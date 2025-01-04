"use client";

import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import { useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import Ticket from "@/components/ticket";

export default function TicketPage() {
  const params = useParams();
  const { user } = useUser();
  const ticket = useQuery(api.tickets.getTicketWithDetails, {
    ticketId: params.id as Id<"tickets">,
  });

  useEffect(() => {
    if (!user) {
      redirect("/");
    }

    if (!ticket || ticket.userId !== user.id) {
      redirect("/tickets");
    }

    if (!ticket.event) {
      redirect("/tickets");
    }
  }, [user, ticket]);

  if (!ticket || !ticket.event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 space-y-8">
          {/* Navigation and Actions */}
          <div className="flex items-center justify-between">
            <Link
              href="/tickets"
              className="flex items-center text-gray-600 transition-colors hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Tickets
            </Link>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <Download className="h-4 w-4" />
                <span className="text-sm">Save</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>

          {/* Event Info Summary */}
          <div
            className={`rounded-lg border bg-white p-6 shadow-sm ${ticket.event.is_cancelled ? "border-red-200" : "border-gray-100"}`}
          >
            <h1 className="text-2xl font-bold text-gray-900">
              {ticket.event.name}
            </h1>
            <p className="mt-1 text-gray-600">
              {new Date(ticket.event.eventDate).toLocaleDateString()} at{" "}
              {ticket.event.location}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  ticket.event.is_cancelled
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {ticket.event.is_cancelled ? "Cancelled" : "Valid Ticket"}
              </span>
              <span className="text-sm text-gray-500">
                Purchased on {new Date(ticket.purchasedAt).toLocaleDateString()}
              </span>
            </div>
            {ticket.event.is_cancelled && (
              <p className="mt-4 text-sm text-red-600">
                This event has been cancelled. A refund will be processed if it
                hasn&apos;t been already.
              </p>
            )}
          </div>
        </div>

        {/* Ticket Component */}
        <Ticket ticketId={ticket._id} />

        {/* Additional Information */}
        <div
          className={`mt-8 rounded-lg p-4 ${
            ticket.event.is_cancelled
              ? "border border-red-100 bg-red-50"
              : "border border-blue-100 bg-teal-100"
          }`}
        >
          <h3
            className={`text-sm font-medium ${
              ticket.event.is_cancelled ? "text-red-900" : "text-teal-900"
            }`}
          >
            Need Help?
          </h3>
          <p
            className={`mt-1 text-sm ${
              ticket.event.is_cancelled ? "text-red-700" : "text-gray-500"
            }`}
          >
            {ticket.event.is_cancelled
              ? "For questions about refunds or cancellations, please contact our support team at team@spotix.com"
              : "If you have any issues with your ticket, please contact our support team at team@spotix.com"}
          </p>
        </div>
      </div>
    </div>
  );
}
