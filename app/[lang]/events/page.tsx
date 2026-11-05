import { connection } from "next/server";
import eventsJson from "@/data/events.json";
import type { ClubEvent } from "@/types/event";
import { EventsListing } from "@/components/events/EventsListing";
import { getCurrentTimestamp } from "@/components/events/event-utils";

const events = eventsJson as ClubEvent[];

export default async function EventsPage() {
  await connection();
  return <EventsListing events={events} now={getCurrentTimestamp()} />;
}
