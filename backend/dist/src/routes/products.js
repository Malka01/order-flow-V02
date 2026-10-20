"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
const createProductSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(100),
    description: zod_1.z.string().trim().max(500).optional(),
    price: zod_1.z.number().positive().finite(),
    stock: zod_1.z.number().int().min(0).default(0),
});
// GET /api/products
router.get("/", async (_req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        console.error("Failed to fetch products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
});
// POST /api/products
router.post("/", async (req, res) => {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid product data",
            errors: result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    try {
        const product = await prisma_1.default.product.create({
            data: {
                name: result.data.name,
                description: result.data.description,
                price: result.data.price,
                stock: result.data.stock,
            },
        });
        return res.status(201).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        console.error("Failed to create product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
});
exports.default = router;
