import { createServer, Response } from "miragejs";
import data from "./data";

export function makeServer({ environment = "test" } = {}) {
  let server = createServer({
    environment,

    seeds(server) {
      server.db.loadData(data);
    },

    routes() {
      this.namespace = "api";
      this.timing = 1500;

      this.get("/get-news-data", (schema) => {
        return { data: schema.db.data };
      });

      this.post("/reset-password", () => {
        throw new Error("Reset password not available on Dev mode");
      });

      this.post("/login", () => {
        return new Response(
          500,
          { "Content-Type": "application/json" },
          { general: "Login not available on Dev Mode" }
        );
      });

      this.post("/signup", () => {
        return new Response(
          500,
          { "Content-Type": "application/json" },
          { general: "Signup not available on Dev Mode" }
        );
      });

      this.post("/update-user-password", () => {
        return new Response(
          500,
          { "Content-Type": "application/json" },
          "Reset Password not available on Dev Mode"
        );
      });
    },
  });

  return server;
}
