import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import {
  Sun,
  Moon,
  ArrowRight,
  Upload,
  X,
  Check,
  Palette,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

const accentPresets = [
  { name: "Electric Blue", primary: "#3B5EF5", secondary: "#5B7BF7" },
  { name: "Navy", primary: "#1B2A4A", secondary: "#2C3E6B" },
  { name: "Bright Teal", primary: "#0D9488", secondary: "#14B8A6" },
  { name: "Dark Berry", primary: "#7C2D4F", secondary: "#9D3C6A" },
  { name: "Taupe", primary: "#8B7D6B", secondary: "#A69882" },
  { name: "Dark Slate", primary: "#3D4F5F", secondary: "#546E7A" },
  { name: "Dark Purple", primary: "#4A2D6B", secondary: "#6B3FA0" },
  { name: "Burnt Sienna", primary: "#A0522D", secondary: "#C06030" },
  { name: "Light Taupe Grey", primary: "#9E9589", secondary: "#B5ADA3" },
  { name: "Warm Charcoal", primary: "#36393F", secondary: "#4E5258" },
  { name: "Sage", primary: "#6B7F5E", secondary: "#839B72" },
];

const bannerPresets = [
  {
    name: "Blue → Purple",
    type: "gradient" as const,
    value: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
  },
  {
    name: "Green → Teal",
    type: "gradient" as const,
    value: "linear-gradient(135deg, #10B981 0%, #14B8A6 100%)",
  },
  {
    name: "Red → Orange",
    type: "gradient" as const,
    value: "linear-gradient(135deg, #EF4444 0%, #F97316 100%)",
  },
  {
    name: "Dark Slate",
    type: "gradient" as const,
    value: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
  },
  {
    name: "Sunset",
    type: "gradient" as const,
    value: "linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)",
  },
  {
    name: "No Banner",
    type: "none" as const,
    value: "",
  },
];

export const ThemeCustomization = ({
  userId,
  onComplete,
}: ThemeCustomizationProps) => {
  const [themeBase, setThemeBase] = useState<"light" | "dark">("light");
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [secondaryColor, setSecondaryColor] = useState("#8B5CF6");
  const [bannerType, setBannerType] = useState<"gradient" | "solid" | "custom" | "none">("gradient");
  const [bannerValue, setBannerValue] = useState(
    "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)"
  );
  const [bannerUrl, setBannerUrl] = useState("");
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleBannerUpload = useCallback(
    async (file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Banner image must be under 5MB",
          variant: "destructive",
        });
        return;
      }
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Banner must be PNG or JPG",
          variant: "destructive",
        });
        return;
      }

      setUploadingBanner(true);
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `banner-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await supabase.storage
          .from("profile-banners")
          .upload(filePath, file);

        if (error) {
          toast({ title: "Upload failed", description: error.message, variant: "destructive" });
          return;
        }

        const { data: urlData } = supabase.storage
          .from("profile-banners")
          .getPublicUrl(filePath);

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
    // Auto-generate a gradient banner from selected colors if using default gradient
    let finalBannerValue = bannerValue;
    if (bannerType === "gradient" && bannerValue === "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)") {
      finalBannerValue = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    }
    if (bannerType === "solid") {
      finalBannerValue = primaryColor;
    }

    onComplete({
      themeBase,
      primaryColor,
      secondaryColor,
      bannerType,
      bannerValue: finalBannerValue,
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
      : bannerType === "solid"
      ? primaryColor
      : bannerValue || `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;

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

          {/* Color Presets */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Accent Colors</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {accentPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setPrimaryColor(preset.primary);
                    setSecondaryColor(preset.secondary);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    primaryColor === preset.primary && secondaryColor === preset.secondary
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: preset.primary }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Custom Color Pickers */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-3">
                  <button
                    className="w-10 h-10 rounded-lg border-2 border-border shrink-0 transition-shadow hover:shadow-md"
                    style={{ backgroundColor: primaryColor }}
                    onClick={() => {
                      setShowPrimaryPicker(!showPrimaryPicker);
                      setShowSecondaryPicker(false);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Primary</p>
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full text-sm font-mono bg-transparent border-none p-0 focus:outline-none"
                    />
                  </div>
                </div>
                {showPrimaryPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2"
                  >
                    <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                  </motion.div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <button
                    className="w-10 h-10 rounded-lg border-2 border-border shrink-0 transition-shadow hover:shadow-md"
                    style={{ backgroundColor: secondaryColor }}
                    onClick={() => {
                      setShowSecondaryPicker(!showSecondaryPicker);
                      setShowPrimaryPicker(false);
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Secondary</p>
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full text-sm font-mono bg-transparent border-none p-0 focus:outline-none"
                    />
                  </div>
                </div>
                {showSecondaryPicker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2"
                  >
                    <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Banner</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {bannerPresets.map((preset, idx) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setBannerType(preset.type === "none" ? "none" : "gradient");
                    setBannerValue(preset.value);
                    setBannerUrl("");
                  }}
                  className={`h-10 px-3 rounded-lg border text-xs font-medium transition-all flex items-center gap-2 ${
                    bannerType !== "custom" && bannerValue === preset.value
                      ? "border-primary ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {preset.type === "none" ? (
                    <X className="w-3 h-3" />
                  ) : (
                    <div
                      className="w-5 h-5 rounded"
                      style={{ background: preset.value }}
                    />
                  )}
                  {preset.name}
                </button>
              ))}
            </div>
            {/* Custom upload */}
            <button
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploadingBanner}
              className={`w-full p-3 rounded-lg border-2 border-dashed text-sm transition-all flex items-center justify-center gap-2 ${
                bannerType === "custom"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <Upload className="w-4 h-4" />
              {uploadingBanner ? "Uploading..." : "Upload custom banner"}
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
            <p className="text-xs text-muted-foreground mt-1">
              PNG or JPG, max 5MB. Recommended: 1200×300px
            </p>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div>
          <label className="text-sm font-semibold mb-3 block">Preview</label>
          <div
            className="rounded-xl border overflow-hidden shadow-lg"
            style={{
              backgroundColor: previewBg,
              borderColor: previewBorder,
            }}
          >
            {/* Banner */}
            {bannerType !== "none" && (
              <div
                className="w-full h-24"
                style={{ background: previewBanner }}
              />
            )}

            {/* Content */}
            <div className="p-5 space-y-4" style={{ color: previewFg }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-full"
                  style={{ backgroundColor: previewBorder }}
                />
                <div>
                  <p className="font-semibold text-sm">Your Name</p>
                  <p className="text-xs opacity-60">Your Professional Headline</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: primaryColor,
                    color: "#FFFFFF",
                  }}
                >
                  Get in Touch
                </div>
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-medium border"
                  style={{
                    borderColor: primaryColor,
                    color: primaryColor,
                  }}
                >
                  LinkedIn
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <div
                    className="h-2 rounded-full flex-1"
                    style={{ backgroundColor: primaryColor, opacity: 0.8 }}
                  />
                  <div
                    className="h-2 rounded-full w-16"
                    style={{ backgroundColor: secondaryColor, opacity: 0.5 }}
                  />
                </div>
                <div
                  className="h-16 rounded-lg"
                  style={{ backgroundColor: previewCard }}
                />
                <div className="flex gap-2">
                  <div
                    className="h-12 rounded-lg flex-1"
                    style={{ backgroundColor: previewCard }}
                  />
                  <div
                    className="h-12 rounded-lg flex-1"
                    style={{ backgroundColor: previewCard }}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            You can update your style anytime from settings
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
