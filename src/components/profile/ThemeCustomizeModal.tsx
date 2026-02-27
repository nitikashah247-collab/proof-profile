import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Upload, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * percent / 100));
  const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * percent / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

interface ThemeCustomizeModalProps {
  open: boolean;
  onClose: () => void;
  profile: {
    id: string;
    user_id: string;
    theme_base?: string;
    theme_primary_color?: string;
    theme_secondary_color?: string;
    banner_type?: string;
    banner_url?: string;
    banner_value?: string;
  };
  onSave: (updates: Record<string, any>) => void;
}

export const ThemeCustomizeModal = ({ open, onClose, profile, onSave }: ThemeCustomizeModalProps) => {
  const [themeBase, setThemeBase] = useState<"light" | "dark">((profile.theme_base as "light" | "dark") || "light");
  const [primaryColor, setPrimaryColor] = useState(profile.theme_primary_color || "#3B5EF5");
  const [secondaryColor, setSecondaryColor] = useState(profile.theme_secondary_color || "#5B7BF7");
  const [bannerType, setBannerType] = useState(profile.banner_type || "solid");
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePrimaryChange = (hex: string) => {
    setPrimaryColor(hex);
    setSecondaryColor(lightenColor(hex, 15));
  };

  const handleUpload = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${profile.user_id}/banner-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("profile-banners").upload(path, file);
      if (error) { toast({ title: "Upload failed", variant: "destructive" }); return; }
      const { data } = supabase.storage.from("profile-banners").getPublicUrl(path);
      setBannerUrl(data.publicUrl);
      setBannerType("custom");
    } catch { toast({ title: "Upload failed", variant: "destructive" }); }
    finally { setUploading(false); }
  }, [profile.user_id]);

  const handleSave = async () => {
    setSaving(true);
    const updates: Record<string, any> = {
      theme_base: themeBase,
      theme_primary_color: primaryColor,
      theme_secondary_color: secondaryColor,
      banner_type: bannerType === "custom" ? "custom" : "solid",
      banner_value: bannerType === "custom" ? "" : primaryColor,
      banner_url: bannerType === "custom" ? bannerUrl : null,
    };
    const { error } = await supabase.from("profiles").update(updates).eq("id", profile.id);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      onSave(updates);
      toast({ title: "Theme updated" });
      onClose();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          {/* Theme toggle */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Base Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "light" as const, icon: Sun, label: "Light" },
                { id: "dark" as const, icon: Moon, label: "Dark" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeBase(t.id)}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all relative",
                    themeBase === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  {themeBase === t.id && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                  <t.icon className="w-5 h-5 mx-auto mb-1 text-foreground" />
                  <p className="text-xs font-medium">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Accent Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => handlePrimaryChange(e.target.value)}
                className="w-12 h-12 rounded-lg border border-border cursor-pointer bg-transparent"
                style={{ padding: 0 }}
              />
              <div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground font-mono">{primaryColor}</p>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Banner</label>
            <div className="flex gap-3">
              <button
                onClick={() => { setBannerType("solid"); setBannerUrl(""); }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                  bannerType !== "custom" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                <div className="w-6 h-4 rounded" style={{ backgroundColor: primaryColor }} />
                Accent color
              </button>
              <button
                onClick={() => setBannerType("custom")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                  bannerType === "custom" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                )}
              >
                <Upload className="w-4 h-4" />
                Upload image
              </button>
            </div>
            {bannerType === "custom" && (
              <div className="mt-3">
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-full p-3 rounded-lg border-2 border-dashed border-border hover:border-primary/40 text-sm flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : bannerUrl ? "Change image" : "Upload banner"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); e.target.value = ""; }}
                />
              </div>
            )}
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
