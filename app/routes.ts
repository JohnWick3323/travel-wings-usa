import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

const devRoutes = import.meta.env.DEV ? prefix("dev", [route("components", "dev/components.tsx")]) : [];

export default [index("routes/home.tsx"), ...devRoutes] satisfies RouteConfig;
