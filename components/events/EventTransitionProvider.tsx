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

interface Origin {
  slug: string;
  image: string;
  rect: Rect;
  scrollY: number;
  listPath: string;
}

interface Overlay {
  image: string;
  from: Rect;
  to: Rect;
  destination: string;
  expanded: boolean;
  fading: boolean;
}

interface TransitionContextValue {
  openEvent: (event: ClubEvent, origin?: DOMRect) => void;
  backToEvents: (slug: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

function normalizedPath(path: string) {
  return path.replace(/\/+$/, "") || "/";
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
      const listPath = `/${lang}/events`;
      if (sourceRect) {
        const rect = {
          left: sourceRect.left,
          top: sourceRect.top,
          width: sourceRect.width,
          height: sourceRect.height,
        };
        originRef.current = {
          slug: event.slug,
          image: event.coverImage,
          rect,
          scrollY: window.scrollY,
          listPath,
        };
        if (!reduceMotion && event.coverImage) {
          setOverlay({
            image: event.coverImage,
            from: rect,
            to: viewportRect(),
            destination: normalizedPath(`${listPath}/${event.slug}`),
            expanded: false,
            fading: false,
          });
        }
      }

      router.push(`${listPath}/${event.slug}`);
    },
    [lang, reduceMotion, router, viewportRect]
  );

  const backToEvents = useCallback(
    (slug: string) => {
      const origin = originRef.current;
      const listPath = origin?.slug === slug ? origin.listPath : `/${lang}/events`;

      if (origin?.slug === slug && !reduceMotion) {
        setOverlay({
          image: origin.image,
          from: viewportRect(),
          to: origin.rect,
          destination: normalizedPath(listPath),
          expanded: false,
          fading: false,
        });
      }

      if (origin?.slug === slug) {
        router.back();
      } else {
        router.push(listPath);
      }
    },
    [lang, reduceMotion, router, viewportRect]
  );

  useLayoutEffect(() => {
    const origin = originRef.current;
    if (origin && normalizedPath(pathname) === normalizedPath(origin.listPath)) {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, origin.scrollY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    }
  }, [pathname]);

  const routeReady =
    overlay !== null &&
    normalizedPath(pathname) === overlay.destination;

  useEffect(() => {
    if (!overlay?.expanded || !routeReady || overlay.fading) return;
    const timer = window.setTimeout(
      () => setOverlay((current) => (current ? { ...current, fading: true } : current)),
      80
    );
    return () => window.clearTimeout(timer);
  }, [overlay, routeReady]);

  useEffect(() => {
    if (!overlay) return;
    const timer = window.setTimeout(() => setOverlay(null), 3000);
    return () => window.clearTimeout(timer);
  }, [overlay]);

  return (
    <TransitionContext.Provider value={{ openEvent, backToEvents }}>
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
            left: overlay.expanded ? overlay.to.left : overlay.to.left,
            top: overlay.expanded ? overlay.to.top : overlay.to.top,
            width: overlay.expanded ? overlay.to.width : overlay.to.width,
            height: overlay.expanded ? overlay.to.height : overlay.to.height,
            borderRadius: overlay.expanded ? 0 : 0,
            opacity: overlay.fading ? 0 : 1,
          }}
          transition={{
            left: { duration: overlay.expanded ? 0.28 : 0.68, ease: [0.2, 0.8, 0.2, 1] },
            top: { duration: overlay.expanded ? 0.28 : 0.68, ease: [0.2, 0.8, 0.2, 1] },
            width: { duration: overlay.expanded ? 0.28 : 0.68, ease: [0.2, 0.8, 0.2, 1] },
            height: { duration: overlay.expanded ? 0.28 : 0.68, ease: [0.2, 0.8, 0.2, 1] },
            borderRadius: { duration: overlay.expanded ? 0.28 : 0.68 },
            opacity: { duration: 0.24 },
          }}
          onAnimationComplete={() => {
            if (!overlay.expanded) {
              setOverlay((current) =>
                current ? { ...current, expanded: true } : current
              );
            } else if (overlay.fading) {
              setOverlay(null);
            }
          }}
        >
          {overlay.image && (
            <Image
              src={overlay.image}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
          )}
        </motion.div>
      )}
    </TransitionContext.Provider>
  );
}
