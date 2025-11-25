import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true, unique: true },
    location: { type: String, trim: true },
    phone: { type: String, trim: true, index: true },
    tin: { type: String, trim: true, index: true, sparse: true },
    segment: { type: String, trim: true },
    totalSales: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 🔹 Burada text index əlavə edirik
CustomerSchema.index({
  companyName: "text",
  contactPerson: "text",
  email: "text",
  location: "text",
  segment: "text",
});

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
