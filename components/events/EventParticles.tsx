"use client";

import { motion, useReducedMotion } from "framer-motion";

const particles = [
  { left: "8%", top: "22%", size: 3, delay: 0 },
  { left: "18%", top: "68%", size: 2, delay: 1.4 },
  { left: "31%", top: "35%", size: 2, delay: 0.7 },
  { left: "43%", top: "77%", size: 3, delay: 2.1 },
  { left: "57%", top: "19%", size: 2, delay: 1.1 },
  { left: "68%", top: "58%", size: 3, delay: 0.4 },
  { left: "81%", top: "31%", size: 2, delay: 1.8 },
  { left: "92%", top: "72%", size: 2, delay: 0.9 },
];

export function EventParticles() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-accent shadow-[0_0_12px_rgba(59,130,246,0.7)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: reduceMotion ? 0.45 : undefined,
          }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -12, 0], opacity: [0.2, 0.65, 0.2] }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 5 + (index % 3),
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </div>
  );
}
