import { hc } from "hono/client";
import { type ApiRoutes } from "server/index.ts";
import { supabase, supabaseAnonKey } from "./supabase.ts";

const url = import.meta.env.DEV ? "http://localhost:3000" : window.location.origin;

export const { api } = hc<ApiRoutes>(url, {
    headers: async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token ?? supabaseAnonKey;
      return {
        apikey: supabaseAnonKey,
        authorization: `Bearer ${token}`,
      };
    },
  });
  