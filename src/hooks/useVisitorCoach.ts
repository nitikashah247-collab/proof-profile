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
    if (isOwner) return;
    const sectionElements = document.querySelectorAll("[data-section-type]");
    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sectionType = (entry.target as HTMLElement).dataset.sectionType;
            if (sectionType) {
              setVisibleSection(sectionType);
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isOwner]);

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
    if (isOwner || insights.length === 0) return;

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
    if (isOwner || insights.length === 0 || isDrawerOpen) return;

    if (lingerTimeoutRef.current) clearTimeout(lingerTimeoutRef.current);

    lingerTimeoutRef.current = setTimeout(() => {
      const sectionInsights = insights
        .filter(
          (i) =>
            i.section === visibleSection &&
            i.trigger === "scroll_to" &&
            !shownInsights.has(i.message)
        )
        .sort((a, b) => a.priority - b.priority);

      if (sectionInsights.length > 0) {
        showInsight(sectionInsights[0]);
      }
    }, 2000);

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
