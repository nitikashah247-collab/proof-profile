import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
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

export const TestimonialsCarousel = ({
  testimonials,
  autoRotate = true,
  rotateInterval = 5000,
}: TestimonialsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoRotate || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, rotateInterval);
    return () => clearInterval(interval);
  }, [autoRotate, isPaused, rotateInterval, testimonials.length]);

  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const current = testimonials[currentIndex];

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-primary/60 mb-1">Testimonials</p>
            <h2 className="text-2xl font-semibold text-foreground">What People Say</h2>
          </div>

          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative p-8 md:p-12 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
              <Quote className="absolute top-8 right-8 w-20 h-20 text-primary/10" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed mb-8">
                    "{current.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    {current.photoUrl ? (
                      <img src={current.photoUrl} alt={current.author} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {current.author.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-lg text-foreground">{current.author}</p>
                      <p className="text-muted-foreground">{current.role} at {current.company}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 1 && (
                <>
                  <Button variant="ghost" size="icon" onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "w-8 bg-primary" : "bg-border hover:bg-primary/50"
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
