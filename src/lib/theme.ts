"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2f6f4e" },
    secondary: { main: "#bf5f45" },
    background: { default: "#f7f7f2", paper: "#ffffff" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 750 },
    h3: { fontWeight: 700 },
  },
});
