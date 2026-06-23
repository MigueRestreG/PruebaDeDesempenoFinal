"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const fullName = user ? `${user.name} ${user.lastName}`.trim() : "";

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: "1px solid #e2e0d7" }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <RestaurantMenuIcon color="primary" />
          <Typography variant="h6" component={Link} href="/" sx={{ fontWeight: 800, mr: "auto" }}>
            Recetario
          </Typography>
          <Button component={Link} href="/" startIcon={<HomeIcon />} color="inherit">
            Inicio
          </Button>
          <Button component={Link} href="/favorites" startIcon={<FavoriteIcon />} color="inherit">
            Favoritos
          </Button>
          {user ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">{fullName}</Typography>
              <Button onClick={handleLogout} startIcon={<LogoutIcon />} color="secondary">
                Salir
              </Button>
            </Box>
          ) : (
            <Button component={Link} href="/login" variant="contained">
              Entrar
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
