"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "motion/react";
import { PlusCircle, MapPin, Calendar, Clock, DollarSign, FileText, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { getCategories } from "@/src/services/category";
import { createTask } from "@/src/services/tasks";
import { getRunnerProfile } from "@/src/services/runners";
import { postTaskSchema, PostTaskValues } from "@/src/validation/task.validation";

function PostTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const runnerId = searchParams.get("runnerId");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetRunner, setTargetRunner] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostTaskValues>({
    resolver: zodResolver(postTaskSchema),
    defaultValues: {
      offerPrice: 250,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (res?.success) {
        setCategories(res.data);
      }
    };
    fetchCategories();

    if (runnerId) {
      const fetchRunner = async () => {
        const res = await getRunnerProfile(runnerId);
        if (res?.success && res.data && res.data.length > 0) {
          setTargetRunner(res.data[0]);
        }
      };
      fetchRunner();
    }
  }, [runnerId]);

  const onSubmit = async (data: PostTaskValues) => {
    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${data.executionDate}T${data.preferredTime}`);
      const endDateTime = new Date(startDateTime.getTime() + 4 * 60 * 60 * 1000); 

      const payload = {
        title: data.title,
        description: data.description,
        offerPrice: data.offerPrice,
        categoryId: data.categoryId,
        timeWindowStart: startDateTime.toISOString(),
        timeWindowEnd: endDateTime.toISOString(),
        estimatedDuration: 60, 
        stops: [
          {
            order: 1,
            locationLabel: "Main Location",
            locationLat: 23.8103, 
            locationLng: 90.4125, 
            address: data.location,
          },
        ],
      };

      const res = await createTask(payload);

      if (res?.success) {
        toast.success("Task published successfully!");
        router.push("/dashboard/user/tasks");
      } else {
        toast.error(res?.message || "Failed to publish task");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto pb-16">
      
      
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-xl shadow-primary/30 rotate-3">
            <PlusCircle className="w-10 h-10 text-white -rotate-3" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
              {targetRunner ? `Book ${targetRunner.name || targetRunner.user?.name}` : "Post a New Task"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              {targetRunner 
                ? `You're booking ${targetRunner.name || targetRunner.user?.name} from ${targetRunner.runnerProfile?.university || targetRunner.university}. Describe your task and they'll get a notification.`
                : "Describe what you need help with in detail, set your budget, and connect with verified runners instantly."}
            </p>
          </div>
        </div>

        <motion.form 
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative p-8 md:p-12 rounded-[2.5rem] bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-3xl border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none rounded-[2.5rem]" />

          <div className="relative space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Task Details</h2>
              </div>
              
              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Task Title</Label>
                <div className="group relative">
                  <Input 
                    {...register("title")}
                    placeholder="e.g., Grocery shopping from Unimart"
                    className={`h-16 pl-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-bold text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.title ? "border-red-500 ring-2 ring-red-500/20" : ""}`} 
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 -z-10 blur-xl transition-opacity duration-500" />
                </div>
                {errors.title && <p className="text-red-500 text-xs ml-1 font-medium">{errors.title.message}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Detailed Description</Label>
                <Textarea 
                  {...register("description")}
                  placeholder="List the items or describe the task in detail..."
                  className={`min-h-[160px] rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium focus:ring-4 focus:ring-primary/20 focus:border-primary p-6 resize-y transition-all shadow-sm ${errors.description ? "border-red-500 ring-2 ring-red-500/20" : ""}`}
                />
                {errors.description && <p className="text-red-500 text-xs ml-1 font-medium">{errors.description.message}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Category</Label>
                <div className="relative">
                  <select 
                    {...register("categoryId")}
                    className={`w-full h-16 pl-6 pr-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all shadow-sm ${errors.categoryId ? "border-red-500 ring-2 ring-red-500/20" : ""}`}
                  >
                    <option value="" disabled className="text-gray-400">Select the best matching category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="dark:bg-gray-900">{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.categoryId && <p className="text-red-500 text-xs ml-1 font-medium">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Location & Logistics</h2>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Address</Label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <Input 
                    {...register("location")}
                    placeholder="e.g., House 12, Road 5, Dhanmondi, Dhaka"
                    className={`h-16 pl-20 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-semibold focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.location ? "border-red-500 ring-2 ring-red-500/20" : ""}`} 
                  />
                </div>
                {errors.location && <p className="text-red-500 text-xs ml-1 font-medium">{errors.location.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Execution Date</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <Input 
                      {...register("executionDate")}
                      type="date"
                      className={`h-16 pl-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-semibold focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.executionDate ? "border-red-500 ring-2 ring-red-500/20" : ""}`} 
                    />
                  </div>
                  {errors.executionDate && <p className="text-red-500 text-xs ml-1 font-medium">{errors.executionDate.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Preferred Time</Label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 group-focus-within:bg-primary group-focus-within:text-white transition-colors">
                      <Clock className="h-5 w-5" />
                    </div>
                    <Input 
                      {...register("preferredTime")}
                      type="time"
                      className={`h-16 pl-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-semibold focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.preferredTime ? "border-red-500 ring-2 ring-red-500/20" : ""}`} 
                    />
                  </div>
                  {errors.preferredTime && <p className="text-red-500 text-xs ml-1 font-medium">{errors.preferredTime.message}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Budget Offer</h2>
              </div>
              
              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Your Offer (৳)</Label>
                <div className="relative group max-w-sm">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400 group-focus-within:text-primary transition-colors">
                    ৳
                  </div>
                  <Input 
                    {...register("offerPrice", { valueAsNumber: true })}
                    type="number"
                    placeholder="250"
                    className={`h-20 pl-16 text-3xl rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-black focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.offerPrice ? "border-red-500 ring-2 ring-red-500/20" : ""}`} 
                  />
                </div>
                {errors.offerPrice && <p className="text-red-500 text-xs ml-1 font-medium">{errors.offerPrice.message}</p>}
                <p className="text-sm text-muted-foreground ml-1">Set a fair price to attract runners faster.</p>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-gray-200 dark:border-white/10">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-20 rounded-[1.5rem] bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white text-xl font-black shadow-2xl shadow-primary/30 flex gap-4 transition-all hover:-translate-y-1 active:scale-[0.98] group overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span>Publishing Task...</span>
                  </div>
                ) : (
                  <>
                    <PlusCircle className="w-8 h-8" />
                    <span>Publish Task Now</span>
                  </>
                )}
              </Button>
            </div>

          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default function PostTaskPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <PostTaskForm />
    </Suspense>
  );
}
