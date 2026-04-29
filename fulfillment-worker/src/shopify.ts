import { config } from "./config.js";
import { logger } from "./logger.js";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function shopifyGraphQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const url = `https://${config.shopify.storeDomain}/admin/api/${config.shopify.apiVersion}/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": config.shopify.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Shopify API HTTP ${response.status}: ${text}`);
  }

  const json = (await response.json()) as GraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`);
  }

  if (!json.data) {
    throw new Error("Shopify GraphQL returned no data");
  }

  return json.data;
}

// --- Order lookup ---

interface OrderNode {
  id: string;
  name: string;
}

interface FindOrderData {
  orders: {
    edges: Array<{ node: OrderNode }>;
  };
}

export async function findOrderByName(orderName: string): Promise<OrderNode | null> {
  const normalizedName = orderName.startsWith("#") ? orderName : `#${orderName}`;

  const query = `
    query FindOrder($searchQuery: String!) {
      orders(first: 1, query: $searchQuery) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<FindOrderData>(query, { searchQuery: `name:${normalizedName}` });
  const edges = data.orders.edges;

  if (edges.length === 0) {
    return null;
  }

  return edges[0].node;
}

// --- Fulfillment orders ---

interface FulfillmentOrderLineItemNode {
  id: string;
  remainingQuantity: number;
}

interface FulfillmentOrderNode {
  id: string;
  status: string;
  assignedLocation: {
    name: string;
  };
  lineItems: {
    edges: Array<{ node: FulfillmentOrderLineItemNode }>;
  };
}

interface GetFulfillmentOrdersData {
  order: {
    fulfillmentOrders: {
      edges: Array<{ node: FulfillmentOrderNode }>;
    };
  };
}

export async function getFulfillmentOrders(orderId: string): Promise<FulfillmentOrderNode[]> {
  const query = `
    query GetFulfillmentOrders($orderId: ID!) {
      order(id: $orderId) {
        fulfillmentOrders(first: 20) {
          edges {
            node {
              id
              status
              assignedLocation {
                name
              }
              lineItems(first: 50) {
                edges {
                  node {
                    id
                    remainingQuantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyGraphQL<GetFulfillmentOrdersData>(query, { orderId });
  return data.order.fulfillmentOrders.edges.map((e) => e.node);
}

export function findOpenPrintRoyalFulfillmentOrders(
  fulfillmentOrders: FulfillmentOrderNode[],
  locationName: string,
): FulfillmentOrderNode[] {
  const openStatuses = new Set(["OPEN", "IN_PROGRESS"]);
  return fulfillmentOrders.filter(
    (fo) => openStatuses.has(fo.status) && fo.assignedLocation.name === locationName,
  );
}

// --- Create fulfillment ---

interface FulfillmentCreateData {
  fulfillmentCreate: {
    fulfillment: { id: string; status: string } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

export async function createFulfillment(
  fulfillmentOrderIds: string[],
  trackingNumber: string,
  carrier: string,
): Promise<{ id: string; status: string }> {
  const mutation = `
    mutation FulfillmentCreate($fulfillment: FulfillmentInput!) {
      fulfillmentCreate(fulfillment: $fulfillment) {
        fulfillment {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const lineItemsByFulfillmentOrder = fulfillmentOrderIds.map((foId) => ({
    fulfillmentOrderId: foId,
  }));

  const variables = {
    fulfillment: {
      lineItemsByFulfillmentOrder,
      notifyCustomer: true,
      trackingInfo: {
        number: trackingNumber,
        company: carrier,
      },
    },
  };

  logger.info("Creating fulfillment", {
    fulfillmentOrderIds,
    trackingNumber,
    carrier,
  });

  const data = await shopifyGraphQL<FulfillmentCreateData>(mutation, variables);
  const result = data.fulfillmentCreate;

  if (result.userErrors.length > 0) {
    const errorMessages = result.userErrors.map((e) => `${e.field.join(".")}: ${e.message}`).join("; ");
    throw new Error(`Shopify fulfillment errors: ${errorMessages}`);
  }

  if (!result.fulfillment) {
    throw new Error("Shopify returned no fulfillment and no errors");
  }

  logger.info("Fulfillment created", {
    fulfillmentId: result.fulfillment.id,
    status: result.fulfillment.status,
  });

  return result.fulfillment;
}
