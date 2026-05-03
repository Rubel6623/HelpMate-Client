"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShieldAlert, UserCheck, Loader2, Eye, BadgeCheck, X } from "lucide-react";
import { toast } from "sonner";
import { getUsers, updateUser, getUserById } from "@/src/services/user";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modal State
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      if (res?.success) {
        setUsers(res.data || []);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, isActive: boolean) => {
    setUpdatingId(userId);
    try {
      const res = await updateUser(userId, { isActive });
      if (res?.success) {
        toast.success(`User status updated to ${isActive ? "ACTIVE" : "SUSPENDED"}`);
        setUsers(users.map(u => u.id === userId ? { ...u, isActive } : u));
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setUpdatingId(userId);
    try {
      const res = await updateUser(userId, { verificationStatus: "VERIFIED" });
      if (res?.success) {
        toast.success("User successfully verified!");
        setUsers(users.map(u => u.id === userId ? { ...u, verificationStatus: "VERIFIED" } : u));
        if (selectedUser && selectedUser.id === userId) {
            setSelectedUser({ ...selectedUser, verificationStatus: "VERIFIED" });
        }
      } else {
        toast.error(res?.message || "Failed to verify user");
      }
    } catch (error) {
      toast.error("An error occurred while verifying the user");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewUserData = async (userId: string) => {
    setIsModalOpen(true);
    setModalLoading(true);
    setSelectedUser(null);
    try {
      const res = await getUserById(userId);
      if (res?.success) {
        setSelectedUser(res.data);
      } else {
        toast.error("Failed to fetch user details");
        setIsModalOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while fetching user details");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">User Management</h1>
          <p className="text-muted-foreground text-lg">Manage all registered users and their verification status.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input 
            placeholder="Search users by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 w-[350px] pl-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium shadow-sm text-black dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm z-10">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                  <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">User Info</th>
                  <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Account Status</th>
                  <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Verification</th>
                  <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                          {user.name?.substring(0, 2) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-black dark:text-white text-lg leading-tight">{user.name}</p>
                          <p className="text-sm text-gray-400 mt-1">{user.email || user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`text-xs font-black px-3 py-1 rounded-lg ${
                        user.role === "RUNNER" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${
                           user.isActive ? "bg-green-500" : "bg-red-500"
                         }`} />
                         <span className="font-bold text-sm text-black dark:text-white">{user.isActive ? "ACTIVE" : "SUSPENDED"}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.verificationStatus === 'VERIFIED' ? 'bg-green-500/10 text-green-500' : 
                        user.verificationStatus === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="p-8 text-right relative">
                      {updatingId === user.id ? (
                        <div className="flex justify-end pr-4">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={() => handleViewUserData(user.id)}
                             title="View User Data"
                             className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-xl transition-colors shadow-sm bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10 dark:hover:bg-blue-500/10"
                           >
                              <Eye className="w-4 h-4" />
                           </button>

                           {user.verificationStatus !== "VERIFIED" && (
                             <button 
                               onClick={() => handleVerifyUser(user.id)}
                               title="Verify Identity"
                               className="p-2.5 hover:bg-green-50 text-green-600 rounded-xl transition-colors shadow-sm bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10 dark:hover:bg-green-500/10"
                             >
                                <BadgeCheck className="w-4 h-4" />
                             </button>
                           )}

                           {!user.isActive ? (
                             <button 
                               onClick={() => handleUpdateStatus(user.id, true)}
                               title="Activate Account"
                               className="p-2.5 hover:bg-green-50 text-green-600 rounded-xl transition-colors shadow-sm bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10 dark:hover:bg-green-500/10"
                             >
                                <UserCheck className="w-4 h-4" />
                             </button>
                           ) : (
                             <button 
                               onClick={() => handleUpdateStatus(user.id, false)}
                               title="Suspend Account"
                               className="p-2.5 hover:bg-orange-50 text-orange-500 rounded-xl transition-colors shadow-sm bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10 dark:hover:bg-orange-500/10"
                             >
                                <ShieldAlert className="w-4 h-4" />
                             </button>
                           )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Data Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-gray-100 dark:border-white/10"
            >
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  User Details
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              <div className="p-8 min-h-[250px]">
                {modalLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p>Loading details...</p>
                  </div>
                ) : selectedUser ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl font-black text-primary">
                        {selectedUser.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black dark:text-white">{selectedUser.name}</h3>
                        <span className="inline-block px-2 py-1 mt-1 text-[10px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-white/10 rounded-md">
                          {selectedUser.role} • {selectedUser.verificationStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="font-semibold text-black dark:text-white">{selectedUser.phone || "N/A"}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Email Address</p>
                        <p className="font-semibold text-black dark:text-white break-all">{selectedUser.email || "N/A"}</p>
                      </div>
                    </div>

                    {selectedUser.role === "RUNNER" && selectedUser.runnerProfile && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                          <p className="text-xs text-blue-600/60 dark:text-blue-400/60 font-bold uppercase tracking-wider mb-1">Student ID</p>
                          <p className="font-bold text-blue-700 dark:text-blue-400">{selectedUser.runnerProfile.studentId || "N/A"}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                          <p className="text-xs text-blue-600/60 dark:text-blue-400/60 font-bold uppercase tracking-wider mb-1">NID Number</p>
                          <p className="font-bold text-blue-700 dark:text-blue-400">{selectedUser.runnerProfile.nationalId || "N/A"}</p>
                        </div>
                      </div>
                    )}
                    
                    {selectedUser.verificationStatus !== "VERIFIED" && (
                      <button 
                        onClick={() => handleVerifyUser(selectedUser.id)}
                        disabled={updatingId === selectedUser.id}
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {updatingId === selectedUser.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <BadgeCheck className="w-5 h-5" />
                            Verify This User
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-10">User data could not be loaded.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
