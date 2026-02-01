import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../styles/theme";
import { NodeStateProvider } from "../state/NodeState";
import AppLayout from "../components/AppLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NodeStateProvider>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </NodeStateProvider>
    </ThemeProvider>
  );
}
