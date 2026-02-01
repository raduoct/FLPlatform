import { AppBar, Box, Chip, Toolbar, Typography } from "@mui/material";
import { useNodeState } from "../state/NodeState";
import StatusPill from "./StatusPill";

export default function TopBar() {
  const { node, models } = useNodeState();
  const deployed = models.find(m => m.status === "deployed");

  return (
    <AppBar position="static" elevation={0} color="transparent" sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Node: {node.node_id}
          </Typography>
          <StatusPill ok={node.healthy} />
          {node.gpu?.available && <Chip size="small" label={`GPU: ${node.gpu.name}`} />}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {deployed ? (
            <Chip size="small" variant="outlined" label={`Deployed: ${deployed.name} ${deployed.version} (${deployed.hash})`} />
          ) : (
            <Chip size="small" color="warning" label="No deployed model" />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
