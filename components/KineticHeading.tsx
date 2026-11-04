"use client";

import {
  useCallback,
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { gsap } from "gsap";
import styles from "./KineticHeading.module.css";

type KineticHeadingProps = {
  text: string;
  className?: string;
};

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function KineticHeading({ text, className = "" }: KineticHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const keyboardIndexRef = useRef(0);
  const introCompleteRef = useRef(false);
  const interactionTimelinesRef = useRef(
    new Map<HTMLElement, gsap.core.Timeline>(),
  );
  const instructionsId = useId();

  const animateCharacter = useCallback((character: HTMLElement) => {
    if (
      !introCompleteRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    interactionTimelinesRef.current.get(character)?.kill();
    gsap.killTweensOf(character);

    const timeline = gsap
      .timeline({
        onComplete: () => {
          if (interactionTimelinesRef.current.get(character) === timeline) {
            interactionTimelinesRef.current.delete(character);
          }
        },
      })
      .to(character, {
        y: -16,
        rotation: randomBetween(-8, 8),
        scale: 1.1,
        color: "#E3BD43",
        duration: 0.22,
        ease: "power2.out",
      })
      .to(character, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        color: "#F5F3EF",
        duration: 0.9,
        ease: "elastic.out(1, 0.6)",
      });
    interactionTimelinesRef.current.set(character, timeline);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const characters = Array.from(
      heading.querySelectorAll<HTMLElement>("[data-kinetic-character]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let removeMotionPreferenceListener: (() => void) | undefined;
    const context = gsap.context(() => {
      let intro: gsap.core.Timeline | undefined;
      let introStarted = false;

      const showFinalHeading = () => {
        intro?.kill();
        introCompleteRef.current = true;
        interactionTimelinesRef.current.forEach((timeline) => timeline.kill());
        interactionTimelinesRef.current.clear();
        gsap.killTweensOf(characters);
        gsap.set(characters, {
          clearProps: "transform,opacity,color",
        });
      };

      const playIntro = () => {
        if (reducedMotion.matches || introStarted) {
          showFinalHeading();
          return;
        }

        introStarted = true;
        const compact = window.matchMedia("(max-width: 640px)").matches;
        const scatterX = compact ? 28 : 52;
        const scatterY = compact ? 32 : 46;
        const offsets = characters.map(() => ({
          x: randomBetween(-scatterX, scatterX),
          y: randomBetween(-scatterY, scatterY),
          rotation: randomBetween(-18, 18),
          scale: randomBetween(0.9, 1.08),
        }));

        introCompleteRef.current = false;
        gsap.set(characters, (index: number) => ({
          x: offsets[index].x * 0.08,
          y: offsets[index].y * 0.08,
          rotation: offsets[index].rotation * 0.08,
          scale: 1,
          opacity: 0,
        }));
        const timeline = gsap.timeline();
        intro = timeline;
        timeline.to(characters, {
          x: (index: number) => offsets[index].x,
          y: (index: number) => offsets[index].y,
          rotation: (index: number) => offsets[index].rotation,
          scale: (index: number) => offsets[index].scale,
          opacity: 1,
          duration: 0.32,
          ease: "power2.out",
        });
        timeline.to({}, { duration: 0.08 });
        const assemblyStart = timeline.duration();
        const assemblyDuration = 1.25;
        const staggerDuration = 0.55;
        characters.forEach((character, index) => {
          timeline.fromTo(
            character,
            offsets[index],
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              duration: assemblyDuration,
              ease: "elastic.out(1, 0.72)",
              clearProps: "transform,opacity",
            },
            assemblyStart +
              (index / Math.max(1, characters.length - 1)) * staggerDuration,
          );
        });
        timeline.eventCallback("onComplete", () => {
          introCompleteRef.current = true;
        });
      };

      playIntro();

      const handleMotionPreferenceChange = () => {
        if (reducedMotion.matches) {
          showFinalHeading();
        }
      };
      reducedMotion.addEventListener("change", handleMotionPreferenceChange);
      removeMotionPreferenceListener = () => {
        reducedMotion.removeEventListener(
          "change",
          handleMotionPreferenceChange,
        );
      };
    }, heading);

    return () => {
      removeMotionPreferenceListener?.();
      interactionTimelinesRef.current.forEach((timeline) => timeline.kill());
      interactionTimelinesRef.current.clear();
      gsap.killTweensOf(characters);
      context.revert();
    };
  }, [text]);

  const handlePointerEnter = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "touch") {
      animateCharacter(event.currentTarget);
    }
  };

  const handleCharacterClick = (event: MouseEvent<HTMLSpanElement>) => {
    if (
      event.detail > 0 &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      animateCharacter(event.currentTarget);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLHeadingElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    const characters =
      headingRef.current?.querySelectorAll<HTMLElement>(
        "[data-kinetic-character]",
      );
    if (!characters?.length) return;

    animateCharacter(characters[keyboardIndexRef.current % characters.length]);
    keyboardIndexRef.current += 1;
  };

  return (
    <h1
      ref={headingRef}
      className={`${styles.heading} ${className}`}
      aria-label={text}
      aria-describedby={instructionsId}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.visual} aria-hidden="true">
        {text.split(" ").map((word, wordIndex, words) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className={styles.word}>
              {Array.from(word).map((character, characterIndex) => (
                <span
                  className={styles.character}
                  data-kinetic-character
                  key={`${character}-${characterIndex}`}
                  onPointerEnter={handlePointerEnter}
                  onClick={handleCharacterClick}
                >
                  {character}
                </span>
              ))}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
      <span className={styles.srOnly} id={instructionsId}>
        Focus this heading and press Enter or Space to animate a letter.
      </span>
    </h1>
  );
}
