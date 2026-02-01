import { Box, Typography } from "@mui/material";
import SectionHeader from "../components/SectionHeader";
import ModelsTable from "../components/ModelsTable";
import MetricsCards from "../components/MetricsCards";
import { useNodeState } from "../state/NodeState";

export default function ModelsPage() {
  const { models, promoteModel, rollbackTo } = useNodeState();
  const deployed = models.find(m => m.status === "deployed");

  return (
    <Box>
      <SectionHeader title="Models" subtitle="Local model list with promote/rollback (simulated governance)." />

      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
        Deployed model metrics
      </Typography>
      <MetricsCards metrics={deployed?.metrics} />

      <Box sx={{ mt: 2 }}>
        <ModelsTable models={models} onPromote={promoteModel} onRollback={rollbackTo} />
      </Box>
    </Box>
  );
}
