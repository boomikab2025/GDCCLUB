export type Locale = "en" | "ta" | "ru" | "hi" | "zh" | "ja" | "de" | "es";

export type GameStatus = "released" | "coming-soon";

export interface Game {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  genre: string[];
  platforms: string[];
  releaseYear: number;
  rating: number;
  /** Empty string = placeholder art until real cover is added */
  coverImage: string;
  screenshots: string[];
  trailerUrl?: string;
  features: string[];
  story: string;
  /** Default treated as "released" if omitted */
  status?: GameStatus;
  systemRequirements: {
    minimum: Record<string, string>;
    recommended: Record<string, string>;
  };
  links: {
    steam?: string;
    epic?: string;
    gog?: string;
    itch?: string;
    website?: string;
    github?: string;
  };
  awards?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  /** Handle / nickname shown under the name */
  tagname?: string;
  /** GitHub profile URL */
  github?: string;
  /** Avatar URL (usually GitHub avatar) */
  image?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Dictionary {
  nav: {
    home: string;
    games: string;
    blog: string;
    community: string;
    about: string;
    contact: string;
    cta: string;
  };
  hero: {
    badge: string;
    tagline: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  games: {
    title: string;
    subtitle: string;
    comingSoon: string;
    comingSoonDesc: string;
    toBeReleased: string;
    details: string;
    buyNow: string;
    wishlist: string;
    trailer: string;
    screenshots: string;
    story: string;
    features: string;
    requirements: string;
  };
  blog: {
    title: string;
    subtitle: string;
    comingSoon: string;
    comingSoonDesc: string;
    search: string;
    categories: string;
    readMore: string;
    readTime: string;
    latest: string;
  };
  community: {
    title: string;
    description: string;
    discordCta: string;
    discordDesc: string;
    joinDiscord: string;
    linkSoon: string;
  };
  about: {
    title: string;
    story: string;
    locationTitle: string;
    locationBody: string;
    team: string;
    teamSoon: string;
    values: string;
  };
  contact: {
    title: string;
    subtitle: string;
    findUs: string;
    socialsHint: string;
  };
  footer: {
    rights: string;
    links: string;
    social: string;
    tagline: string;
  };
  common: {
    comingSoon: string;
    viewAll: string;
    backHome: string;
    notFound: string;
  };
  values: {
    craft: { title: string; desc: string };
    players: { title: string; desc: string };
    curiosity: { title: string; desc: string };
    community: { title: string; desc: string };
  };
}
