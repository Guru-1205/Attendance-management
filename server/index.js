const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require('cors');
const Docxtemplater = require('docxtemplater');
const officegen = require('officegen');

const path = require('path');
const app = express();
const StudentModel = require('./models/Student1');
const AttendanceModel = require('./models/Attendance2');
app.use(express.json());
app.use(cors({ origin: ["http://localhost:3000", "https://mern-attendance-app.onrender.com"] }));
mongoose.connect('// add your mongodb connection url', {
    useNewUrlParser: true,
});

app.post('/form/insert', async (req, res) => {
    const {
        Name,
        Register_number,
        Year_of_studying,
        Branch_of_studying,
        Date_of_Birth,
        Gender,
        Community,
        Minority_Community,
        Blood_Group,
        Aadhar_number,
        Mobile_number,
        Email_id
    } = req.body;

    const student = new StudentModel({
        Name,
        Register_number,
        Year_of_studying,
        Branch_of_studying,
        Date_of_Birth,
        Gender,
        Community,
        Minority_Community,
        Blood_Group,
        Aadhar_number,
        Mobile_number,
        Email_id
    });

    try {
        await student.save();
        res.send('Inserted data successfully');
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/remove/getStudent/:registerNumber', async (req, res) => {
  const registerNumber = req.params.registerNumber;

  try {
    const student = await StudentModel.findOne({ Register_number: registerNumber });

    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/remove/delete/:registerNumber', async (req, res) => {
  const registerNumber = req.params.registerNumber;
  // console.log(registerNumber)

  try {
    // Find the student by register number and remove it
    // const removedStudent = await StudentModel.findOneAndRemove({ Register_number: registerNumber });
    const foundStudent = await StudentModel.findOne({ Register_number: registerNumber });
      const studentId = foundStudent._id;

      // Remove the student by ID
    const removedStudent = await StudentModel.findByIdAndRemove(studentId);

    if (removedStudent) {

      res.status(200).send('Student removed successfully');
    } else {

      res.status(404).send('Student not found');
    }
  } catch (error) {
    console.error('Error removing student:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/attendance', (req, res) => {
  const attendanceData = req.body.attendanceData;
  //const date = new Date().setHours(0, 0, 0, 0); // Get the current date with time set to midnight
  const fdate = new Date();
  fdate.setDate(fdate.getDate(), 1);

  var date = fdate.toISOString().split('T')[0];

  // Create attendance records for each student
  const attendanceRecords = attendanceData.map(data => ({
    studentId: data.studentId,
    attendance: data.attendance
  }));

  // Find or create the attendance document for the current date
  AttendanceModel.findOneAndUpdate(
    { date },
    { $set: { attendanceRecords } },
    { upsert: true, new: true }
  )
    .then(() => {
      res.status(200).send('Attendance recorded successfully');
    })
    .catch(error => {
      console.error('Error recording attendance:', error);
      res.status(500).send('Error recording attendance');
    });
});


// Endpoint to download attendance data for multiple dates as CSV
app.get('/data/download', (req, res) => {
  const startDate = new Date(req.query.start);
  const endDate = new Date(req.query.end);

  // Find the attendance records within the date range
  AttendanceModel.find({ date: { $gte: startDate, $lte: endDate } })
    .populate('attendanceRecords.studentId')
    .then(attendanceRecords => {
      if (attendanceRecords.length === 0) {
        return res.status(404).send('Attendance data not found');
      }
      // Extract unique dates and student names
      const uniqueDates = [...new Set(attendanceRecords.map(record => record.date.toISOString().split('T')[0]))];
const studentData = [...new Set(attendanceRecords.flatMap(record => record.attendanceRecords.map(r => r.studentId)))];

// Prepare attendance data for CSV
const csvData = studentData.map(student => {
  const rowData = {
    Name: student.Name,
    YearOfStudy: student.Year_of_studying || '', // Add null check
    Gender: student.Gender || '', // Add null check
  };

  uniqueDates.forEach(date => {
    const attendanceRecord = attendanceRecords.find(record => record.date.toISOString().split('T')[0] === date);

    // Add null checks
    if (attendanceRecord && attendanceRecord.attendanceRecords) {
      const attendance = attendanceRecord.attendanceRecords.find(r => r.studentId && r.studentId.Name === student.Name);
      rowData[date] = attendance ? attendance.attendance : '';
    } else {
      rowData[date] = '';
    }
  });

  return rowData;
});

// Create CSV header configuration
const csvHeader = [
  { id: 'Name', title: 'Name' },
  { id: 'YearOfStudy', title: 'Year of Study' },
  { id: 'Gender', title: 'Gender' },
  ...uniqueDates.map(date => ({ id: date, title: date })),
];


      // Create CSV writer
      const csvWriter = createCsvWriter({
        path: 'attendance.csv',
        header: csvHeader
      });

      // Write CSV data to file
      csvWriter
        .writeRecords(csvData)
        .then(() => {
          // Set response headers for file download
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
            
          // Stream the generated CSV file to the response
          fs.createReadStream('attendance.csv').pipe(res);
        })
        .catch(error => {
          console.error('Error writing CSV file:', error);
          res.status(500).send('Error generating attendance CSV');
        });
    })
    .catch(error => {
      console.error('Error downloading attendance data:', error);
      res.status(500).send('Error downloading attendance data');
    });
});

app.get('/read', async (req, res) => {
    try {
        const data = await StudentModel.find({});
      res.send(data);
    }
    catch (err) {
        console.log(err);
    }
});

app.get('/attendanceToday/:date', async (req, res) => {
  try {
    const dateParam = req.params.date;

    // Ensure that the date parameter matches the expected format
    if (!isValidDateFormat(dateParam)) {
      return res.status(400).send('Invalid date format. Use YYYY-MM-DD.');
    }

    // Find attendance records for the specified date
    const attendanceRecord = await AttendanceModel.findOne({ date: new Date(dateParam) });

    if (!attendanceRecord) {
      return res.status(404).send('Attendance data not found for the specified date.');
    }

    // Fetch student details for the attendance records
    const studentDetails = await StudentModel.find({
      _id: { $in: attendanceRecord.attendanceRecords.map(record => record.studentId) },
    });

    // Filter students based on present attendance
    const presentStudents = studentDetails.filter(studentDetail =>
      attendanceRecord.attendanceRecords.some(record =>
        record.studentId.equals(studentDetail._id) && record.attendance === 'present'
      )
    );

    // Create a new Word document
    const docx = officegen('docx');
    
    // Add a title
    const title = docx.createP();
    title.addText(`Attendance for ${dateParam}`, { font_face: 'Times New Roman', font_size: 14, bold: true });

    // Define table data and style
    const table = [
      [{
        val: "S.No",
        opts: {
          cellColWidth: 1000,
          b: true,
          sz: '20',
          spacingBefore: 120,
          spacingAfter: 120,
          spacingLine: 240,
          spacingLineRule: 'atLeast',
          shd: {
            fill: "7F7F7F",
            themeFill: "text1",
            "themeFillTint": "80"
          },
          fontFamily: "Avenir Book"
        }
      },{
        val: "Name",
        opts: {
          b: true,
          align: "center",
          cellColWidth: 4000,
          shd: {
            fill: "92CDDC",
            themeFill: "text1",
            "themeFillTint": "80"
          }
        }
      },{
        val: "Register Number",
        opts: {
          align: "center",
          vAlign: "center",
          cellColWidth: 2000,
          b: true,
          sz: '20',
          shd: {
            fill: "92CDDC",
            themeFill: "text1",
            "themeFillTint": "80"
          }
        }
      },{
        val: "Dept",
        opts: {
          align: "center",
          vAlign: "center",
          cellColWidth: 1500,
          b: true,
          sz: '20',
          shd: {
            fill: "92CDDC",
            themeFill: "text1",
            "themeFillTint": "80"
          }
        }
      },{
        val: "Year",
        opts: {
          align: "center",
          vAlign: "center",
          cellColWidth: 1000,
          b: true,
          sz: '20',
          shd: {
            fill: "92CDDC",
            themeFill: "text1",
            "themeFillTint": "80"
          }
        }
      }]
    ];

    // Add data to the table
    presentStudents.forEach((studentDetail, index) => {
      table.push([index + 1, studentDetail.Name, studentDetail.Register_number, studentDetail.Branch_of_studying, studentDetail.Year_of_studying]);
    });

    // Add the table to the document
    docx.createTable(table, {
      tableColWidth: 100,
      tableSize: 24,
      tableColor: "ada",
      tableAlign: "left",
      tableFontFamily: "Times New Roman",
      spacingBefore: 120,
      spacingAfter: 120,
      spacingLine: 240,
      spacingLineRule: 'atLeast',
      indent: 10,
      fixedLayout: true,
      borders: true,
      borderSize: 2,
      columns: [{ width: 1 }, { width: 1 }, { width: 42 }, { width: 20 }, { width: 20 }],
    });

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${dateParam}.docx`);

    // Stream the generated Word document to the response
    docx.generate(res);
  } catch (error) {
    console.error('Error generating and sending Word document:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to check if the date is in the format YYYY-MM-DD
function isValidDateFormat(date) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date);
}


// ... (your other routes and app.listen)

app.listen(3031, () =>
{
    console.log('server runningg....');
})
