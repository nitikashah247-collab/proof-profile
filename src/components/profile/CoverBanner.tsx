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

  // Default: solid accent color (flat, clean)
  return (
    <div
      className="w-full h-32"
      style={{ backgroundColor: primaryColor || "#3B5EF5" }}
    />
  );
};
