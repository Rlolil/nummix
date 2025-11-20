import Customer from "../models/customersSchema.js";
import Payment from "../models/paymentsSchema.js";

// Yeni payment yarat
export const createPayment = async (req, res) => {
  try {
    const { date, customerId, invoiceNumber, amount, method, status, type } =
      req.body;

    // Bütün sahələrin olub olmadığını yoxla
    if (
      !date ||
      !customerId ||
      !invoiceNumber ||
      !amount ||
      !method ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Customer yoxla
    const customer = await Customer.findOne({
      _id: customerId,
      userId: req.user?._id,
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    const newPayment = new Payment({
      userId: req.user?._id,
      date,
      customerId,
      invoiceNumber,
      amount,
      method,
      status,
      type: type || "outflow", // default type
    });

    const savedPayment = await newPayment.save();

    res.status(201).json({
      message: "Payment record created successfully",
      data: savedPayment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Bütün paymentləri al (search + userId qorunması)
export const getAllPayments = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";

    const payments = await Payment.find({
      userId: req.user?._id,
      $text: { $search: searchQuery },
    }).sort({ createdAt: -1 });

    if (!payments || !payments.length) {
      return res.status(404).json({ message: "No payments found." });
    }

    res.status(200).json({
      message: "Payments retrieved successfully",
      data: payments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// ID üzrə payment gətir
export const getSinglePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({ _id: id, userId: req.user?._id });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found." });
    }

    res.status(200).json({
      message: "Payment retrieved successfully",
      data: payment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Payment redaktə et
export const editPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({ _id: id, userId: req.user?._id });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    payment.date = req.body.date || payment.date;
    payment.invoiceNumber = req.body.invoiceNumber || payment.invoiceNumber;
    payment.amount = req.body.amount || payment.amount;
    payment.method = req.body.method || payment.method;
    payment.status = req.body.status || payment.status;
    payment.type = req.body.type || payment.type;

    if (req.body.customerId) {
      const customer = await Customer.findOne({
        _id: req.body.customerId,
        userId: req.user?._id,
      });
      if (!customer) {
        return res.status(404).json({ message: "Customer not found." });
      }
      payment.customerId = customer._id;
    }

    await payment.save();

    res.status(200).json({
      message: "Payment record updated successfully",
      data: payment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Payment status dəyiş
export const changePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOne({ _id: id, userId: req.user?._id });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    payment.isActive = !payment.isActive;
    await payment.save();

    res.status(200).json({
      message: "Payment record status updated successfully",
      data: payment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

// Payment statistikasını al
export const getPaymentStats = async (req, res) => {
  try {
    const totalOutflow = await Payment.aggregate([
      { $match: { type: "outflow", userId: req.user?._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalReceivable = await Payment.aggregate([
      { $match: { type: "receipt", userId: req.user?._id } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const overduePayments = await Payment.countDocuments({
      type: "outflow",
      status: "overdue",
      userId: req.user?._id,
    });

    const overdueReceivables = await Payment.countDocuments({
      type: "receipt",
      status: "overdue",
      userId: req.user?._id,
    });

    res.json({
      totalOutflow: totalOutflow[0]?.total || 0,
      totalReceivable: totalReceivable[0]?.total || 0,
      overduePayments,
      overdueReceivables,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Növbəti 7 gün üçün planlaşdırılmış ödənişlər
export const getNext7DaysSchedule = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const schedule = await Payment.find({
      dueDate: { $gte: today, $lte: nextWeek },
      userId: req.user?._id,
    }).sort({ dueDate: 1 });

    const formatted = schedule.map((p) => ({
      date: p.dueDate,
      customerId: p.customerId,
      type: p.type,
      amount: p.amount,
      urgent: p.dueDate < new Date() ? "Təcili" : null,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
