import { z } from "zod";

export const postTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  offerPrice: z.number().positive("Offer price must be a positive number"),
  categoryId: z.string().uuid("Please select a valid category"),
  executionDate: z.string().min(1, "Execution date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  location: z.string().min(5, "Location address is required"),
});

export type PostTaskValues = z.infer<typeof postTaskSchema>;
