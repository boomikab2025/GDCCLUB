"use client";

import Image from "next/image";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Locale } from "@/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { GalleryEventView, GalleryPhotoView } from "@/types/gallery";

interface GallerySlide extends GalleryPhotoView {
  eventId: string;
  eventTitle: string;
}

const galleryOrderStorageKey = "gdcvitc-gallery-order-v1";
const galleryOrderSubscribers = new Set<() => void>();

function subscribeToGalleryOrder(callback: () => void): () => void {
  galleryOrderSubscribers.add(callback);
  return () => galleryOrderSubscribers.delete(callback);
}

function getGalleryOrderSnapshot(): string | null {
  try {
    return window.sessionStorage.getItem(galleryOrderStorageKey);
  } catch {
    return null;
  }
}

function getServerGalleryOrderSnapshot(): null {
  return null;
}

function getPhotosInSavedOrder(
  photos: GallerySlide[],
  savedOrder: string | null
): GallerySlide[] {
  if (!savedOrder) return photos;

  try {
    const savedIds: unknown = JSON.parse(savedOrder);
    if (
      !Array.isArray(savedIds) ||
      !savedIds.every((id) => typeof id === "string")
    ) {
      return photos;
    }

    const photosById = new Map(photos.map((photo) => [photo.id, photo]));
    const orderedPhotos: GallerySlide[] = [];
    const orderedIds = new Set<string>();
    for (const id of savedIds) {
      const photo = photosById.get(id);
      if (photo && !orderedIds.has(photo.id)) {
        orderedPhotos.push(photo);
        orderedIds.add(photo.id);
      }
    }
    orderedPhotos.push(...photos.filter((photo) => !orderedIds.has(photo.id)));
    return orderedPhotos;
  } catch {
    return photos;
  }
}

function randomizePhotos(photos: GallerySlide[]): GallerySlide[] {
  const remaining = [...photos];
  const shuffled: GallerySlide[] = [];

  while (remaining.length > 0) {
    const previousEventId = shuffled[shuffled.length - 1]?.eventId;
    const eligibleIndices = remaining.reduce<number[]>(
      (indices, photo, index) => {
        if (photo.eventId !== previousEventId) indices.push(index);
        return indices;
      },
      []
    );
    const choices =
      eligibleIndices.length > 0
        ? eligibleIndices
        : remaining.map((_, index) => index);
    const selectedIndex = choices[Math.floor(Math.random() * choices.length)];
    shuffled.push(remaining.splice(selectedIndex, 1)[0]);
  }

  return shuffled;
}

function getSessionPhotoOrder(photos: GallerySlide[]): GallerySlide[] {
  const photosById = new Map(photos.map((photo) => [photo.id, photo]));

  try {
    const savedOrder = window.sessionStorage.getItem(galleryOrderStorageKey);
    if (savedOrder) {
      const savedIds: unknown = JSON.parse(savedOrder);
      if (
        Array.isArray(savedIds) &&
        savedIds.every((id) => typeof id === "string")
      ) {
        const orderedPhotos: GallerySlide[] = [];
        const orderedIds = new Set(orderedPhotos.map((photo) => photo.id));
        for (const id of savedIds) {
          const photo = photosById.get(id);
          if (photo && !orderedIds.has(photo.id)) {
            orderedPhotos.push(photo);
            orderedIds.add(photo.id);
          }
        }
        orderedPhotos.push(
          ...photos.filter((photo) => !orderedIds.has(photo.id))
        );
        if (orderedPhotos.length > 0) {
          window.sessionStorage.setItem(
            galleryOrderStorageKey,
            JSON.stringify(orderedPhotos.map((photo) => photo.id))
          );
          return orderedPhotos;
        }
      }
    }

    const randomized = randomizePhotos(photos);
    window.sessionStorage.setItem(
      galleryOrderStorageKey,
      JSON.stringify(randomized.map((photo) => photo.id))
    );
    return randomized;
  } catch (error) {
    console.warn("Could not preserve the gallery order for this tab.", error);
    return randomizePhotos(photos);
  }
}

function PhotoUnavailable({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_35%,rgba(59,130,246,0.16),transparent_58%),linear-gradient(135deg,#070b14,#0e1a2e)] px-4 text-center text-accent/80">
      <ImageOff aria-hidden="true" className="h-8 w-8" strokeWidth={1.2} />
      <span className="text-xs tracking-wide text-foreground/65">{label}</span>
    </div>
  );
}

