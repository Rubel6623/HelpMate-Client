"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { UserCircle, Star, ShieldCheck, MapPin, Search, Filter, Loader2, Calendar, Home, ArrowLeft } from "lucide-react";
import { getAllRunners } from "@/src/services/runners";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function RunnersPage() {
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

  return (
    <div className="container px-6 md:px-20 py-12">
      
      
      {/* Back to Home Button */}
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

      {/* Header Section */}
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

      {/* Search and Filter */}
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

      {/* Runners Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Fetching active runners...</p>
        </div>
      ) : filteredRunners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRunners.map((item, index) => {
            // Support both old and new data structures
            const user = item.user || item;
            const profile = item.runnerProfile || (item.user ? item : null);
            
            // If it's the new structure where item is User, profile is item.runnerProfile
            // If it's the old structure where item is RunnerProfile, user is item.user
            
            if (!profile) return null; // Skip runners without profiles on this page

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative p-6 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500"
              >
                {/* Profile Top */}
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
                    <div className="flex items-center gap-1 text-amber-500 font-black text-xl">
                      <Star className="w-5 h-5 fill-current" />
                      {(profile.averageRating || 0).toFixed(1)}
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {profile.totalTasksDone || 0} Tasks Done
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {user.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mt-1">
                      <MapPin className="w-4 h-4" />
                      {profile.university}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 font-medium">
                    {profile.bio || "Student runner ready to help with your errands and tasks across the campus."}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {profile.skills?.slice(0, 3).map((skill: string) => (
                      <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                        {skill}
                      </span>
                    ))}
                    {profile.skills?.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                        +{profile.skills.length - 3} More
                      </span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <div className="flex gap-3">
                  <Link href={`/runners/${user.id || item.userId}`} className="flex-1">
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 font-bold">
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/dashboard/user/post-task?runnerId=${user.id || item.userId}`} className="flex-1">
                    <Button className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white dark:text-black hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 font-bold gap-2 group/btn text-sm">
                      <Calendar className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                      Book Now
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
