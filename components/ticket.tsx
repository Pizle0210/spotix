"use client";

import { useQuery } from "convex/react";
import type { Id } from "../convex/_generated/dataModel";
import { api } from "../convex/_generated/api";
import QRCode from "react-qr-code";
import { CalendarDays, IdCard, MapPin, TicketIcon, User } from "lucide-react";
import Image from "next/image";
import Spinner from "./spinner";
import { useStorageUrl } from "../lib/utils";

export default function Ticket({ ticketId }: { ticketId: Id<"tickets"> }) {
  const ticket = useQuery(api.tickets.getTicketWithDetails, { ticketId });
  const user = useQuery(api.users.getUserById, {
    userId: ticket?.userId ?? "",
  });
  const imageUrl = useStorageUrl(ticket?.event?.imageStorageId);

  if (!ticket || !ticket.event || !user) {
    return <Spinner />;
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-xl ${ticket.event.is_cancelled ? "border-red-200" : "border-gray-100"}`}
    >
      {/* Event Header with Image */}
      <div className="relative">
        {imageUrl && (
          <div className="relative aspect-[21/9] w-full">
            <Image
              src={imageUrl}
              alt={ticket.event.name}
              fill
              className={`object-cover object-center ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/90" />
          </div>
        )}
        <div
          className={`px-6 py-4 ${imageUrl ? "absolute bottom-0 left-0 right-0" : ticket.event.is_cancelled ? "bg-red-600" : "bg-black"} `}
        >
          <h2
            className={`text-2xl font-bold ${imageUrl || !imageUrl ? "text-white" : "text-black"}`}
          >
            {ticket.event.name}
          </h2>
          {ticket.event.is_cancelled && (
            <p className="mt-1 text-red-300">This event has been cancelled</p>
          )}
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Left Column - Event Details */}
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <CalendarDays
                size={25}
                className={`mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-green-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(ticket.event.eventDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin
                size={25}
                className={`mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-green-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{ticket.event.location}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <User
                size={25}
                className={`mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-green-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500">Ticket Holder</p>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center break-all text-gray-600">
              <IdCard
                size={25}
                className={`mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-green-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500">Ticket Holder ID</p>
                <p className="font-medium">{user.userId}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <TicketIcon
                size={25}
                className={`mr-3 ${ticket.event.is_cancelled ? "text-red-600" : "text-green-600"}`}
              />
              <div>
                <p className="text-sm text-gray-500">Ticket Price</p>
                <p className="font-medium">
                  <span className="font-bold">{ticket.currency}</span>{" "}
                  {ticket.event.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex flex-col items-center justify-center border-gray-200 pl-6 sm:border-l">
            <div
              className={`rounded-lg bg-gray-100 p-4 ${ticket.event.is_cancelled ? "opacity-50" : ""}`}
            >
              <QRCode
                value={ticket._id}
                className="aspect-auto sm:h-40 sm:w-40"
              />
            </div>
            <p className="mt-2 max-w-[200px] border-spacing-2 items-center break-all rounded-full border bg-[#e5e7eb]/30 px-2 py-1 text-center text-xs text-gray-500 md:max-w-full">
              Ticket ID: {ticket._id}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="mb-2 text-sm font-medium text-gray-900">
            Important Information
          </h3>
          {ticket.event.is_cancelled ? (
            <p className="text-sm text-red-600">
              This event has been cancelled. A refund will be processed if it
              hasn&apos;t been already.
            </p>
          ) : (
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Please arrive at least 30 minutes before the event</li>
              <li>• Have your ticket QR code ready for scanning</li>
              <li>• This ticket is non-transferable</li>
            </ul>
          )}
        </div>
      </div>

      {/* Ticket Footer */}
      <div
        className={`${ticket.event.is_cancelled ? "bg-red-50" : "bg-gray-50"} flex items-center justify-between px-6 py-4`}
      >
        <span className="text-sm text-gray-500">
          Purchase Date: {new Date(ticket.purchasedAt).toLocaleString()}
        </span>
        <span
          className={`text-sm font-medium ${ticket.event.is_cancelled ? "text-red-600" : "text-green-600"}`}
        >
          {ticket.event.is_cancelled ? "Cancelled" : "Valid Ticket"}
        </span>
      </div>
    </div>
  );
}
