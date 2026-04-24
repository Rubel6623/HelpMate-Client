"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Star,
  Trophy,
  Target,
  Award,
  Zap,
  Loader2,
  Medal,
} from "lucide-react";
import { getAllBadges, getMyBadges } from "@/src/services/badges";

// Map icon names from backend to lucide components
const iconMap: Record<string, any> = {
  trophy: Trophy,
  zap: Zap,
  star: Star,
  target: Target,
  shieldcheck: ShieldCheck,
  award: Award,
  medal: Medal,
};

const colorMap: Record<number, { color: string; bg: string }> = {
  0: { color: "text-yellow-500", bg: "bg-yellow-50" },
  1: { color: "text-blue-500", bg: "bg-blue-50" },
  2: { color: "text-orange-500", bg: "bg-orange-50" },
  3: { color: "text-green-500", bg: "bg-green-50" },
  4: { color: "text-purple-500", bg: "bg-purple-50" },
  5: { color: "text-pink-500", bg: "bg-pink-50" },
};

export default function RunnerBadgesPage() {
  const [allBadges, setAllBadges] = useState<any[]>([]);
  const [myBadgeIds, setMyBadgeIds] = useState<Set<string>>(new Set());
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const [allRes, myRes] = await Promise.all([
        getAllBadges(),
        getMyBadges(),
      ]);

      if (allRes?.success && allRes.data) {
        setAllBadges(allRes.data);
      }

      if (myRes?.success && myRes.data) {
        setMyBadges(myRes.data);
        const ids = new Set<string>(myRes.data.map((ub: any) => ub.badgeId));
        setMyBadgeIds(ids);
      }
    } catch (error) {
      console.error("Error fetching badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string | undefined, index: number) => {
    if (iconName && iconMap[iconName.toLowerCase()]) {
      return iconMap[iconName.toLowerCase()];
    }
    // Fallback icons
    const fallbacks = [Trophy, Zap, Star, Target, ShieldCheck, Award];
    return fallbacks[index % fallbacks.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading badges...</p>
        </div>
      </div>
    );
  }

  // Separate earned and locked badges
  const earnedBadges = allBadges.filter((b) => myBadgeIds.has(b.id));
  const lockedBadges = allBadges.filter((b) => !myBadgeIds.has(b.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">My Achievement Badges</h1>
        <p className="text-muted-foreground text-lg">
          Unlock badges to increase your visibility and trust score. 
          You've earned {earnedBadges.length} out of {allBadges.length} badges.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
              Badge Progress
            </h3>
            <p className="text-muted-foreground mb-4">
              {earnedBadges.length === 0
                ? "Start completing tasks to earn your first badge!"
                : `Great job! You've unlocked ${earnedBadges.length} badge${earnedBadges.length > 1 ? "s" : ""}. Keep going!`}
            </p>
            <div className="w-full max-w-md h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: allBadges.length > 0 ? `${(earnedBadges.length / allBadges.length) * 100}%` : "0%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
              />
            </div>
            <p className="text-sm font-bold text-muted-foreground mt-2">
              {earnedBadges.length} / {allBadges.length} badges earned
            </p>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black dark:text-white px-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Earned Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {earnedBadges.map((badge, i) => {
              const colors = colorMap[i % 6];
              const IconComp = getIconComponent(badge.icon, i);
              const userBadge = myBadges.find((ub: any) => ub.badgeId === badge.id);

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white dark:bg-white/5 border-2 border-primary/10 shadow-xl hover:border-primary/30 transition-all relative overflow-hidden group"
                >
                  <div className={`w-20 h-20 rounded-2xl ${colors.bg} dark:bg-white/10 flex items-center justify-center ${colors.color} mb-6 group-hover:rotate-12 transition-transform`}>
                    <IconComp className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-black dark:text-white mb-2">{badge.name}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{badge.description}</p>

                  {userBadge?.awardedAt && (
                    <p className="text-xs text-primary font-bold mt-4">
                      Earned on {new Date(userBadge.awardedAt).toLocaleDateString()}
                    </p>
                  )}

                  <div className="absolute top-6 right-6">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-black dark:text-white px-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-gray-400" /> Locked Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lockedBadges.map((badge, i) => {
              const colors = colorMap[(earnedBadges.length + i) % 6];
              const IconComp = getIconComponent(badge.icon, earnedBadges.length + i);

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-gray-50/50 dark:bg-white/5 border-2 border-gray-100 dark:border-white/5 grayscale transition-all relative overflow-hidden group hover:grayscale-0"
                >
                  <div className={`w-20 h-20 rounded-2xl ${colors.bg} dark:bg-white/10 flex items-center justify-center ${colors.color} mb-6 group-hover:rotate-12 transition-transform`}>
                    <IconComp className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-black dark:text-white mb-2">{badge.name}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{badge.description}</p>

                  {badge.criteria && (
                    <p className="text-xs text-gray-500 font-bold mt-4 uppercase tracking-widest">
                      {badge.criteria}
                    </p>
                  )}

                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-0" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Locked</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state when no badges exist at all */}
      {allBadges.length === 0 && (
        <div className="p-20 text-center rounded-3xl border-4 border-dashed border-gray-100 dark:border-white/5">
          <Medal className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
          <p className="text-2xl font-bold text-gray-400 mb-2">No badges available yet</p>
          <p className="text-muted-foreground">Badges will appear here once the admin creates them.</p>
        </div>
      )}
    </div>
  );
}
