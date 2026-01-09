import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CreateTask.css';
import { useNavigate } from 'react-router-dom';
import BACKEND_URL from '../../config.js';

type CreateTaskPayload = {
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
};

export default function CreateTask() {
  const navigate = useNavigate();
  const [task, setTask] = useState<CreateTaskPayload>({
    name: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to get JWT token
  const getToken = () => localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = getToken();
    if (!token) {
      toast.error("You are not logged in");
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/tasks`,
        task,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Task created successfully!');
      setTask({
        name: '',
        description: '',
        status: 'pending',
        dueDate: '',
      });

      // Navigate back after short delay
      setTimeout(() => navigate('/dashboard'), 1000);

    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Task creation failed. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-task-container">
      <div className="create-task-card">
        <div className="create-task-header">
          <h2>Create New Task</h2>
          <p>Fill in the details below to add a new task to your list</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Task Name */}
          <div className="form-group">
            <label className="form-label">Task Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={task.name}
              onChange={handleChange}
              placeholder="Enter task name"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Enter task description"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="filter-wrapper">
              <select
                className="status-filter"
                value={task.status}
                onChange={(e) =>
                  setTask(prev => ({ ...prev, status: e.target.value as CreateTaskPayload['status'] }))
                }
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>

            <button
              type="button"
              className="submit-button cancel_button"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
              style={{ background: '#6c757d' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
