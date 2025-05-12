import React from "react";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import Courses from "./components/Courses";
import AdminSignup from "./Admin/AdminSignup";
import AdminLogin from "./Admin/AdminLogin";
import Dashboard from "./Admin/Dashboard";
import CourseCreate from "./Admin/CourseCreate";
import UpdateCourse from "./Admin/UpdateCourse";
import OurCourses from "./Admin/OurCourses";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Other Routes */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/buy/:courseId" element={<Buy />} />
          <Route
            path="/purchases"
            element={user ? <Purchases /> : <Navigate to={"/login"} />}
          />

          {/* Admin Routes */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />}
          />
          <Route path="/admin/create-course" element={<CourseCreate />} />
          <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
          <Route path="/admin/our-courses" element={<OurCourses />} />
        </Routes>
        <Toaster />
      </div>
  );
}

export default App;
