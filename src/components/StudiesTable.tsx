import { Table, TableBody, TableCell, TableHead, TableRow, Chip, Box } from "@mui/material";
import { Study } from "../state/types";

export default function StudiesTable({ studies, onPick }: { studies: Study[]; onPick?: (id: string) => void }) {
  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Study</TableCell>
            <TableCell>Filename</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Split</TableCell>
            <TableCell align="right">Added</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studies.map(s => (
            <TableRow
              key={s.study_id}
              hover
              sx={{ cursor: onPick ? "pointer" : "default" }}
              onClick={() => onPick?.(s.study_id)}
            >
              <TableCell sx={{ fontFamily: "monospace" }}>{s.study_id}</TableCell>
              <TableCell>{s.filename}</TableCell>
              <TableCell>
                {s.label ? <Chip size="small" label={s.label} /> : <Chip size="small" variant="outlined" label="Unlabeled" />}
              </TableCell>
              <TableCell>{s.split ?? "-"}</TableCell>
              <TableCell align="right">{new Date(s.added_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
