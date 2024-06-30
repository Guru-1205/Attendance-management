// ParentComponent.js
import React, { useState } from 'react';
import StudentList from './StudentList';

function ParentComponent(studentlist) {
    // Sample student data fetched from an API
    const [studentList, setStudentList] = useState(studentlist);
  

  // Initialize attendanceData with default values
  const initialAttendanceData = {};
  studentList.forEach((student) => {
    initialAttendanceData[student._id] = 'absent';
  });
  
  // State to manage the attendanceData
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);

  // Function to handle changes in attendanceData
  const handleAttendanceChange = (studentId, value) => {
    setAttendanceData((prevAttendanceData) => ({
      ...prevAttendanceData,
      [studentId]: value,
    }));
  };

  // Render StudentList component with necessary props
  return (
    <div>
      <h1>Student Attendance List</h1>
      <StudentList
        studentList={studentList}
        attendanceData={attendanceData}
        handleAttendanceChange={handleAttendanceChange}
      />
    </div>
  );
}

export default ParentComponent;
