import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "El username debe tener al menos 3 caracteres")
  .max(24, "El username no puede superar los 24 caracteres")
  .regex(/^[a-zA-Z0-9_.]+$/, "Solo se permiten letras, números, punto y guion bajo");

const imagePathSchema = z
  .string()
  .trim()
  .refine(
    (value) => !value || value.startsWith("/") || /^https?:\/\//.test(value),
    "La imagen debe ser una ruta local válida o una URL completa."
  );

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Introduce un email válido"),
  username: usernameSchema,
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Introduce un email válido"),
  password: z.string().min(8, "La contraseña es obligatoria")
});

export const postSchema = z.object({
  content: z
    .string()
    .trim()
    .max(280, "El post no puede superar los 280 caracteres")
    .optional()
    .transform((value) => value ?? ""),
  imageUrl: imagePathSchema.optional().or(z.literal("")).transform((value) => value || null)
});

export const commentSchema = z.object({
  content: z.string().trim().min(1, "El comentario no puede estar vacío").max(180)
});

export const profileSchema = z.object({
  username: usernameSchema,
  bio: z.string().trim().max(180, "La bio no puede superar los 180 caracteres").default(""),
  avatarUrl: imagePathSchema.optional().or(z.literal("")).transform((value) => value || null)
});

export const searchSchema = z.object({
  q: z.string().trim().max(40).default("")
});
