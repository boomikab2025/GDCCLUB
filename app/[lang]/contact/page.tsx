"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  Camera,
  Gamepad2,
  MessageCircle,
  Share2,
  Video,
} from "lucide-react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import socialLinks from "@/data/social.json";

const platforms = [
  {
    key: "discord" as const,
    label: "Discord",
    href: socialLinks.discord,
    Icon: MessageCircle,
  },
  {
    key: "twitter" as const,
    label: "X / Twitter",
    href: socialLinks.twitter,
    Icon: Share2,
  },
  {
    key: "youtube" as const,
    label: "YouTube",
    href: socialLinks.youtube,
    Icon: Video,
  },
  {
    key: "instagram" as const,
    label: "Instagram",
    href: socialLinks.instagram,
    Icon: Camera,
  },
  {
    key: "steam" as const,
    label: "Steam",
    href: socialLinks.steam,
    Icon: Gamepad2,
  },
];

export default function ContactPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {dict.contact.title}
        </h1>
        <p className="text-lg text-muted-foreground">{dict.contact.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 rounded-2xl border bg-card"
      >
        <h2 className="font-bold text-xl mb-2 text-center">
          {dict.contact.findUs}
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {dict.contact.socialsHint}
        </p>

        <ul className="space-y-3">
          {platforms.map(({ label, href, Icon }, index) => {
            const ready = href !== "#";
            return (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                {ready ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border hover:border-accent/50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-medium">{label}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-muted/30 opacity-80">
                    <Icon className="h-5 w-5 text-accent shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        {dict.community.linkSoon}
                      </div>
                    </div>
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
