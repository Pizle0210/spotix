import EventForm from "../../../components/event-form";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="bg-gradient-to-r from-[#17BEBB] to-[#17BEBB]/80 px-6 py-8 text-white">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <p className="mt-2">List your event and start selling tickets</p>
        </div>

        <div className="p-6">
          <EventForm mode="create" />
        </div>
      </div>
    </div>
  );
}
