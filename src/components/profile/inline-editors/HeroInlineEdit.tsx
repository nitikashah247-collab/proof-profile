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

  // Stats
  const [yearsExperience, setYearsExperience] = useState(sectionData?.hero_stats?.years_experience || 0);
  const [projectsLed, setProjectsLed] = useState(sectionData?.hero_stats?.projects_led || 0);
  const [peopleManaged, setPeopleManaged] = useState(sectionData?.hero_stats?.people_managed || 0);
  const [keyMetricValue, setKeyMetricValue] = useState(sectionData?.hero_stats?.key_metric?.value || 0);
  const [keyMetricLabel, setKeyMetricLabel] = useState(sectionData?.hero_stats?.key_metric?.label || "");
  const [keyMetricSuffix, setKeyMetricSuffix] = useState(sectionData?.hero_stats?.key_metric?.suffix || "%");

  const handleSave = async () => {
    setSaving(true);
    await onSave(
      { full_name: fullName, headline, bio, location },
      {
        ...sectionData,
        email,
        linkedin_url: linkedinUrl,
        hero_stats: {
          years_experience: Number(yearsExperience),
          projects_led: Number(projectsLed),
          people_managed: Number(peopleManaged),
          key_metric: {
            value: Number(keyMetricValue),
            label: keyMetricLabel,
            suffix: keyMetricSuffix,
          },
        },
      }
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

      {/* Stats editing */}
      <div>
        <Label className="text-xs text-muted-foreground font-medium">Profile Stats</Label>
        <p className="text-xs text-muted-foreground mb-2">Set to 0 to hide a stat</p>
        <div className="grid grid-cols-3 gap-3 mt-1">
          <div>
            <Label className="text-xs text-muted-foreground">Years Experience</Label>
            <Input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Projects Led</Label>
            <Input type="number" value={projectsLed} onChange={(e) => setProjectsLed(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">People Managed</Label>
            <Input type="number" value={peopleManaged} onChange={(e) => setPeopleManaged(e.target.value)} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div>
            <Label className="text-xs text-muted-foreground">Key Metric Value</Label>
            <Input type="number" value={keyMetricValue} onChange={(e) => setKeyMetricValue(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Key Metric Label</Label>
            <Input value={keyMetricLabel} onChange={(e) => setKeyMetricLabel(e.target.value)} className="mt-1" placeholder="e.g. YoY Growth" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Suffix</Label>
            <Input value={keyMetricSuffix} onChange={(e) => setKeyMetricSuffix(e.target.value)} className="mt-1" placeholder="e.g. %, +, x" />
          </div>
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
