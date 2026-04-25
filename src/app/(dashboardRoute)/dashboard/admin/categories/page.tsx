"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Loader2,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  Tag,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { getCategories, createCategory, deleteCategory } from "@/src/services/category";
import { toast, Toaster } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res?.success && res.data) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setCreating(true);
    try {
      const res = await createCategory({
        name: name.trim(),
        icon: icon.trim() || undefined,
        description: description.trim() || undefined,
      });

      if (res?.success) {
        toast.success(`Category "${name}" created successfully!`);
        setName("");
        setIcon("");
        setDescription("");
        setShowForm(false);
        await fetchCategories();
      } else {
        toast.error(res?.message || "Failed to create category.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? Tasks using this category may be affected.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await deleteCategory(id);
      if (res?.success) {
        toast.success(`Category "${categoryName}" deleted.`);
        await fetchCategories();
      } else {
        toast.error(res?.message || "Failed to delete category.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
            <FolderOpen className="w-3.5 h-3.5" />
            Administration
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white">
            Task Categories
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage the categories available for task posting.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className={`h-14 px-8 rounded-2xl font-black text-lg shadow-xl transition-all flex gap-2 ${
            showForm
              ? "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-300"
              : "bg-primary text-white shadow-primary/20 hover:scale-105"
          }`}
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" /> Cancel
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" /> New Category
            </>
          )}
        </Button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleCreate}
              className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border-2 border-primary/10 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white">
                  Create New Category
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Category Name *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Food Delivery"
                      required
                      className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                    Icon (emoji or text)
                  </label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="e.g. 🍔 or food"
                      className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short description of this category..."
                    className="h-12 pl-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none font-semibold text-black dark:text-white focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={creating}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 flex gap-3 transition-all"
              >
                {creating ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
                {creating ? "Creating..." : "Create Category"}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-black text-black dark:text-white">
            All Categories ({categories.length})
          </h3>
          <Button
            onClick={fetchCategories}
            variant="outline"
            size="sm"
            className="rounded-xl font-bold"
          >
            Refresh
          </Button>
        </div>

        {categories.length === 0 ? (
          <div className="p-20 text-center rounded-3xl border-4 border-dashed border-gray-100 dark:border-white/5">
            <FolderOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <p className="text-2xl font-bold text-gray-400 mb-2">No categories yet</p>
            <p className="text-muted-foreground">Create your first category to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                    {category.icon || "📁"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-lg font-black text-black dark:text-white truncate">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleDelete(category.id, category.name)}
                  disabled={deletingId === category.id}
                  variant="ghost"
                  className="shrink-0 ml-4 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                >
                  {deletingId === category.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
