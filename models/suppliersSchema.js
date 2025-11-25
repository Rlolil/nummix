import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        companyName: { type: String, required: true, trim: true, unique: true },
        taxId: { type: String, required: true, trim: true, unique: true },
        contactName: { type: String, required: true, trim: true },
        phoneNumber: { type: String, required: true, trim: true },
        contactEmail: { type: String, required: true, trim: true, unique: true },
        address: { type: String, required: true, trim: true },

        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Add text index for supplier searchable fields
SupplierSchema.index({ companyName: "text", contactName: "text", address: "text" });

const Supplier = mongoose.model("Supplier", SupplierSchema);

export default Supplier;
