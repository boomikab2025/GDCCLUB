"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { MessageCircle, Users } from "lucide-react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import socialLinks from "@/data/social.json";

export default function CommunityPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);
  const discordReady = socialLinks.discord !== "#";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Users className="h-14 w-14 text-accent mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {dict.community.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {dict.community.description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-8 sm:p-12 rounded-2xl border bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 text-center"
      >
        <MessageCircle className="h-10 w-10 text-accent mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-3">{dict.community.discordCta}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {dict.community.discordDesc}
        </p>
        {discordReady ? (
          <a
            href={socialLinks.discord}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="accent" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {dict.community.joinDiscord}
            </Button>
          </a>
        ) : (
          <div className="space-y-3">
            <Button size="lg" variant="accent" className="gap-2" disabled>
              <MessageCircle className="h-4 w-4" />
              {dict.community.joinDiscord}
            </Button>
            <p className="text-sm text-muted-foreground">
              {dict.community.linkSoon}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
