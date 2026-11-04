"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { BookOpen, Search } from "lucide-react";
import blogPostsJson from "@/data/blog.json";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { BlogPost } from "@/types";

const blogPosts = blogPostsJson as BlogPost[];
const categories = ["All", "Development", "Art", "Audio", "Design", "Business"];

export default function BlogPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const dict = getDictionary(lang);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || post.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{dict.blog.title}</h1>
        <p className="text-lg text-muted-foreground">{dict.blog.subtitle}</p>
      </motion.div>

      {blogPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-12 sm:p-16 text-center"
        >
          <BookOpen className="h-14 w-14 text-accent mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {dict.blog.comingSoon}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {dict.blog.comingSoonDesc}
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={dict.blog.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border bg-background"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`motion-button px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] rounded-sm border transition-colors ${
                    category === c
                      ? "bg-accent text-accent-foreground border-accent shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                      : "border-accent/35 bg-black/60 text-muted-foreground hover:border-accent/55 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 20,
                  delay: index * 0.05,
                }}
              >
                <Link href={`/${lang}/blog/${post.slug}/`}>
                  <div className="motion-card group h-full bg-card border rounded-xl overflow-hidden hover:border-accent/50 transition-all">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{post.author}</span>
                        <span className="text-muted-foreground">
                          {post.readTime} {dict.blog.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
