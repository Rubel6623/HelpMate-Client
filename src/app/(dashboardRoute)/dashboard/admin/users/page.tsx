"use client";

import { motion } from "motion/react";
import { Search, ShieldCheck, UserMinus, ShieldAlert, UserCheck, MoreVertical } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function AdminUsersPage() {
  const users = [
    { id: "1", name: "Ariful Islam", role: "RUNNER", status: "VERIFIED", email: "ariful@gmail.com", joined: "12 Apr 2026" },
    { id: "2", name: "Shaheb Ahmed", role: "USER", status: "PENDING", email: "shaheb@gmail.com", joined: "15 Apr 2026" },
    { id: "3", name: "Rakibul Hasan", role: "RUNNER", status: "SUSPENDED", email: "rakib@gmail.com", joined: "10 Apr 2026" },
  ];

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
            placeholder="Search users..."
            className="h-12 w-80 pl-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 outline-none focus:border-primary transition-colors font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">User Info</th>
                <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="p-8 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {users.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-black dark:text-white text-lg leading-tight">{user.name}</p>
                        <p className="text-sm text-gray-400 mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className={`text-xs font-black px-3 py-1 rounded-lg ${
                      user.role === "RUNNER" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${
                         user.status === "VERIFIED" ? "bg-green-500" : 
                         user.status === "PENDING" ? "bg-yellow-500" : "bg-red-500"
                       }`} />
                       <span className="font-bold text-sm">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-gray-400 font-medium">{user.joined}</span>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2.5 hover:bg-green-50 text-green-600 rounded-xl transition-colors shadow-sm bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10">
                          <UserCheck className="w-5 h-5" />
                       </button>
                       <button className="p-2.5 hover:bg-orange-50 text-orange-500 rounded-xl transition-colors shadow-sm bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10">
                          <ShieldAlert className="w-5 h-5" />
                       </button>
                       <button className="p-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors shadow-sm bg-white dark:bg-zinc-800 border border-gray-100 dark:border-white/10">
                          <UserMinus className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
