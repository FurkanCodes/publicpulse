import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";

import { auth } from "@/lib/auth";

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error("[safe-action] server error", error);
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return "Unexpected error. Please try again.";
  },
});

export const authenticatedAction = actionClient.use(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      success: false,
      serverError: "You must be signed in to perform this action.",
    };
  }

  return next({
    ctx: {
      session,
    },
  });
});
