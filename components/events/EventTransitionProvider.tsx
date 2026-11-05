"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { ClubEvent } from "@/types/event";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

type TransitionPhase =
  | "expanding"
  | "awaiting-detail"
  | "awaiting-list"
  | "collapsing"
  | "fading";

interface Origin {
  id: number;
  slug: string;
  image: string;
  rect: Rect;
  scrollY: number;
  listPath: string;
}

interface Overlay {
  id: number;
  image: string;
  from: Rect;
  to: Rect;
  sourcePath: string;
  destination: string;
  phase: TransitionPhase;
}

interface TransitionContextValue {
  openEvent: (event: ClubEvent, origin?: DOMRect) => void;
  backToEvents: (slug: string) => void;
  isListingTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

function normalizedPath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

function rectFromElement(element: Element): Rect {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

export function useEventTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "useEventTransition must be used within EventTransitionProvider"
    );
  }
  return context;
}

export function EventTransitionProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const originRef = useRef<Origin | null>(null);
  const nextIdRef = useRef(0);
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  const viewportRect = useCallback(
    (): Rect => ({
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    }),
    []
  );

  const openEvent = useCallback(
    (event: ClubEvent, sourceRect?: DOMRect) => {
      const listPath = normalizedPath(`/${lang}/events`);
      if (sourceRect) {
        const id = ++nextIdRef.current;
        const rect = {
          left: sourceRect.left,
          top: sourceRect.top,
          width: sourceRect.width,
          height: sourceRect.height,
        };
        originRef.current = {
          id,
          slug: event.slug,
          image: event.coverImage,
          rect,
          scrollY: window.scrollY,
          listPath,
        };
        if (!reduceMotion && event.coverImage) {
          setOverlay({
            id,
            image: event.coverImage,
            from: rect,
            to: viewportRect(),
            sourcePath: listPath,
            destination: normalizedPath(`${listPath}/${event.slug}`),
            phase: "expanding",
          });
        }
      }

      router.push(`${listPath}/${event.slug}`, { scroll: false });
    },
    [lang, reduceMotion, router, viewportRect]
  );

  const backToEvents = useCallback(
    (slug: string) => {
      const origin = originRef.current;
      if (origin?.slug === slug) {
        router.back();
      } else {
        router.push(`/${lang}/events/`);
      }
    },
    [lang, router]
  );

  useEffect(() => {
    const handlePopState = () => {
      const origin = originRef.current;
      if (!origin) return;

      const currentPath = normalizedPath(window.location.pathname);
      const detailPath = normalizedPath(`${origin.listPath}/${origin.slug}`);
      const id = ++nextIdRef.current;

      if (
        !reduceMotion &&
        origin.image &&
        currentPath === origin.listPath
      ) {
        setOverlay({
          id,
          image: origin.image,
          from: viewportRect(),
          to: origin.rect,
          sourcePath: detailPath,
          destination: origin.listPath,
          phase: "awaiting-list",
        });
      } else if (
        !reduceMotion &&
        origin.image &&
        currentPath === detailPath
      ) {
        setOverlay({
          id,
          image: origin.image,
          from: origin.rect,
          to: viewportRect(),
          sourcePath: origin.listPath,
          destination: detailPath,
          phase: "expanding",
        });
      } else if (currentPath !== origin.listPath && currentPath !== detailPath) {
        originRef.current = null;
        setOverlay(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [reduceMotion, viewportRect]);

  useLayoutEffect(() => {
    const origin = originRef.current;
    if (!origin || normalizedPath(pathname) !== origin.listPath) return;

    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, origin.scrollY);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;

    if (reduceMotion || !origin.image) return;

    const firstFrame = window.requestAnimationFrame(() => {
      window.scrollTo(0, origin.scrollY);
      const card = Array.from(
        document.querySelectorAll<HTMLElement>("[data-event-image]")
      ).find((element) => element.dataset.eventImage === origin.slug);
      const target = card ? rectFromElement(card) : null;

      setOverlay((current) => {
        if (
          !current ||
          current.phase !== "awaiting-list" ||
          current.destination !== origin.listPath
        ) {
          return current;
        }
        return {
          ...current,
          to: target ?? current.to,
          phase: target ? "collapsing" : "fading",
        };
      });
    });

    return () => window.cancelAnimationFrame(firstFrame);
  }, [pathname, reduceMotion]);

  useEffect(() => {
    if (!overlay) return;
    const currentPath = normalizedPath(pathname);
    if (
      currentPath === overlay.sourcePath ||
      currentPath === overlay.destination
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setOverlay((current) => (current?.id === overlay.id ? null : current));
      originRef.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [overlay, pathname]);

  const routeReady =
    overlay !== null &&
    overlay.phase === "awaiting-detail" &&
    normalizedPath(pathname) === overlay.destination;

  const isListingTransitioning =
    overlay !== null &&
    overlay.destination !== overlay.sourcePath &&
    normalizedPath(pathname) === overlay.sourcePath;

  const completeAnimation = useCallback((current: Overlay) => {
    if (current.phase === "expanding") {
      setOverlay((active) =>
        active?.id === current.id
          ? { ...active, phase: "awaiting-detail" }
          : active
      );
    } else if (
      current.phase === "collapsing" ||
      current.phase === "fading" ||
      (current.phase === "awaiting-detail" && routeReady)
    ) {
      setOverlay((active) => (active?.id === current.id ? null : active));
    }
  }, [routeReady]);
  const overlayTarget = overlay
    ? overlay.phase === "collapsing"
      ? overlay.to
      : viewportRect()
    : null;

  return (
    <TransitionContext.Provider
      value={{ openEvent, backToEvents, isListingTransitioning }}
    >
      {children}
      {overlay && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed z-[100] overflow-hidden bg-black"
          initial={{
            left: overlay.from.left,
            top: overlay.from.top,
            width: overlay.from.width,
            height: overlay.from.height,
            borderRadius: 16,
            opacity: 1,
          }}
          animate={{
            left: overlayTarget?.left ?? 0,
            top: overlayTarget?.top ?? 0,
            width: overlayTarget?.width ?? 0,
            height: overlayTarget?.height ?? 0,
            borderRadius: overlay.phase === "collapsing" ? 16 : 0,
            opacity: overlay.phase === "fading" || routeReady ? 0 : 1,
          }}
          transition={{
            duration:
              overlay.phase === "expanding" || overlay.phase === "collapsing"
                ? 0.68
                : 0.24,
            ease: [0.2, 0.8, 0.2, 1],
            opacity: { duration: 0.24 },
          }}
          onAnimationComplete={() => completeAnimation(overlay)}
        >
          <Image
            src={overlay.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      )}
    </TransitionContext.Provider>
  );
}
