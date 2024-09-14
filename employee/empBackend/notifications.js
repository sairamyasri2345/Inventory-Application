const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  employeeId: String,
  message: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
