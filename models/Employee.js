import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  leaveId: { type: String },
  leaveType: { type: String, enum: ["annual", "sick", "unpaid", "other"], default: "annual" },
  startDate: { type: Date },
  endDate: { type: Date },
  totalDaysRequested: { type: Number, default: 0 },
  daysUsed: { type: Number, default: 0 },
  daysRemaining: { type: Number, default: 0 },
  status: { type: String, enum: ["approved", "pending", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  reason :{ type: String },
  notes: { type: String }
});

const attendanceSchema = new mongoose.Schema({
  attendanceId: { type: String },
  date: { type: String },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { type: String, enum: ["present", "absent", "on_leave", "remote"], default: "present" },
  isLate: { type: Boolean, default: false },
  lateMinutes: { type: Number, default: 0 },
  lateType: { type: String, enum: ["voluntary", "involuntary", "other"], default: "other" }
});

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  position: { type: String },
companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  salary: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "on_leave", "terminated"], default: "active" },
  hireDate: { type: String },
  lateAllowed: { type: Number, default: 0 },
  isLate: { type: Boolean, default: false },
  lateMinutes: { type: Number, default: 0 },
  lateType: { type: String, enum: ["voluntary", "involuntary", "other"], default: "other" },
  onLeave: { type: Boolean, default: false },
  currentLeaveId: { type: String, default: null },
  leaves: [leaveSchema],
  attendances: [attendanceSchema],
  Department:{ type: String,},

}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
