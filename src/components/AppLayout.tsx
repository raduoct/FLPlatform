import { Box } from "@mui/material";
import Nav from "./Nav";
import TopBar from "./TopBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Nav />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <Box component="main" sx={{ p: 3, flex: 1, bgcolor: "background.default" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
