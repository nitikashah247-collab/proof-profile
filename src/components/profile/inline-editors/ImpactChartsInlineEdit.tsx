import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  const addViz = () => {
    setVisualizations((prev) => [...prev, {
      type: "bar_chart",
      title: "",
      headline_value: "",
      headline_label: "",
      data: [],
      format: "number",
    }]);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, visualizations });
    setSaving(false);
    toast({ title: "Changes saved", description: "Your profile has been updated." });
  };

  return (
    <div className="space-y-4">
      {visualizations.map((viz, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{viz.title || `Chart ${i + 1}`}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeViz(i)} className="text-destructive h-7 text-xs">
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Chart Type</Label>
              <select value={viz.type || "bar_chart"} onChange={(e) => updateViz(i, "type", e.target.value)}
                className="mt-1 h-9 w-full px-3 rounded-md border border-input bg-background text-sm">
                <option value="bar_chart">Bar Chart</option>
                <option value="line_chart">Line Chart</option>
                <option value="pie_chart">Pie Chart</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Format</Label>
              <select value={viz.format || "number"} onChange={(e) => updateViz(i, "format", e.target.value)}
                className="mt-1 h-9 w-full px-3 rounded-md border border-input bg-background text-sm">
                <option value="number">Number</option>
                <option value="percentage">Percentage</option>
                <option value="currency">Currency</option>
              </select>
            </div>
          </div>
          {/* Data points */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Data Points</Label>
            {(viz.data || []).map((dp: any, j: number) => (
              <div key={j} className="flex items-center gap-2">
                <Input value={dp.label || ""} onChange={(e) => {
                  const newData = [...(viz.data || [])];
                  newData[j] = { ...newData[j], label: e.target.value };
                  updateViz(i, "data", newData);
                }} placeholder="Label (e.g. Q1 2024)" className="h-8 text-xs flex-1" />
                <Input type="number" value={dp.value ?? ""} onChange={(e) => {
                  const newData = [...(viz.data || [])];
                  newData[j] = { ...newData[j], value: parseFloat(e.target.value) || 0 };
                  updateViz(i, "data", newData);
                }} placeholder="Value" className="h-8 text-xs w-24" />
                <Button type="button" variant="ghost" size="icon" onClick={() => {
                  const newData = (viz.data || []).filter((_: any, k: number) => k !== j);
                  updateViz(i, "data", newData);
                }} className="h-7 w-7 text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => {
              const newData = [...(viz.data || []), { label: "", value: 0 }];
              updateViz(i, "data", newData);
            }} className="text-xs gap-1">
              <Plus className="w-3 h-3" /> Add Data Point
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addViz} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Metric
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
