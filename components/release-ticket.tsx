"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { XCircle } from "lucide-react";
import { useState } from "react";

export default function ReleaseTicket({
  eventId,
  waitingListId,
}: {
  eventId: Id<"events">;
  waitingListId: Id<"waitingList">;
}) {
  const releaseTicket = useMutation(api.waitingList.releaseTicket);
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = async () => {
    if (!confirm("Are you sure you want to release your ticket offer?")) return;

    try {
      setIsReleasing(true);
      await releaseTicket({
        eventId,
        waitingListId,
      });
    } catch (error) {
      console.error("Error releasing ticket:", error);
    } finally {
      setIsReleasing(false);
    }
  };
  return (
    <button
      onClick={handleRelease}
      disabled={isReleasing}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <XCircle className="h-4 w-4" />
      {isReleasing ? "Releasing..." : "Release Ticket Offer"}
    </button>
  );
}
