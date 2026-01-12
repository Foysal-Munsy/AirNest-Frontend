import { z } from "zod";
export const registrationSchema = z.object({
  username: z
    .string()
    .min(4, "username must be at least 4 characters")
    .max(100),
  email: z.email(),
  fullname: z
    .string()
    .min(4, "fullname must be at least 4 characters")
    .max(150),
  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .max(100),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(4, "username must be at least 4 characters")
    .max(100),
  password: z
    .string()
    .min(6, "password must be at least 6 characters")
    .max(100),
});
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
