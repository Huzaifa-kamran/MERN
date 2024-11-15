import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Navbar';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [updatedTodo, setUpdatedTodo] = useState({ todoName: '', todoCat: '' });
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

  const fetchTodos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        toast.error('User not authenticated');
        return;
      }

      const decodedUserId = decodeToken(token);
      if (!decodedUserId) {
        setIsAuthenticated(false);
        toast.error('Failed to decode token');
        return;
      }

      setUserId(decodedUserId);

      const response = await fetch(`http://localhost:5000/todo/${decodedUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setTodos(data);
      } else {
        toast.error(data.error || 'Failed to fetch todos');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (todoId) => {
    try {
      const response = await fetch(`http://localhost:5000/update/${todoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        setCurrentTodo(data);
        setUpdatedTodo({ todoName: data.todoName, todoCat: data.todoCat });
        setShowModal(true);
      } else {
        toast.error(data.error || 'Failed to load todo');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/todo/${currentTodo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        toast.success('Todo updated successfully');
        setShowModal(false);
        fetchTodos();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update todo');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleDelete = async (todoId) => {
    try {
      const response = await fetch(`http://localhost:5000/todo/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Todo deleted successfully');
        fetchTodos();
      } else {
        toast.error(data.error || 'Failed to delete todo');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again later.');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchCategory();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 min-h-screen flex flex-col items-center p-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
          <div className="p-6">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">Your Todo List</h1>
            <div className="overflow-x-auto rounded-lg bg-zinc-900 shadow-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-300">
                <thead className="bg-blue-600 text-xs text-white uppercase">
                  <tr>
                    <th scope="col" className="px-6 py-3">Todo Name</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-400">No todos found.</td>
                    </tr>
                  ) : (
                    todos.map((todo, index) => (
                      <tr key={index} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-6 py-4">{todo.todoName}</td>
                        <td className="px-6 py-4">{todo.todoCat}</td>
                        <td className="px-6 py-4 flex space-x-4">
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            onClick={() => handleUpdate(todo._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            onClick={() => handleDelete(todo._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for updating a Todo */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Todo</h2>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <input
                  type="text"
                  value={updatedTodo.todoName}
                  onChange={(e) => setUpdatedTodo({ ...updatedTodo, todoName: e.target.value })}
                  className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Todo Name"
                />
                <div>
                  <label htmlFor="category" className="block mb-2 text-sm text-gray-600">Category</label>
                  <select
                    id="category"
                    value={updatedTodo.todoCat}
                    onChange={(e) => setUpdatedTodo({ ...updatedTodo, todoCat: e.target.value })}
                    className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.catName}>{cat.catName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default TodoList;
