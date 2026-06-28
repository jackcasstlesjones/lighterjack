import { cn } from "@/lib/utils";

export function BrandMark({
  size = "md",
  showWordmark = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
}) {
  const dim = size === "lg" ? 34 : size === "md" ? 28 : 22;
  const radius = size === "lg" ? 9 : 7;
  const fontPx = size === "lg" ? 18 : size === "md" ? 15 : 13;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="flex items-center justify-center bg-primary text-primary-foreground font-bold"
        style={{
          width: dim,
          height: dim,
          borderRadius: radius,
          fontSize: fontPx,
        }}
      >
        L
      </div>
      {showWordmark && (
        <span
          className="font-bold tracking-tight"
          style={{
            fontSize: size === "lg" ? 21 : size === "md" ? 17 : 15,
            letterSpacing: "-0.02em",
          }}
        >
          LighterJack
        </span>
      )}
    </div>
  );
}
