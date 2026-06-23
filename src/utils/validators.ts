import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres."),
  email: z.email("Ingresa un email valido."),
  password: z.string().min(6, "La contrasena debe tener al menos 6 caracteres."),
  confirmPassword: z.string().min(1, "Confirma tu contrasena."),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Las contrasenas no coinciden.",
});

export const loginSchema = z.object({
  email: z.email("Ingresa un email valido."),
  password: z.string().min(1, "La contrasena es obligatoria."),
});

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Id invalido.");

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
