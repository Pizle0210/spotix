import { getConvexClient } from "@/lib/convex";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Ticket from "@/components/ticket";
import { api } from "../../../../convex/_generated/api";

async function TicketSuccess() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const convex = getConvexClient();
  const tickets = await convex.query(api.events.getUserTickets, { userId });
  const latestTicket = tickets[tickets.length - 1];

  if (!latestTicket) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-600">
            Ticket Purchase Successful!
          </h1>
          <p className="mt-2 text-gray-500">
            Your ticket has been confirmed and is ready to use
          </p>
        </div>

        <Ticket ticketId={latestTicket._id} />
      </div>
    </div>
  );
}

export default TicketSuccess;
