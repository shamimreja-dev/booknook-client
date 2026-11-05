import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://booknook-server-2t5l.onrender.com";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [jwtClient()],
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;