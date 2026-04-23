"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, MapPin, Calendar, Clock, DollarSign, FileText, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { getCategories } from "@/src/services/category";
import { createTask } from "@/src/services/tasks";
import { postTaskSchema, PostTaskValues } from "@/src/validation/task.validation";

export default function PostTaskPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  }, []);

  const onSubmit = async (data: PostTaskValues) => {
    setIsSubmitting(true);
    try {
      // Construct the payload for the backend
      const startDateTime = new Date(`${data.executionDate}T${data.preferredTime}`);
      const endDateTime = new Date(startDateTime.getTime() + 4 * 60 * 60 * 1000); // 4 hours later

      const payload = {
        title: data.title,
        description: data.description,
        offerPrice: data.offerPrice,
        categoryId: data.categoryId,
        timeWindowStart: startDateTime.toISOString(),
        timeWindowEnd: endDateTime.toISOString(),
        estimatedDuration: 60, // Default 60 mins
        stops: [
          {
            order: 1,
            locationLabel: "Main Location",
            locationLat: 23.8103, // Default Dhaka Lat
            locationLng: 90.4125, // Default Dhaka Lng
            address: data.location,
          },
        ],
      };

      const res = await createTask(payload);

      if (res?.success) {
        toast.success("Task published successfully!");
        router.push("/dashboard/user/my-tasks"); // Redirect to my tasks page
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
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <Toaster position="top-right" richColors />
      
      <div>
        <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">Post a New Task</h1>
        <p className="text-muted-foreground">Describe what you need help with and set your budget.</p>
      </div>

      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-xl space-y-8"
      >
        {/* Task Title */}
        <div className="space-y-4">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Task Title</Label>
          <Input 
            {...register("title")}
            placeholder="e.g., Grocery shopping from Unimart"
            className={`h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-lg focus:ring-2 focus:ring-primary/20 ${errors.title ? "ring-2 ring-red-500" : ""}`} 
          />
          {errors.title && <p className="text-red-500 text-xs ml-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-4">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Detailed Description</Label>
          <Textarea 
            {...register("description")}
            placeholder="List the items or describe the task in detail..."
            className={`min-h-[150px] rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-semibold focus:ring-2 focus:ring-primary/20 p-4 ${errors.description ? "ring-2 ring-red-500" : ""}`}
          />
          {errors.description && <p className="text-red-500 text-xs ml-1">{errors.description.message}</p>}
        </div>

        {/* Location */}
        <div className="space-y-4">
          <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Location / Address</Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 h-5 w-5 text-primary" />
            <Input 
              {...register("location")}
              placeholder="e.g., House 12, Road 5, Dhanmondi, Dhaka"
              className={`h-14 pl-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-semibold focus:ring-2 focus:ring-primary/20 ${errors.location ? "ring-2 ring-red-500" : ""}`} 
            />
          </div>
          {errors.location && <p className="text-red-500 text-xs ml-1">{errors.location.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Budget */}
          <div className="space-y-4">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Offer (৳)</Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-4 h-5 w-5 text-primary" />
              <Input 
                {...register("offerPrice", { valueAsNumber: true })}
                type="number"
                placeholder="250"
                className={`h-14 pl-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold text-xl focus:ring-2 focus:ring-primary/20 ${errors.offerPrice ? "ring-2 ring-red-500" : ""}`} 
              />
            </div>
            {errors.offerPrice && <p className="text-red-500 text-xs ml-1">{errors.offerPrice.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-4">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category</Label>
            <select 
              {...register("categoryId")}
              className={`w-full h-14 px-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-bold text-black dark:text-white focus:ring-2 focus:ring-primary/20 outline-none appearance-none ${errors.categoryId ? "ring-2 ring-red-500" : ""}`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs ml-1">{errors.categoryId.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date */}
          <div className="space-y-4">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Execution Date</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Input 
                {...register("executionDate")}
                type="date"
                className={`h-14 pl-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-semibold focus:ring-2 focus:ring-primary/20 ${errors.executionDate ? "ring-2 ring-red-500" : ""}`} 
              />
            </div>
            {errors.executionDate && <p className="text-red-500 text-xs ml-1">{errors.executionDate.message}</p>}
          </div>

          {/* Time */}
          <div className="space-y-4">
            <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred Time</Label>
            <div className="relative">
              <Clock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <Input 
                {...register("preferredTime")}
                type="time"
                className={`h-14 pl-12 rounded-2xl bg-gray-50 dark:bg-white/5 border-none font-semibold focus:ring-2 focus:ring-primary/20 ${errors.preferredTime ? "ring-2 ring-red-500" : ""}`} 
              />
            </div>
            {errors.preferredTime && <p className="text-red-500 text-xs ml-1">{errors.preferredTime.message}</p>}
          </div>
        </div>

        <Button 
          type="submit"
          disabled={isSubmitting}
          className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-extrabold shadow-2xl shadow-primary/30 flex gap-3 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <PlusCircle className="w-6 h-6" />
              Publish Task
            </>
          )}
        </Button>
      </motion.form>
    </div>
  );
}
