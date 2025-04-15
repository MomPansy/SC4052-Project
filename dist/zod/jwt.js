import { z } from "zod";
const jwtPayloadSchema = z.object({
  exp: z.number().refine((val) => val > Date.now() / 1e3, {
    message: "expired"
  }),
  sub: z.string().describe("user_id, uuid format"),
  email: z.string(),
  role: z.string().describe("anon, authenticated, or service_role")
});
export {
  jwtPayloadSchema
};
