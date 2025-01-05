"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import Spinner from "../../../components/spinner";
import { useStorageUrl } from "../../../lib/utils";
import EventCard from "../../../components/event-card";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { Button } from "../../../components/ui/button";
import JoinQueue from "../../../components/join-queue";
import BackButton from "../../../components/ui/back-button";
import Link from "next/link";

export default function EventPage() {
  const { user } = useUser();
  const param = useParams();
  const event = useQuery(api.events.getById, {
    eventId: param.id as Id<"events">,
  });
  const availability = useQuery(api.events.getEventAvailability, {
    eventId: param.id as Id<"events">,
  });
  const imgUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Details */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {imgUrl && (
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={imgUrl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Left Column - Event Details */}
              <div className="space-y-8">
                <div>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    {event.name}
                  </h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-1 flex items-center text-gray-600">
                      <CalendarDays className="mr-2 h-5 w-5 text-[#17BEBB]" />
                      <span className="text-sm font-medium">Date</span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-1 flex items-center text-gray-600">
                      <MapPin className="mr-2 h-5 w-5 text-[#17BEBB]" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-gray-900">{event.location}</p>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-1 flex items-center text-gray-600">
                      <Ticket className="mr-2 h-5 w-5 text-[#17BEBB]" />
                      <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      <span className="font-bold">{event.currency}</span>{" "}
                      {event.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div className="mb-1 flex items-center text-gray-600">
                      <Users className="mr-2 h-5 w-5 text-[#17BEBB]" />
                      <span className="text-sm font-medium">Availability</span>
                    </div>
                    <p className="text-gray-900">
                      {availability.totalTickets - availability.purchasedCount}/
                      {availability.totalTickets} left
                    </p>
                  </div>
                </div>

                {/* Additional Event Information */}
                <div className="rounded-lg border border-gray-100 bg-slate-100 p-6">
                  <h3 className="mb-2 text-lg font-bold text-[#17BEBB]">
                    Event Information
                  </h3>
                  <ul className="space-y-2">
                    <li>- Please arrive 30 minutes before the event starts</li>
                    <li>- Tickets are non-refundable</li>
                    <li>- Age restriction: 18+</li>
                  </ul>
                </div>
              </div>

              {/* Right Column - Ticket Purchase Card */}
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventCard eventId={param.id as Id<"events">} />

                  {user ? (
                    <JoinQueue
                      eventId={param.id as Id<"events">}
                      userId={user.id}
                    />
                  ) : (
                    <SignInButton>
                      <Button className="w-full rounded-lg bg-gradient-to-r from-[#17BEBB] to-[#17BEBB]/60 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:from-[#17BEBB] hover:to-[#17BEBB]/90 hover:shadow-lg">
                        Sign in to buy tickets
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <BackButton className="mt-4 rounded-lg bg-gray-400 text-white hover:bg-gray-600">
          <Link href={`/`}>back</Link>
        </BackButton>
      </div>
    </div>
  );
}
