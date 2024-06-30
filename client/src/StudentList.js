import React, { useState, useEffect } from 'react';
import './StudentList.css';
import Axios from 'axios';
import { storage } from "./firebase";
import { listAll,getDownloadURL } from 'firebase/storage';
import { ref } from 'firebase/storage';

import SearchComponent from './SearchComponent';
const URL1 = process.env.REACT_APP_SERVER_URL;
const URL="https://mern-attendance-app-api.onrender.com"
function StudentList({ studentList, attendanceData, handleAttendanceChange }) {
  const [searchResults, setSearchResults] = useState(studentList);
  const [defaultAttendanceData, setDefaultAttendanceData] = useState({});
  const [fileUrls, setFileUrls] = useState({});
  const imageListRef = ref(storage, "images/");
  const urls = {};
  useEffect(() => {
  const defaultData = {};
  studentList.forEach((student) => {
    defaultData[student._id] = 'absent';
  });
  setDefaultAttendanceData(defaultData);

  const fetchFileUrls = async () => {
    try {
      const response = await listAll(imageListRef);
      

      await Promise.all(
        response.items.map(async (item) => {
          try {
            const url = await getDownloadURL(item);
            console.log(item.name);
            console.log(url);
            urls[item.name] = url;
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        })
      );

      // Now you can set the file URLs after fetching them
      setFileUrls(urls);
      setFileUrls((prevUrls) => ({ ...prevUrls, ...urls }));
      console.log(urls);
    } catch (error) {
      console.error('Error listing items:', error);
    }
    
  };

  // Invoke the fetchFileUrls function without parentheses
  fetchFileUrls();
}, [studentList]);



  useEffect(() => {
    // Apply default attendance data when the component mounts
    setDefaultAttendanceData((prevDefaultData) => ({
      ...prevDefaultData,
      ...attendanceData,
    }));
  }, [attendanceData]);
  const handleUpdateAttendance = () => {
  // Create an array for default values
  const defaultAttendanceArray = Object.keys(defaultAttendanceData).map((studentId) => ({
    studentId,
    attendance: 'absent',
  }));

  // Combine default values with updated values
    const combinedAttendanceArray = [
      ...defaultAttendanceArray,
      ...Object.entries(attendanceData).map(([studentId, attendance]) => ({
        studentId,
        attendance,
      }))
    ];
    const resultMap = new Map();

// Iterate over the array in reverse order to keep the last occurrence
for (let i = combinedAttendanceArray.length - 1; i >= 0; i--) {
  const item = combinedAttendanceArray[i];
  // Set the item in the map only if the key (studentId) is not already present
  if (!resultMap.has(item.studentId)) {
    resultMap.set(item.studentId, item);
  }
}
    const uniqueLastOccurrenceList = Array.from(resultMap.values());

  Axios.post(`${URL}/attendance`, { attendanceData: uniqueLastOccurrenceList })
    .then(() => {
      console.log('Attendance recorded successfully');
    })
    .catch((error) => {
      console.error('Error recording attendance:', error);
    });
  };
  const [downloadDate, setdownloadDate] = useState('');
  const handleInputChange = (event) => {
    setdownloadDate(event.target.value);
  }
  const handleDownloadToday = () => {
    console.log(downloadDate);
    // Axios.get(`${URL}/attendanceToday/${downloadDate}`).then(() => {
    //   console.log('attendance downloaded');
    // }).catch((error) => {
    //   console.error('error :', error);
    // });
    Axios.get(`${URL}/attendanceToday/${downloadDate}`, {
      responseType: 'arraybuffer',
    })
    .then(response => {
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
    .catch(error => {
      console.log(error);
    });
  }
  const handleSearch = (results) => {
    setSearchResults(results);
  
  };

  return (
    <div className="StudentList">
      <SearchComponent
        data={studentList}
        searchKey="Name"
        setSearchResults={handleSearch}
      />

      <table>
        <thead>
          <tr>
            
            <th style={{ textAlign: 'center' }}>Name</th>
            <th style={{textAlign:'center'}}>Photo</th>
            <th style={{ textAlign: 'center' }}>Register Number</th>
            <th style={{ textAlign: 'center' }}>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {console.log(fileUrls)}{searchResults.map((student) => (
            <tr key={student._id}>
              <td>{student.Name}</td>
              <td>
                <div>
                  
                  {fileUrls[student.Register_number] && (
                    <img
                      src={fileUrls[student.Register_number] }
                      alt={`Photo of ${student.Register_number}`}
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                
                  )}
                  {<p>{urls[student.Register_number]}</p>}
                  
                  </div>
              </td>
              <td>{student.Register_number}</td>
              <td>
                <div className="attendance-container">
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      value="present"
                      checked={defaultAttendanceData[student._id] === 'present'}
                      onChange={() =>
                        handleAttendanceChange(student._id, 'present')
                      }
                    />
                    Present
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`attendance-${student._id}`}
                      value="absent"
                      checked={defaultAttendanceData[student._id] === 'absent'}
                      onChange={() =>
                        handleAttendanceChange(student._id, 'absent')
                      }
                   />
                    Absent
                  </label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="UpdateButton" onClick={handleUpdateAttendance}>
          Update
      </button>
      <input type="text" value={downloadDate} onChange={handleInputChange}/>
      <button className="downloadTodayAttendance" onClick={handleDownloadToday}>Download</button>
    </div>
  );
}

export default StudentList;
