"use client";

import { use, useEffect, useState } from "react";
import { motion } from "motion/react";
import { FileText, Image as ImageIcon, Send, Loader2, ArrowLeft, Globe, BookOpen, Tag, X, Edit3 } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { getBlogById, updateBlog } from "@/src/services/blogs";
import { blogSchema, BlogValues } from "@/src/validation/blog.validation";
import Link from "next/link";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<BlogValues>({
    resolver: zodResolver(blogSchema),
  });

  const [tagInput, setTagInput] = useState("");
  const tags = watch("tags") || [];

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await getBlogById(id);
      if (res?.success) {
        // Prepare data for the form
        const { author, createdAt, updatedAt, publishedAt, id: blogId, viewCount, ...formData } = res.data;
        reset(formData);
      } else {
        toast.error("Failed to fetch blog data");
        router.push("/dashboard/admin/blogs");
      }
      setInitialLoading(false);
    };
    fetchBlog();
  }, [id, reset, router]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setValue("tags", [...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue("tags", tags.filter(tag => tag !== tagToRemove));
  };

  const title = watch("title");

  const generateSlug = () => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue("slug", slug);
    }
  };

  const onSubmit: SubmitHandler<BlogValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await updateBlog(id, data);

      if (res?.success) {
        toast.success("Blog post updated successfully!");
        router.push("/dashboard/admin/blogs");
      } else {
        toast.error(res?.message || "Failed to update blog post");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-16">
      <Toaster position="top-right" richColors />
      
      <div className="mb-8 flex items-center justify-between">
        <Link 
          href="/dashboard/admin/blogs" 
          className="flex items-center gap-2 text-muted-foreground hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
          <Edit3 className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-black dark:text-white">
            Edit Blog Post
          </h1>
          <p className="text-muted-foreground">
            Update your content and publish settings.
          </p>
        </div>
      </div>

      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 shadow-sm space-y-8">
            <div className="space-y-4">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Post Title</Label>
              <Input 
                {...register("title")}
                onBlur={generateSlug}
                placeholder="How to boost your productivity as a runner..."
                className={`h-14 px-6 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-bold text-lg focus:ring-2 focus:ring-primary/20 ${errors.title ? "ring-2 ring-red-500" : ""}`} 
              />
              {errors.title && <p className="text-red-500 text-xs ml-1 font-medium">{errors.title.message}</p>}
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Content (Markdown supported)</Label>
              <Textarea 
                {...register("content")}
                placeholder="Write your blog content here..."
                className={`min-h-[400px] px-6 py-6 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-medium focus:ring-2 focus:ring-primary/20 resize-none ${errors.content ? "ring-2 ring-red-500" : ""}`}
              />
              {errors.content && <p className="text-red-500 text-xs ml-1 font-medium">{errors.content.message}</p>}
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 shadow-sm space-y-8">
            <div className="space-y-4">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Excerpt (Short Summary)</Label>
              <Textarea 
                {...register("excerpt")}
                placeholder="A brief summary for the blog card..."
                className={`min-h-[100px] px-6 py-4 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-medium focus:ring-2 focus:ring-primary/20 resize-none ${errors.excerpt ? "ring-2 ring-red-500" : ""}`}
              />
              {errors.excerpt && <p className="text-red-500 text-xs ml-1 font-medium">{errors.excerpt.message}</p>}
            </div>
          </div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/5 shadow-sm space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-black dark:text-white">Publish Settings</h3>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL Slug</Label>
                <Input 
                  {...register("slug")}
                  className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm"
                />
                {errors.slug && <p className="text-red-500 text-xs font-medium">{errors.slug.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Category</Label>
                <select 
                  {...register("category")}
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="EARNING">Earning</option>
                  <option value="PRODUCTIVITY">Productivity</option>
                  <option value="SAFETY">Safety</option>
                  <option value="LIFESTYLE">Lifestyle</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Read Time (min)</Label>
                <Input 
                  {...register("readTimeMin", { valueAsNumber: true })}
                  type="number"
                  className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-bold"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</Label>
                <select 
                  {...register("status")}
                  className="w-full h-12 px-4 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
                <ImageIcon className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-black dark:text-white">Media</h3>
              </div>
              
              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cover Image URL</Label>
                <Input 
                  {...register("coverImage")}
                  placeholder="https://images.unsplash.com/..."
                  className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm"
                />
                {errors.coverImage && <p className="text-red-500 text-xs font-medium">{errors.coverImage.message}</p>}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-4">
                <Tag className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-black dark:text-white">Metadata & Tags</h3>
              </div>
              
              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tags (Press Enter)</Label>
                <div className="space-y-4">
                  <Input 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Add a tag..."
                    className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Title</Label>
                <Input 
                  {...register("metaTitle")}
                  placeholder="SEO Title..."
                  className="h-12 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Meta Description</Label>
                <Textarea 
                  {...register("metaDesc")}
                  placeholder="SEO Description..."
                  className="min-h-[80px] bg-gray-50 dark:bg-white/5 border-none rounded-xl font-medium text-sm p-4 resize-none"
                />
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Edit3 className="w-5 h-5" />
                )}
                {isSubmitting ? "Updating..." : "Update Post"}
              </Button>
            </div>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
