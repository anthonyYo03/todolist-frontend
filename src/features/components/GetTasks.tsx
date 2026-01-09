import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import '../dashboard/Dashboard.css';
import type { Task } from '../types/Task';
import DeleteUserTask from './DeleteTasks';
import BACKEND_URL from '../../config.js';
type GetUserTasksProps = {
  statusFilter: string;
};

// Component to fetch and display tasks
const GetUserTasks = ({ statusFilter }: GetUserTasksProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to check if task is overdue
  const isTaskOverdue = (dueDate: string, status: string): boolean => {
    if (status === 'completed') return false; // Don't mark completed tasks as overdue
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const TaskNotFound=()=>{
    return(
     <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No tasks found</h3>
        <p>
          {statusFilter === 'all' 
            ? 'Create your first task to get started!' 
            : `No ${statusFilter} tasks found.`}
        </p>
      </div>
    );
  }

  // Fetch tasks on mount
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/tasks`, { withCredentials: true })
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error('Error fetching tasks:', err);
        toast.error(err?.response?.data?.message || 'Failed to fetch tasks');
      })
      .finally(() => setLoading(false));
  }, []);

  // Callback to remove task from state after deletion
  const handleDeleteSuccess = (id: string) => {
    setTasks(prev => prev.filter(task => task._id !== id));
  };

  // Filter tasks based on selected status
  const filteredTasks = statusFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === statusFilter);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return <TaskNotFound />;
      
  }

  return (
    <div className="tasks-grid">
      {filteredTasks.map(task => {
        // Check if this task is overdue
        const overdue = isTaskOverdue(task.dueDate, task.status);
        
        return (
          <div key={task._id} className={`task-card ${overdue ? 'overdue' : ''}`}>
            {/* Task Header - Updated to include overdue badge */}
            <div className="task-header">
              <div className="task-name-container">
                <h3 className="task-name">{task.name}</h3>
                {/* Overdue Badge - Only show if task is overdue */}
                {overdue && (
                  <span className="overdue-badge">
                    ⚠️ Overdue
                  </span>
                )}
              </div>
              <span className={`status-badge status-${task.status}`}>
                {task.status}
              </span>
            </div>
            
            <p className="task-description">{task.description}</p>
            
            {/* Task Dates - Updated to highlight overdue date */}
            <div className="task-dates">
              <div className="date-item">
                <span className="date-label">Created:</span>
                <span className="date-value">
                  {new Date(task.creationDate).toLocaleDateString()}
                </span>
              </div>
              <div className="date-item">
                <span className="date-label">Due:</span>
                <span className={`date-value ${overdue ? 'overdue-date' : ''}`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                  {/* Add overdue indicator */}
                  {overdue && ' ⏰'}
                </span>
              </div>
            </div>
            
            <div className="task-actions">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/dashboard/editTask/${task._id}`)}
              >
                ✏️ Edit
              </button>
              
              <DeleteUserTask 
                deleteTaskId={task._id} 
                onDeleteSuccess={handleDeleteSuccess} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GetUserTasks;