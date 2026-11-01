import { Hero } from "@/components/sections/Hero";
import { LatestGames } from "@/components/sections/LatestGames";
import { CommunityTeaser } from "@/components/sections/CommunityTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LatestGames />
      <CommunityTeaser />
    </>
  );
}
