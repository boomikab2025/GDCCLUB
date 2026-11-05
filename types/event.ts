export type EventStatus = "upcoming" | "past";

export interface ClubEvent {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  date: string;
  endDate?: string;
  venue: string;
  category: string;
  coverImage: string;
  gallery?: string[];
  registrationUrl?: string;
  status: EventStatus;
  featured?: boolean;
}
