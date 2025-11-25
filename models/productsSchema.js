import mongoose from "mongoose";

const productCategories = [
  "Raw Materials",
  "Work In Progress",
  "Finished Goods",
  "Spare Parts",
  "Packaging Materials",
];

const ProductsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional for global products
    SKU: { type: String, required: true, trim: true, unique: true },
    barcode: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: productCategories,
      required: true,
      trim: true,
    },

    // köhnə model sahələri
    quantity: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    cost: { type: Number, default: 0 },
    location: { type: String, default: "" },

    // yeni model sahələri
    unitOfMeasure: {
      type: String,
      enum: ["kg", "g", "lb", "oz", "l", "ml", "pieces"],
      required: true,
      trim: true,
    },
    minStock: { type: Number, default: 0 },
    maxStock: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    storageLocation: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["Down", "Good"], default: "Good" },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Text index to support product search by name, SKU, barcode and category
ProductsSchema.index({ SKU: "text", barcode: "text", name: "text", category: "text" });

const Product = mongoose.model("Products", ProductsSchema);

export default Product;
