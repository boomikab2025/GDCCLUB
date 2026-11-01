"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Heart, Sparkles, Target, Users } from "lucide-react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import team from "@/data/member.json";
import { Logo } from "@/components/layout/Logo";

export default function AboutPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  const values = [
    { icon: Target, ...dict.values.craft },
    { icon: Heart, ...dict.values.players },
    { icon: Sparkles, ...dict.values.curiosity },
    { icon: Users, ...dict.values.community },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">{dict.about.title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {dict.about.story}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border bg-card p-10 sm:p-12"
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
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
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
        <h2 className="text-3xl font-bold text-center mb-12">
          {dict.about.values}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl border bg-card text-center hover:border-accent/50 transition-colors"
            >
              <value.icon className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-12">{dict.about.team}</h2>
        {team.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-12 text-center text-muted-foreground"
          >
            {dict.about.teamSoon}
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {team.map((member, index) => {
              const card = (
                <>
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-muted flex items-center justify-center ring-1 ring-border">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-accent">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  {member.tagname && (
                    <p className="text-xs text-accent/90 font-medium mt-0.5">
                      @{member.tagname}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {member.role}
                  </p>
                </>
              );

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="text-center group"
                >
                  {member.github ? (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                    >
                      {card}
                    </a>
                  ) : (
                    card
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
