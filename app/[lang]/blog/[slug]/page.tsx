"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Tag } from "lucide-react";
import blogPostsJson from "@/data/blog.json";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types";

const blogPosts = blogPostsJson as BlogPost[];

export default function BlogPostPage() {
  const params = useParams();
  const lang = (params.lang as Locale) || "en";
  const slug = params.slug as string;
  const dict = getDictionary(lang);

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">{dict.common.notFound}</h1>
        <Link href={`/${lang}/blog/`}>
          <Button variant="outline">{dict.blog.title}</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${lang}/blog/`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {dict.blog.title}
      </Link>

      <div className="aspect-[21/9] rounded-xl overflow-hidden mb-8">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
        <Badge variant="accent">{post.category}</Badge>
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {post.author}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {post.date}
        </span>
        <span>{post.readTime} {dict.blog.readTime}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-bold mb-8">{post.title}</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">{post.excerpt}</p>
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-8 border-t">
        <Tag className="h-4 w-4 text-muted-foreground mr-2" />
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            #{tag}
          </Badge>
        ))}
      </div>
    </article>
  );
}