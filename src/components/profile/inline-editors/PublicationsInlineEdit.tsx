import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PublicationsInlineEditProps {
  sectionData: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export const PublicationsInlineEdit = ({ sectionData, onSave, onCancel }: PublicationsInlineEditProps) => {
  const [pubs, setPubs] = useState<{ title: string; outlet: string; year: string; url: string }[]>(
    (sectionData?.publications || []).map((p: any) => ({
      title: p.title || "",
      outlet: p.outlet || "",
      year: p.year || "",
      url: p.url || "",
    }))
  );
  const [saving, setSaving] = useState(false);

  const updatePub = (i: number, field: string, value: string) => {
    setPubs((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, publications: pubs.filter((p) => p.title.trim()) });
    setSaving(false);
    toast({ title: "Changes saved", description: "Your profile has been updated." });
  };

  return (
    <div className="space-y-4">
      {pubs.map((pub, i) => (
        <div key={i} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Publication {i + 1}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => setPubs((p) => p.filter((_, idx) => idx !== i))} className="text-destructive h-7 text-xs">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Title</Label>
              <Input value={pub.title} onChange={(e) => updatePub(i, "title", e.target.value)} className="mt-1 h-8 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Outlet</Label>
              <Input value={pub.outlet} onChange={(e) => updatePub(i, "outlet", e.target.value)} className="mt-1 h-8 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Year</Label>
              <Input value={pub.year} onChange={(e) => updatePub(i, "year", e.target.value)} className="mt-1 h-8 text-sm" placeholder="2024" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">URL</Label>
              <Input value={pub.url} onChange={(e) => updatePub(i, "url", e.target.value)} className="mt-1 h-8 text-sm" placeholder="https://..." />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setPubs((p) => [...p, { title: "", outlet: "", year: "", url: "" }])} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Publication
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
