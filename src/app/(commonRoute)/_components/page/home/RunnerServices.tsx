"use client";

import { motion } from "motion/react";
import { 
  ShoppingBag, 
  Clock, 
  FileText, 
  Cpu, 
  Dog, 
  Sparkles, 
  Truck, 
  Search,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";

const services = [
  {
    title: "On-Demand Errands",
    subtitle: "Quick & Efficient",
    description: "From grocery shopping to picking up your dry cleaning, our runners handle the small things so you can focus on the big ones.",
    icon: ShoppingBag,
    features: ["Grocery Shopping", "Pharmacy Pickup", "Gift Delivery"],
    color: "from-blue-500 to-cyan-400",
    delay: 0.1,
    href: "/tasks?type=errand"
  },
  {
    title: "Queue Standing",
    subtitle: "Save Your Time",
    description: "Don't waste hours in line. Our runners will stand in queue for hospital tokens, government offices, or concert tickets for you.",
    icon: Clock,
    features: ["Hospital Tokens", "Bank Queues", "Ticket Collection"],
    color: "from-purple-500 to-pink-500",
    delay: 0.2,
    href: "/tasks?type=queue"
  },
  {
    title: "Document & Logistics",
    subtitle: "Secure & Reliable",
    description: "Need papers signed or delivered? We handle sensitive document submissions, printing, and local courier tasks with care.",
    icon: FileText,
    features: ["Bank Submissions", "Printing & Delivery", "Courier Tasks"],
    color: "from-emerald-500 to-teal-400",
    delay: 0.3,
    href: "/tasks?type=documents"
  },
  {
    title: "Technical Support",
    subtitle: "Expert Help",
    description: "Setting up a new device or troubleshooting software? Get help from tech-savvy student runners at affordable rates.",
    icon: Cpu,
    features: ["Phone Setup", "App Installation", "Basic Troubleshooting"],
    color: "from-orange-500 to-yellow-500",
    delay: 0.4,
    href: "/tasks?type=tech"
  },
  {
    title: "Pet & Home Care",
    subtitle: "Friendly Assistance",
    description: "Ensure your furry friends get their walks or get help with minor household tasks like furniture assembly or cleaning.",
    icon: Dog,
    features: ["Dog Walking", "Furniture Assembly", "Plant Watering"],
    color: "from-red-500 to-rose-400",
    delay: 0.5,
    href: "/tasks?type=petcare"
  },
  {
    title: "Special Requests",
    subtitle: "Tailored For You",
    description: "Have a unique task that doesn't fit a category? Post a custom request and find a runner willing to help you out.",
    icon: Sparkles,
    features: ["Event Setup", "Local Research", "Custom Errands"],
    color: "from-indigo-500 to-violet-500",
    delay: 0.6,
    href: "/dashboard/user/post-task"
  }
];

const ServiceCardSkeleton = () => (
  <div className="h-full p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-transparent shadow-sm space-y-4 flex flex-col">
    <div className="flex items-start justify-between">
      <Skeleton className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/10" />
      <Skeleton className="w-16 h-3 rounded-full bg-gray-200 dark:bg-white/10" />
    </div>
    <div className="space-y-3 flex-grow">
      <Skeleton className="h-6 w-3/4 rounded-xl bg-gray-200 dark:bg-white/10" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full rounded-lg bg-gray-200 dark:bg-white/10" />
        <Skeleton className="h-3 w-5/6 rounded-lg bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="space-y-3 pt-4">
        <Skeleton className="h-3 w-1/2 rounded-lg bg-gray-200 dark:bg-white/10" />
        <Skeleton className="h-3 w-2/3 rounded-lg bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
      <Skeleton className="w-full h-10 rounded-xl bg-gray-200 dark:bg-white/10" />
    </div>
  </div>
);

export const RunnerServices = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Our Service Spectrum</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white dark:text-white mb-6 tracking-tight"
          >
            Diverse Services for <span className="text-primary italic">Every Need</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed"
          >
            From the mundane to the complex, our network of verified student runners 
            is equipped to handle a wide variety of tasks across the city.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            [...Array(4)].map((_, i) => <ServiceCardSkeleton key={i} />)
          ) : (
            services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: service.delay }}
                className="group p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/40 transition-all duration-500 hover:bg-white dark:hover:bg-white/10 shadow-sm hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm flex flex-col h-full"
              >
                {/* Icon Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg shadow-current/20`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                      {service.subtitle}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-white/5 flex-grow">
                  {service.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/5 mt-auto">
                  <Link href={service.href} className="w-full block">
                    <Button 
                      variant="outline" 
                      className="w-full h-10 rounded-xl border-gray-200 dark:border-white/10 hover:bg-primary hover:text-white hover:border-primary dark:hover:bg-primary transition-all duration-300 font-bold text-xs gap-2 group/btn"
                    >
                      Explore Services
                      <Search className="w-4 h-4 ml-1 group-hover/btn:scale-110 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))
        )}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center p-12 rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md"
        >
          <h3 className="text-3xl font-bold text-black dark:text-white mb-4">Can't find what you're looking for?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our runners are versatile! Post a custom task with your specific requirements 
            and we'll find the perfect match for you.
          </p>
          <Link href="/dashboard/user/post-task">
            <button className="px-10 py-4 rounded-full bg-primary text-white font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20">
              Post a Custom Task
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
