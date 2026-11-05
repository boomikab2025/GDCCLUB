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
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { GalleryEventView, GalleryPhotoView } from "@/types/gallery";

type GallerySlide = GalleryPhotoView;

function PhotoUnavailable({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_35%,rgba(212,175,55,0.12),transparent_58%),linear-gradient(135deg,#0b0b0a,#19160e)] px-4 text-center text-accent/80">
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
  fit: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);

  if (!photo.available || failed) return <PhotoUnavailable label={label} />;

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      className={
        fit === "cover"
          ? "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          : "object-contain"
      }
      onError={() => setFailed(true)}
    />
  );
}

function getPhotoLayoutClass(index: number, photoCount: number): string {
  const groupPosition = index % 3;
  const groupSize = Math.min(3, photoCount - (index - groupPosition));

  if (groupSize === 1) {
    return "col-span-2 aspect-[16/10] sm:col-span-6 sm:row-span-1 sm:aspect-auto lg:col-span-12";
  }

  if (groupSize === 2) {
    return "col-span-1 aspect-[4/3] sm:col-span-3 sm:row-span-1 sm:aspect-auto lg:col-span-6";
  }

  if (groupPosition === 0) {
    return "col-span-2 aspect-[16/10] sm:col-span-4 sm:row-span-2 sm:aspect-auto lg:col-span-7";
  }

  return "col-span-1 aspect-[4/3] sm:col-span-2 sm:row-span-1 sm:aspect-auto lg:col-span-5";
}

function GalleryPhotoFrame({
  photo,
  label,
  layoutClassName,
  onOpen,
}: {
  photo: GalleryPhotoView;
  label: string;
  layoutClassName: string;
  onOpen: () => void;
}) {
  return (
    <figure className={`group min-w-0 ${layoutClassName}`}>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${photo.caption}: ${photo.alt}`}
        className="block h-full w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative h-full min-h-0 overflow-hidden rounded-xl bg-[#11100d] shadow-[0_12px_34px_rgba(0,0,0,0.32)] ring-1 ring-white/10 transition-transform duration-300 ease-out group-hover:-translate-y-1 motion-reduce:transition-none">
          <GalleryImage
            photo={photo}
            label={label}
            fit="contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 67vw, 58vw"
          />
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
  const slides = useMemo<GallerySlide[]>(
    () => events.flatMap((event) => event.photos),
    [events]
  );
  const isLightboxOpen = activeIndex !== null;
  const activeSlide =
    activeIndex === null ? null : (slides[activeIndex] ?? null);

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
        const buttons =
          dialogRef.current?.querySelectorAll<HTMLButtonElement>(
            "button:not(:disabled)"
          );
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
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
      <header className="relative isolate overflow-hidden border-b border-accent/10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.12),transparent_58%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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
          <div className="grid grid-cols-2 gap-3 py-10 sm:grid-cols-6 sm:gap-4 sm:[grid-auto-rows:clamp(8rem,14vw,11rem)] lg:grid-cols-12 lg:gap-5 lg:[grid-auto-rows:clamp(12rem,16vw,15rem)]">
            {slides.map((photo, index) => (
              <GalleryPhotoFrame
                key={photo.id}
                photo={photo}
                label={dict.gallery.photoUnavailable}
                layoutClassName={getPhotoLayoutClass(index, slides.length)}
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
