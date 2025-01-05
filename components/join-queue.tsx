//  import type { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Spinner from "./spinner";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { Clock, OctagonXIcon } from "lucide-react";
import { WAITING_LIST_STATUS } from "../convex/constant";
import type { Id } from "../convex/_generated/dataModel";

export default function JoinQueue({
  eventId,
  userId,
}: {
  eventId: Id<"events">;
  userId: string;
}) {
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });
  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId,
  });
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId,
  });
  const joinWaitingList = useMutation(api.events.joinWaitingList);
  const isEventOwner = userId === event?.userId;

  async function handleJoinQueue() {
    try {
      const result = await joinWaitingList({ eventId, userId });
      if (result.success) {
        console.log("Successfully joined waiting list");
      }
      toast(result.message);
    } catch (error: unknown) {
      if (
        error instanceof ConvexError &&
        error.message.includes("joined the waiting list too many times")
      ) {
        toast.info(`Slow down there!`);
      } else {
        console.error("Error joining waiting list:", error);
        toast("Uh oh! Something went wrong.");
      }
    }
  }

  if (queuePosition === undefined || availability === undefined || !event) {
    return <Spinner />;
  }

  if (userTicket) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();

  return (
    <div>
      {(!queuePosition ||
        queuePosition.status === WAITING_LIST_STATUS.EXPIRED ||
        (queuePosition.status === WAITING_LIST_STATUS.OFFERED &&
          queuePosition.offerExpiresAt &&
          queuePosition.offerExpiresAt <= Date.now())) && (
        <>
          {isEventOwner ? (
            <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-700">
              <OctagonXIcon className="h-5 w-5" />
              <span>You cannot buy a ticket for your own event</span>
            </div>
          ) : isPastEvent ? (
            <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-500">
              <Clock className="h-5 w-5" />
              <span>Event has ended</span>
            </div>
          ) : availability.purchasedCount >= availability?.totalTickets ? (
            <div className="p-4 text-center">
              <p className="text-lg font-semibold text-red-600">
                Sorry, this event is sold out
              </p>
            </div>
          ) : (
            <button
              onClick={handleJoinQueue}
              disabled={isPastEvent || isEventOwner}
              className="flex w-full items-center justify-center rounded-lg bg-black/75 px-6 py-3 font-medium text-white shadow-md transition-colors duration-200 hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Buy Ticket
            </button>
          )}
        </>
      )}
    </div>
  );
}
