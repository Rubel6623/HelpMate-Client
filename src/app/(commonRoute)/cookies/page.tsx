"use client";

import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { motion } from "motion/react";
import { 
  Cookie, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Monitor, 
  Lock, 
  Clock,
  Info,
  HelpCircle,
  ToggleRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CookiesPage() {
  const router = useRouter();

  const cookieTypes = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Essential Cookies",
      content: "These are necessary for the website to function. They handle authentication, security, and basic navigation. Without these, our platform wouldn't work safely for you."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Analytics Cookies",
      content: "We use these to understand how you interact with HelpMate. They help us identify popular features and areas where we can improve the user experience for everyone."
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Functional Cookies",
      content: "These allow us to remember your preferences, like your language settings or theme choice, so you don't have to reset them every time you visit."
    },
    {
      icon: <Cookie className="w-6 h-6" />,
      title: "Task Persistence",
      content: "Cookies help keep your draft tasks saved while you navigate between pages, ensuring you don't lose any work if you accidentally refresh."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent blur-3xl -z-10" />
        
        <main className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-widest mb-4">
              <Cookie className="w-4 h-4" /> Browsing Experience
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tighter">
              Cookie <span className="text-amber-500">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              We use cookies to ensure you get the best possible experience on HelpMate. Learn what they are and how we use them.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
               <Clock className="w-4 h-4" /> Updated: May 3, 2026
            </div>
          </motion.div>

          {/* Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {cookieTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                  {type.icon}
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-4 tracking-tight">
                  {type.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {type.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Management Section */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="p-10 md:p-16 rounded-[4rem] bg-zinc-900 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-amber-500/5 -z-0" />
            <div className="shrink-0 w-24 h-24 bg-amber-500 rounded-3xl flex items-center justify-center rotate-3 shadow-2xl shadow-amber-500/20">
                <Settings className="w-12 h-12 text-white animate-spin-slow" />
            </div>
            <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                <h3 className="text-3xl md:text-4xl font-black tracking-tight">How to manage cookies?</h3>
                <p className="text-gray-400 font-medium leading-relaxed max-w-xl">
                  You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <button 
                       onClick={() => router.push('/contact')}
                       className="px-8 py-4 rounded-2xl bg-white text-zinc-900 font-black hover:bg-amber-50 transition-all flex items-center gap-2"
                    >
                        <ToggleRight className="w-5 h-5 text-amber-500" />
                        Adjust Preferences
                    </button>
                    <button className="px-8 py-4 rounded-2xl bg-white/10 text-white font-black hover:bg-white/20 transition-all flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        Learn More
                    </button>
                </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
