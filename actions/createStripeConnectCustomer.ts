"use server";

import { auth } from "@clerk/nextjs/server";
import { api } from "../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";
import { stripe } from "../lib/stripe";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error(`NEXT_PUBLIC_CONVEX_URL is not set`);
}

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function createStripeConnectCustomer() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error(`Not Authenticated`);
  }

  //   check if user already has a connected account.
  const existingStripeConnectId = await convex.query(
    api.users?.getUsersStripeConnectId,
    {
      userId,
    },
  );

  // return
  if (existingStripeConnectId) {
    return { account: existingStripeConnectId };
  }

  // create new account
  const account = await stripe.accounts.create({
    type: "express",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
      cashapp_payments: { requested: true },
      us_bank_account_ach_payments: { requested: true },
      amazon_pay_payments: { requested: true },
      samsung_pay_payments: { requested: true },
    },
  });

  //   update user with stripe connect id
  await convex.mutation(api.users.updateOrCreateUserStripeConnectId, {
    userId,
    stripeConnectId: account.id,
  });

  return { account: account.id };
}
