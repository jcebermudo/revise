import { z } from "zod";

export const UsernameSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters").max(10, "Username must be at most 10 characters")
  })

export type TUsernameSchema = z.infer<typeof UsernameSchema>;