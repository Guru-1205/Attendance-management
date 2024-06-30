
---

# 📚 Attendance Management System

Hey everyone, it’s **Gc** here!

I'm thrilled to share an exciting update on our Attendance Management System. We've created a robust web application using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Firebase Authentication and Storage. This system streamlines the management of student attendance, making it easier than ever to track, update, and export attendance records.

**If you find this project helpful or interesting, please consider starring the repository on GitHub! Your support is greatly appreciated.**

Feel free to check out my other repositories:

 - [AutoDocMailer](https://github.com/Guru-1205/AutoDocMailer)
 - [EventTextGen](https://github.com/Guru-1205/EventTextGen)

## Table of Contents
- [👋 Introduction](#introduction)
- [✨ Features](#features)
- [🛠️ Technologies Used](#technologies-used)
- [🔧 Prerequisites](#prerequisites)
- [🚀 Installation](#installation)
- [📖 Usage](#usage)
- [📡 API Endpoints](#api-endpoints)
- [📂 Folder Structure](#folder-structure)
- [🤝 Contributing](#contributing)
- [📧 Contact](#contact)

## Introduction

The Attendance Management System is a web application built using the MERN stack (MongoDB, Express.js, React.js, Node.js) with Firebase Authentication and Storage. It provides a comprehensive solution for managing student attendance, adding or removing student data, and generating attendance reports.

## Features

- **🔐 User Authentication**: Securely register and login with email and password using Firebase Authentication. This ensures that only authorized personnel can access and manage the system.
  
- **📋 Manage Attendance**: 
  - **View Attendance**: Displays a list of all students with their names, register numbers, and images. 
  - **Search Students**: Quickly find students by their name.
  - **Update Attendance**: Admins can mark students as present or absent using radio buttons, updating their status multiple times throughout the day. The system maintains the attendance status for the current date, resetting it automatically at the start of each new day.

- **📝 Student Data Management**:
  - **Add Student**: Capture essential student information including name, register number, and image. Images are stored in Firebase Storage, renamed with the student's register number for unique identification.
  - **Delete Student**: Remove student records easily by entering their register number, which deletes both the record from MongoDB and the image from Firebase Storage.
  - **Retrieve Student**: Fetch student details by their register number.

- **📊 Export Attendance Data**:
  - **Excel Export**: Download attendance records between specified dates in Excel format. This report includes student names, gender, year, and their attendance records within the selected range.
  - **Word Export**: Download the current day's attendance in Word format, listing the names, departments, register numbers, and years of present students.

- **📱 Responsive Design**: The application is designed to work seamlessly across various devices, including desktops, tablets, and mobile phones.


## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage
- **Excel Export**: [csv-writer](https://www.npmjs.com/package/csv-writer) library
- **Word Export**: [officegen](https://www.npmjs.com/package/officegen) library

## Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or later)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Firebase Project](https://firebase.google.com/) (for Authentication and Storage)
- [Git](https://git-scm.com/)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Guru-1205/attendance-management-system.git
    cd attendance-management-system
    ```

2. **Backend Setup**:
    ```bash
    cd server
    npm install
    ```

    - Create a `.env` file in the `server` directory with the following environment variables:
      ```bash
      PORT=5000
      MONGO_URI=<your_mongo_db_connection_string>
      ```

    - Start the backend server:
      ```bash
      npm start
      ```

3. **Frontend Setup**:
    ```bash
    cd ../client
    npm install
    ```

    - Create a `.env` file in the `client` directory with the following environment variables:
      ```bash
      REACT_APP_FIREBASE_API_KEY=<your_firebase_api_key>
      REACT_APP_FIREBASE_AUTH_DOMAIN=<your_firebase_auth_domain>
      REACT_APP_FIREBASE_PROJECT_ID=<your_firebase_project_id>
      REACT_APP_FIREBASE_STORAGE_BUCKET=<your_firebase_storage_bucket>
      REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your_firebase_messaging_sender_id>
      REACT_APP_FIREBASE_APP_ID=<your_firebase_app_id>
      ```

    - Start the frontend development server:
      ```bash
      npm start
      ```

## Usage

1. **Login/Register**: Register a new user or login with existing credentials.
2. **Manage Attendance**: View the list of students and update their attendance.
3. **Add Student**: Use the "Add Student" feature to include new student data and their image.
4. **Delete Student**: Remove a student by their register number.
5. **Retrieve Student**: Fetch student details by their register number.
6. **Export Data**:
   - **Excel**: Export attendance records between selected dates.
   - **Word**: Download the current day's attendance.

## API Endpoints

### Authentication

- **Register User**: `POST /api/auth/register`
- **Login User**: `POST /api/auth/login`

### Students

- **Add Student**: `POST /form/insert`
  - **Request Body**:
    ```json
    {
        "Name": "John Doe",
        "Register_number": "12345",
        "Year_of_studying": "2",
        "Branch_of_studying": "CSE",
        "Date_of_Birth": "2000-01-01",
        "Gender": "Male",
        "Community": "General",
        "Minority_Community": "No",
        "Blood_Group": "O+",
        "Aadhar_number": "123456789012",
        "Mobile_number": "9876543210",
        "Email_id": "john.doe@example.com"
    }
    ```

- **Get Student**: `GET /remove/getStudent/:registerNumber`
  - **Response**:
    ```json
    {
        "_id": "60d1f5c8d6e5d435c8763e1a",
        "Name": "John Doe",
        "Register_number": "12345",
        "Year_of_studying": "2",
        "Branch_of_studying": "CSE",
        "Date_of_Birth": "2000-01-01",
        "Gender": "Male",
        "Community": "General",
        "Minority_Community": "No",
        "Blood_Group": "O+",
        "Aadhar_number": "123456789012",
        "Mobile_number": "9876543210",
        "Email_id": "john.doe@example.com"
    }
    ```

- **Delete Student**: `DELETE /remove/delete/:registerNumber`
  - **Response**:
    ```text
    Student removed successfully
    ```

### Attendance

- **Record Attendance**: `POST /attendance`
  - **Request Body**:
    ```json
    {
        "attendanceData": [
            {
                "studentId": "60d1f5c8d6e5d435c8763e1a",
                "attendance": "present"
            },
            {
                "studentId": "60d1f5c8d6e5d435c8763e1b",
                "attendance": "absent"
            }
        ]
    }
    ```

- **Export Attendance Data (Excel)**: `GET /data/download?start=2023-01-01&end=2023-12-31`
  - **Query Parameters**:
    - `start`: Start date of the range in `YYYY-MM-DD` format.
    - `end`: End date of the range in `YYYY-MM-DD` format.
  - **Response**: A downloadable CSV file containing the attendance data.

- **Download Today’s Attendance (Word)**: `GET /attendanceToday/:date`
  - **Query Parameter**:
    - `date`: Date in `YYYY-MM-DD` format.
  - **Response**: A downloadable Word document containing the attendance details of present students for the specified date.

### Students

- **Get All Students**: `GET /read`
  - **Response**:
    ```json
    [
      {
          "_id": "60d1f5c8d6e5d435c8763e1a",
          "Name": "John Doe",
          "Register_number": "12345",
          "Year_of_studying": "2",
          "Branch_of_studying": "CSE",
          "Date_of_Birth": "2000-01-01",
          "Gender": "Male",
          "Community": "General",
          "Minority_Community": "No",
          "Blood_Group": "O+",
          "Aadhar_number": "123456789012",
          "Mobile_number": "9876543210",
          "Email_id": "john.doe@example.com"
      },
      ...
    ]
    ```

## Folder Structure

```
attendance-management-system/
│
├── client/                # React frontend
│   ├── public/
│  

 └──

 src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       ├── index.js
│       └── ...
│
├── server/                # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── ...
│
├── .gitignore
├── README.md
└── ...
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contact

For any questions or suggestions, please reach out to:

- **Name**: Guru Charan K S 
- **Email**: premguru1045@gmail.com
- **GitHub**: [Guru-1205](https://github.com/Guru-1205)

---

Feel free to further customize the README according to your project's requirements and structure.

Happy coding 

**Cheers Gc**
