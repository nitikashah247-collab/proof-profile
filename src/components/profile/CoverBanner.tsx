interface CoverBannerProps {
  bannerType?: string;
  bannerValue?: string;
  bannerUrl?: string;
  primaryColor?: string;
  archetype?: string;
}

export const CoverBanner = ({
  bannerType,
  bannerValue,
  bannerUrl,
  primaryColor,
  archetype,
}: CoverBannerProps) => {
  // Custom banner image
  if (bannerType === "custom" && bannerUrl) {
    return (
      <div className="w-full h-[200px] overflow-hidden">
        <img src={bannerUrl} alt="Profile banner" className="w-full h-full object-cover" />
      </div>
    );
  }

  // No banner
  if (bannerType === "none") {
    return null;
  }

  // Solid accent color (new default)
  const bgColor = primaryColor || bannerValue || "#3B5EF5";

  return (
    <div
      className="w-full h-[200px] relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
