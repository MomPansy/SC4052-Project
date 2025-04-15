import { serveStatic } from "@hono/node-server/serve-static";
import { serve } from "@hono/node-server";
import { factory } from "./factory.js";
import { route as chatRoute } from "./routes/chat.js";
import { cors } from "hono/cors";
const app = factory.createApp();
app.use("/api/*", cors({
  origin: "*",
  // Allow all origins
  allowMethods: ["GET", "POST", "OPTIONS"],
  // Allow specific HTTP methods
  allowHeaders: ["Authorization", "Content-Type"]
  // Allow specific headers
}));
app.get("/healthz", (c) => {
  return c.json({ message: "Ok" });
});
const apiRoutes = app.basePath("/api").route("/chat", chatRoute);
app.get("/*", serveStatic({ root: "./dist/static" })).get("/*", serveStatic({ path: "./dist/static/index.html" }));
(async () => {
  const port = 3e3;
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server is running on port ${port.toString()}`);
  });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
export {
  apiRoutes
};
