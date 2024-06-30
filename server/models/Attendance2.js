const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    unique: true
  },
  attendanceRecords: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student1',
        required: true
      },
      attendance: {
        type: String,
        enum: ['present', 'absent'],
        required: true
      }
    }
  ]
});
const Attendance2 = mongoose.model('Attendance2', attendanceSchema);
module.exports = Attendance2;