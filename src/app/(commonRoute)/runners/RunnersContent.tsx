"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { UserCircle, Star, ShieldCheck, MapPin, Search, Filter, Calendar, Home, ArrowLeft } from "lucide-react";
import { getAllRunners } from "@/src/services/runners";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import Link from "next/link";

const RunnerCardSkeleton = () => (
  <div className="p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl space-y-6 h-full flex flex-col">
    <div className="flex items-start justify-between">
      <Skeleton className="w-20 h-20 rounded-3xl bg-gray-200 dark:bg-white/10" />
      <div className="flex flex-col items-end gap-2">
        <Skeleton className="w-16 h-8 rounded-lg bg-gray-200 dark:bg-white/10" />
        <Skeleton className="w-12 h-6 rounded-lg bg-gray-200 dark:bg-white/10" />
        <Skeleton className="w-20 h-4 rounded-lg bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
    <div className="space-y-4 flex-grow">
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4 rounded-xl bg-gray-200 dark:bg-white/10" />
        <Skeleton className="h-4 w-1/2 rounded-lg bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded-lg bg-gray-200 dark:bg-white/10" />
        <Skeleton className="h-4 w-5/6 rounded-lg bg-gray-200 dark:bg-white/10" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
        <Skeleton className="h-6 w-16 rounded-full bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
    <div className="flex gap-3 mt-auto">
      <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
      <Skeleton className="h-12 flex-1 rounded-xl bg-gray-200 dark:bg-white/10" />
    </div>
  </div>
);

const PageSkeleton = () => (
  <div className="container px-6 md:px-20 py-12">
    <div className="mb-8">
      <Skeleton className="w-32 h-10 rounded-full bg-gray-200 dark:bg-white/10" />
    </div>
    <div className="mb-12 text-center space-y-4">
      <Skeleton className="h-16 w-2/3 mx-auto rounded-2xl bg-gray-200 dark:bg-white/10" />
      <Skeleton className="h-6 w-1/2 mx-auto rounded-xl bg-gray-200 dark:bg-white/10" />
    </div>
    <div className="flex flex-col md:flex-row gap-4 mb-12">
      <Skeleton className="h-14 flex-1 rounded-2xl bg-gray-200 dark:bg-white/10" />
      <Skeleton className="h-14 w-32 rounded-2xl bg-gray-200 dark:bg-white/10" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <RunnerCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default function RunnersContent() {
  const [runners, setRunners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRunners = async () => {
      const res = await getAllRunners();
      if (res?.success) {
        setRunners(res.data);
      }
      setLoading(false);
    };
    fetchRunners();
  }, []);

  const filteredRunners = runners.filter((runner) => {
    const userName = runner.name || runner.user?.name || "";
    const university = runner.runnerProfile?.university || runner.university || "";
    
    return (
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="container px-6 md:px-20 py-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link href="/">
          <Button variant="ghost" className="rounded-full gap-2 text-white hover:text-primary transition-colors border border-white/20">
            <ArrowLeft className="w-4 h-4" />
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </Link>
      </motion.div>

      <div className="mb-12 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl text-white font-bold mb-4 tracking-tight"
        >
          Find Your Perfect <span className="text-primary">Runner</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Browse through our active student runners ready to help you with your errands and tasks.
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search by name or university..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-white/5 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </Button>
      </div>

      {filteredRunners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredRunners.map((item, index) => {
            const user = item.user || item;
            const profile = item.runnerProfile || (item.user ? item : null);
            
            if (!profile) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center overflow-hidden border border-white/10">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    {profile.isVerified && (
                      <div className="absolute -bottom-2 -right-2 bg-primary text-white p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-[#0a0a0a]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-primary font-black text-2xl flex items-baseline gap-0.5">
                      <span className="text-sm font-bold">৳</span>
                      {profile.hourlyRate}
                      <span className="text-[10px] text-muted-foreground font-bold uppercase ml-1">/hr</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {(profile.averageRating || 0).toFixed(1)}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      {profile.totalTasksDone || 0} Tasks Done
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{profile.university}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 font-medium min-h-[2.5rem]">
                    {profile.bio || "Student runner ready to help with your errands and tasks across the campus."}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {profile.skills?.slice(0, 2).map((skill: string) => (
                      <span key={skill} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest">
                        {skill}
                      </span>
                    ))}
                    {profile.skills?.length > 2 && (
                      <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 text-[9px] font-bold uppercase tracking-widest">
                        +{profile.skills.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <Link href={`/runners/${user.id || item.userId}`} className="flex-1">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 font-bold text-xs">
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/user/post-task?runnerId=${user.id || item.userId}`} className="flex-1">
                    <Button className="w-full h-12 rounded-xl bg-gray-900 dark:bg-white dark:text-black hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 font-bold gap-2 group/btn text-xs">
                      <Calendar className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                      Book
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/10">
          <UserCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No runners found</h3>
          <p className="text-muted-foreground">Try adjusting your search query or check back later.</p>
        </div>
      )}
    </div>
  );
}
