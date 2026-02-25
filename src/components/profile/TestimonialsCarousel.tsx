import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  photoUrl?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoRotate?: boolean;
  rotateInterval?: number;
}

const EASE = [0.22, 1, 0.36, 1];

export const TestimonialsCarousel = ({
  testimonials,
  autoRotate = true,
  rotateInterval = 5000,
}: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!autoRotate || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, isPaused, rotateInterval, testimonials.length]);

  const goTo = (index: number) => setCurrentIndex(index);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);

  const current = testimonials[currentIndex];

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE as any }}
          className="max-w-4xl mx-auto"
        >
          <p className="section-overline mb-2 text-center">Testimonials</p>
          <h2 className="section-heading text-4xl mb-10 text-center text-foreground">What People Say</h2>

          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main Testimonial Card — glassmorphism */}
            <div className="relative glass-card p-10 md:p-14 rounded-3xl overflow-hidden">
              {/* Decorative quote mark */}
              <span className="absolute -top-2 left-8 text-8xl font-display text-primary/10 select-none leading-none">
                "
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: EASE as any }}
                  className="relative z-10"
                >
                  <p className="text-2xl md:text-3xl font-display font-normal italic leading-relaxed text-foreground/90 mb-10">
                    "{current.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    {current.photoUrl ? (
                      <img
                        src={current.photoUrl}
                        alt={current.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {current.author.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-foreground">{current.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {current.role}{current.company ? ` at ${current.company}` : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {testimonials.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-40 hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Dots Indicator */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-border hover:bg-primary/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
