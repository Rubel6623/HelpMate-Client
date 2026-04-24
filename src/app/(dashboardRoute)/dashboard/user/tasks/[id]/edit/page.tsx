"use client";

import { useEffect, useState, use } from "react";
import { motion } from "motion/react";
import { Pencil, MapPin, Calendar, Clock, DollarSign, FileText, Loader2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { getCategories } from "@/src/services/category";
import { getTaskById, updateTask } from "@/src/services/tasks";
import { postTaskSchema, PostTaskValues } from "@/src/validation/task.validation";
import Link from "next/link";

export default function EditTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostTaskValues>({
    resolver: zodResolver(postTaskSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch categories
        const catRes = await getCategories();
        if (catRes?.success) {
          setCategories(catRes.data);
        }

        // Fetch task details
        const taskRes = await getTaskById(taskId);
        if (taskRes?.success && taskRes.data) {
          const task = taskRes.data;
          
          // Pre-fill form
          setValue("title", task.title);
          setValue("description", task.description);
          setValue("offerPrice", task.budget || task.estimatedBudget);
          setValue("categoryId", task.categoryId);
          
          if (task.timeWindowStart) {
            const date = new Date(task.timeWindowStart);
            setValue("executionDate", date.toISOString().split('T')[0]);
            setValue("preferredTime", date.toTimeString().split(' ')[0].substring(0, 5));
          }

          if (task.stops && task.stops.length > 0) {
            setValue("location", task.stops[0].address);
          }
        } else {
          toast.error("Task not found or access denied");
          router.push("/dashboard/user/tasks");
        }
      } catch (error) {
        toast.error("Failed to load task details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [taskId, setValue, router]);

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
        stops: [
          {
            order: 1,
            locationLabel: "Main Location",
            address: data.location,
          },
        ],
      };

      const res = await updateTask(taskId, payload);

      if (res?.success) {
        toast.success("Task updated successfully!");
        router.push("/dashboard/user/tasks");
      } else {
        toast.error(res?.message || "Failed to update task");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-bold">Loading task data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-4xl mx-auto pb-16">
      <Toaster position="top-right" richColors />
      
      <div className="relative z-10">
        <div className="mb-8">
           <Link href="/dashboard/user/tasks">
              <Button variant="ghost" className="mb-4 gap-2 text-gray-500 hover:text-primary transition-colors">
                 <ArrowLeft className="w-4 h-4" /> Back to My Tasks
              </Button>
           </Link>
           <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30 rotate-3">
                <Pencil className="w-10 h-10 text-white -rotate-3" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                  Edit Your Task
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  Update your task details, budget, or schedule to attract the best runners.
                </p>
              </div>
           </div>
        </div>

        <motion.form 
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 md:p-12 rounded-[2.5rem] bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-3xl border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="relative space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 dark:border-white/10 pb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Task Details</h2>
              </div>
              
              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Task Title</Label>
                <Input 
                  {...register("title")}
                  placeholder="Task title"
                  className={`h-16 pl-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-bold text-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.title ? "border-red-500" : ""}`} 
                />
                {errors.title && <p className="text-red-500 text-xs ml-1 font-medium">{errors.title.message}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Detailed Description</Label>
                <Textarea 
                  {...register("description")}
                  placeholder="Task description"
                  className={`min-h-[160px] rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-medium focus:ring-4 focus:ring-primary/20 focus:border-primary p-6 transition-all shadow-sm ${errors.description ? "border-red-500" : ""}`}
                />
                {errors.description && <p className="text-red-500 text-xs ml-1 font-medium">{errors.description.message}</p>}
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Category</Label>
                <select 
                  {...register("categoryId")}
                  className={`w-full h-16 pl-6 pr-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-bold focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all shadow-sm ${errors.categoryId ? "border-red-500" : ""}`}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
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
                <Input 
                  {...register("location")}
                  placeholder="Address"
                  className={`h-16 pl-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-semibold focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.location ? "border-red-500" : ""}`} 
                />
                {errors.location && <p className="text-red-500 text-xs ml-1 font-medium">{errors.location.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Execution Date</Label>
                  <Input 
                    {...register("executionDate")}
                    type="date"
                    className={`h-16 pl-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-semibold focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.executionDate ? "border-red-500" : ""}`} 
                  />
                  {errors.executionDate && <p className="text-red-500 text-xs ml-1 font-medium">{errors.executionDate.message}</p>}
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest ml-1">Preferred Time</Label>
                  <Input 
                    {...register("preferredTime")}
                    type="time"
                    className={`h-16 pl-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-semibold focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.preferredTime ? "border-red-500" : ""}`} 
                  />
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
                <Input 
                  {...register("offerPrice", { valueAsNumber: true })}
                  type="number"
                  className={`h-20 pl-6 text-3xl rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 font-black focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all shadow-sm ${errors.offerPrice ? "border-red-500" : ""}`} 
                />
                {errors.offerPrice && <p className="text-red-500 text-xs ml-1 font-medium">{errors.offerPrice.message}</p>}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-gray-200 dark:border-white/10">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-20 rounded-[1.5rem] bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xl font-black shadow-2xl transition-all hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span>Updating Task...</span>
                  </div>
                ) : (
                  <span>Update Task Details</span>
                )}
              </Button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
