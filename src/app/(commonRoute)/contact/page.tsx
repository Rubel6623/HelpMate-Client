"use client";

import { motion } from "motion/react";
import { Navbar } from "../_components/shared/navbar/Navbar";
import { Footer } from "../_components/shared/footer/Footer";
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2 } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully! Our team will get back to you soon.", {
        description: "Thank you for reaching out to HelpMate.",
        duration: 5000,
      });
      (e.target as HTMLFormElement).reset();
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-zinc-950 min-h-screen">
        {/* Hero Section */}
        <div className="relative pt-20 pb-32 overflow-hidden">
           <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
           
           <div className="container mx-auto px-6 relative z-10 text-center">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-3xl mx-auto"
             >
               <h1 className="text-5xl md:text-7xl font-black text-black dark:text-white mb-8 tracking-tight">
                 Let's Start a <span className="text-primary italic">Conversation</span>
               </h1>
               <p className="text-xl text-muted-foreground leading-relaxed">
                 Whether you have a question about tasks, need help with your account, or just want to say hello, our team is here for you.
               </p>
             </motion.div>
           </div>
        </div>

        {/* Contact Content */}
        <div className="container mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 dark:bg-white/5 p-10 md:p-16 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm"
            >
              <h2 className="text-3xl font-bold mb-8 text-black dark:text-white flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-primary" />
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Name</Label>
                    <Input placeholder="John Doe" className="h-14 px-6 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</Label>
                    <Input type="email" placeholder="john@example.com" className="h-14 px-6 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</Label>
                  <Input placeholder="How can we help?" className="h-14 px-6 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Message</Label>
                  <Textarea placeholder="Describe your inquiry..." className="min-h-[160px] p-6 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white text-lg font-bold shadow-xl shadow-primary/20 flex gap-3 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12 lg:pt-12"
            >
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-black dark:text-white">Contact Information</h3>
                <p className="text-lg text-muted-foreground">
                  Our dedicated support team usually responds within 24 hours. Here's how you can reach us directly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ContactInfoCard 
                  icon={Mail} 
                  title="Email" 
                  value="support@helpmate.com" 
                  description="For general inquiries and support."
                />
                <ContactInfoCard 
                  icon={Phone} 
                  title="Phone" 
                  value="+880 1234-567890" 
                  description="Mon-Fri from 9am to 6pm."
                />
                <ContactInfoCard 
                  icon={MapPin} 
                  title="Office" 
                  value="Dhaka, Bangladesh" 
                  description="Come visit us at our HQ."
                />
                <ContactInfoCard 
                  icon={MessageCircle} 
                  title="Live Chat" 
                  value="Available 24/7" 
                  description="Chat with our AI bot anytime."
                />
              </div>

              <div className="pt-12 border-t border-gray-100 dark:border-white/5">
                <h4 className="text-xl font-bold mb-6 text-black dark:text-white">Follow Our Journey</h4>
                <div className="flex gap-4">
                  <SocialLink icon={FaFacebook} href="#" />
                  <SocialLink icon={FaTwitter} href="#" />
                  <SocialLink icon={FaInstagram} href="#" />
                  <SocialLink icon={FaLinkedin} href="#" />
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function ContactInfoCard({ icon: Icon, title, value, description }: any) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:border-primary/30 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-black dark:text-white mb-1">{title}</h4>
      <p className="text-primary font-black mb-2">{value}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SocialLink({ icon: Icon, href }: any) {
  return (
    <a 
      href={href}
      className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all hover:-translate-y-1"
    >
      <Icon className="w-6 h-6" />
    </a>
  );
}
