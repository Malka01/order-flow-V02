"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const products_1 = __importDefault(require("./routes/products"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use((0, cors_1.default)({ origin: FRONTEND_URL }));
app.use(express_1.default.json());
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "OrderFlow API is running!",
        timestamp: new Date().toISOString(),
    });
});
app.use("/api/products", products_1.default);
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
app.listen(PORT, () => {
    console.log(`OrderFlow API running at http://localhost:${PORT}`);
});
