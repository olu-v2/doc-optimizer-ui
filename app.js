import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import serverlessExpress from "@vendia/serverless-express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve the Vite build output
app.use(express.static(join(__dirname, "dist")));

// SPA fallback — all routes return index.html
app.get("/{*path}", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

export const handler = serverlessExpress({ app });
