import Link from "next/link";
import { useRouter } from "next/router";
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ImageIcon from "@mui/icons-material/Image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ScienceIcon from "@mui/icons-material/Science";
import HubIcon from "@mui/icons-material/Hub";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const items = [
  { href: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/studies", label: "Studies", icon: <ImageIcon /> },
  { href: "/inference", label: "Inference", icon: <PlayCircleIcon /> },
  { href: "/train", label: "Train", icon: <ScienceIcon /> },
  { href: "/federated", label: "Federated", icon: <HubIcon /> },
  { href: "/models", label: "Models", icon: <Inventory2Icon /> }
];

export default function Nav() {
  const router = useRouter();

  return (
    <Box
      sx={{
        width: 260,
        borderRight: "1px solid",
        borderColor: "divider",
        p: 2,
        bgcolor: "background.paper"
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Node Portal
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Federated PoC
      </Typography>

      <List sx={{ p: 0 }}>
        {items.map(it => {
          const selected = router.pathname === it.href;
          return (
            <Link key={it.href} href={it.href} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton selected={selected} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{it.icon}</ListItemIcon>
                <ListItemText primary={it.label} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Box>
  );
}
