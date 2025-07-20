const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const AccessLog = require("../models/accessLog");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create order route (required before Razorpay popup)
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_order_${Math.random() * 1000}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});


router.post("/verify", async (req, res) => {
  const { razorpay_payment_id, userId, courseId, courseTitle, amount } = req.body;

  try {
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (payment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment not captured" });
    }

    const access = new AccessLog({
      userId,
      courseId,
      courseTitle,
      amount,
      paymentId: razorpay_payment_id,
    });

    await access.save();

    res.status(200).json({ success: true, message: "Access granted" });
  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ success: false, message: "Internal error" });
  }
});

router.get("/access/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const access = await AccessLog.find({ userId }).select("courseId");
    const purchasedCourseIds = access.map((entry) => entry.courseId);
    res.status(200).json({ success: true, courseIds: purchasedCourseIds });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch access" });
  }
});


module.exports = router;
