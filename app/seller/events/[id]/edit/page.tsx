"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { AlertCircle } from "lucide-react";
import EventForm from "../../../../../components/event-form";

export default function EditEvent() {
  const params = useParams();
  const event = useQuery(api.events.getById, {
    eventId: params.id as Id<"events">,
  });

  if (!event) return null;

  return (
    <div className="mx-auto min-h-screen max-w-3xl p-8">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        {/* heading */}
        <div className="space-y-3 bg-gradient-to-br from-[#ff0079] to-teal-500 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Edit Event</h2>
          <p className="text-lg text-white">Update your event details</p>
        </div>

        <div className="p-6">
          <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
            <div className="flex gap-2 text-gray-700">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm">
                <span className="text-red-600">* </span>Note:Sold tickets are
                valid! Modification will not apply to sold ticket as they are
                valid.You cannot decrease number below the number of sold
                tickets
              </p>
            </div>
          </div>
          <EventForm mode="edit" initialData={event} />
        </div>
      </div>
    </div>
  );
}
