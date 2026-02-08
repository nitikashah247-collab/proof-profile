import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Download, Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExportUser {
  full_name: string;
  user_id: string;
  marketing_opted_in: boolean;
  created_at: string;
}

const DataExport = () => {
  const [marketingOnly, setMarketingOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let query = supabase
        .from("profiles")
        .select("full_name, user_id, marketing_opted_in, created_at")
        .order("created_at", { ascending: false });

      if (marketingOnly) {
        query = query.eq("marketing_opted_in", true);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        toast({ title: "No users found", description: "No matching users to export." });
        setIsExporting(false);
        return;
      }

      // Build CSV
      const headers = ["Name", "User ID", "Marketing Opted In", "Signup Date"];
      const rows = (data as ExportUser[]).map((u) => [
        `"${u.full_name || ""}"`,
        u.user_id,
        u.marketing_opted_in ? "Yes" : "No",
        new Date(u.created_at).toLocaleDateString("en-GB"),
      ]);

      const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `proof-users-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({ title: "Export complete", description: `${data.length} users exported.` });
    } catch (err) {
      console.error("Export error:", err);
      toast({ title: "Export failed", description: "Could not export user data.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl border border-border bg-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Export User Data</h3>
          <p className="text-sm text-muted-foreground">Download user data as CSV</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Checkbox
          id="marketing-filter"
          checked={marketingOnly}
          onCheckedChange={(checked) => setMarketingOnly(checked === true)}
        />
        <Label htmlFor="marketing-filter" className="text-sm cursor-pointer">
          Marketing opted-in only
        </Label>
      </div>

      <Button onClick={handleExport} disabled={isExporting} className="w-full">
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Export Users CSV
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default DataExport;
