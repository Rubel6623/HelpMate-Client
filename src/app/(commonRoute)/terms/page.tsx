"use client";

import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { motion } from "motion/react";
import { Shield, FileText, UserCheck, Scale, AlertCircle, Clock, Gavel, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();
  const sections = [
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: "By accessing and using HelpMate, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use this platform. We provide a marketplace connecting Users and Runners for various tasks."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "User Eligibility",
      content: "You must be at least 18 years old to create an account. You are responsible for maintaining the security of your account and password. HelpMate cannot and will not be liable for any loss or damage from your failure to comply with this security obligation."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Service Fees & Payments",
      content: "HelpMate charges a service fee for successful task completions. All payments are processed through our secure internal wallet system. Once a task is marked as completed and the OTP is verified, funds are released to the Runner."
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Platform Rules",
      content: "Users may not post illegal, dangerous, or offensive tasks. Runners must provide accurate identification and maintain high quality standards. HelpMate reserves the right to suspend any account that violates our community guidelines."
    },
    {
      icon: <Gavel className="w-6 h-6" />,
      title: "Dispute Resolution",
      content: "In case of a disagreement between a User and a Runner, HelpMate provides a dispute resolution system. Our administrators will review submitted evidence (photos, messages) to reach a fair decision for both parties."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy & Data",
      content: "Your privacy is important to us. We collect and use your personal information only as necessary to provide our services. We do not sell your data to third parties. Please review our Privacy Policy for more details."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent blur-3xl -z-10" />
        
        <main className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-widest mb-4">
              <Shield className="w-4 h-4" /> Legal Center
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white tracking-tighter">
              Terms of <span className="text-primary">Service</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Everything you need to know about using the HelpMate platform safely and effectively.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
               <Clock className="w-4 h-4" /> Last Updated: May 3, 2026
            </div>
          </motion.div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  {section.icon}
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white mb-4 tracking-tight">
                  {section.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.8 }}
             className="p-10 rounded-[3rem] bg-zinc-900 text-white relative overflow-hidden text-center space-y-6"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-0" />
            <div className="relative z-10 space-y-6">
                <FileText className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-3xl font-black tracking-tight">Need clarification?</h3>
                <p className="text-gray-400 max-w-xl mx-auto font-medium">
                  If you have any questions regarding these terms or any other legal matters, our support team is ready to help you.
                </p>
                <div className="pt-4">
                    <button 
                      onClick={() => router.push('/contact')}
                      className="px-10 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all"
                    >
                        Contact Legal Support
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
