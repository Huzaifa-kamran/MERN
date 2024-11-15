import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode'; // Importing jwt-decode correctly

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleToast = (message, toastType) => {
    toastType === "danger" ? toast.error(message) : toast.success(message);
  };

  // Handle Login  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: username,
          userPassword: password,
        }),
      });

      const responseData = await response.json();

      if (responseData.error) {
        handleToast(responseData.error, "danger");
      }

      if (response.ok) {
        sessionStorage.setItem('token', responseData.token);
        handleToast(responseData.message, "success");
        setTimeout(() => {
          navigate('/todoList');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  
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
    <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-screen text-white flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
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
            Don't have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Register
            </Link>
          </div>

          <button
            type="submit"
            className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
