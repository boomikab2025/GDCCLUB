"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TeamMember, TeamMemberLink } from "@/types";

function safeHref(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") {
      return url.href;
    }
  } catch {
    return null;
  }
  return null;
}

export function memberAvatarSrc(member: TeamMember) {
  const direct = safeHref(member.image);
  if (direct) return direct;
  const github = safeHref(member.github);
  if (!github) return null;
  try {
    const url = new URL(github);
    if (url.hostname !== "github.com" && url.hostname !== "www.github.com") return null;
    const username = url.pathname.split("/").filter(Boolean)[0];
    if (!username || username.includes(".")) return null;
    return `https://github.com/${username}.png`;
  } catch {
    return null;
  }
}

function memberLinks(member: TeamMember): TeamMemberLink[] {
  const links: TeamMemberLink[] = [];
  const github = safeHref(member.github);
  if (github) links.push({ label: "GitHub", href: github });
  for (const link of member.links ?? []) {
    const href = safeHref(link.href);
    if (!href || href === github) continue;
    links.push({ label: link.label, href });
  }
  return links;
}

function AsyncAvatar({
  src,
  alt,
  fallback,
  className,
  eager = false,
}: {
  src: string | null;
  alt: string;
  fallback: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(eager);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src || eager) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      { rootMargin: "160px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [src, eager]);

  return (
    <span ref={ref} className="absolute inset-0">
      <span className="flex h-full w-full items-center justify-center font-semibold text-accent">
        {fallback}
      </span>
      {src && ready && !failed ? (
        <img
          src={src}
          alt={alt}
          className={`${className ?? ""} ${loaded ? "opacity-100" : "opacity-0"}`}
          decoding="async"
          loading="lazy"
          fetchPriority="low"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}

export function SquircleCard({
  member,
  size = "md",
}: {
  member: TeamMember;
  size?: "md" | "lg";
}) {
  const src = memberAvatarSrc(member);
  const github = safeHref(member.github);
  const dimension = size === "lg" ? "h-44 w-44 sm:h-52 sm:w-52" : "h-36 w-36 sm:h-40 sm:w-40";

  const articleWidth = size === "lg" ? "w-44 sm:w-52" : "w-36 sm:w-40";

  return (
    <article className={`flex flex-col items-center text-center ${articleWidth}`}>
      <div
        className={`relative overflow-hidden rounded-[2rem] border border-accent/40 bg-secondary shadow-[0_0_24px_rgba(59,130,246,0.16)] ${dimension}`}
      >
        <AsyncAvatar
          src={src}
          alt={member.name}
          fallback={member.name.charAt(0).toUpperCase()}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{member.name}</h3>
      <p className="mt-1 text-sm text-accent">{member.role}</p>
      {member.tagname ? (
        github ? (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-sm text-muted-foreground hover:text-accent"
          >
            @{member.tagname}
          </a>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">@{member.tagname}</p>
        )
      ) : null}
    </article>
  );
}

function MemberCircle({
  member,
  open,
  onOpen,
  onScheduleClose,
  onCancelClose,
}: {
  member: TeamMember;
  open: boolean;
  onOpen: (anchor: HTMLButtonElement) => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const src = memberAvatarSrc(member);

  return (
    <button
      ref={buttonRef}
      type="button"
      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-accent/40 bg-secondary shadow-[0_0_22px_rgba(59,130,246,0.2)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:h-32 sm:w-32"
      aria-expanded={open}
      aria-label={`${member.name}, ${member.role}`}
      onMouseEnter={() => {
        onCancelClose();
        if (buttonRef.current) onOpen(buttonRef.current);
      }}
      onMouseLeave={onScheduleClose}
      onClick={() => {
        if (window.matchMedia("(hover: hover)").matches) return;
        if (open) onScheduleClose();
        else if (buttonRef.current) onOpen(buttonRef.current);
      }}
      onFocus={() => {
        if (buttonRef.current) onOpen(buttonRef.current);
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Element && next.closest("[data-member-card]")) return;
        onScheduleClose();
      }}
    >
      <AsyncAvatar
        src={src}
        alt=""
        fallback={member.name.charAt(0).toUpperCase()}
        className="absolute inset-0 h-full w-full object-cover text-lg"
      />
    </button>
  );
}

function MemberCard({
  member,
  top,
  left,
  below,
  onCancelClose,
  onScheduleClose,
}: {
  member: TeamMember;
  top: number;
  left: number;
  below: boolean;
  onCancelClose: () => void;
  onScheduleClose: () => void;
}) {
  const src = memberAvatarSrc(member);
  const links = memberLinks(member);
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-label={member.name}
      data-member-card
      className="fixed z-[80] w-72"
      style={{
        left,
        top: below ? top : undefined,
        bottom: below ? undefined : top,
      }}
      onMouseEnter={onCancelClose}
      onMouseLeave={onScheduleClose}
    >
      <article className="rounded-2xl border border-accent/35 bg-card/95 p-4 text-left shadow-[0_18px_50px_rgba(2,8,20,0.72)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-accent/30 bg-secondary text-xl">
            <AsyncAvatar
              src={src}
              alt={member.name}
              fallback={member.name.charAt(0).toUpperCase()}
              className="absolute inset-0 h-full w-full object-cover"
              eager
            />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">{member.name}</h3>
            <p className="truncate text-sm text-accent">{member.role}</p>
          </div>
        </div>
        {member.about ? (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {member.about}
          </p>
        ) : null}
        {links.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {links.map((link) => (
              <li key={`${link.label}-${link.href}`}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-accent/40 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </article>
    </div>,
    document.body
  );
}

function circleRows(members: TeamMember[]) {
  const columns = Math.max(1, Math.ceil(members.length / 3));
  return [0, 1, 2].map((index) => members.slice(index * columns, (index + 1) * columns));
}

function CircleRow({
  members,
  reverse,
  paused,
  activeId,
  onOpen,
  onScheduleClose,
  onCancelClose,
}: {
  members: TeamMember[];
  reverse: boolean;
  paused: boolean;
  activeId: string | null;
  onOpen: (anchor: HTMLButtonElement, memberId: string) => void;
  onScheduleClose: () => void;
  onCancelClose: () => void;
}) {
  if (members.length === 0) return null;
  const repeats = Math.max(2, Math.ceil(3200 / Math.max(1, members.length * 152)));

  return (
    <div className="overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_7rem,black_calc(100%-7rem),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_7rem,black_calc(100%-7rem),transparent)]">
      <div
        className={`flex w-max ${
          reverse ? "animate-marquee [animation-direction:reverse]" : "animate-marquee"
        }`}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {Array.from({ length: repeats }, (_, repeat) => (
              <div key={repeat} className="flex shrink-0 items-center gap-5 pr-5">
                {members.map((member) => (
                  <MemberCircle
                    key={`${copy}-${repeat}-${member.id}`}
                    member={member}
                    open={activeId === member.id}
                    onOpen={(anchor) => onOpen(anchor, member.id)}
                    onScheduleClose={onScheduleClose}
                    onCancelClose={onCancelClose}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberCircleGrid({ members }: { members: TeamMember[] }) {
  const rows = circleRows(members);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [placement, setPlacement] = useState({ top: 0, left: 0, below: false });
  const closeTimer = useRef<number | null>(null);
  const activeMember = members.find((member) => member.id === activeId) ?? null;

  const cancelClose = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActiveId(null), 160);
  };

  const placePopover = (anchor: HTMLButtonElement, memberId: string) => {
    const rect = anchor.getBoundingClientRect();
    const width = 288;
    const pad = 12;
    const below = rect.top < 240;
    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - width - pad));
    setPlacement({
      left,
      below,
      top: below ? rect.bottom - 12 : window.innerHeight - rect.top - 12,
    });
    setActiveId(memberId);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelClose();
    };
  }, []);

  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <CircleRow
          key={index}
          members={row}
          reverse={index === 1}
          paused={row.some((member) => member.id === activeId)}
          activeId={activeId}
          onOpen={placePopover}
          onScheduleClose={scheduleClose}
          onCancelClose={cancelClose}
        />
      ))}
      {activeMember ? (
        <MemberCard
          member={activeMember}
          top={placement.top}
          left={placement.left}
          below={placement.below}
          onCancelClose={cancelClose}
          onScheduleClose={scheduleClose}
        />
      ) : null}
    </div>
  );
}
