"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Shield, Camera, Edit3, Save, X } from "lucide-react";
import { getUser, getMe, updateProfile } from "@/src/services/auth";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getMe();
      if (profile?.success) {
        setUser(profile.data);
        setFormData({
          name: profile.data.name,
          email: profile.data.email || "",
          phone: profile.data.phone,
          avatarUrl: profile.data.avatarUrl || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    const result = await updateProfile(formData);
    if (result.success) {
      setUser(result.data);
      setIsEditing(false);
    }
    setLoading(false);
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-black dark:text-white">Account Settings</h1>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="rounded-xl bg-primary hover:bg-primary/90 font-bold flex gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="rounded-xl font-bold flex gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-xl bg-green-500 hover:bg-green-600 font-bold flex gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl text-center"
        >
          <div className="relative inline-block mb-6 group">
            <div className="w-32 h-32 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-5xl font-black text-primary overflow-hidden">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">{user?.name}</h2>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-6">{user?.role} ACCOUNT</p>
          
          <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col gap-4">
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status</span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 font-bold text-xs uppercase">
                  {user?.verificationStatus}
                </span>
             </div>
             <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Member Since</span>
                <span className="text-black dark:text-white font-bold">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
             </div>
          </div>
        </motion.div>

        {/* Details Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white focus:ring-2 focus:ring-primary/20" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input 
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white focus:ring-2 focus:ring-primary/20" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input 
                  disabled={true} // Phone usually shouldn't be changed easily
                  value={formData.phone}
                  className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-gray-400" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Avatar URL</Label>
              <div className="relative">
                <Camera className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input 
                  disabled={!isEditing}
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                  placeholder="https://example.com/avatar.jpg"
                  className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white focus:ring-2 focus:ring-primary/20" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Security</h3>
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-black dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-lg font-bold">Enable</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
