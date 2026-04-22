"use client";

import { ShoppingCart, Clock, FileText, Home, Cpu, Dog, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const categories = [
  {
    title: "Grocery & Shopping",
    description: "Supermarket runs, pharmacy pickup, market shopping.",
    icon: ShoppingCart,
    color: "bg-blue-500",
    duration: "60-90 min",
  },
  {
    title: "Queue & Waiting",
    description: "Hospital tokens, govt. office queues, ticket collection.",
    icon: Clock,
    color: "bg-purple-500",
    duration: "1-3 hrs",
  },
  {
    title: "Document Handling",
    description: "Bank submissions, courier pickup/drop, printing.",
    icon: FileText,
    color: "bg-green-500",
    duration: "30-60 min",
  },
  {
    title: "Household Assistance",
    description: "Minor cleaning, furniture assembly, light lifting.",
    icon: Home,
    color: "bg-yellow-500",
    duration: "60-120 min",
  },
  {
    title: "Tech Help",
    description: "Phone setup, app installation, troubleshooting.",
    icon: Cpu,
    color: "bg-red-500",
    duration: "30-60 min",
  },
  {
    title: "Pet Care",
    description: "Dog walking, vet pickup/drop.",
    icon: Dog,
    color: "bg-orange-500",
    duration: "30-90 min",
  },
];

export const Categories = () => {
  return (
    <section className="py-24 bg-white dark:bg-black overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-black dark:text-white">
              Errands for <br />
              <span className="text-primary italic">Every Occasion</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Whatever you need, our verified student runners are ready to help. 
              Choose a category and get started in seconds.
            </p>
          </div>
          <button className="flex items-center gap-2 text-lg font-semibold hover:text-primary transition-colors group">
            View all categories 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg shadow-current/20`}>
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                {category.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {category.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
                <span className="text-sm font-medium text-muted-foreground">
                  Avg. {category.duration}
                </span>
                <span className="text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Book Now
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
