"use client";

import { useParams } from "next/navigation";
import { Users } from "lucide-react";
import membersJson from "@/data/member.json";
import { MemberCircleGrid, SquircleCard } from "@/components/community/MemberCluster";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale, TeamMember } from "@/types";

const members = membersJson as TeamMember[];

export default function CommunityPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);
  const coordinators = members.filter((member) => member.category === "coordinator");
  const leads = members.filter((member) => member.category === "team-lead");
  const roster = members.filter((member) => member.category === "member");

  return (
    <main className="overflow-x-clip py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header className="mb-16 text-center">
        <Users className="mx-auto mb-6 h-14 w-14 text-accent" />
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">{dict.community.title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          {dict.community.description}
        </p>
      </header>

      <div className="space-y-20">
        <section aria-labelledby="coordinator-heading">
          {coordinators.length === 0 ? (
            <p className="text-center text-muted-foreground">{dict.community.membersComingSoon}</p>
          ) : (
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
              {coordinators[0] ? <SquircleCard member={coordinators[0]} size="lg" /> : <div className="w-44 sm:w-52" />}
              <div className="flex min-h-52 w-full flex-1 items-center justify-center border border-accent/40 bg-secondary/40 px-6 py-10 shadow-[0_0_28px_rgba(59,130,246,0.14)] md:mx-6 md:min-h-64">
                <h2
                  id="coordinator-heading"
                  className="text-center text-3xl font-semibold uppercase tracking-[0.22em] text-accent sm:text-4xl"
                >
                  {dict.community.coordinator}
                </h2>
              </div>
              {coordinators[1] ? <SquircleCard member={coordinators[1]} size="lg" /> : <div className="hidden w-44 sm:w-52 md:block" />}
            </div>
          )}
        </section>

        <section aria-labelledby="team-lead-heading">
          <h2 id="team-lead-heading" className="mb-8 text-center text-2xl font-semibold sm:text-3xl">
            {dict.community.teamLead}
          </h2>
          {leads.length === 0 ? (
            <p className="text-center text-muted-foreground">{dict.community.membersComingSoon}</p>
          ) : (
            <div className="flex flex-wrap items-start justify-center gap-8 sm:gap-10">
              {leads.map((member) => (
                <SquircleCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </section>
      </div>
      </div>

      <section aria-labelledby="members-heading" className="mt-20">
        <h2
          id="members-heading"
          className="mb-8 px-4 text-center text-2xl font-semibold sm:text-3xl"
        >
          {dict.community.members}
        </h2>
        {roster.length === 0 ? (
          <p className="text-center text-muted-foreground">{dict.community.membersComingSoon}</p>
        ) : (
          <MemberCircleGrid members={roster} />
        )}
      </section>
    </main>
  );
}
