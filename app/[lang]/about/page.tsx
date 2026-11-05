"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useParams } from "next/navigation";
import { Heart, Sparkles, Target, Users } from "lucide-react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Logo } from "@/components/layout/Logo";
import { KineticHeading } from "@/components/KineticHeading";

const ABOUT_HEADLINE = "WHERE IDEAS BECOME PLAYABLE WORLDS.";

export default function AboutPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);
  const shouldReduceMotion = useReducedMotion();

  const values = [
    { icon: Target, ...dict.values.craft },
    { icon: Heart, ...dict.values.players },
    { icon: Sparkles, ...dict.values.curiosity },
    { icon: Users, ...dict.values.community },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <KineticHeading
          text={ABOUT_HEADLINE}
          className="text-4xl sm:text-6xl font-bold mb-6"
        />
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.9,
            delay: shouldReduceMotion ? 0 : 2.3,
            ease: [0.2, 0.8, 0.2, 1],
          }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          {dict.about.story}
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="motion-card rounded-2xl border bg-card p-10 sm:p-12"
        >
          <div className="mb-6">
            <Logo height={48} showWordmark wordmarkClassName="text-xl" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{dict.about.locationTitle}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {dict.about.locationBody}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="space-y-6"
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            {dict.footer.tagline}
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {dict.games.comingSoonDesc}
          </p>
        </motion.div>
      </div>

      <div className="mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-center mb-12"
        >
          {dict.about.values}
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 20,
                delay: index * 0.08,
              }}
              className="motion-card p-6 rounded-xl border bg-card text-center hover:border-accent/50 transition-colors"
            >
              <value.icon className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
