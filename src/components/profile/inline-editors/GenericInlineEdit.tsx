import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

interface GenericInlineEditProps {
  sectionData: Record<string, any>;
  sectionType: string;
  displayName: string;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export const GenericInlineEdit = ({
  sectionData,
  sectionType,
  displayName,
  onSave,
  onCancel,
}: GenericInlineEditProps) => {
  const initialItems = sectionData?.items || sectionData?.[sectionType] || [];
  const [items, setItems] = useState<any[]>(
    Array.isArray(initialItems) ? [...initialItems] : []
  );
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { title: "", company: "", description: "", url: "", metric: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...sectionData, items });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No items yet. Click "Add Item" to create one.
        </p>
      )}

      {items.map((item, i) => (
        <div key={i} className="space-y-3 p-4 rounded-xl border border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Item {i + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(i)}
              className="text-destructive h-7 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" /> Remove
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Title / Name</Label>
              <Input
                value={item.title || item.name || ""}
                onChange={(e) =>
                  updateItem(i, item.name !== undefined && item.title === undefined ? "name" : "title", e.target.value)
                }
                className="mt-1 h-8 text-sm"
                placeholder="e.g. Project name, role..."
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Company / Organization</Label>
              <Input
                value={item.company || item.organization || ""}
                onChange={(e) =>
                  updateItem(i, item.organization !== undefined && item.company === undefined ? "organization" : "company", e.target.value)
                }
                className="mt-1 h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={item.description || item.summary || ""}
              onChange={(e) =>
                updateItem(i, item.summary !== undefined && item.description === undefined ? "summary" : "description", e.target.value)
              }
              rows={2}
              className="mt-1 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">URL / Link</Label>
              <Input
                value={item.url || item.link || ""}
                onChange={(e) => updateItem(i, "url", e.target.value)}
                className="mt-1 h-8 text-sm"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Key Metric / Value</Label>
              <Input
                value={item.metric || item.value || item.result || ""}
                onChange={(e) => updateItem(i, "metric", e.target.value)}
                className="mt-1 h-8 text-sm"
                placeholder="e.g. $2M revenue"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add Item
      </Button>

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
};
