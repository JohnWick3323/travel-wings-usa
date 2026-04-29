export interface ShipmentRecord {
  trackingNumber: string;
  orderNumber: string;
  shippingMethod: string;
}

export function parseCsv(content: string, fileName: string): ShipmentRecord {
  // Strip BOM if present
  const cleaned = content.replace(/^\uFEFF/, "").trim();
  const lines = cleaned.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    throw new Error(`Invalid CSV "${fileName}": expected at least a header row and one data row, got ${lines.length} line(s)`);
  }

  // Validate header
  const header = lines[0].toLowerCase().trim();
  if (!header.includes("sendungsnummer") || !header.includes("bestellnummer")) {
    throw new Error(`Invalid CSV "${fileName}": unexpected header format "${lines[0]}"`);
  }

  // Parse data row (one CSV = one order)
  const dataLine = lines[1].trim();
  const parts = dataLine.split(",").map((p) => p.trim());

  if (parts.length < 3) {
    throw new Error(`Invalid CSV "${fileName}": data row has ${parts.length} columns, expected 3`);
  }

  const trackingNumber = parts[0];
  const orderNumber = parts[1];
  const shippingMethod = parts[2];

  if (!trackingNumber) {
    throw new Error(`Invalid CSV "${fileName}": tracking number (Sendungsnummer) is empty`);
  }

  if (!orderNumber) {
    throw new Error(`Invalid CSV "${fileName}": order number (Bestellnummer) is empty`);
  }

  return { trackingNumber, orderNumber, shippingMethod };
}

export function deriveCarrier(shippingMethod: string): string {
  const normalized = shippingMethod.toLowerCase();
  if (normalized.startsWith("dhl")) return "DHL";
  if (normalized.startsWith("dpd")) return "DPD";
  if (normalized.startsWith("ups")) return "UPS";
  if (normalized.startsWith("hermes")) return "Hermes";
  if (normalized.startsWith("gls")) return "GLS";
  return shippingMethod;
}
