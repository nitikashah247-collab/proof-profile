import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Trash2 } from "lucide-react";

interface ImpactChartsInlineEditProps {
  sectionData: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export const ImpactChartsInlineEdit = ({ sectionData, onSave, onCancel }: ImpactChartsInlineEditProps) => {
  const [visualizations, setVisualizations] = useState<any[]>(
    (sectionData?.visualizations || []).map((v: any) => ({ ...v }))
  );
  const [saving, setSaving] = useState(false);

  const updateViz = (index: number, field: string, value: any) => {
    setVisualizations((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  };

  const removeViz = (index: number) => {
    setVisualizations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, visualizations });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {visualizations.map((viz, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{viz.title || `Chart ${i + 1}`}</span>
            <Button variant="ghost" size="sm" onClick={() => removeViz(i)} className="text-destructive h-7 text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input value={viz.title || ""} onChange={(e) => updateViz(i, "title", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Headline Value</Label>
              <Input value={viz.headline_value || ""} onChange={(e) => updateViz(i, "headline_value", e.target.value)} className="mt-1" placeholder="62%" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Headline Label</Label>
              <Input value={viz.headline_label || ""} onChange={(e) => updateViz(i, "headline_label", e.target.value)} className="mt-1" placeholder="YoY Growth" />
            </div>
          </div>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">Chart data points are AI-generated. You can edit titles and headline values above.</p>
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
