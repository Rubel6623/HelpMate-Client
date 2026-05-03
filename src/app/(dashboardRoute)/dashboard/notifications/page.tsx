"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Loader2, 
  CheckCheck,
  BellOff,
  Star,
  ShieldAlert,
  CreditCard,
  MessageSquare,
  Package
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getMyNotifications, markNotificationAsRead, markAllAsRead, sendMessageToRunner } from "@/src/services/notifications";
import { toast, Toaster } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { Send } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [replyToNotification, setReplyToNotification] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      if (res?.success) {
        setNotifications(res.data || []);
      }
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await markNotificationAsRead(id);
      if (res?.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      const res = await markAllAsRead();
      if (res?.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast.success("All marked as read");
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const senderId = replyToNotification?.data?.senderId;
    if (!senderId) {
      toast.error("Could not find sender information");
      return;
    }

    setReplying(true);
    try {
      const res = await sendMessageToRunner({
        runnerId: senderId,
        message: replyMessage,
        title: `Reply from HelpMate Runner`
      });

      if (res?.success) {
        toast.success("Reply sent successfully!");
        setReplyMessage("");
        setReplyToNotification(null);
      } else {
        toast.error(res?.message || "Failed to send reply");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setReplying(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_RECEIVED":
      case "PAYMENT_SENT":
        return <CreditCard className="w-5 h-5 text-emerald-500" />;
      case "SOS_ALERT":
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "REVIEW_RECEIVED":
        return <Star className="w-5 h-5 text-amber-500" />;
      case "TASK_COMPLETED":
      case "TASK_CONFIRMED":
        return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
      case "APPLICATION_RECEIVED":
      case "APPLICATION_ACCEPTED":
        return <Package className="w-5 h-5 text-primary" />;
      case "DIRECT_MESSAGE":
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground text-lg">Stay updated with your activities and task progress.</p>
        </div>
        
        {unreadCount > 0 && (
          <Button 
            onClick={handleMarkAllRead} 
            disabled={actionLoading}
            variant="outline" 
            className="rounded-xl font-bold flex gap-2"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-white/5">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <BellOff className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No notifications yet</h3>
            <p className="text-muted-foreground">We'll notify you when something important happens.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                  notif.read 
                    ? "bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 opacity-70" 
                    : "bg-white dark:bg-white/5 border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-primary/10"
                }`}
              >
                {!notif.read && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                )}
                
                <div className="flex gap-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    notif.read ? "bg-gray-100 dark:bg-white/10" : "bg-primary/10"
                  }`}>
                    {getIcon(notif.type)}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold ${notif.read ? "text-gray-500" : "text-black dark:text-white"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${notif.read ? "text-gray-400" : "text-muted-foreground"}`}>
                      {notif.message}
                    </p>

                    {notif.type === "DIRECT_MESSAGE" && (
                      <div className="pt-3">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="rounded-xl font-bold h-9 gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyToNotification(notif);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Reply
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <Dialog open={!!replyToNotification} onOpenChange={(open) => !open && setReplyToNotification(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              Reply to {replyToNotification?.data?.senderName || 'User'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 italic text-sm text-muted-foreground">
              "{replyToNotification?.message}"
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Reply</label>
              <Textarea 
                placeholder="Type your reply here..."
                className="min-h-[150px] rounded-2xl p-6 bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleReply}
              disabled={replying}
              className="w-full h-14 rounded-2xl font-black text-lg gap-2"
            >
              {replying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
