const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Register_number: {
        type: String,
        required: true,
    },
    Year_of_studying: {
        type: String,
    },
    Branch_of_studying: {
        type:String,
    },
    Date_of_Birth: {
        type:String
    },
    Gender: {
        type:String
    },
    Community: {
        type:String
    },
    Minority_Community: {
        type:String
    },
    Blood_Group: {
        type:String
    },
    Aadhar_number: {
        type:String
    },
    Mobile_number: {
        type:String
    },
    Email_id: {
        type:String
    }

});
// Middleware to remove associated attendance records when a student is removed
StudentSchema.pre('findOneAndRemove', async function (next) {
    // Store the student ID before removal
    console.log(this._conditions);
    this._idToDelete = this._conditions._id;
    console.log(this._idToDelete);
    try {
    await mongoose.model('Attendance2').updateMany(
      {},
      { $pull: { 'attendanceRecords': { 'studentId': this._conditions._id } } }
    );
    next();
  } catch (error) {
    return next(error);
  }
  
});


const Student = mongoose.model("Student1", StudentSchema)
module.exports = Student;