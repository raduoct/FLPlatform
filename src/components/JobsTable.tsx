import { Chip, Table, TableBody, TableCell, TableHead, TableRow, Typography, Box } from "@mui/material";
import { Job } from "../state/types";

function statusColor(s: Job["status"]) {
  if (s === "succeeded") return "success";
  if (s === "failed") return "error";
  if (s === "running") return "info";
  return "default";
}

export default function JobsTable({ jobs }: { jobs: Job[] }) {
  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Job</TableCell>
            <TableCell>Kind</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Message</TableCell>
            <TableCell align="right">Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.slice(0, 8).map(j => (
            <TableRow key={j.job_id}>
              <TableCell>
                <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                  {j.job_id}
                </Typography>
              </TableCell>
              <TableCell>{j.kind}</TableCell>
              <TableCell>
                <Chip size="small" color={statusColor(j.status) as any} label={j.status} />
              </TableCell>
              <TableCell>{j.message ?? "-"}</TableCell>
              <TableCell align="right">{new Date(j.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
