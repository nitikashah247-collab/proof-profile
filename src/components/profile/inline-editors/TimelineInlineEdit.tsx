import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimelineInlineEditProps {
  sectionData: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

interface TimelineItem {
  role: string;
  company: string;
  start_year: string;
  end_year: string;
  achievements: string[];
}

export const TimelineInlineEdit = ({ sectionData, onSave, onCancel }: TimelineInlineEditProps) => {
  const [entries, setEntries] = useState<TimelineItem[]>(
    (sectionData?.timeline || []).map((e: any) => ({
      role: e.role || "",
      company: e.company || "",
      start_year: e.start_year || e.startYear || "",
      end_year: e.end_year || e.endYear || "Present",
      achievements: e.achievements || [],
    }))
  );
  const [saving, setSaving] = useState(false);

  const updateEntry = (index: number, field: string, value: any) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { role: "", company: "", start_year: "", end_year: "Present", achievements: [] }]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, timeline: entries });
    setSaving(false);
    toast({ title: "Changes saved", description: "Your profile has been updated." });
  };

  return (
    <div className="space-y-4">
      {entries.map((entry, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Role {i + 1}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => removeEntry(i)} className="text-destructive h-7 text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Input value={entry.role} onChange={(e) => updateEntry(i, "role", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input value={entry.company} onChange={(e) => updateEntry(i, "company", e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Start Year</Label>
              <Input value={entry.start_year} onChange={(e) => updateEntry(i, "start_year", e.target.value)} className="mt-1" placeholder="2020" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">End Year</Label>
              <Input value={entry.end_year} onChange={(e) => updateEntry(i, "end_year", e.target.value)} className="mt-1" placeholder="Present" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Achievements (one per line)</Label>
            <Textarea
              value={(entry.achievements || []).join("\n")}
              onChange={(e) => updateEntry(i, "achievements", e.target.value.split("\n").filter(Boolean))}
              rows={3}
              className="mt-1"
              placeholder="Led migration to cloud infrastructure&#10;Reduced deployment time by 40%"
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addEntry} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Role
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
