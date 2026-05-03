"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import { 
  UserCircle, Star, ShieldCheck, MapPin, 
  Calendar, ArrowLeft, Mail, Phone, 
  GraduationCap, Briefcase, Award, CheckCircle2 
} from "lucide-react";
import { getRunnerProfile } from "@/src/services/runners";
import { sendMessageToRunner } from "@/src/services/notifications";
import { Button } from "@/src/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import Link from "next/link";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function RunnerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [runner, setRunner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRunner = async () => {
      const res = await getRunnerProfile(id);
      if (res?.success && res.data) {
        // If it's an array, take the first one, otherwise take it as is
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setRunner(data);
      }
      setLoading(false);
    };
    fetchRunner();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Loading runner profile...</p>
      </div>
    );
  }

  if (!runner) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Runner not found</h2>
        <Link href="/runners">
          <Button>Back to Runners</Button>
        </Link>
      </div>
    );
  }

  const user = runner.user || runner;
  const profile = runner.runnerProfile || (runner.user ? runner : null);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);
    try {
      const res = await sendMessageToRunner({
        runnerId: user.id,
        message: message,
        title: `Direct message from interested user`
      });

      if (res?.success) {
        toast.success("Message sent successfully!");
        setMessage("");
        setIsDialogOpen(false);
      } else {
        toast.error(res?.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen px-6 md:px-20 pb-20">
      <Toaster position="top-right" richColors />
      
      {/* Hero Header / Banner */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-b-[4rem]">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

        <div className="container relative h-full flex flex-col justify-end pb-20 px-8">
          <Link href="/runners" className="absolute top-8 left-8">
            <motion.div whileHover={{ x: -5 }}>
              <Button variant="ghost" className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full gap-2 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4" />
                Back to Runners
              </Button>
            </motion.div>
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
                {profile?.isVerified ? "Verified Expert" : "Verified Student"}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-widest">
                Active Now
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tight leading-none">
              Meet <span className="text-primary">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 font-medium max-w-xl">
              Professional student runner from {profile?.university || "university"}. Dedicated to providing the best errands and logistics support on campus.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 shadow-2xl shadow-primary/5 sticky top-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center overflow-hidden border-2 border-white dark:border-white/10 shadow-xl">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  {profile?.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-2xl shadow-lg border-4 border-white dark:border-[#0a0a0a]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <h1 className="text-3xl font-black mb-2">{user.name}</h1>
                <p className="text-muted-foreground font-medium mb-6 flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {profile?.university || "Verified Student"}
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                    <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xl">
                      <Star className="w-5 h-5 fill-current" />
                      {(profile?.averageRating || 0).toFixed(1)}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Rating</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                    <div className="font-bold text-xl">
                      {profile?.totalTasksDone || 0}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Tasks Done</span>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  <Link href={`/dashboard/user/post-task?runnerId=${user.id}`} className="block w-full">
                    <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20">
                      Book Now
                    </Button>
                  </Link>
                  
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-200 dark:border-white/10 font-bold gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-primary" />
                          </div>
                          Send Message to {user.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6 py-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Message</label>
                          <Textarea 
                            placeholder="Type your message here... e.g. Hi, I have a task for you!"
                            className="min-h-[150px] rounded-2xl p-6 bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleSendMessage}
                          disabled={sending}
                          className="w-full h-14 rounded-2xl font-black text-lg gap-2"
                        >
                          {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 space-y-4">
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 md:p-12 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                About Runner
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {profile?.bio || `${user.name} is a dedicated student at ${profile?.university || "university"} who is passionate about helping others and completing tasks with excellence.`}
              </p>
            </motion.div>

            {/* Skills & Expertise */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 md:p-12 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-purple-500" />
                </div>
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-3">
                {(profile?.skills || ["Quick Delivery", "Reliable", "Honest", "Punctual"]).map((skill: string) => (
                  <div key={skill} className="px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10 text-primary font-bold flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {skill}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education & Context */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  Education
                </h3>
                <p className="font-bold text-gray-900 dark:text-white">{profile?.university || "University Student"}</p>
                <p className="text-sm text-muted-foreground">Currently enrolled in Undergraduate Program</p>
              </div>
              <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-emerald-500" />
                  Work Status
                </h3>
                <p className="font-bold text-gray-900 dark:text-white">Active Runner</p>
                <p className="text-sm text-muted-foreground">Available for tasks and errands</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
