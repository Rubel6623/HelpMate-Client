"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft, ShieldCheck, AlertCircle, Loader2,
  Navigation, Timer, Layout, Star, UserCircle,
  Clock, MapPin, Tag, Calendar, ImageIcon, ArrowRight, Eye
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getTaskById, getTasks } from "@/src/services/tasks";
import { applyForTask, getMyApplications } from "@/src/services/task-applications";
import { getUser } from "@/src/services/auth";
import { Skeleton } from "@/src/components/ui/skeleton";
import Link from "next/link";
import { Navbar } from "../../_components/shared/navbar/Navbar";
import { Footer } from "../../_components/shared/footer/Footer";

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

export default function TaskDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [task, setTask] = useState<any>(null);
  const [relatedTasks, setRelatedTasks] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const [taskRes, currentUser] = await Promise.all([getTaskById(id), getUser()]);
        if (taskRes?.success) {
          setTask(taskRes.data);
          const related = await getTasks(`status=NOT_COMPLETED&limit=4`);
          if (related?.success) {
            setRelatedTasks(related.data.filter((t: any) => t.id !== id).slice(0, 4));
          }
          if (currentUser?.role === "RUNNER") {
            const appsRes = await getMyApplications();
            if (appsRes?.success) {
              setIsApplied(appsRes.data.some((app: any) => app.taskId === id));
            }
          }
        }
        setUser(currentUser);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    init();
  }, [id]);

  const handleApply = async () => {
    if (!user || user.role !== "RUNNER") { setError("Only runners can accept tasks."); return; }
    setApplying(true); setError("");
    try {
      const res = await applyForTask({ taskId: id });
      if (res?.success) { setSuccess("Task accepted! Check your dashboard."); setIsApplied(true); }
      else setError(res?.message || "Failed to accept task.");
    } catch (err: any) { setError(err.message); }
    finally { setApplying(false); }
  };

  if (loading) return <TaskDetailsSkeleton />;
  if (!task) return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-[#0a0a0a]">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Task not found</h2>
        <Link href="/tasks"><Button variant="outline">Back to Tasks</Button></Link>
      </div>
      <Footer />
    </>
  );

  const images = task.attachmentUrls?.length > 0 ? task.attachmentUrls : [];
  const avgRating = task.reviews?.length > 0
    ? task.reviews.reduce((s: number, r: any) => s + r.rating, 0) / task.reviews.length
    : 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-500">

        {/* ── Hero / Media Gallery ── */}
        <div className="relative w-full bg-gray-900 overflow-hidden" style={{ minHeight: images.length ? 420 : 220 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/20 mix-blend-multiply" />
          {images.length > 0 ? (
            <>
              <img src={images[activeImage]} alt={`attachment-${activeImage}`}
                className="w-full h-[420px] object-cover opacity-80" />
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                  {images.map((_: string, i: number) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary scale-110" : "border-white/30 opacity-60 hover:opacity-100"}`}>
                      <img src={images[i]} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-56 gap-4">
              <ImageIcon className="w-16 h-16 text-white/20" />
              <span className="text-white/40 font-bold uppercase tracking-widest text-sm">No Media Attached</span>
            </div>
          )}
          {/* Overlay breadcrumb */}
          <div className="absolute top-6 left-6">
            <Link href="/tasks">
              <Button variant="ghost" className="gap-2 text-white border border-white/20 bg-black/30 backdrop-blur-md rounded-xl hover:bg-white/10">
                <ChevronLeft className="w-4 h-4" /> Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── LEFT: Main Sections ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* ── SECTION 1: Overview ── */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                    {task.category?.name || "Task"}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                    task.status === "PENDING"
                      ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                      : task.status === "COMPLETED"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  }`}>{task.status.replace(/_/g, " ")}</span>
                  {task.isPromoted && (
                    <span className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest border border-red-500/20">
                      🔥 Promoted
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{task.title}</h1>
                <div className="flex flex-wrap gap-5 text-sm text-gray-500 dark:text-gray-400 mb-8">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Posted {timeAgo(task.createdAt)}</span>
                  <span className="flex items-center gap-2"><Timer className="w-4 h-4 text-primary" /> Est. {task.estimatedDuration} min</span>
                  <span className="flex items-center gap-2"><Eye className="w-4 h-4 text-primary" /> {task._count?.applications ?? task.applications?.length ?? 0} applicants</span>
                </div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-primary" /> Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base whitespace-pre-wrap font-medium">
                  {task.description}
                </p>
                {task.specialNotes && (
                  <div className="mt-6 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Special Notes</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{task.specialNotes}</p>
                  </div>
                )}
              </motion.section>

              {/* ── SECTION 2: Key Information / Specifications ── */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
                <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" /> Specifications
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Offer Price", value: `৳${task.offerPrice}`, icon: "💰" },
                    { label: "Radius", value: `${task.radiusKm} KM`, icon: "📍" },
                    { label: "Duration", value: `${task.estimatedDuration} min`, icon: "⏱️" },
                    { label: "Category", value: task.category?.name || "General", icon: "🏷️" },
                    { label: "Time Start", value: new Date(task.timeWindowStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), icon: "🕐" },
                    { label: "Time End", value: new Date(task.timeWindowEnd).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), icon: "🕔" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1">
                      <span className="text-xl">{icon}</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Route / Stops */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                  <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" /> Route & Stops
                  </h3>
                  <div className="space-y-3">
                    {task.stops?.sort((a: any, b: any) => a.order - b.order).map((stop: any, i: number) => (
                      <div key={stop.id} className="relative pl-10 pb-3 last:pb-0">
                        {i !== task.stops.length - 1 && (
                          <div className="absolute left-[18px] top-7 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
                        )}
                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-xs font-black text-primary">{i + 1}</div>
                        <div className="p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{stop.locationLabel}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 uppercase font-bold tracking-tight">Stop #{stop.order}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* ── SECTION 3: Reviews / Ratings ── */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" /> Reviews & Ratings
                  </h2>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="font-black text-amber-600 dark:text-amber-400">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-gray-400 font-bold">({task.reviews?.length})</span>
                    </div>
                  )}
                </div>

                {task.reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {task.reviews.map((review: any) => (
                      <div key={review.id} className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                            {review.reviewer?.avatarUrl
                              ? <img src={review.reviewer.avatarUrl} alt={review.reviewer.name} className="w-full h-full object-cover" />
                              : <UserCircle className="w-6 h-6 text-primary/50" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{review.reviewer?.name || "Anonymous"}</p>
                              <p className="text-[10px] text-gray-400 font-bold shrink-0">{timeAgo(review.createdAt)}</p>
                            </div>
                            <div className="flex gap-0.5 my-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-gray-600"}`} />
                              ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Star className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-bold">No reviews yet for this task.</p>
                  </div>
                )}
              </motion.section>

              {/* ── SECTION 4: Related Tasks ── */}
              {relatedTasks.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" /> Related Tasks
                    </h2>
                    <Link href="/tasks" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                      Explore All <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedTasks.map((t: any) => (
                      <Link key={t.id} href={`/tasks/${t.id}`}>
                        <div className="group p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black px-2.5 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">
                              {t.category?.name || "General"}
                            </span>
                            <span className="text-base font-black text-gray-900 dark:text-white">৳{t.offerPrice}</span>
                          </div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-primary transition-colors flex-1">{t.title}</p>
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{timeAgo(t.createdAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* ── RIGHT: Sticky Sidebar ── */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-purple-600 shadow-2xl shadow-primary/20 sticky top-24">
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">Offer Price</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-white">৳{task.offerPrice}</span>
                  <span className="text-white/70 font-bold text-sm">Fixed</span>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: Navigation, label: "Radius", value: `${task.radiusKm} KM` },
                    { icon: Timer, label: "Duration", value: `~${task.estimatedDuration} min` },
                    { icon: ShieldCheck, label: "Payment", value: "Escrow Protected" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 border border-white/10">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white">{label}</span>
                      </div>
                      <span className="text-xs font-black text-white/90">{value}</span>
                    </div>
                  ))}
                </div>

                {success && <div className="mb-4 p-4 rounded-2xl bg-white/20 text-white text-sm font-bold text-center">{success}</div>}
                {error && <div className="mb-4 p-4 rounded-2xl bg-red-500/30 text-white text-sm font-bold text-center">{error}</div>}

                {user?.role === "RUNNER" ? (
                  isApplied
                    ? <Button disabled className="w-full h-16 rounded-2xl bg-white/20 text-white font-black cursor-not-allowed uppercase tracking-widest">✓ Task Accepted</Button>
                    : <Button onClick={handleApply} disabled={applying}
                        className="w-full h-16 rounded-2xl bg-white text-black hover:bg-gray-100 font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
                        {applying ? <Loader2 className="w-6 h-6 animate-spin" /> : "Accept Task Now"}
                      </Button>
                ) : (
                  <Button disabled className="w-full h-16 rounded-2xl bg-white/10 text-white/50 font-black uppercase tracking-widest cursor-not-allowed">
                    {user ? "Runner Access Only" : "Login to Accept"}
                  </Button>
                )}

                <p className="mt-5 text-center text-[10px] text-white/50 font-bold uppercase tracking-tighter">
                  Funds held in escrow until completion
                </p>
              </motion.div>

              {/* Posted by */}
              {task.user && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                  className="p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Posted By</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center">
                      {task.user.avatarUrl
                        ? <img src={task.user.avatarUrl} alt={task.user.name} className="w-full h-full object-cover" />
                        : <UserCircle className="w-8 h-8 text-primary/50" />}
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white">{task.user.name}</p>
                      <p className="text-xs text-gray-500 font-bold">Task Poster</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Explore CTA */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="p-6 rounded-[2.5rem] bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <p className="font-black text-gray-900 dark:text-white mb-2">Looking for more tasks?</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Explore the full marketplace and find the perfect fit.</p>
                <Link href="/tasks">
                  <Button className="w-full rounded-xl gap-2 bg-gray-900 dark:bg-white dark:text-black hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all font-bold">
                    Explore All Tasks <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function TaskDetailsSkeleton() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <Skeleton className="w-full h-56 rounded-none bg-gray-200 dark:bg-white/5" />
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {[600, 400, 300].map((h, i) => (
              <Skeleton key={i} className={`h-[${h}px] w-full rounded-[2.5rem] bg-gray-200 dark:bg-white/5`} />
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[420px] w-full rounded-[2.5rem] bg-gray-200 dark:bg-white/5" />
            <Skeleton className="h-32 w-full rounded-[2.5rem] bg-gray-200 dark:bg-white/5" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
