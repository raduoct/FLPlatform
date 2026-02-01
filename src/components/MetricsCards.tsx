import { Box, Card, CardContent, Typography } from "@mui/material";

type Metrics = { f1?: number; auc?: number; sensitivity?: number; specificity?: number };

function metric(label: string, value?: number) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
          {value === undefined ? "—" : value.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function MetricsCards({ metrics }: { metrics?: Metrics }) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 2 }}>
      {metric("F1", metrics?.f1)}
      {metric("AUC", metrics?.auc)}
      {metric("Sensitivity", metrics?.sensitivity)}
      {metric("Specificity", metrics?.specificity)}
    </Box>
  );
}
