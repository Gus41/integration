import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
  productCode: String,
  quantity: Number,
  unitPrice: Number,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Sale || mongoose.model("Sale", SaleSchema);