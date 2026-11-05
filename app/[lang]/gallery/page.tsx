import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";
import { notFound } from "next/navigation";
import galleryJson from "@/data/gallery.json";
import { GalleryPage } from "@/components/gallery/GalleryPage";
import { isValidLocale } from "@/lib/i18n/config";
import type { GalleryEvent, GalleryEventView } from "@/types/gallery";

const publicDirectory = resolve(process.cwd(), "public");

function isLocalImageAvailable(src: string): boolean {
  if (!src.startsWith("/") || src.startsWith("//")) return false;
  const imagePath = resolve(publicDirectory, `.${src}`);
  return (
    imagePath.startsWith(`${publicDirectory}${sep}`) && existsSync(imagePath)
  );
}

function sortByEventDateDescending(
  first: GalleryEvent,
  second: GalleryEvent
): number {
  const firstDate = Date.parse(first.eventDate);
  const secondDate = Date.parse(second.eventDate);
  const normalizedFirst = Number.isFinite(firstDate) ? firstDate : -Infinity;
  const normalizedSecond = Number.isFinite(secondDate) ? secondDate : -Infinity;
  return normalizedSecond - normalizedFirst;
}

export default async function GalleryRoute({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const events = (galleryJson as GalleryEvent[])
    .map(
      (event): GalleryEventView => ({
        ...event,
        photos: event.photos.map((photo) => ({
          ...photo,
          available: isLocalImageAvailable(photo.src),
        })),
      })
    )
    .sort(sortByEventDateDescending);

  return <GalleryPage events={events} locale={lang} />;
}
