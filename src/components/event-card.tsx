"use client";

import { useUser } from "@clerk/nextjs";
import type { Id } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { cn, useStorageUrl } from "@/lib/utils";
import Image from "next/image";
import {
  CalendarDays,
  Check,
  CircleArrowRight,
  LayoutListIcon,
  LoaderCircle,
  MapPin,
  PencilIcon,
  StarIcon,
  Ticket,
  XCircle,
} from "lucide-react";
import PurchaseTicket from "./purchase-ticket";

export default function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const router = useRouter();
  const { user } = useUser();

  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });

  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const imgUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id === event?.userId;

  const renderQueuePosition = () => {
    if (!queuePosition || queuePosition.status !== "waiting") return null;

    if (availability.purchasedCount >= availability.totalTickets) {
      return (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center">
            <Ticket className="mr-2 h-5 w-5 text-gray-400" />
            <span className="text-gray-600">Event is sold out</span>
          </div>
        </div>
      );
    }

    if (queuePosition.position === 2) {
      return (
        <div className="flex flex-col items-center justify-between rounded-lg border border-amber-100 bg-amber-50 p-3 lg:flex-row">
          <div className="flex items-center">
            <CircleArrowRight className="mr-2 h-5 w-5 text-amber-500" />
            <span className="font-medium text-amber-700">
              You&apos;re next in line! (Queue position:{" "}
              {queuePosition.position})
            </span>
          </div>
          <div className="flex items-center">
            <LoaderCircle className="mr-1 h-4 w-4 animate-spin text-amber-500" />
            <span className="text-sm text-amber-600">Waiting for ticket</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="flex items-center">
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-blue-500" />
          <span className="text-blue-700">Queue position</span>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
          #{queuePosition.position}
        </span>
      </div>
    );
  };

  const renderTicketStatus = () => {
    if (!user) return null;

    if (isEventOwner) {
      return (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/seller/events/${eventId}/edit`);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-200"
          >
            <PencilIcon size={18} />
            Edit Event
          </button>
        </div>
      );
    }

    if (userTicket) {
      return (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-green-100 bg-green-50 p-3">
          <div className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-600" />
            <span className="font-medium text-green-700">
              You have a ticket!
            </span>
          </div>
          <button
            onClick={() => router.push(`/tickets/${userTicket._id}`)}
            className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-green-700"
          >
            View your ticket
          </button>
        </div>
      );
    }

    if (queuePosition) {
      return (
        <div className="mt-4">
          {queuePosition.status === "offered" && (
            <PurchaseTicket eventId={eventId} />
          )}
          {renderQueuePosition()}
          {queuePosition.status === "expired" && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-3">
              <span className="flex items-center font-medium text-red-700">
                <XCircle className="mr-2 h-5 w-5" />
                Offer expired
              </span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg ${
        isPastEvent ? `opacity-75 hover:opacity-100` : ""
      }`}
      onClick={() => router.push(`/event/${eventId}`)}
    >
      {imgUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imgUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      <div className={`p-6 ${imgUrl ? "relative" : ""}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col items-start gap-2">
            {isEventOwner && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-xs font-medium text-white">
                <StarIcon className="h-3 w-3" />
                Your Event
              </span>
            )}
            <h2 className="line-clamp-1 text-ellipsis text-2xl font-bold text-gray-900">
              {event!.name}
            </h2>
            {isPastEvent && (
              <span className="mt-2 inline-flex items-center rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-medium text-white/60">
                Past Event
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span
            className={cn(
              `rounded-full px-4 py-1.5 font-semibold ${
                isPastEvent
                  ? "bg-gray-50 text-gray-500"
                  : "bg-green-50 text-[#17BEBB]"
              }`,
            )}
          >
            {event.currency}{" "}
            {event.price.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {availability.purchasedCount >= availability.totalTickets && (
            <span className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700">
              Sold Out
            </span>
          )}
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center text-gray-600">
            <LayoutListIcon size={18} className="mr-2" />
            <span>{event.category}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-2" />
            <span className="line-clamp-1 text-ellipsis">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarDays size={18} className="mr-2" />
            <span>
              {new Date(event.eventDate).toLocaleDateString()}
              {isPastEvent && "(Ended)"}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Ticket size={18} className="mr-2" />
            <span>
              {availability.totalTickets - availability.purchasedCount}/
              {availability.totalTickets} available
              {!isPastEvent && availability.activeOffers > 0 && (
                <span className="text-[#17BEBB]">
                  ({availability.activeOffers}{" "}
                  {availability.activeOffers === 1 ? "person" : "people"} trying
                  to buy)
                </span>
              )}
            </span>
          </div>
        </div>

        <p className="mt-4 line-clamp-1 text-ellipsis text-sm text-gray-600">
          {event.description}
        </p>

        <div onClick={(e) => e.stopPropagation()}>
          {!isPastEvent && renderTicketStatus()}
        </div>
      </div>
    </div>
  );
}
