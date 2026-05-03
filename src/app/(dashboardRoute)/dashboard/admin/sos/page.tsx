"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, CheckCircle2, Clock, MapPin, Phone, User, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getSosAlerts, resolveSosAlert } from "@/src/services/sos";

export default function AdminSosPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      const res = await getSosAlerts();
      if (res?.success) {
        setAlerts(res.data || []);
      } else {
        toast.error("Failed to fetch SOS alerts");
      }
    } catch (error) {
      toast.error("An error occurred while fetching alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      const res = await resolveSosAlert(id);
      if (res?.success) {
        toast.success("SOS Alert marked as resolved");
        setAlerts(alerts.map(a => a.id === id ? { ...a, isResolved: true, resolvedAt: new Date().toISOString() } : a));
      } else {
        toast.error(res?.message || "Failed to resolve alert");
      }
    } catch (error) {
      toast.error("An error occurred while resolving the alert");
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !a.isResolved);
  const resolvedAlerts = alerts.filter(a => a.isResolved);

  return (
    <div className="space-y-8">
      
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2 flex items-center gap-3">
            <ShieldAlert className="w-10 h-10 text-red-500" />
            SOS Emergency Center
          </h1>
          <p className="text-muted-foreground text-lg">Monitor and respond to emergency alerts from users and runners.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
           <AlertCircle className="w-6 h-6 animate-pulse" />
           <span className="font-black text-lg">{activeAlerts.length} Active Emergencies</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {activeAlerts.length > 0 ? activeAlerts.map((alert, index) => (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border-2 border-red-500/20 shadow-2xl shadow-red-500/5 space-y-8 relative overflow-hidden group"
            >
              {/* Decorative Pulse Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 animate-pulse pointer-events-none" />

              <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-widest animate-bounce">
                      URGENT HELP NEEDED
                    </span>
                    <span className="text-gray-400 font-bold text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {new Date(alert.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                          <User className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Raised By</p>
                          <h3 className="text-2xl font-black text-black dark:text-white">{alert.user?.name}</h3>
                          <p className="text-red-500 font-bold flex items-center gap-1">
                            <Phone className="w-4 h-4" /> {alert.user?.phone}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10">
                        <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-2">Message</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400 italic">"{alert.message || "No message provided - Immediate assistance required!"}"</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <MapPin className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                          <h3 className="text-xl font-bold text-black dark:text-white">Lat: {alert.lat}, Lng: {alert.lng}</h3>
                          <a 
                            href={`https://www.google.com/maps?q=${alert.lat},${alert.lng}`} 
                            target="_blank" 
                            className="text-blue-500 font-bold hover:underline flex items-center gap-1 text-sm mt-1"
                          >
                            View on Google Maps
                          </a>
                        </div>
                      </div>

                      {alert.task && (
                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Associated Task</p>
                          <p className="font-bold text-black dark:text-white">{alert.task.title}</p>
                          <p className="text-xs text-gray-400">ID: {alert.task.id}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 min-w-[240px]">
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    disabled={resolvingId === alert.id}
                    className="h-20 w-full rounded-3xl bg-green-500 hover:bg-green-600 text-white font-black text-xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                  >
                    {resolvingId === alert.id ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-8 h-8" />
                        MARK RESOLVED
                      </>
                    )}
                  </button>
                  <button className="h-14 w-full rounded-2xl bg-white dark:bg-white/5 border-2 border-red-500/20 text-red-500 font-bold hover:bg-red-50 transition-colors">
                    CONTACT POLICE/EMERGENCY
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/5"
            >
              <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-3xl font-black text-black dark:text-white mb-2">System Safe</h3>
              <p className="text-gray-400 font-bold">No active SOS alerts at this time.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {resolvedAlerts.length > 0 && (
          <div className="pt-12 space-y-6">
            <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest px-4">Resolved Alerts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resolvedAlerts.map(alert => (
                <div key={alert.id} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 opacity-60 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-black dark:text-white">{alert.user?.name}</p>
                    <p className="text-xs text-gray-400">Resolved at {new Date(alert.resolvedAt).toLocaleString()}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
