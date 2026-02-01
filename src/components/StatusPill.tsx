import { Chip } from "@mui/material";

export default function StatusPill({ ok }: { ok: boolean }) {
  return <Chip size="small" color={ok ? "success" : "error"} label={ok ? "Healthy" : "Down"} />;
}
