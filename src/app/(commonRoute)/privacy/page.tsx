"use client";

import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  UserCircle, 
  Globe, 
  Clock, 
  Mail,
  Fingerprint,
  Share2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  const policies = [
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Collection",
      content: "We collect only essential information required to facilitate tasks, such as your name, contact details, and location. We ensure all data is collected through lawful and fair means with your explicit consent."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "How We Use Data",
      content: "Your information is used to match you with the right task partners, process payments, and improve our services. We never use your personal data for purposes other than those described in this policy."
    },
    {
      icon: <Fingerprint className="w-6 h-6" />,
      title: "Biometric & ID Data",
      content: "For Runner verification, we securely process National ID details. This sensitive data is encrypted and used solely for platform safety and identity verification purposes."
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: "Third-Party Sharing",
      content: "We do not sell your personal information. Data is only shared with trusted partners (like payment processors) necessary to complete your transactions on the HelpMate platform."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cookies & Tracking",
      content: "HelpMate uses cookies to enhance your browsing experience and remember your preferences. You can control cookie settings through your browser at any time."
    },
    {
      icon: <EyeOff className="w-6 h-6" />,
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal data at any time. Our privacy settings allow you to manage what information is visible to other users on the platform."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent blur-3xl -z-10" />
        
        <main className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-24"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">
              <ShieldCheck className="w-4 h-4" /> Privacy First
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tighter">
              Privacy <span className="text-emerald-500">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              At HelpMate, your trust is our most valuable asset. Learn how we protect your data with state-of-the-art security measures.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
               <Clock className="w-4 h-4" /> Version 2.0 • Effective May 3, 2026
            </div>
          </motion.div>

          {/* Policy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group p-10 rounded-[3rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 group-hover:rotate-12 transition-transform duration-500">
                  {policy.icon}
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-4 tracking-tight">
                  {policy.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {policy.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Commitment Section */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="relative p-12 md:p-20 rounded-[4rem] bg-emerald-600 text-white overflow-hidden shadow-3xl shadow-emerald-500/20"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 text-center lg:text-left">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto lg:mx-0">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Our Security <br /> Commitment
                    </h2>
                    <p className="text-emerald-50 text-xl font-medium leading-relaxed opacity-90">
                        We use bank-grade encryption (AES-256) for all sensitive data and regular security audits to ensure your information remains untouchable.
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-10 space-y-8 border border-white/20">
                    <h4 className="text-xl font-black">Privacy Questions?</h4>
                    <p className="text-emerald-50 font-medium">
                        Our Data Protection Officer is available to answer any specific queries regarding your personal data.
                    </p>
                    <button 
                       onClick={() => router.push('/contact')}
                       className="w-full py-5 rounded-2xl bg-white text-emerald-600 font-black text-lg hover:bg-emerald-50 transition-all shadow-xl shadow-black/10"
                    >
                        Request Data Audit
                    </button>
                    <div className="flex items-center justify-center gap-3 text-sm font-bold opacity-80">
                        <Mail className="w-4 h-4" /> privacy@helpmate.com
                    </div>
                </div>
            </div>
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
