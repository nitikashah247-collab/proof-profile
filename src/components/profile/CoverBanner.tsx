interface CoverBannerProps {
  archetype?: string;
  bannerUrl?: string;
}

const archetypeGradients: Record<string, string> = {
  executive: "from-slate-950 via-slate-900 to-slate-800",
  creative: "from-blue-600 via-purple-600 to-pink-500",
  technical: "from-sky-600 via-blue-500 to-indigo-600",
  sales: "from-red-500 via-orange-500 to-amber-500",
  operations: "from-emerald-600 via-teal-500 to-cyan-500",
};

export const CoverBanner = ({ archetype, bannerUrl }: CoverBannerProps) => {
  const gradient = archetypeGradients[archetype || "executive"] || archetypeGradients.executive;

  if (bannerUrl) {
    return (
      <div className="w-full h-[200px] overflow-hidden">
        <img src={bannerUrl} alt="Profile banner" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`w-full h-[200px] bg-gradient-to-r ${gradient} relative overflow-hidden`}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};
