import { Box, Button, Chip, Stack, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { ModelSummary } from "../state/types";

export default function ModelsTable({
  models,
  onPromote,
  onRollback
}: {
  models: ModelSummary[];
  onPromote: (id: string) => void;
  onRollback: (id: string) => void;
}) {
  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Model</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Metrics</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models.map(m => (
            <TableRow key={m.model_id}>
              <TableCell>
                <div style={{ fontFamily: "monospace" }}>{m.model_id}</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.6)" }}>
                  {m.name} {m.version} ({m.hash})
                </div>
              </TableCell>
              <TableCell>{m.origin}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={m.status}
                  color={m.status === "deployed" ? "success" : m.status === "candidate" ? "info" : "default"}
                />
              </TableCell>
              <TableCell>
                {m.metrics ? `F1 ${m.metrics.f1?.toFixed(2)} • AUC ${m.metrics.auc?.toFixed(2)}` : "—"}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" onClick={() => onRollback(m.model_id)}>
                    Rollback
                  </Button>
                  <Button size="small" variant="contained" onClick={() => onPromote(m.model_id)} disabled={m.status === "deployed"}>
                    Promote
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
