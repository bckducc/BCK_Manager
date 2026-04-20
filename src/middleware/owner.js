const db = require("../models");

exports.invoice = async (req, res, next) => {
  const invoice = await db.invoices.findByPk(req.params.id);

  if (!invoice) {
    return res.status(404).json({ message: "Không tìm thấy hóa đơn" });
  }

  if (req.user.role === "landlord") {
    return next();
  }

  if (invoice.tenant_id !== req.user.id) {
    return res.status(403).json({
      message: "Không có quyền"
    });
  }

  next();
};