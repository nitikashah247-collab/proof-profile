import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Check, Loader2, Plus, Trash2, X } from "lucide-react";

interface WorkStyleInlineEditProps {
  sectionData: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export const WorkStyleInlineEdit = ({ sectionData, onSave, onCancel }: WorkStyleInlineEditProps) => {
  const ws = sectionData?.work_style || {};
  const [dimensions, setDimensions] = useState<any[]>(
    (ws.dimensions || []).map((d: any) => ({ ...d }))
  );
  const [traits, setTraits] = useState<string[]>(ws.traits || []);
  const [newTrait, setNewTrait] = useState("");
  const [saving, setSaving] = useState(false);

  const updateDim = (index: number, field: string, value: any) => {
    setDimensions((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const addTrait = () => {
    if (newTrait.trim()) {
      setTraits((prev) => [...prev, newTrait.trim()]);
      setNewTrait("");
    }
  };

  const removeTrait = (index: number) => {
    setTraits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, work_style: { dimensions, traits } });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-sm font-semibold">Work Style Dimensions</Label>
        {dimensions.map((dim, i) => (
          <div key={i} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <Input value={dim.left_label || dim.leftLabel || ""} onChange={(e) => updateDim(i, "left_label", e.target.value)} placeholder="Left label" className="h-8 text-xs" />
              <Input value={dim.label || ""} onChange={(e) => updateDim(i, "label", e.target.value)} placeholder="Dimension" className="h-8 text-xs text-center" />
              <Input value={dim.right_label || dim.rightLabel || ""} onChange={(e) => updateDim(i, "right_label", e.target.value)} placeholder="Right label" className="h-8 text-xs text-right" />
            </div>
            <Slider value={[dim.value || 50]} onValueChange={([v]) => updateDim(i, "value", v)} max={100} step={5} />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Core Values & Traits</Label>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {trait}
              <button onClick={() => removeTrait(i)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newTrait} onChange={(e) => setNewTrait(e.target.value)} placeholder="Add a trait..." className="h-8 text-sm" onKeyDown={(e) => e.key === "Enter" && addTrait()} />
          <Button variant="outline" size="sm" onClick={addTrait} className="h-8"><Plus className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

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
