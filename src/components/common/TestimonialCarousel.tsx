import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote, Pause, Play, Sparkles } from 'lucide-react';
import { Testimonial } from '../../types';

export interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  autoPlayInterval?: number;
  className?: string;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  title = 'Endorsed by Global Industry Leaders',
  subtitle = 'Discover how Fiza-Fiya delivers precision architectural modeling, Revit BIM accuracy, and generative AI visual excellence.',
  autoPlayInterval = 5000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const total = testimonials.length;

  const nextSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || total === 0 || autoPlayInterval <= 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, total, autoPlayInterval, nextSlide]);

  // Touch swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header with Nav Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Client Feedback & Testimonials</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-slate-400 text-xs max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Carousel Action Controls */}
        <div className="flex items-center justify-center md:justify-end space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            className="p-2.5 rounded-full bg-[#151B2E] border border-indigo-500/30 text-slate-400 hover:text-white hover:border-violet-500 transition-all cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
          </button>
          
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Testimonial"
            className="p-2.5 rounded-full bg-[#151B2E] border border-indigo-500/30 text-slate-400 hover:text-white hover:border-violet-500 hover:bg-violet-600/20 transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Testimonial"
            className="p-2.5 rounded-full bg-[#151B2E] border border-indigo-500/30 text-slate-400 hover:text-white hover:border-violet-500 hover:bg-violet-600/20 transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Swipeable Carousel Container */}
      <div
        className="relative overflow-hidden rounded-3xl p-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((t, idx) => (
            <div
              key={t.id || idx}
              className="w-full shrink-0 px-2"
            >
              <div className="p-8 sm:p-10 rounded-3xl bg-[#151B2E] backdrop-blur-2xl border border-indigo-500/30 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-violet-500/50 transition-all">
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/20 transition-all" />
                <Quote className="w-12 h-12 text-violet-500/15 absolute top-6 right-6 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  {/* Rating Stars */}
                  <div className="flex items-center space-x-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-amber-400/90 text-xs font-semibold ml-2">
                      {(t.rating || 5).toFixed(1)} / 5.0
                    </span>
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-slate-200 text-sm sm:text-base leading-relaxed italic font-normal">
                    "{t.content}"
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-4 pt-6 border-t border-indigo-500/20 relative z-10">
                  <img
                    src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-violet-500/40 shadow-md shrink-0"
                  />
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-wide">
                      {t.name}
                    </h4>
                    <p className="text-violet-400 text-xs font-medium mt-0.5">
                      {t.role}{t.company ? `, ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Indicators / Dots */}
      <div className="flex items-center justify-center space-x-2 pt-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === idx
                ? 'w-8 h-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 shadow-md shadow-violet-500/50'
                : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialCarousel;
