import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import { useState } from "react";
import axios from "axios";
import  BACKEND_URL  from "../utilts/utilts";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}users/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          Headers: {
            "content-type": " application/json",
          },
        }
      );
      console.log("Signup Successful", response.data);
      toast.success(response.data.message)
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Signup failed!");
      }
    }
  };
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900">
        {/* Header */}
        <header className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-orange-500 font-bold">
              Vidya Niketan
            </h1>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              to="/login"
              className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-black hover:py-1 hover:px-2 duration-300"
            >
              Login
            </Link>
            <Link
              to="/"
              className="bg-transparent text-white py-2 px-4 border border-white rounded hover:bg-black hover:py-1 hover:px-2 duration-300"
            >
              Join Now
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow flex items-center justify-center">
          <div className="p-8 rounded-2xl shadow-lg w-full max-w-md bg-opacity-50 bg-gray-800 backdrop-blur-md border border-gray-700 transform scale-95 hover:scale-100 transition-all duration-500 ease-in-out">
            {/* Form heading */}
            <h2 className="text-3xl font-bold text-center text-white mb-6 animate-fadeIn">
              Welcome to <span className="text-orange-500">Vidya Niketan</span>
            </h2>
            <p className="text-center text-gray-400 mb-6 animate-fadeIn">
              Join us today with a quick signup!
            </p>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div className="relative">
                <label htmlFor="firstname" className="block text-gray-400 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500 transition-all duration-300"
                  placeholder="Your first name"
                />
              </div>

              {/* Last Name */}
              <div className="relative">
                <label htmlFor="lastname" className="block text-gray-400 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500 transition-all duration-300"
                  placeholder="Your last name"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="email" className="block text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-300"
                  placeholder="name@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label htmlFor="password" className="block text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-500 transition-all duration-300"
                  placeholder="***********"
                  required
                />
                <span className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-white transition">
                  👁️
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 text-red-500 text-center animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-blue-500 text-white py-3 px-6 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Signup
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
};

export default Signup;
