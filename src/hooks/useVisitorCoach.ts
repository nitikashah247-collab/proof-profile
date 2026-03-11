import { useState, useEffect, useRef, useCallback } from "react";

interface VisitorInsight {
  section: string;
  trigger: string;
  message: string;
  priority: number;
}

interface UseVisitorCoachProps {
  insights: VisitorInsight[];
  isOwner: boolean;
}

export const useVisitorCoach = ({ insights, isOwner }: UseVisitorCoachProps) => {
  const [currentInsight, setCurrentInsight] = useState<VisitorInsight | null>(null);
  const [shownInsights, setShownInsights] = useState<Set<string>>(new Set());
  const [visibleSection, setVisibleSection] = useState("hero");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const insightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lingerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track which section is in view
  useEffect(() => {
    // Small delay to ensure DOM sections are rendered
    const timer = setTimeout(() => {
      const sectionElements = document.querySelectorAll("[data-section-type]");
      console.log("[VisitorCoach] Found sections:", Array.from(sectionElements).map(el => (el as HTMLElement).dataset.sectionType));
      
      if (sectionElements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          let bestEntry: IntersectionObserverEntry | null = null;
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
                bestEntry = entry;
              }
            }
          }
          if (bestEntry) {
            const sectionType = (bestEntry.target as HTMLElement).dataset.sectionType;
            if (sectionType) {
              setVisibleSection(prev => {
                if (prev !== sectionType) {
                  console.log("[VisitorCoach] Section changed:", prev, "→", sectionType);
                }
                return sectionType;
              });
            }
          }
        },
        { 
          threshold: [0, 0.1, 0.2, 0.3, 0.5],
          rootMargin: "-10% 0px -10% 0px"
        }
      );

      sectionElements.forEach((el) => observer.observe(el));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const showInsight = useCallback((insight: VisitorInsight) => {
    setCurrentInsight(insight);
    setShownInsights((prev) => new Set([...prev, insight.message]));

    if (insightTimeoutRef.current) clearTimeout(insightTimeoutRef.current);
    insightTimeoutRef.current = setTimeout(() => {
      setCurrentInsight(null);
    }, 8000);
  }, []);

  // Show first_visit insights after a delay
  useEffect(() => {
    if (insights.length === 0) return; // TEMP: removed isOwner check for testing

    const firstVisitInsights = insights
      .filter((i) => i.trigger === "first_visit")
      .sort((a, b) => a.priority - b.priority);

    if (firstVisitInsights.length > 0) {
      const timer = setTimeout(() => {
        showInsight(firstVisitInsights[0]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [insights, isOwner, showInsight]);

  // When visible section changes, find a relevant insight
  useEffect(() => {
    if (insights.length === 0 || isDrawerOpen) return; // TEMP: removed isOwner check for testing

    console.log("[VisitorCoach] Section in view:", visibleSection, "| Available insights:", 
      insights.filter(i => i.section === visibleSection && i.trigger === "scroll_to").length
    );

    if (lingerTimeoutRef.current) clearTimeout(lingerTimeoutRef.current);

    lingerTimeoutRef.current = setTimeout(() => {
      const sectionInsights = insights
        .filter(
          (i) =>
            i.section === visibleSection &&
            i.trigger === "scroll_to" &&
            true // TEMP: allow re-showing insights for testing
        )
        .sort((a, b) => a.priority - b.priority);

      if (sectionInsights.length > 0) {
        showInsight(sectionInsights[0]);
      }
    }, 1500);

    return () => {
      if (lingerTimeoutRef.current) clearTimeout(lingerTimeoutRef.current);
    };
  }, [visibleSection, insights, isOwner, isDrawerOpen, shownInsights, showInsight]);

  const dismissInsight = useCallback(() => {
    setCurrentInsight(null);
    if (insightTimeoutRef.current) clearTimeout(insightTimeoutRef.current);
  }, []);

  // TEMP: disabled owner check for testing
  // if (isOwner) {
  //   return {
  //     currentInsight: null,
  //     visibleSection: "hero",
  //     isDrawerOpen: false,
  //     setIsDrawerOpen: (() => {}) as (v: boolean) => void,
  //     dismissInsight: () => {},
  //   };
  // }

  return {
    currentInsight,
    visibleSection,
    isDrawerOpen,
    setIsDrawerOpen,
    dismissInsight,
  };
};
