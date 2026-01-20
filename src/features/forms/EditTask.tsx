import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateTask.css';
import BACKEND_URL from '../../config.js';
type Task = {
  _id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
};

export default function EditTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [task, setTask] = useState<Task>({
    _id: '',
    name: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the task data when component mounts
  useEffect(() => {
    if (id) {
      axios
        .get(`${BACKEND_URL}/api/task/${id}`, { withCredentials: true })
        .then(res => {
          // Format the date to YYYY-MM-DD for input field
          const formattedDate = res.data.dueDate 
            ? new Date(res.data.dueDate).toISOString().split('T')[0]
            : '';
          
          setTask({
            ...res.data,
            dueDate: formattedDate
          });
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.error('Error fetching task:', err);
          toast.error(err?.response?.data?.message || 'Failed to load task');
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(
        `${BACKEND_URL}/api/tasks/${id}`,
        {
          name: task.name,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate,
        },
        { withCredentials: true }
      );
toast.success('Task updated successfully!');
      setTimeout(() => {
  navigate('/dashboard');
}, 1000); 
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Task update failed. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="create-task-container">
        <div className="create-task-card">
          <p>Loading task...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="create-task-container">
      <div className="create-task-card">
        <div className="create-task-header">
          <h2>Edit Task</h2>
          <p>Update the details below to modify your task</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* NAME */}
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

          {/* DESCRIPTION */}
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

          {/* STATUS */}
          <div className="form-group status-group">
            <label className="status-label">Status</label>
            <div className="filter-wrapper">
  <select
  className="status-filter"
  value={task.status}
  onChange={(e) =>
    setTask(prev => ({
      ...prev,
      status: e.target.value as Task['status'],
    }))
  }
  disabled={isSubmitting}
>
  <option value="pending">Pending</option>
  <option value="in-progress">In Progress</option>
  <option value="completed">Completed</option>
</select>

</div>
          </div>

          {/* DUE DATE */}
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <div className="date-container">
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
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Task'}
            </button>
            
            <button
              type="button"
              className="submit-button"
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
    </>
  );
}