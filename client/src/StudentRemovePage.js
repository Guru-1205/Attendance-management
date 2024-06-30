import React, { useState } from 'react';
import Axios from 'axios';
import './StudentRemoval.css'; // Import your CSS file

const URL1 = process.env.REACT_APP_SERVER_URL;
const URL="https://mern-attendance-app-api.onrender.com"
const StudentRemovalForm = () => {
  const [registerNumber, setRegisterNumber] = useState('');
    const [studentDetails, setStudentDetails] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');

  const handleInputChange = (e) => {
    setRegisterNumber(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await Axios.get(`${URL}/remove/getStudent/${registerNumber}`);
      setStudentDetails(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setStudentDetails(null);
    }
  };

  const handleDelete = async () => {
    try {
      await Axios.delete(`${URL}/remove/delete/${registerNumber}`);
        console.log('Student removed successfully');
        setDeleteMessage("Student Removed successfully");

      // Clear the form data and search results
      setRegisterNumber('');
      setStudentDetails(null);
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  return (
    <div className="container">
      <h2>Student Removal Form</h2>
      <label>Enter Register Number:</label>
      <input type="text" value={registerNumber} onChange={handleInputChange} />
      <button onClick={handleSearch}>Search</button>

      {studentDetails && (
        <div>
          <h3>Student Details</h3>
          <table>
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{studentDetails.Name}</td>
              </tr>
              <tr>
                <td>Register Number:</td>
                <td>{studentDetails.Register_number}</td>
              </tr>
              <tr>
                <td>Year of Studying:</td>
                <td>{studentDetails.Year_of_studying}</td>
              </tr>
              <tr>
                <td>Branch of Studying:</td>
                <td>{studentDetails.Branch_of_studying}</td>
              </tr>
              <tr>
                <td>Date of Birth:</td>
                <td>{studentDetails.Date_of_Birth}</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{studentDetails.Gender}</td>
              </tr>
              <tr>
                <td>Community:</td>
                <td>{studentDetails.Community}</td>
              </tr>
              <tr>
                <td>Minority Community:</td>
                <td>{studentDetails.Minority_Community}</td>
              </tr>
              <tr>
                <td>Blood Group:</td>
                <td>{studentDetails.Blood_Group}</td>
              </tr>
              <tr>
                <td>Aadhar Number:</td>
                <td>{studentDetails.Aadhar_number}</td>
              </tr>
              <tr>
                <td>Mobile Number:</td>
                <td>{studentDetails.Mobile_number}</td>
              </tr>
              <tr>
                <td>Email ID:</td>
                <td>{studentDetails.Email_id}</td>
              </tr>
            </tbody>
          </table>
                  <button onClick={handleDelete}>Delete Student</button>
                  
        </div>
          )}
          {deleteMessage && <p>{deleteMessage}</p>}
    </div>
  );
};

export default StudentRemovalForm;
