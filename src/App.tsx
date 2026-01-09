import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// import socketIOClient from 'socket.io-client';

import Register from './Register/Register';
import Login from './Login/Login';
import NotFound from './NotFound/NotFound';
import CreateTask from './features/forms/CreateTask';
import EditTask from './features/forms/EditTask';
import Dashboard from './features/dashboard/Dashboard';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ResetPassword/ResetPassword';


const ENDPOINT = "http://localhost:5402"; // your backend URL

function App() {
  // const [overdueTasks, setOverdueTasks] = useState<any[]>([]);

  // useEffect(() => {
  //   const socket = socketIOClient(ENDPOINT);

  //   // Listen for overdue tasks from backend
  //   socket.on("overdueTasks", (tasks: any[]) => {
  //     setOverdueTasks(tasks);
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Toaster position="top-right" />
        
        {/* Notification component always active */}
       

        <Routes>
          
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/createTask" element={<CreateTask />} />
          <Route path="/dashboard/editTask/:id" element={<EditTask />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      
    
      </BrowserRouter>
    </>
  );
}

export default App;
