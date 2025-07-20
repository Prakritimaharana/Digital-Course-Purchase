const mongoose = require("mongoose");

const accessLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: Number,
    courseTitle: String,
    amount: String,
    paymentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("accessLog", accessLogSchema);
