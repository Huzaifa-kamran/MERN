import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './Pages/Login';
import './App.css';
import Register from './Pages/Register';
import TodoList from './Pages/TodoList';
import AddTodo from './Pages/AddTodo';
import ProfilePage from './Pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todolist" element={<TodoList/>} />
        <Route path="/addtodo" element={<AddTodo/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
