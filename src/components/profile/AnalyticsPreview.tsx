import { motion } from "framer-motion";
import { Eye, Clock, MousePointer, BarChart3 } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  avgTimeOnPage: string;
  topSection: string;
  viewsThisWeek: number;
}

interface AnalyticsPreviewProps {
  data: AnalyticsData;
  isOwner: boolean;
}

export const AnalyticsPreview = ({ data, isOwner }: AnalyticsPreviewProps) => {
  if (!isOwner) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-6 z-40"
    >
      <div className="p-4 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl max-w-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Profile Analytics</span>
          </div>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            Owner only
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-muted/50">
            <Eye className="w-4 h-4 text-primary mb-1" />
            <p className="text-lg font-bold">{data.totalViews}</p>
            <p className="text-[10px] text-muted-foreground">Total Views</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <Clock className="w-4 h-4 text-primary mb-1" />
            <p className="text-lg font-bold">{data.avgTimeOnPage}</p>
            <p className="text-[10px] text-muted-foreground">Avg. Time</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <MousePointer className="w-4 h-4 text-primary mb-1" />
            <p className="text-sm font-bold truncate">{data.topSection}</p>
            <p className="text-[10px] text-muted-foreground">Most Viewed</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50">
            <BarChart3 className="w-4 h-4 text-primary mb-1" />
            <p className="text-lg font-bold">{data.viewsThisWeek}</p>
            <p className="text-[10px] text-muted-foreground">This Week</p>
          </div>
        </div>

        <button className="w-full mt-3 text-xs text-primary hover:underline text-center">
          View Full Analytics →
        </button>
      </div>
    </motion.div>
  );
};
