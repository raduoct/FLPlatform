import { Box, Typography } from "@mui/material";

export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
