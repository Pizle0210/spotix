"use server";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
}
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

// Function to retrieve the Stripe Connect account ID for the authenticated user
export async function getStripeConnectAccount() {
  const { userId } = await auth();

  // Throw an error if the user is not authenticated
  if (!userId) {
    throw new Error("Not authenticated");
  }

  // Query the Convex backend to get the user's Stripe Connect ID
  const stripeConnectId = await convex.query(
    api.users.getUsersStripeConnectId,
    {
      userId,
    },
  );

  // Return the Stripe Connect ID, or null if it doesn't exist
  return {
    stripeConnectId: stripeConnectId || null,
  };
}
