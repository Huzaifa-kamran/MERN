import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode'; // Importing jwt-decode correctly

const Register = () => {
  // State variables for each input field
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');

  const handleToast = (message, toastType) => {
    toastType === "danger" ? toast.error(message) : toast.success(message);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        userName: username,
        userEmail: email,
        userAge: age,
        userPassword: password,
      };
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const responseData = await response.json();

      if (responseData.error) {
        handleToast(responseData.error, "danger");
      }

      if (response.ok) {
        handleToast(responseData.message+". Please login to continue.", "success");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      handleToast("Registration failed", "danger");
    }
  };

  const navigate = useNavigate();

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const userId = decodeToken(token);
    if (userId) {
      navigate('/todoList');
    }
  }, [navigate]);

  return (
    <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-3 text-white flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">User Name</label>
            <input
              type="text"
              id="username"
              className="block w-full mt-2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Your Email</label>
            <input
              type="email"
              id="email"
              className="block w-full mt-2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-600">Your Age</label>
            <input
              type="number"
              id="age"
              className="block w-full mt-2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Your Password</label>
            <input
              type="password"
              id="password"
              className="block w-full mt-2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>

          <button
            type="submit"
            className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
