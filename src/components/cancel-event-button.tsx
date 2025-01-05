"use client";

import { useState } from "react";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import type { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import {toast} from 'sonner'

export default function CancelEventButton({
  eventId,
}: {
  eventId: Id<"events">;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();
  const cancelEvent = useMutation(api.events.cancelEvent);

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this event? All tickets will be refunded and the event will be cancelled permanently.",
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      await refundEventTickets(eventId);
      await cancelEvent({ eventId });
      toast.info("Event cancelled", {
        description: "All tickets have been refunded successfully.",
      });
      router.push("/seller/events");
    } catch (error) {
      console.error("Failed to cancel event:", error);
      toast.error("Error", {
        description: "Failed to cancel event. Please try again.",
      });
    } finally {
      setIsCancelling(false);
    }
  };



  return (
    <button
      onClick={handleCancel}
      disabled={isCancelling}
      className="flex items-center gap-2 rounded-lg px-4 py-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
    >
      <Ban className="h-4 w-4" />
      <span>{isCancelling ? "Processing..." : "Cancel Event"}</span>
    </button>
  );
}
