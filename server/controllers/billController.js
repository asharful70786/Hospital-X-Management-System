import Bill from "../Models/Bill.js";

export const createBill = async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    await newBill.save();
    res.status(201).json({ message: "Bill created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTodayCollection = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const bills = await Bill.aggregate([
      { $match: { createdAt: { $gte: today }, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    res.json({ totalToday: bills[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonthlyCollection = async (req, res) => {
  const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  try {
    const bills = await Bill.aggregate([
      { $match: { createdAt: { $gte: start }, isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    res.json({ totalThisMonth: bills[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDepartmentWiseBills = async (req, res) => {
  try {
    const bills = await Bill.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "patient",
          foreignField: "_id",
          as: "patientInfo"
        }
      },
      { $unwind: "$patientInfo" },
      {
        $lookup: {
          from: "departments",
          localField: "patientInfo.department",
          foreignField: "_id",
          as: "departmentInfo"
        }
      },
      { $unwind: "$departmentInfo" },
      {
        $group: {
          _id: "$departmentInfo.name",
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDailyIncome = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      {
        $match: { isPaid: true }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          total: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /bills/payment-mode-summary
export const getPaymentModeSummary = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: "$paymentMode",
          total: { $sum: "$totalAmount" }
        }
      }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getMonthlyBillingTrend = async (req, res) => {
  try {
    const result = await Bill.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$totalAmount" }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" }
                ]
              }
            ]
          },
          total: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

