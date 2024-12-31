/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import type { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import ReleaseTicket from "./release-ticket";
import { createStripeCheckoutSession } from "@/actions/createStripeCheckoutSession";

export default function PurchaseTicket({ eventId }: { eventId: Id<"events"> }) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const offerExpiresAt = queuePosition?.offerExpiresAt ?? 0;
  const isExpired = Date.now() > offerExpiresAt;

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }

      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${
            seconds === 1 ? "" : "s"
          }`,
        );
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

    async function handlePurchase() {
      if (!user) {
        alert("You must be logged in to purchase a ticket.");
        return;
      }

      try {
        setIsLoading(true);
        const { sessionUrl } = await createStripeCheckoutSession({
          eventId,
        });

        if (sessionUrl) {
          router.push(sessionUrl);
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
      } finally {
        setIsLoading(false);
      }
    }

  if (!user || !queuePosition || queuePosition.status !== "offered") {
    return null;
  }

  return (
    <div className="rounded-xl border border-[#ff0079]/40 bg-white p-6 shadow-lg">
      <div className="space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <Ticket className="h-6 w-6 text-black/70" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Ticket Reserved
                </h3>
                <p className="text-sm text-gray-500">
                  Expires in {timeRemaining}
                </p>
              </div>
            </div>

            <div className="text-sm leading-relaxed text-gray-600">
              A ticket has been reserved for you. Complete your purchase before
              the timer expires to secure your spot at this event.
            </div>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isExpired || isLoading}
          className="w-full transform rounded-lg bg-gradient-to-r from-[#ff0079] to-[#ff0079]/60 px-8 py-4 text-lg font-bold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:from-[#ff0079] hover:to-[#ff0079]/90 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:hover:scale-100"
        >
          {isLoading
            ? "Redirecting to checkout..."
            : "Purchase Your Ticket Now →"}
        </button>

        <div className="mt-4">
          <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id} />
        </div>
      </div>
    </div>
  );
}
