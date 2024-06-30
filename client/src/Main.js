import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import StudentFormPage from "./StudentFormPage";
import StudentRemovalForm from "./StudentRemovePage";
import Login from "./Login";
import { ProtectedRoute } from "./component/ProtectedRoute";
import App from "./App";
import AttendanceDownload from "./AttendanceDownload";
// import { ProtectedRoute } from "./components/protectedRoute";
// import { Home } from "./pages/home";
// import { Private } from "./pages/private";

// import "./App.css";
import { useEffect, useState } from "react";

function Main() {
  const [user, setUser] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsFetching(false);
        return;
      }

      setUser(null);
      setIsFetching(false);
    });
    return () => unsubscribe();
  }, []);

  if (isFetching) {
    return <h2>Loading...</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>
              <Route exact path="/" element={<Login user={user} />}></Route>
              
        <Route exact path="/home" element={<ProtectedRoute user={user}><App></App></ProtectedRoute>}></Route>
        <Route exact path="/form" element={<ProtectedRoute user={user}><StudentFormPage></StudentFormPage></ProtectedRoute>}></Route>
        <Route exact path="/remove" element={<ProtectedRoute user={user}><StudentRemovalForm></StudentRemovalForm></ProtectedRoute>}></Route>
        <Route exact path="/data" element={<ProtectedRoute user={user}><AttendanceDownload></AttendanceDownload></ProtectedRoute>}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default Main;