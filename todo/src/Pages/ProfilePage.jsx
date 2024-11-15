import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // token DEcode 
  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.id; 
    } catch (error) {
      console.error("Error decoding token", error);
      return null;
    }
  };

  // Fetch user data
  const fetchUser = async () => {
    try {
      const userId = decodeToken(sessionStorage.getItem('token'));
      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: 'GET',
      });
      const data = await response.json();

      if (response.ok) {
        setUser(data); 
      } else {
        toast.error(data.error || 'Failed to load user data');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error:', error);
    }
  };

  // Handle Logout 
  const handleLogout = () => {
    sessionStorage.removeItem('token'); 
    navigate('/login');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (user === null) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 h-screen text-white flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Profile</h1>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-medium text-gray-700">User Name:</h2>
              <p className="text-lg text-gray-800">{user.userName}</p>
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-700">Email:</h2>
              <p className="text-lg text-gray-800">{user.userEmail}</p>
            </div>

            <div>
              <h2 className="text-xl font-medium text-gray-700">Age:</h2>
              <p className="text-lg text-gray-800">{user.userAge}</p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleLogout}
                className="w-full px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
