"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GameFiltersProps {
  onFilterChange: (filters: { genre: string; platform: string; year: string }) => void;
}

const genres = ["All", "Horror", "Sci-Fi", "Adventure", "Action", "RPG", "Cyberpunk", "Narrative", "Racing", "Indie"];
const platforms = ["All", "PC", "PlayStation 5", "Xbox Series X", "Nintendo Switch", "iOS", "Android"];
const years = ["All", "2024", "2023", "2022", "2021"];

export function GameFilters({ onFilterChange }: GameFiltersProps) {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (type: string, value: string) => {
    const newFilters = {
      genre: type === "genre" ? value : selectedGenre,
      platform: type === "platform" ? value : selectedPlatform,
      year: type === "year" ? value : selectedYear,
    };
    
    if (type === "genre") setSelectedGenre(value);
    if (type === "platform") setSelectedPlatform(value);
    if (type === "year") setSelectedYear(value);
    
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSelectedGenre("All");
    setSelectedPlatform("All");
    setSelectedYear("All");
    onFilterChange({ genre: "All", platform: "All", year: "All" });
  };

  const hasActiveFilters = selectedGenre !== "All" || selectedPlatform !== "All" || selectedYear !== "All";

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="default" className="ml-1 h-5 min-w-5 px-1.5 tracking-normal">
              {[selectedGenre, selectedPlatform, selectedYear].filter(f => f !== "All").length}
            </Badge>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="p-4 rounded-sm border border-accent/25 bg-card space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium mb-2 block tracking-wide text-accent/90">Genre</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => handleChange("genre", g)}
                  className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] rounded-sm border transition-colors ${
                    selectedGenre === g
                      ? "bg-accent text-accent-foreground border-accent shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                      : "border-accent/35 bg-black/60 text-muted-foreground hover:border-accent/55 hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block tracking-wide text-accent/90">Platform</label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <button
                  key={p}
                  onClick={() => handleChange("platform", p)}
                  className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] rounded-sm border transition-colors ${
                    selectedPlatform === p
                      ? "bg-accent text-accent-foreground border-accent shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                      : "border-accent/35 bg-black/60 text-muted-foreground hover:border-accent/55 hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block tracking-wide text-accent/90">Year</label>
            <div className="flex flex-wrap gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => handleChange("year", y)}
                  className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] rounded-sm border transition-colors ${
                    selectedYear === y
                      ? "bg-accent text-accent-foreground border-accent shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                      : "border-accent/35 bg-black/60 text-muted-foreground hover:border-accent/55 hover:text-foreground"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}