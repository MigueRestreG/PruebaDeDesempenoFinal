import { Container, Stack, Typography } from "@mui/material";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FavoriteGrid } from "@/components/FavoriteGrid";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";
import { getFavoritesByUser } from "@/services/favorite.service";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = await verifySessionToken(token);

  if (!user) {
    redirect("/login?redirect=/favorites");
  }

  const favorites = await getFavoritesByUser(user.id);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 900 }}>
          Tus favoritos
        </Typography>
        <Typography color="text.secondary">
          Recetas guardadas para volver a ellas cuando quieras.
        </Typography>
      </Stack>
      <ProtectedRoute>
        <FavoriteGrid favorites={favorites} />
      </ProtectedRoute>
    </Container>
  );
}