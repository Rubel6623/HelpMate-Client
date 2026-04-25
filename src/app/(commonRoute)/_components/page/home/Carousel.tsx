"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Grocery & Daily Essentials",
    description: "Get fresh groceries and daily necessities delivered from local markets to your doorstep in minutes.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
    stats: { rating: 4.9, time: "25m", distance: "1.4 km" },
    tag: "Top Rated"
  },
  {
    id: 2,
    title: "Personal Shopping Partner",
    description: "Need help navigating the mall or picking up specific items? Hire a dedicated shopping assistant.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
    stats: { rating: 4.8, time: "50m", distance: "3.2 km" },
    tag: "Flexible"
  },
  {
    id: 3,
    title: "Secure Document Courier",
    description: "Safe and confidential handling of university papers, bank documents, or urgent office files.",
    image: "https://images.unsplash.com/photo-1586769852044-692d6e3703a0?q=80&w=1000&auto=format&fit=crop",
    stats: { rating: 5.0, time: "15m", distance: "0.7 km" },
    tag: "Essential"
  },
  {
    id: 4,
    title: "Instant Technical Support",
    description: "Troubleshoot software issues or get help with device setups from tech-savvy student experts.",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1000&auto=format&fit=crop",
    stats: { rating: 4.7, time: "40m", distance: "1.9 km" },
    tag: "Expert Help"
  },
  {
    id: 5,
    title: "Queue Standing Service",
    description: "Save hours by letting our runners hold your spot at hospitals, banks, or government offices.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop",
    stats: { rating: 4.9, time: "2h+", distance: "4.5 km" },
    tag: "Time Saver"
  }
];

export const Carousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="py-20 bg-transparent overflow-hidden">

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Featured Errands</h2>
            <p className="text-gray-400">See what's happening in your neighborhood right now.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={prev}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={next}
              className="p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative h-[400 md:h-[500px] w-full rounded-3xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <img 
                src={slides[current].image} 
                alt={slides[current].title}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                <div className="max-w-2xl">
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                    {slides[current].tag}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    {slides[current].title}
                  </h3>
                  <p className="text-lg text-gray-300 mb-8">
                    {slides[current].description}
                  </p>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-white/80">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold">{slides[current].stats.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>{slides[current].stats.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>{slides[current].stats.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute top-8 right-8 z-30 flex flex-col gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-8 rounded-full transition-all ${
                  i === current ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
