import { Box, FormControlLabel, Slider, Switch, Typography } from "@mui/material";
import { useMemo, useState } from "react";

export default function StudyViewer({ baseUrl, overlayUrl }: { baseUrl: string; overlayUrl?: string }) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [opacity, setOpacity] = useState(55);

  const overlayOpacity = useMemo(() => opacity / 100, [opacity]);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <FormControlLabel
          control={<Switch checked={showOverlay} onChange={e => setShowOverlay(e.target.checked)} />}
          label="Overlay (Grad-CAM)"
        />
        <Box sx={{ width: 220, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Opacity
          </Typography>
          <Slider size="small" value={opacity} onChange={(_, v) => setOpacity(v as number)} />
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          maxHeight: 520,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider"
        }}
      >
        {/* base */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={baseUrl} alt="study" style={{ width: "100%", display: "block" }} />
        {/* overlay */}
        {overlayUrl && showOverlay && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={overlayUrl}
            alt="overlay"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: overlayOpacity,
              mixBlendMode: "multiply"
            }}
          />
        )}
      </Box>
    </Box>
  );
}
