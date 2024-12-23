import { Google } from "arctic";

export const google = new Google(
  process.env.AUTH_GOOGLE_ID || "",
  process.env.AUTH_GOOGLE_SECRET || "",
  "http://localhost:3000/login/google/callback"
);

