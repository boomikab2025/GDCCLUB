"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Camera, Code2, Mail } from "lucide-react";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import socialLinks from "@/data/social.json";
import { BRAND } from "@/lib/brand";
import { BrandWordmark, Logo } from "./Logo";

const socialItems = [
  { label: "Gmail", href: `mailto:${socialLinks.gmail}`, Icon: Mail },
  { label: "Instagram", href: socialLinks.instagram, Icon: Camera },
  { label: "LinkedIn", href: socialLinks.linkedin, Icon: BriefcaseBusiness },
  { label: "GitHub", href: socialLinks.github, Icon: Code2 },
];

export function Footer() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  const links = [
    { label: dict.nav.games, href: `/${lang}/games/` },
    { label: dict.nav.community, href: `/${lang}/community/` },
    { label: dict.nav.about, href: `/${lang}/about/` },
    { label: dict.nav.contact, href: `/${lang}/contact/` },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
      className="border-t bg-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link
              href={`/${lang}/`}
              className="inline-flex items-center"
              aria-label={`${BRAND.nameLatin} home`}
            >
              <Logo height={40} wordmarkClassName="text-lg" />
            </Link>
            <p className="text-sm text-muted-foreground">{dict.footer.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{dict.footer.links}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="motion-footer-link inline-block text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{dict.footer.social}</h4>
            <div className="flex flex-wrap gap-4">
              {socialItems.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={href === "#" ? `${label} (link soon)` : label}
                  className="motion-footer-link inline-block text-muted-foreground hover:text-accent transition-colors"
                  {...(href !== "#"
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { onClick: (e) => e.preventDefault() })}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <BrandWordmark className="font-medium text-foreground" />.{" "}
          {dict.footer.rights}
        </div>
      </div>
    </motion.footer>
  );
}
