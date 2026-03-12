interface ProofLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showWordmark?: boolean;
}

export const ProofLogo = ({ size = "md", variant = "light", showWordmark = true }: ProofLogoProps) => {
  const sizes = {
    sm: { icon: 28, font: "text-lg", gap: "gap-1.5" },
    md: { icon: 32, font: "text-xl", gap: "gap-2" },
    lg: { icon: 40, font: "text-2xl", gap: "gap-2.5" },
  };

  const s = sizes[size];
  const textClass = variant === "light" ? "text-foreground" : "text-white";

  return (
    <div className={`flex items-center ${s.gap}`}>
      <img
        src="/proof-logo.png"
        alt="Proof"
        className="rounded-full"
        style={{ width: s.icon, height: s.icon }}
      />

      {showWordmark && (
        <span
          className={`${s.font} ${textClass}`}
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, letterSpacing: "-0.5px" }}
        >
          proof
        </span>
      )}
    </div>
  );
};
