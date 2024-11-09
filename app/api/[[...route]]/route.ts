import { handle } from "hono/vercel";
import app from "./appRoute";

const handler = handle(app);
export { handler as GET, handler as POST }
