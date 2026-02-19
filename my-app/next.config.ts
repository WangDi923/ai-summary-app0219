import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // When a workspace has multiple lockfiles Next.js can guess the wrong
  // root directory for Turbopack, which leads to module resolution errors
  // (e.g. missing `tailwindcss` in the parent folder).
  //
  // Explicitly set the root to the current project so that all imports are
  // resolved from `my-app` instead of `/workspaces/ai-summary-app0219`.
  turbopack: {
    root: "./",
  },
};

export default nextConfig;
