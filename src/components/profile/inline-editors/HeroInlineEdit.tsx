import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeroInlineEditProps {
  profileData: any;
  sectionData: Record<string, any>;
  onSave: (profileUpdates: Record<string, any>, sectionUpdates: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export const HeroInlineEdit = ({ profileData, sectionData, onSave, onCancel }: HeroInlineEditProps) => {
  const [fullName, setFullName] = useState(profileData?.full_name || "");
  const [headline, setHeadline] = useState(profileData?.headline || "");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [location, setLocation] = useState(profileData?.location || "");
  const [email, setEmail] = useState(sectionData?.email || "");
  const [linkedinUrl, setLinkedinUrl] = useState(sectionData?.linkedin_url || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(
      { full_name: fullName, headline, bio, location },
      { ...sectionData, email, linkedin_url: linkedinUrl }
    );
    setSaving(false);
    toast({ title: "Changes saved", description: "Your profile has been updated." });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground">Full Name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Headline</Label>
        <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Bio</Label>
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs text-muted-foreground">Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">LinkedIn URL</Label>
          <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
