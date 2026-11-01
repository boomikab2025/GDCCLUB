"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import socialLinks from "@/data/social.json";

export function CommunityTeaser() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);
  const discordReady = socialLinks.discord !== "#";

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-accent/5" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Users className="h-12 w-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              {dict.community.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {dict.community.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={`/${lang}/community/`}>
              <Button size="lg" variant="outline" className="gap-2">
                {dict.community.title}
              </Button>
            </Link>
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
              <Button size="lg" variant="accent" className="gap-2" disabled>
                <MessageCircle className="h-4 w-4" />
                {dict.community.linkSoon}
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
