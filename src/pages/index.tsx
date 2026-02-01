import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import SectionHeader from "../components/SectionHeader";
import JobsTable from "../components/JobsTable";
import MetricsCards from "../components/MetricsCards";
import { useNodeState } from "../state/NodeState";
import Link from "next/link";

export default function Dashboard() {
  const { node, jobs, models, fedRounds } = useNodeState();
  const deployed = models.find(m => m.status === "deployed");
  const lastRound = fedRounds[0];

  return (
    <Box>
      <SectionHeader title="Dashboard" subtitle="Node status, deployed model, and recent activity." />

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 2, mb: 2 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Node Health
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
              {node.healthy ? "Healthy" : "Down"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              Uptime: {Math.floor(node.uptime_sec / 3600)}h • Disk: {node.disk.used_gb}/{node.disk.total_gb} GB
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Deployed Model
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
              {deployed ? `${deployed.name} ${deployed.version}` : "None"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {deployed ? `Hash: ${deployed.hash}` : "Promote a candidate model to deploy."}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Federated
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
              {lastRound ? `${lastRound.round_id}` : "No rounds yet"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              {lastRound ? `Status: ${lastRound.status}` : "Pull a plan to start."}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
          Key metrics (deployed model)
        </Typography>
        <MetricsCards metrics={deployed?.metrics} />
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Link href="/inference" style={{ textDecoration: "none" }}>
          <Button variant="contained">Run inference</Button>
        </Link>
        <Link href="/train" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Start local training</Button>
        </Link>
        <Link href="/federated" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Federated</Button>
        </Link>
        <Link href="/models" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Models</Button>
        </Link>
      </Stack>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Recent jobs
      </Typography>
      <JobsTable jobs={jobs} />
    </Box>
  );
}
