import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CaseStudyInlineEditProps {
  sectionData: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

interface ArtifactItem {
  url: string;
  caption: string;
  type: string;
}

interface CaseStudyItem {
  title: string;
  company: string;
  key_metric: string;
  summary: string;
  challenge: string;
  approach: string;
  results: string;
  skills_used: string[];
  artifacts: ArtifactItem[];
}

export const CaseStudyInlineEdit = ({ sectionData, onSave, onCancel }: CaseStudyInlineEditProps) => {
  const [studies, setStudies] = useState<CaseStudyItem[]>(
    (sectionData?.items || sectionData?.case_studies || []).map((cs: any) => ({
      title: cs.title || "",
      company: cs.company || "",
      key_metric: cs.key_metric || "",
      summary: cs.summary || "",
      challenge: cs.challenge || "",
      approach: cs.approach || "",
      results: cs.results || "",
      skills_used: cs.skills_used || cs.skills || [],
      artifacts: (cs.artifacts || []).map((a: any) => ({
        url: a.url || "",
        caption: a.caption || "",
        type: a.type || "link",
      })),
    }))
  );
  const [saving, setSaving] = useState(false);
  const [newArtifactUrls, setNewArtifactUrls] = useState<Record<number, string>>({});

  const updateStudy = (index: number, field: string, value: any) => {
    setStudies((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addStudy = () => {
    setStudies((prev) => [...prev, { title: "", company: "", key_metric: "", summary: "", challenge: "", approach: "", results: "", skills_used: [], artifacts: [] }]);
  };

  const removeStudy = (index: number) => {
    setStudies((prev) => prev.filter((_, i) => i !== index));
  };

  const addArtifact = (storyIndex: number) => {
    const url = newArtifactUrls[storyIndex]?.trim();
    if (!url) return;
    setStudies((prev) =>
      prev.map((s, i) =>
        i === storyIndex
          ? { ...s, artifacts: [...s.artifacts, { url, caption: url, type: "link" }] }
          : s
      )
    );
    setNewArtifactUrls((prev) => ({ ...prev, [storyIndex]: "" }));
  };

  const removeArtifact = (storyIndex: number, artifactIndex: number) => {
    setStudies((prev) =>
      prev.map((s, i) =>
        i === storyIndex
          ? { ...s, artifacts: s.artifacts.filter((_, ai) => ai !== artifactIndex) }
          : s
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, items: studies });
    setSaving(false);
    toast({ title: "Changes saved", description: "Your profile has been updated." });
  };

  return (
    <div className="space-y-6">
      {studies.length === 0 && (
        <p className="text-sm text-muted-foreground italic">No impact stories found. Click "Add Story" to create one.</p>
      )}
      {studies.map((study, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Story {i + 1}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeStudy(i)} className="text-destructive h-7 text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input value={study.title} onChange={(e) => updateStudy(i, "title", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input value={study.company} onChange={(e) => updateStudy(i, "company", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Key Metric</Label>
              <Input value={study.key_metric} onChange={(e) => updateStudy(i, "key_metric", e.target.value)} className="mt-1" placeholder="e.g. 62% growth" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Summary</Label>
            <Textarea value={study.summary} onChange={(e) => updateStudy(i, "summary", e.target.value)} rows={2} className="mt-1" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Challenge</Label>
              <Textarea value={study.challenge} onChange={(e) => updateStudy(i, "challenge", e.target.value)} rows={2} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Approach</Label>
              <Textarea value={study.approach} onChange={(e) => updateStudy(i, "approach", e.target.value)} rows={2} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Results</Label>
              <Textarea value={study.results} onChange={(e) => updateStudy(i, "results", e.target.value)} rows={2} className="mt-1" />
            </div>
          </div>

          {/* Evidence & Artifacts */}
          <div>
            <Label className="text-xs text-muted-foreground font-medium">Evidence & Artifacts</Label>
            <p className="text-xs text-muted-foreground mb-2">Add links or images that support this story</p>
            {study.artifacts.map((artifact, ai) => (
              <div key={ai} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-muted">
                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm truncate flex-1">{artifact.caption || artifact.url}</span>
                <button onClick={() => removeArtifact(i, ai)} className="text-destructive text-xs hover:underline shrink-0">
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <Input
                value={newArtifactUrls[i] || ""}
                onChange={(e) => setNewArtifactUrls((prev) => ({ ...prev, [i]: e.target.value }))}
                placeholder="https://example.com/evidence"
                className="flex-1"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addArtifact(i); } }}
              />
              <Button size="sm" variant="outline" onClick={() => addArtifact(i)} className="shrink-0">
                Add
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addStudy} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Story
      </Button>
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
