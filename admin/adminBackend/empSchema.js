const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
