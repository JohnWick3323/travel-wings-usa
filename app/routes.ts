import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/destinations", "routes/destinations.tsx"),
  route("/tour/:tourId", "routes/tour-details.tsx"),
  route("/blog", "routes/blog.tsx"),
  route("/blog/:articleId", "routes/blog-article.tsx"),
  route("/about", "routes/about-us.tsx"),
  route("/admin", "routes/admin-dashboard.tsx"),
  route("/contact", "routes/contact-us.tsx"),
  route("/api/inquiry", "routes/api.inquiry.ts"),
  route("/api/newsletter", "routes/api.newsletter.ts"),
  route("/api/leads", "routes/api.leads.ts"),
  route("/api/leads/:id", "routes/api.leads.$id.ts"),
  route("/api/admin/login", "routes/api.admin.login.ts"),
] satisfies RouteConfig;
