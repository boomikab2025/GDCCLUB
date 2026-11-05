import { connection } from "next/server";
import { notFound } from "next/navigation";
import eventsJson from "@/data/events.json";
import type { ClubEvent } from "@/types/event";
import { EventDetails } from "@/components/events/EventDetails";
import { getCurrentTimestamp } from "@/components/events/event-utils";

const events = eventsJson as ClubEvent[];

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const event = events.find((item) => item.slug === slug);

  if (!event) notFound();

  return <EventDetails event={event} now={getCurrentTimestamp()} />;
}
