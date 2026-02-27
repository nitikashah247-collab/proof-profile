import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  ArrowRight,
  Upload,
  X,
  Check,
  Pencil,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface ThemeSettings {
  themeBase: "light" | "dark";
  primaryColor: string;
  secondaryColor: string;
  bannerType: "gradient" | "solid" | "custom" | "none";
  bannerValue: string;
  bannerUrl: string;
}

interface ThemeCustomizationProps {
  userId: string;
  onComplete: (settings: ThemeSettings) => void;
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * percent / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export const ThemeCustomization = ({
  userId,
  onComplete,
}: ThemeCustomizationProps) => {
  const [themeBase, setThemeBase] = useState<"light" | "dark">("light");
  const [primaryColor, setPrimaryColor] = useState("#3B5EF5");
  const [secondaryColor, setSecondaryColor] = useState("#5B7BF7");
  const [bannerType, setBannerType] = useState<"gradient" | "solid" | "custom" | "none">("solid");
  const [bannerValue, setBannerValue] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handlePrimaryChange = (hex: string) => {
    setPrimaryColor(hex);
    setSecondaryColor(lightenColor(hex, 15));
  };

  const handleBannerUpload = useCallback(
    async (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "File too large", description: "Banner image must be under 5MB", variant: "destructive" });
        return;
      }
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        toast({ title: "Invalid file type", description: "Banner must be PNG or JPG", variant: "destructive" });
        return;
      }

      setUploadingBanner(true);
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage.from("profile-banners").upload(filePath, file);
        if (error) {
          toast({ title: "Upload failed", description: error.message, variant: "destructive" });
          return;
        }

        const { data: urlData } = supabase.storage.from("profile-banners").getPublicUrl(filePath);
        setBannerType("custom");
        setBannerUrl(urlData.publicUrl);
        setBannerValue("");
        toast({ title: "Banner uploaded", description: "Your custom banner has been applied." });
      } catch {
        toast({ title: "Upload failed", variant: "destructive" });
      } finally {
        setUploadingBanner(false);
      }
    },
    [userId]
  );

  const handleContinue = () => {
    onComplete({
      themeBase,
      primaryColor,
      secondaryColor,
      bannerType,
      bannerValue: bannerType === "solid" ? primaryColor : bannerValue,
      bannerUrl,
    });
  };

  // Preview styles
  const previewBg = themeBase === "dark" ? "#0F172A" : "#FFFFFF";
  const previewFg = themeBase === "dark" ? "#F8FAFC" : "#1E293B";
  const previewCard = themeBase === "dark" ? "#1E293B" : "#F8FAFC";
  const previewBorder = themeBase === "dark" ? "#334155" : "#E2E8F0";

  const previewBanner =
    bannerType === "custom" && bannerUrl
      ? `url(${bannerUrl}) center/cover`
      : bannerType === "none"
      ? previewCard
      : primaryColor;

  return (
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-3">
        Choose your <span className="text-primary">style</span>
      </h1>
      <p className="text-lg text-muted-foreground mb-10">
        Pick a base theme and customize your colors
      </p>

      <div className="grid md:grid-cols-2 gap-8 text-left">
        {/* Left: Controls */}
        <div className="space-y-8">
          {/* Base Theme Toggle */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Base Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "light" as const, icon: Sun, label: "Light", desc: "Clean & Modern" },
                { id: "dark" as const, icon: Moon, label: "Dark", desc: "Bold & Sleek" },
              ].map((t) => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setThemeBase(t.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all relative ${
                    themeBase === t.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {themeBase === t.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <t.icon className="w-6 h-6 mx-auto mb-2 text-foreground" />
                  <p className="font-semibold text-sm">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Accent Color Picker */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Accent Color</label>
            <p className="text-xs text-muted-foreground mb-3">Choose a color for buttons, links, and accents</p>
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => handlePrimaryChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="w-14 h-14 rounded-xl border-2 border-border group-hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background border border-border rounded-full flex items-center justify-center shadow-sm">
                  <Pencil className="w-2.5 h-2.5 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Click to change</p>
                <p className="text-xs text-muted-foreground font-mono">{primaryColor}</p>
              </div>
            </label>
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Banner</label>
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => { setBannerType("solid"); setBannerUrl(""); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  bannerType !== "custom"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="w-8 h-5 rounded" style={{ backgroundColor: primaryColor }} />
                <span className="text-sm">Accent color</span>
              </button>

              <button
                onClick={() => setBannerType("custom")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
                  bannerType === "custom"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload image</span>
              </button>
            </div>

            {bannerType === "custom" && (
              <div>
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={uploadingBanner}
                  className="w-full p-3 rounded-lg border-2 border-dashed text-sm transition-all flex items-center justify-center gap-2 border-border hover:border-primary/40"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingBanner ? "Uploading..." : bannerUrl ? "Change banner image" : "Upload custom banner"}
                </button>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleBannerUpload(e.target.files[0]);
                    e.target.value = "";
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1">PNG or JPG, max 5MB. Recommended: 1200×300px</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Preview */}
        <div>
          <label className="text-sm font-semibold mb-3 block">Preview</label>
          <div
            className="rounded-xl border overflow-hidden shadow-lg"
            style={{ backgroundColor: previewBg, borderColor: previewBorder }}
          >
            {/* Banner */}
            <div className="w-full h-24" style={{ background: previewBanner }} />

            {/* Content */}
            <div className="p-5 space-y-4" style={{ color: previewFg }}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full" style={{ backgroundColor: previewBorder }} />
                <div>
                  <p className="font-semibold text-sm">Your Name</p>
                  <p className="text-xs opacity-60">Your Professional Headline</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: primaryColor, color: "#FFFFFF" }}
                >
                  Get in Touch
                </div>
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-medium border"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  LinkedIn
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="h-2 rounded-full flex-1" style={{ backgroundColor: primaryColor, opacity: 0.8 }} />
                  <div className="h-2 rounded-full w-16" style={{ backgroundColor: secondaryColor, opacity: 0.5 }} />
                </div>
                <div className="h-16 rounded-lg" style={{ backgroundColor: previewCard }} />
                <div className="flex gap-2">
                  <div className="h-12 rounded-lg flex-1" style={{ backgroundColor: previewCard }} />
                  <div className="h-12 rounded-lg flex-1" style={{ backgroundColor: previewCard }} />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            You can update your style anytime from your profile
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <Button size="lg" onClick={handleContinue} className="group">
          Continue
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