function GalleryImage({
  photo,
  label,
  sizes,
  fit,
}: {
  photo: GalleryPhotoView;
  label: string;
  sizes: string;
  fit: "thumbnail" | "contain";
}) {
  const [failed, setFailed] = useState(false);
  const [isPortrait, setIsPortrait] = useState<boolean | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!photo.available || failed) return <PhotoUnavailable label={label} />;

  const imageIsPortrait = fit === "thumbnail" && isPortrait === true;
  const imageIsLandscape = fit === "thumbnail" && isPortrait === false;

  return (
    <>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 animate-pulse bg-white/[0.06] motion-reduce:animate-none"
        />
      )}
      {imageIsPortrait && (
        <Image
          src={photo.src}
          alt=""
          aria-hidden="true"
          fill
          sizes={sizes}
          loading="lazy"
          className="scale-110 object-cover object-center opacity-55 blur-xl transition-transform duration-500 ease-out group-hover:scale-[1.16] motion-reduce:transform-none motion-reduce:transition-none"
        />
      )}
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        loading={fit === "thumbnail" ? "lazy" : "eager"}
        className={
          imageIsPortrait || fit === "contain"
            ? "z-10 object-contain object-center"
            : imageIsLandscape
              ? "object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
              : "object-contain object-center"
        }
        onLoad={(event) => {
          setIsPortrait(
            event.currentTarget.naturalHeight >=
              event.currentTarget.naturalWidth
          );
          setIsLoaded(true);
        }}
        onError={() => setFailed(true)}
      />
    </>
  );
}

function GalleryPhotoFrame({
  photo,
  label,
  onOpen,
}: {
  photo: GalleryPhotoView;
  label: string;
  onOpen: () => void;
}) {
  return (
    <figure className="group min-w-0">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${photo.caption}: ${photo.alt}`}
        className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-video overflow-hidden rounded-xl bg-[#11100d] shadow-[0_12px_34px_rgba(0,0,0,0.32)] ring-1 ring-white/10">
          <GalleryImage
            photo={photo}
            label={label}
            fit="thumbnail"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-3 pb-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            <span className="line-clamp-2 text-sm font-medium text-white">
              {photo.caption}
            </span>
          </div>
        </div>
      </button>
      <figcaption className="sr-only">
        {photo.caption}
      </figcaption>
    </figure>
  );
}

export function GalleryPage({
  events,
  locale,
}: {
  events: GalleryEventView[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const sourceSlides = useMemo<GallerySlide[]>(
    () =>
      events.flatMap((event) =>
        event.photos.map((photo) => ({
          ...photo,
          eventId: event.eventId,
          eventTitle: event.eventTitle,
        }))
      ),
    [events]
  );
  const savedOrder = useSyncExternalStore(
    subscribeToGalleryOrder,
    getGalleryOrderSnapshot,
    getServerGalleryOrderSnapshot
  );
  const slides = useMemo(
    () => getPhotosInSavedOrder(sourceSlides, savedOrder),
    [sourceSlides, savedOrder]
  );
  const isLightboxOpen = activeIndex !== null;
  const activeSlide =
    activeIndex === null ? null : (slides[activeIndex] ?? null);

  useEffect(() => {
    getSessionPhotoOrder(sourceSlides);
    galleryOrderSubscribers.forEach((subscriber) => subscriber());
  }, [sourceSlides]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? null : Math.max(0, current - 1)
        );
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) =>
          current === null ? null : Math.min(slides.length - 1, current + 1)
        );
      } else if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)"
        );
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const dialog = dialogRef.current;
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === dialog)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      restoreFocusRef.current?.focus();
    };
  }, [isLightboxOpen, slides.length]);

  const openPhoto = (index: number) => {
    restoreFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setActiveIndex(index);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="relative isolate overflow-hidden border-b border-accent/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.18),transparent_58%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            <Camera aria-hidden="true" className="h-4 w-4" />
            GDCVITC
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {dict.gallery.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {dict.gallery.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {slides.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            {dict.gallery.noEvents}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 py-10 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {slides.map((photo, index) => (
              <GalleryPhotoFrame
                key={photo.id}
                photo={photo}
                label={dict.gallery.photoUnavailable}
                onOpen={() => openPhoto(index)}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeSlide && activeIndex !== null && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={activeSlide.caption}
            tabIndex={-1}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveIndex(null);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label={dict.gallery.closeLightbox}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/50 p-3 text-white transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-6 sm:top-6"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) =>
                  current === null ? null : Math.max(0, current - 1)
                )
              }
              disabled={activeIndex === 0}
              aria-label={dict.gallery.previousPhoto}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2.5 text-white transition-colors hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 sm:left-6 sm:p-3"
            >
              <ChevronLeft aria-hidden="true" className="h-6 w-6" />
            </button>
            <div className="flex max-h-full w-full max-w-6xl flex-col items-center justify-center">
              <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                <div className="relative h-[min(78svh,56rem)] w-full max-w-6xl bg-black/30">
                  <GalleryImage
                    key={activeSlide.id}
                    photo={activeSlide}
                    label={dict.gallery.photoUnavailable}
                    sizes="(max-width: 768px) 90vw, 80vw"
                    fit="contain"
                  />
                </div>
              </div>
              <div className="mt-4 max-w-3xl text-center">
                <p className="text-sm font-medium text-foreground sm:text-base">
                  {activeSlide.caption}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {activeSlide.eventTitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) =>
                  current === null
                    ? null
                    : Math.min(slides.length - 1, current + 1)
                )
              }
              disabled={activeIndex === slides.length - 1}
              aria-label={dict.gallery.nextPhoto}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-2.5 text-white transition-colors hover:border-accent/60 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 sm:right-6 sm:p-3"
            >
              <ChevronRight aria-hidden="true" className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
