"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Users } from "lucide-react";
import membersJson from "@/data/member.json";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale, TeamMember } from "@/types";

const members = membersJson as TeamMember[];

export default function CommunityPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);
  const categories = [
    {
      id: "coordinator",
      title: dict.community.coordinator,
      members: members.filter((member) => member.category === "coordinator"),
    },
    {
      id: "team-lead",
      title: dict.community.teamLead,
      members: members.filter((member) => member.category === "team-lead"),
    },
    {
      id: "members",
      title: dict.community.members,
      members: members.filter((member) => member.category === "member"),
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <header className="text-center mb-16">
        <Users className="h-14 w-14 text-accent mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          {dict.community.title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {dict.community.description}
        </p>
      </header>

      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category.id} aria-labelledby={`${category.id}-heading`}>
            <h2
              id={`${category.id}-heading`}
              className="text-2xl sm:text-3xl font-semibold text-center mb-8"
            >
              {category.title}
            </h2>
            {category.members.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {dict.community.membersComingSoon}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.members.map((member, index) => (
                  <motion.article
                    key={member.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="text-center"
                  >
                    <div className="aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden mb-4 bg-muted flex items-center justify-center ring-1 ring-border">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-5xl font-bold text-accent">
                          {member.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg uppercase">{member.name}</h3>
                    {member.tagname && (
                      <p className="text-sm text-accent font-medium mt-1">
                        @{member.tagname}
                      </p>
                    )}
                    <p className="text-muted-foreground mt-2">{member.role}</p>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
