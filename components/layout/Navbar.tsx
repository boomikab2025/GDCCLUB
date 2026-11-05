"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { BRAND } from "@/lib/brand";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const navContainerVariants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.12, staggerChildren: 0.07 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] as const },
  },
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  const navItems = [
    { label: dict.nav.home, href: `/${lang}/` },
    { label: dict.nav.games, href: `/${lang}/games/` },
    { label: dict.nav.community, href: `/${lang}/community/` },
    { label: dict.nav.about, href: `/${lang}/about/` },
    { label: dict.nav.contact, href: `/${lang}/contact/` },
  ];

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={`/${lang}/`}
            className="flex items-center shrink-0 group"
            aria-label={`${BRAND.nameLatin} home`}
          >
            <Logo
              height={36}
              priority
              wordmarkClassName="text-base sm:text-lg"
            />
          </Link>

          <motion.div
            variants={
              shouldReduceMotion
                ? {
                    hidden: {},
                    visible: {
                      transition: { delayChildren: 0, staggerChildren: 0 },
                    },
                  }
                : navContainerVariants
            }
            initial={shouldReduceMotion ? false : "hidden"}
            animate="visible"
            className="hidden md:flex items-center gap-1"
          >
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                variants={
                  shouldReduceMotion
                    ? {
                        hidden: { opacity: 1, y: 0 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0 } },
                      }
                    : navItemVariants
                }
              >
                <Link
                  href={item.href}
                  className="motion-nav-link block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/10"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link href={`/${lang}/games/`}>
              <Button
                variant="accent"
                size="sm"
                className="motion-button-prominent ml-2"
              >
                {dict.nav.cta}
              </Button>
            </Link>
          </div>

          <button
            className="motion-button md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="motion-nav-link block px-3 py-2 text-base font-medium rounded-md hover:bg-accent/10 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-4 border-t">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
