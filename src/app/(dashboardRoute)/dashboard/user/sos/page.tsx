"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, MapPin, MessageSquare, Loader2, CheckCircle2, AlertCircle, Phone, Navigation } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { createSosAlert } from "@/src/services/sos";
import { toast, Toaster } from "sonner";

export default function UserSosPage() {
  const [loading, setLoading] = useState(false);
  const [raised, setRaised] = useState(false);
  const [message, setMessage] = useState("");

  const handleRaiseSos = async () => {
    setLoading(true);
    try {
      // Get location
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await createSosAlert({
          lat: latitude,
          lng: longitude,
          message: message || "Immediate help needed!",
        });

        if (res?.success) {
          setRaised(true);
          toast.success("SOS Alert raised successfully. Help is on the way!");
        } else {
          toast.error(res?.message || "Failed to raise SOS alert");
        }
        setLoading(false);
      }, (error) => {
        toast.error("Please enable location access to raise SOS");
        setLoading(false);
      });
    } catch (error) {
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <Toaster position="top-center" richColors />

      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest border border-red-500/20">
          <ShieldAlert className="w-4 h-4" />
          Emergency Support
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-black dark:text-white tracking-tight">SOS Center</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
          In case of any emergency or safety concern while using HelpMate, use this button to notify our admins and emergency responders instantly.
        </p>
      </div>

      {!raised ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 rounded-[4rem] bg-white dark:bg-white/5 border-2 border-red-500/10 shadow-2xl space-y-10 relative overflow-hidden"
        >
          {/* Pulsing decoration */}
          <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block text-center">Optional Message</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Briefly describe the situation (e.g., Harassment, Theft, Medical Emergency)..."
              className="w-full h-32 p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-lg font-medium focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all outline-none resize-none"
            />
          </div>

          <div className="flex flex-col items-center gap-6 relative z-10">
             <button 
               onClick={handleRaiseSos}
               disabled={loading}
               className={`w-64 h-64 rounded-full flex flex-col items-center justify-center gap-4 transition-all active:scale-95 shadow-[0_0_50px_rgba(239,68,68,0.3)] group relative overflow-hidden ${
                 loading ? "bg-red-200 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
               }`}
             >
                {loading ? (
                  <Loader2 className="w-16 h-16 text-white animate-spin" />
                ) : (
                  <>
                    <ShieldAlert className="w-20 h-20 text-white animate-bounce" />
                    <span className="text-3xl font-black text-white uppercase tracking-tighter">Raise SOS</span>
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1s_infinite] skew-x-12" />
             </button>
             <p className="text-sm font-bold text-red-500 animate-pulse flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Pressing this will send your location to our team
             </p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-[4rem] bg-green-500 text-white shadow-2xl text-center space-y-8"
        >
          <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto">
             <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black">Help is on the way!</h2>
            <p className="text-xl font-medium opacity-80">We've received your alert and location. An admin is reviewing it right now.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 bg-white/10 rounded-3xl flex items-center gap-4 text-left border border-white/10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600">
                   <Phone className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase opacity-60">Emergency Hotline</p>
                   <p className="text-xl font-black">999 / 100</p>
                </div>
             </div>
             <div className="p-6 bg-white/10 rounded-3xl flex items-center gap-4 text-left border border-white/10">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600">
                   <Navigation className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase opacity-60">Your Location</p>
                   <p className="text-lg font-black truncate max-w-[200px]">Broadcasting live...</p>
                </div>
             </div>
          </div>
          <Button 
            onClick={() => setRaised(false)}
            variant="ghost" 
            className="text-white/60 hover:text-white font-bold"
          >
            I am safe now
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
         <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
               <Navigation className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-black dark:text-white mb-2">Location Tracking</h4>
            <p className="text-sm text-gray-500 font-medium">We track your live coordinates to send help precisely where you are.</p>
         </div>
         <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
               <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-black dark:text-white mb-2">Instant Alerts</h4>
            <p className="text-sm text-gray-500 font-medium">Our 24/7 admin team gets a priority notification when you hit SOS.</p>
         </div>
         <div className="p-8 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
               <Phone className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-black dark:text-white mb-2">Police Support</h4>
            <p className="text-sm text-gray-500 font-medium">We coordinate with local law enforcement for serious incidents.</p>
         </div>
      </div>
    </div>
  );
}
