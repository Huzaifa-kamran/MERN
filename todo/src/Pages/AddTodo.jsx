import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import Navbar from '../Components/Navbar';

const AddTodo = () => {
  const [todoName, setTodoName] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategory = async () => {
    const response = await fetch('http://localhost:5000/category');
    const data = await response.json();
    setCategories(data);
  };

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!todoName || !category) {
      toast.error('Please fill out both fields');
      return;
    }

    const token = sessionStorage.getItem('token');
    const userId = decodeToken(token);
    if (!userId) {
      toast.error('Failed to decode token');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todoName: todoName,
          todoCat: category,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setTodoName('');
        setCategory('');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Add Todo</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="todoName" className="block text-sm font-medium text-gray-600">Todo Name</label>
              <input
                type="text"
                id="todoName"
                className="block w-full mt-2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the todo name"
                value={todoName}
                onChange={(e) => setTodoName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-600">Select Category</label>
              <select
                id="category"
                className="block w-full mt-2 p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.catName}>
                    {cat.catName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddTodo;
