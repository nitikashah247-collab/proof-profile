interface CoverBannerProps {
  bannerType?: string;
  bannerValue?: string;
  bannerUrl?: string;
  primaryColor?: string;
  archetype?: string;
}

export const CoverBanner = ({
  bannerType,
  bannerUrl,
  primaryColor,
}: CoverBannerProps) => {
  // Custom banner image
  if (bannerType === "custom" && bannerUrl) {
    return (
      <div className="w-full h-32 overflow-hidden">
        <img src={bannerUrl} alt="Profile banner" className="w-full h-full object-cover" />
      </div>
    );
  }

  // No banner
  if (bannerType === "none") {
    return null;
  }

  // Default: solid accent color with shimmer sweep (ANIMATION 2)
  return (
    <div
      className="w-full h-32 relative overflow-hidden"
      style={{ backgroundColor: primaryColor || "#3B5EF5" }}
    >
      {/* Shimmer sweep overlay */}
      <div
        className="absolute inset-0 banner-shimmer"
        style={{
          background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
};
