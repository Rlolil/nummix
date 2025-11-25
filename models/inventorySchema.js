import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        SKU: { type: String, required: true, trim: true, unique: true },
        product: { type: String, required: true, trim: true },
        warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouses", required: true },
        localtion: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, default: 0 },
        cost: { type: Number, required: true, default: 0 },
        totalValue: { type: Number, required: true, default: 0 },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Add text index for SKU, product and location to support $text searches
InventorySchema.index({ SKU: "text", product: "text", localtion: "text" });

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
