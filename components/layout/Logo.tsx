import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type LogoProps = {
  className?: string;
  /** Pixel height of the logo mark. */
  height?: number;
  priority?: boolean;
  /** Show wordmark text next to the mark (default true). */
  showWordmark?: boolean;
  /** Wordmark size class. */
  wordmarkClassName?: string;
};

export function Logo({
  className,
  height = 36,
  priority = false,
  showWordmark = true,
  wordmarkClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={BRAND.logoSrc}
        alt=""
        width={height}
        height={height}
        priority={priority}
        className="shrink-0 object-contain"
        style={{ height, width: height }}
        aria-hidden
        loading="eager"
      />
      {showWordmark && (
        <span
          className={cn(
            "font-display font-semibold tracking-wide text-foreground whitespace-nowrap select-none",
            wordmarkClassName
          )}
        >
          {BRAND.wordmark}
        </span>
      )}
    </span>
  );
}

/** Brand wordmark text alone (no image). */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-semibold tracking-wide whitespace-nowrap",
        className
      )}
    >
      {BRAND.wordmark}
    </span>
  );
}
