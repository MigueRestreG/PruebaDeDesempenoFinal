"use client";

import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, registerSchema } from "@/utils/validators";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      if (mode === "register") {
        const name = String(formData.get("name"));
        const lastName = String(formData.get("lastName"));
        const confirmPassword = String(formData.get("confirmPassword"));
        registerSchema.parse({ name, lastName, email, password, confirmPassword });
        await register(name, lastName, email, password, confirmPassword);
      } else {
        loginSchema.parse({ email, password });
        await login(email, password);
      }
      router.push(searchParams.get("redirect") ?? "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la accion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ maxWidth: 440, mx: "auto", p: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h4">{mode === "register" ? "Crear cuenta" : "Iniciar sesion"}</Typography>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {mode === "register" ? <TextField name="name" label="Nombre" required /> : null}
        {mode === "register" ? <TextField name="lastName" label="Apellido" required /> : null}
        <TextField name="email" label="Email" type="email" required />
        <TextField name="password" label="Contrasena" type="password" required />
        {mode === "register" ? <TextField name="confirmPassword" label="Confirmar contrasena" type="password" required /> : null}
        <Button type="submit" variant="contained" disabled={isSubmitting} size="large">
          {mode === "register" ? "Registrarme" : "Entrar"}
        </Button>
        <Box>
          <Button href={mode === "register" ? "/login" : "/register"}>
            {mode === "register" ? "Ya tengo cuenta" : "Crear cuenta"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
