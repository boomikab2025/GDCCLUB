import eventsJson from "@/data/events.json";
import type { ClubEvent } from "@/types/event";
import { EventsListing } from "@/components/events/EventsListing";

const events = eventsJson as ClubEvent[];

export default function EventsPage() {
  return <EventsListing events={events} />;
}
