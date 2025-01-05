"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Spinner from "./spinner";
import { CalendarDays, Ticket } from "lucide-react";
import EventCard from "./event-card";

export default function EventList() {
  const events = useQuery(api.events.get);

  if (!events) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const upcomingEvents = events
    .filter((event) => event.eventDate > Date.now())
    .sort((a, b) => a.eventDate - b.eventDate);

  const pastEvents = events
    .filter((event) => event.eventDate <= Date.now())
    .sort((a, b) => b.eventDate - a.eventDate);

  return (
    <div className="mx-auto w-[min(100%,100%)] px-4 max-sm:mt-10 sm:px-4 lg:px-4">
      {/* header */}
      <div className="mb-8 flex flex-col items-center justify-between max-sm:space-y-4 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 max-sm:text-center">
            Upcoming Events
          </h1>
          <p className="mt-2 text-gray-600 max-sm:text-center">
            Discover & book tickets for amazing events
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="h-5 w-5" />
            <span className="font-medium">
              {upcomingEvents.length} Upcoming Events
            </span>
          </div>
        </div>
      </div>

      {/* upcoming event grid */}
      {upcomingEvents.length > 0 ? (
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
      ) : (
        <div className="mb-12 rounded-lg bg-gray-50 p-12 text-center">
          <Ticket className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No upcoming events
          </h3>
          <p className="mt-1 text-gray-600">Check back later for new events</p>
        </div>
      )}

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Past Events</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <EventCard key={event._id} eventId={event._id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
