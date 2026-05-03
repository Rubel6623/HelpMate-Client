"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit3, Loader2, Award, Sparkles, X, Image as ImageIcon, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { getMyBadges,getBadges, createBadge, updateBadge, deleteBadge } from "@/src/services/badges";
import { toast } from "sonner";

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [type, setType] = useState("TASK_MILESTONE");
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const res = await getBadges();
      if (res?.success) {
        setBadges(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch badges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const resetForm = () => {
    setType("TASK_MILESTONE");
    setLabel("");
    setDescription("");
    setIconUrl("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { type, label, description, iconUrl: iconUrl || undefined };

    try {
      let res;
      if (editingId) {
        res = await updateBadge(editingId, payload);
      } else {
        res = await createBadge(payload);
      }

      if (res?.success) {
        toast.success(editingId ? "Badge updated!" : "Badge created!");
        resetForm();
        fetchBadges();
      } else {
        toast.error(res?.message || "Action failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (badge: any) => {
    setEditingId(badge.id);
    setType(badge.type);
    setLabel(badge.label);
    setDescription(badge.description);
    setIconUrl(badge.iconUrl || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this badge? This will remove it from all users.")) return;
    try {
      const res = await deleteBadge(id);
      if (res?.success) {
        toast.success("Badge deleted");
        fetchBadges();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-black uppercase tracking-widest">
            <Award className="w-3.5 h-3.5" />
            Gamification
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white">Badge Management</h1>
          <p className="text-muted-foreground text-lg">Define achievements and rewards for platform users.</p>
        </div>
        <Button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`h-14 px-8 rounded-2xl font-black text-lg shadow-xl transition-all flex gap-2 ${
            showForm ? "bg-gray-200 dark:bg-white/10 text-gray-600" : "bg-primary text-white"
          }`}
        >
          {showForm ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> New Badge</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border-2 border-primary/10 shadow-2xl space-y-6">
               <h3 className="text-2xl font-black text-black dark:text-white mb-4">
                  {editingId ? "Edit Achievement" : "Create New Achievement"}
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Badge Type</label>
                    <select 
                        value={type} 
                        onChange={(e) => setType(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold text-black dark:text-white focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="TASK_MILESTONE">Task Milestone</option>
                        <option value="FIVE_STAR_STREAK">Five Star Streak</option>
                        <option value="PUNCTUALITY">Punctuality</option>
                        <option value="TOP_RUNNER">Top Runner</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Label / Name</label>
                    <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Master Runner" required className="h-12 rounded-xl" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="How to earn this badge?" required className="h-12 rounded-xl" />
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Icon URL (Optional)</label>
                  <div className="flex gap-4">
                    <Input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://..." className="h-12 rounded-xl flex-1" />
                    {iconUrl && (
                        <div className="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 bg-white">
                            <img src={iconUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                        </div>
                    )}
                  </div>
               </div>

               <Button disabled={submitting} type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg">
                  {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : editingId ? "Update Badge" : "Create Badge"}
               </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge, i) => (
          <motion.div 
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all relative group"
          >
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(badge)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(badge.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-6 mx-auto">
                {badge.iconUrl ? (
                    <img src={badge.iconUrl} alt={badge.label} className="w-12 h-12 object-contain" />
                ) : (
                    <Award className="w-10 h-10 text-amber-500" />
                )}
            </div>

            <div className="text-center space-y-2">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/5 px-3 py-1 rounded-full">
                    {badge.type.replace(/_/g, ' ')}
                </span>
                <h3 className="text-xl font-black text-black dark:text-white">{badge.label}</h3>
                <p className="text-sm text-gray-400 font-medium">{badge.description}</p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-center gap-4 text-xs font-bold text-gray-400">
                <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Official</div>
                <div className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> High Quality</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
