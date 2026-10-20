
import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "OrderFlow API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`OrderFlow API running at http://localhost:${PORT}`);
});
