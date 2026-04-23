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

const services = [
  {
    title: "On-Demand Errands",
    subtitle: "Quick & Efficient",
    description: "From grocery shopping to picking up your dry cleaning, our runners handle the small things so you can focus on the big ones.",
    icon: ShoppingBag,
    features: ["Grocery Shopping", "Pharmacy Pickup", "Gift Delivery"],
    color: "from-blue-500 to-cyan-400",
    delay: 0.1
  },
  {
    title: "Queue Standing",
    subtitle: "Save Your Time",
    description: "Don't waste hours in line. Our runners will stand in queue for hospital tokens, government offices, or concert tickets for you.",
    icon: Clock,
    features: ["Hospital Tokens", "Bank Queues", "Ticket Collection"],
    color: "from-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    title: "Document & Logistics",
    subtitle: "Secure & Reliable",
    description: "Need papers signed or delivered? We handle sensitive document submissions, printing, and local courier tasks with care.",
    icon: FileText,
    features: ["Bank Submissions", "Printing & Delivery", "Courier Tasks"],
    color: "from-emerald-500 to-teal-400",
    delay: 0.3
  },
  {
    title: "Technical Support",
    subtitle: "Expert Help",
    description: "Setting up a new device or troubleshooting software? Get help from tech-savvy student runners at affordable rates.",
    icon: Cpu,
    features: ["Phone Setup", "App Installation", "Basic Troubleshooting"],
    color: "from-orange-500 to-yellow-500",
    delay: 0.4
  },
  {
    title: "Pet & Home Care",
    subtitle: "Friendly Assistance",
    description: "Ensure your furry friends get their walks or get help with minor household tasks like furniture assembly or cleaning.",
    icon: Dog,
    features: ["Dog Walking", "Furniture Assembly", "Plant Watering"],
    color: "from-red-500 to-rose-400",
    delay: 0.5
  },
  {
    title: "Special Requests",
    subtitle: "Tailored For You",
    description: "Have a unique task that doesn't fit a category? Post a custom request and find a runner willing to help you out.",
    icon: Sparkles,
    features: ["Event Setup", "Local Research", "Custom Errands"],
    color: "from-indigo-500 to-violet-500",
    delay: 0.6
  }
];

export const RunnerServices = () => {
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
            className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6 tracking-tight"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: service.delay }}
              className="group relative"
            >
              <div className="h-full p-8 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-primary/40 transition-all duration-500 hover:bg-white dark:hover:bg-white/10 shadow-sm hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm flex flex-col">
                {/* Icon Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg shadow-current/20`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                      {service.subtitle}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-black dark:text-white mb-4 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-8 flex-grow leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-white/5">
                  {service.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover Action */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-black dark:group-hover:text-white transition-colors">
                    Explore Details
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 -rotate-45 group-hover:rotate-0">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
          <button className="px-10 py-4 rounded-full bg-primary text-white font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20">
            Post a Custom Task
          </button>
        </motion.div>
      </div>
    </section>
  );
};
