import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

interface CaseStudyInlineEditProps {
  sectionData: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
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
  artifacts: any[];
}

export const CaseStudyInlineEdit = ({ sectionData, onSave, onCancel }: CaseStudyInlineEditProps) => {
  const [studies, setStudies] = useState<CaseStudyItem[]>(
    (sectionData?.case_studies || []).map((cs: any) => ({
      title: cs.title || "",
      company: cs.company || "",
      key_metric: cs.key_metric || "",
      summary: cs.summary || "",
      challenge: cs.challenge || "",
      approach: cs.approach || "",
      results: cs.results || "",
      skills_used: cs.skills_used || cs.skills || [],
      artifacts: cs.artifacts || [],
    }))
  );
  const [saving, setSaving] = useState(false);

  const updateStudy = (index: number, field: string, value: any) => {
    setStudies((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addStudy = () => {
    setStudies((prev) => [...prev, { title: "", company: "", key_metric: "", summary: "", challenge: "", approach: "", results: "", skills_used: [], artifacts: [] }]);
  };

  const removeStudy = (index: number) => {
    setStudies((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, case_studies: studies });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {studies.map((study, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Story {i + 1}</span>
            <Button variant="ghost" size="sm" onClick={() => removeStudy(i)} className="text-destructive h-7 text-xs">
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
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addStudy} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Story
      </Button>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
