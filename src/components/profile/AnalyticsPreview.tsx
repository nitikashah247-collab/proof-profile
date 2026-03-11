import { motion, AnimatePresence } from "framer-motion";
import { Eye, Clock, MousePointer, BarChart3, X } from "lucide-react";

interface AnalyticsData {
  totalViews: number;
  avgTimeOnPage: string;
  topSection: string;
  viewsThisWeek: number;
}

interface AnalyticsPreviewProps {
  data: AnalyticsData;
  isOwner: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsContent = ({ data }: { data: AnalyticsData }) => (
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
);

export const AnalyticsPreview = ({ data, isOwner, isOpen, onClose }: AnalyticsPreviewProps) => {
  if (!isOwner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="fixed top-24 right-6 z-40"
        >
          <div className="p-4 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl max-w-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Profile Analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Owner only
                </span>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-muted transition-colors ml-1"
                  aria-label="Close analytics"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <AnalyticsContent data={data} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
