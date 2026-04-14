import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" 
    ? window.location.origin 
    : (process.env.NODE_ENV === "production" ? "https://project-98lnv.vercel.app" : "http://localhost:3000")
});
