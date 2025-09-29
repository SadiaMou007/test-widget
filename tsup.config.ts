import { defineConfig } from "tsup";

export default defineConfig([
  // Library build: ESM + CJS, externalize deps
  {
    entry: { index: "src/index.tsx" },
    dts: true,
    format: ["esm", "cjs"],
    sourcemap: true,
    target: "es2018",
    splitting: false,
    clean: true,
    platform: "browser",
    treeshake: true,
    external: ["react", "react-dom", "react-hook-form"],
    env: { NODE_ENV: "production" },
  },
  // Standalone IIFE build: bundle everything and expose global
  {
    entry: { "v1/index.umd": "src/standalone.ts" },
    format: ["iife"],
    globalName: "DMWidgets",
    sourcemap: true,
    target: "es2018",
    splitting: false,
    clean: false,
    platform: "browser",
    treeshake: true,
    // Bundle all deps
    noExternal: ["react", "react-dom", "react-hook-form"],
    minify: true,
    env: { NODE_ENV: "production" },
    legacyOutput: true,
  },
]);
