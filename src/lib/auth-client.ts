import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // NEXT_PUBLIC_API_URL না পেলে সরাসরি Render-এর লাইভ লিংক বা Localhost নিবে
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://booknook-server-2t5l.onrender.com",

  plugins: [jwtClient()],

  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;