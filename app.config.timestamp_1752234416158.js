// app.config.ts
import { defineConfig } from "@tanstack/react-start";
import viteTsConfigPaths from "vite-tsconfig-paths";
var app_config_default = defineConfig({
  tsr: {
    appDirectory: "src"
  },
  server: {
    preset: "netlify"
  },
  vite: {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ["./tsconfig.json"]
      })
    ]
  }
});
export {
  app_config_default as default
};
