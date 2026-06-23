import { Container } from "@mui/material";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Suspense fallback={null}>
        <AuthForm mode="register" />
      </Suspense>
    </Container>
  );
}