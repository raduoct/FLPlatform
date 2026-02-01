import { Box, Button, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import StudiesTable from "../components/StudiesTable";
import { useNodeState } from "../state/NodeState";
import { useRouter } from "next/router";

export default function StudiesPage() {
  const { studies, uploadStudiesMock } = useNodeState();
  const [q, setQ] = useState("");
  const router = useRouter();

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return studies;
    return studies.filter(s => (s.study_id + s.filename + (s.label ?? "")).toLowerCase().includes(qq));
  }, [q, studies]);

  return (
    <Box>
      <SectionHeader title="Studies" subtitle="Manage local studies (PoC). Click a row to run inference." />

      <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
        <TextField value={q} onChange={e => setQ(e.target.value)} size="small" placeholder="Search studies..." />
        <Button variant="contained" onClick={() => uploadStudiesMock(4)}>
          Mock upload (add 4)
        </Button>
      </Stack>

      <StudiesTable
        studies={filtered}
        onPick={(study_id) => router.push(`/inference?study_id=${encodeURIComponent(study_id)}`)}
      />
    </Box>
  );
}
