import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Clock, MousePointer, BarChart3, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

export const AnalyticsPreview = ({ data, isOwner }: AnalyticsPreviewProps) => {
  const [isMinimised, setIsMinimised] = useState(false);
  const isMobile = useIsMobile();

  if (!isOwner) return null;

  // Mobile: use bottom sheet drawer
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
          >
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Analytics</span>
          </motion.button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <div className="py-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Profile Analytics</span>
              </div>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Owner only
              </span>
            </div>
            <AnalyticsContent data={data} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: right-side panel
  return (
    <AnimatePresence>
      {isMinimised ? (
        <motion.button
          key="minimised"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setIsMinimised(false)}
          className="fixed bottom-20 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
        >
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Analytics</span>
        </motion.button>
      ) : (
        <motion.div
          key="expanded"
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
                  onClick={() => setIsMinimised(true)}
                  className="p-1 rounded-md hover:bg-muted transition-colors ml-1"
                  aria-label="Minimise analytics"
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
