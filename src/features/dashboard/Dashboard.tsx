import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import GetUserTasks from '../components/GetTasks';
import Typewriter from 'typewriter-effect';
import TasksSummary from './Charts';
import NotificationBell from '../NotificationBell/NotificationBell';
import type { Task } from '../types/Task';
import { FiLogOut } from "react-icons/fi";
import BACKEND_URL from '../../config.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------
  // Helper to get token from localStorage
  // -------------------------------
  const getToken = () => localStorage.getItem("token");

  // -------------------------------
  // Close menu if clicked outside
  // -------------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // -------------------------------
  // Fetch all tasks for charts
  // -------------------------------
  useEffect(() => {
    const fetchTasks = async () => {
      const token = getToken();
      if (!token) return; // optional: show toast

      try {
        const res = await axios.get(`${BACKEND_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        toast.error(err?.response?.data?.message || 'Failed to fetch tasks for charts');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // -------------------------------
  // Logout handler
  // -------------------------------
  const handleLogout = async () => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove token from localStorage
      localStorage.removeItem("token");

      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      toast.error(err?.response?.data?.message || 'Failed to log out');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="page-title">My Tasks</h1>

        <div className='align-items'>
          {/* Menu */}
          <div className="menu-wrapper" ref={menuRef}>
            <button
              className="menu-btn"
              onClick={() => setMenuOpen(prev => !prev)}
            >
              ☰
            </button>

            {menuOpen && (
              <div className="menu-dropdown">
                <div
                  className="menu-item logout-item"
                  onClick={handleLogout}
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <NotificationBell />
        </div>
      </div>

      {/* Typewriter Subtitle */}
      <h2 className="typewriter-title">
        <Typewriter
          options={{
            strings: [
              'Stay organized Stay productive.',
              'All your tasks, in one place.',
              'Plan Track Complete.',
            ],
            autoStart: true,
            loop: true,
            delay: 60,
            deleteSpeed: 40,
          }}
        />
      </h2>

      {/* Charts */}
      {!loading && tasks.length > 0 && <TasksSummary tasks={tasks} />}

      {/* Status Filter */}
      <div className="filter-wrapper">
        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <GetUserTasks statusFilter={statusFilter} />

      {/* Add Task Button */}
      <button
        className="fab-add-task"
        onClick={() => navigate('/dashboard/createTask')}
        aria-label="Add Task"
      >
        +
      </button>
    </div>
  );
}
