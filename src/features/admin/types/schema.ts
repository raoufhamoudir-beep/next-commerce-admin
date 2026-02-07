import { z } from "zod";

export const formSchema = z.object({
  storeName: z.string().min(3, { message: "Store name must be at least 3 characters" }),
  domain: z
    .string()
    .min(3, { message: "Domain must be at least 3 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Only lowercase letters, numbers, and hyphens allowed" }),
  color: z.string().min(4, { message: "Please select a brand color" }),
  logo: z.any().optional(), 
});

export type FormValues = z.infer<typeof formSchema>;