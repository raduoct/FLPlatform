import { Box, Button, Card, CardContent, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import SectionHeader from "../components/SectionHeader";
import { useNodeState } from "../state/NodeState";

export default function FederatedPage() {
  const { fedPlan, fedRounds, pullFederatedPlan, trainAndSubmitFederated, jobs } = useNodeState();
  const fedJobs = jobs.filter(j => j.kind === "federated_submit" || j.kind === "pull_global");

  return (
    <Box>
      <SectionHeader title="Federated" subtitle="Pull a plan, train locally, submit an update (simulated)." />

      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={pullFederatedPlan}>
          Pull plan
        </Button>
        <Button variant="outlined" onClick={trainAndSubmitFederated} disabled={!fedPlan}>
          Train & submit update
        </Button>
      </Stack>

      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Current plan
          </Typography>
          {fedPlan ? (
            <Typography variant="body1" sx={{ fontWeight: 800, mt: 0.5 }}>
              Round {fedPlan.round_id} • Global model {fedPlan.global_model_id} • epochs {fedPlan.epochs} • lr {fedPlan.lr}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              No plan loaded. Click “Pull plan”.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Round history
      </Typography>

      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden", mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Round</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Decided</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fedRounds.map(r => (
              <TableRow key={r.round_id}>
                <TableCell sx={{ fontFamily: "monospace" }}>{r.round_id}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>{r.submitted_at ? new Date(r.submitted_at).toLocaleString() : "—"}</TableCell>
                <TableCell>{r.decided_at ? new Date(r.decided_at).toLocaleString() : "—"}</TableCell>
                <TableCell>{r.notes ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Federated jobs
      </Typography>
      <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 2 }}>
        {fedJobs.length ? (
          fedJobs.slice(0, 6).map(j => (
            <Typography key={j.job_id} variant="body2" sx={{ fontFamily: "monospace" }}>
              {j.job_id} • {j.kind} • {j.status} • {j.message}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            No federated jobs yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
