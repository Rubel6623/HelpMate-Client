"use client";

import { motion } from "motion/react";
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  IdCard, 
  GraduationCap, 
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Filter
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useEffect, useState } from "react";
import { getAllRunners, verifyRunnerProfile } from "@/src/services/runners";
import { updateUser } from "@/src/services/user";
import { toast } from "sonner";
import { Input } from "@/src/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function VerifyRunnerPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    setLoading(true);
    try {
      const res = await getAllRunners();
      if (res.success) {
        setUsers(res.data);
      } else {
        toast.error(res.message || "Failed to load runners list");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred while fetching runners");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId: string, runnerProfileId: string | undefined, status: boolean) => {
    if (!runnerProfileId && status) {
      toast.error("Runner has not completed their profile yet. Cannot verify without student ID/NID.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(status ? "Verifying runner..." : "Rejecting verification...");

    try {
      let runnerSuccess = true;
      let runnerMessage = "";

      // 1. Verify the Runner Profile (contains NID, Student ID, etc.)
      if (runnerProfileId) {
        const runnerRes = await verifyRunnerProfile(runnerProfileId, status);
        runnerSuccess = runnerRes.success;
        runnerMessage = runnerRes.message;
      }
      
      // 2. Update the User account verification status (global status)
      const userRes = await updateUser(userId, { 
        verificationStatus: status ? "VERIFIED" : "REJECTED" 
      });

      if (runnerSuccess && userRes.success) {
        toast.success(status ? "Runner verified successfully!" : "Verification rejected", { id: loadingToast });
        await fetchRunners();
      } else {
        const errorMsg = !runnerSuccess ? runnerMessage : userRes.message;
        toast.error(errorMsg || "Failed to update status. Please try again.", { id: loadingToast });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error(error.message || "An unexpected error occurred during verification", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.runnerProfile?.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && (!user.runnerProfile || !user.runnerProfile.isVerified);
    if (activeTab === "verified") return matchesSearch && user.runnerProfile?.isVerified;
    return matchesSearch;
  });

  if (loading && users.length === 0) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-black dark:text-white mb-2 tracking-tight">Runner Verification</h1>
          <p className="text-muted-foreground text-lg">Manage runner identities and platform trust.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
             <ShieldCheck className="w-6 h-6" />
             <span className="font-black text-lg">{users.filter(u => !u.runnerProfile?.isVerified).length} Pending</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-1 rounded-2xl h-14">
            <TabsTrigger value="all" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white h-full">All Runners</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl px-8 font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white h-full">Pending</TabsTrigger>
            <TabsTrigger value="verified" className="rounded-xl px-8 font-bold data-[state=active]:bg-green-500 data-[state=active]:text-white h-full">Verified</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            placeholder="Search by name, email or student ID..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 shadow-sm focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredUsers.map((user, i) => (
          <motion.div 
            key={user.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[3rem] bg-white dark:bg-white/5 border shadow-xl space-y-8 group transition-all hover:scale-[1.01] ${
              user.runnerProfile?.isVerified ? 'border-green-500/20' : 'border-gray-100 dark:border-white/5'
            }`}
          >
             <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex gap-8 items-start">
                   <div className="relative">
                      <div className="w-28 h-28 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary text-4xl font-black border-2 border-primary/20 overflow-hidden shadow-inner">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0)
                        )}
                      </div>
                      {user.runnerProfile?.isVerified && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-lg">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                   </div>
                   <div className="space-y-4">
                      <div>
                        <h2 className="text-3xl font-black text-black dark:text-white mb-1">{user.name}</h2>
                        <div className="flex items-center gap-4 text-gray-500 font-bold">
                           <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
                           <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {user.phone}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                          user.runnerProfile?.isVerified 
                          ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }`}>
                          {user.runnerProfile?.isVerified ? 'Profile Verified' : 'Profile Pending'}
                        </span>
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                          user.verificationStatus === 'VERIFIED'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-500 border-gray-200 dark:border-white/10'
                        }`}>
                          Account: {user.verificationStatus}
                        </span>
                        <span className="text-[10px] font-black bg-gray-50 dark:bg-white/5 text-gray-400 px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-100 dark:border-white/5 flex items-center gap-2">
                           <Clock className="w-3 h-3" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 h-fit min-w-[200px]">
                   {!user.runnerProfile?.isVerified ? (
                     <>
                        <Button 
                          disabled={loading}
                          onClick={() => handleVerify(user.id, user.runnerProfile?.id, true)}
                          className="h-14 px-8 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-black shadow-xl shadow-green-500/20 flex gap-2"
                        >
                          <UserCheck className="w-6 h-6" /> Approve Runner
                        </Button>
                        <Button 
                          disabled={loading}
                          variant="outline"
                          onClick={() => handleVerify(user.id, user.runnerProfile?.id, false)}
                          className="h-14 px-8 rounded-2xl border-red-200 text-red-500 hover:bg-red-50 font-black flex gap-2"
                        >
                          <UserX className="w-6 h-6" /> Reject
                        </Button>
                     </>
                   ) : (
                     <Button 
                       disabled={loading}
                       variant="outline"
                       onClick={() => handleVerify(user.id, user.runnerProfile?.id, false)}
                       className="h-14 px-8 rounded-2xl border-amber-200 text-amber-600 hover:bg-amber-50 font-black flex gap-2"
                     >
                       <ShieldCheck className="w-6 h-6" /> Revoke Access
                     </Button>
                   )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 rounded-[2.5rem] bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 relative overflow-hidden group/info">
                {/* Background decorative icon */}
                <Filter className="absolute -bottom-8 -right-8 w-40 h-40 text-gray-200 dark:text-white/5 -rotate-12 pointer-events-none group-hover/info:scale-110 transition-transform duration-700" />
                
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-3 text-blue-600">
                      <div className="p-2 rounded-xl bg-blue-500/10"><GraduationCap className="w-6 h-6" /></div>
                      <span className="font-black uppercase text-[10px] tracking-widest">Academic Credentials</span>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Institution</p>
                        <p className="text-xl font-bold text-black dark:text-white leading-tight">{user.runnerProfile?.university || "Not Provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Student ID</p>
                        <p className="text-xl font-bold text-black dark:text-white">{user.runnerProfile?.studentId || "N/A"}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-3 text-purple-600">
                      <div className="p-2 rounded-xl bg-purple-500/10"><IdCard className="w-6 h-6" /></div>
                      <span className="font-black uppercase text-[10px] tracking-widest">Identity Documents</span>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">NID Number</p>
                        <p className="text-xl font-bold text-black dark:text-white tracking-widest font-mono">
                          {user.runnerProfile?.nationalId || "No Document"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mailing Address</p>
                        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 line-clamp-2">{user.address || "No address on file"}</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-3 text-emerald-600">
                      <div className="p-2 rounded-xl bg-emerald-500/10"><AlertCircle className="w-6 h-6" /></div>
                      <span className="font-black uppercase text-[10px] tracking-widest">Experience & Skills</span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                         {user.runnerProfile?.skills?.length > 0 ? (
                           user.runnerProfile.skills.map((skill: string, idx: number) => (
                             <span key={idx} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-500/20">
                               {skill}
                             </span>
                           ))
                         ) : (
                           <span className="text-gray-400 text-xs font-bold italic">No skills listed</span>
                         )}
                      </div>
                      <div className="p-4 rounded-2xl bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 italic leading-relaxed">
                          "{user.runnerProfile?.bio || "Runner has not provided a bio yet."}"
                        </p>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        ))}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-32 bg-white dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/5">
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
              <UserCheck className="w-12 h-12 text-gray-300" />
            </div>
            <p className="text-3xl font-black text-black dark:text-white mb-2">No Runners Found</p>
            <p className="text-gray-400 font-bold">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
