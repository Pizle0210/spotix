"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import {
  CalendarDays,
  Edit,
  Ticket,
  Ban,
  Banknote,
  InfoIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CancelEventButton from "./cancel-event-button";
import { api } from "../convex/_generated/api";
import type { Metrics } from "../convex/events";
import type { Doc } from "../convex/_generated/dataModel";
import { useStorageUrl } from "../lib/utils";

export default function SellerEventList() {
  const { user } = useUser();
  const events = useQuery(api.events.getSellerEvents, {
    userId: user?.id ?? "",
  });

  if (!events) return null;

  const upcomingEvents = events.filter((e) => e.eventDate > Date.now());
  const pastEvents = events.filter((e) => e.eventDate <= Date.now());

  return (
    <div className="mx-auto space-y-8">
      {/* Upcoming Events */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {upcomingEvents.map((event) => (
            <SellerEventCard key={event._id} event={event} />
          ))}
          {upcomingEvents.length === 0 && (
            <p className="text-gray-500">No upcoming events</p>
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Past Events</h2>
          <div className="grid grid-cols-1 gap-6">
            {pastEvents.map((event) => (
              <SellerEventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SellerEventCard({
  event,
}: {
  event: Doc<"events"> & {
    metrics: Metrics;
  };
}) {
  const imageUrl = useStorageUrl(event.imageStorageId);
  const isPastEvent = event.eventDate < Date.now();

  return (
    <div
      className={`rounded-lg border bg-white shadow-sm ${event.is_cancelled ? "border-red-200" : "border-gray-200"} overflow-hidden`}
    >
      <div className="p-6">
        <div className="md:flow-row flex flex-col items-start gap-6">
          {/* Event Image */}
          {imageUrl && (
            <div className="relative w-full shrink-0 overflow-hidden rounded-lg sm:h-56 sm:w-56">
              <Image
                src={imageUrl}
                alt={event.name}
                width={224}
                height={224}
                className="aspect-square w-full object-cover"
              />
            </div>
          )}

          {/* Event Details */}
          <div className="flex min-w-0 flex-col sm:flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {event.name}
                </h3>
                <p className="mt-1 text-gray-500">{event.description}</p>
                {event.is_cancelled && (
                  <div className="mt-2 flex items-center gap-2 text-red-600">
                    <Ban className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Event Cancelled & Refunded
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-row">
                {!isPastEvent && !event.is_cancelled && (
                  <>
                    <Link
                      href={`/seller/events/${event._id}/edit`}
                      className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                    <CancelEventButton eventId={event._id} />
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center gap-2 text-gray-600">
                  <Ticket className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "Tickets Refunded" : "Tickets Sold"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {event.is_cancelled ? (
                    <>
                      {event.metrics.refundedTickets}
                      <span className="text-sm font-normal text-gray-500">
                        {" "}
                        refunded
                      </span>
                    </>
                  ) : (
                    <>
                      {event.metrics.soldTickets}
                      <span className="text-sm font-normal text-gray-500">
                        /{event.totalTickets}
                      </span>
                    </>
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center gap-2 text-gray-600">
                  <Banknote className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {event.is_cancelled ? "Amount Refunded" : "Revenue"}
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900">
                  {event?.currency}{" "}
                  {event.is_cancelled
                    ? event.metrics.refundedTickets * event.price
                    : event.metrics.revenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center gap-2 text-gray-600">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm font-medium">Date</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(event.eventDate).toLocaleDateString()}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-3">
                <div className="mb-1 flex items-center gap-2 text-gray-600">
                  <InfoIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {event.is_cancelled
                    ? "Cancelled"
                    : isPastEvent
                      ? "Ended"
                      : "Active"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
