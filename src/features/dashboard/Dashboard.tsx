import { useEffect, useState,useRef } from 'react';
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

// Menu close when we click outside of it 
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
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

  // Fetch all tasks for charts
  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/tasks`, { withCredentials: true })
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error('Error fetching tasks:', err);
        toast.error(err?.response?.data?.message || 'Failed to fetch tasks for charts');
      })
      .finally(() => setLoading(false));
  }, []);

const handleLogout = async () => {
  try {
    await axios.post(`${BACKEND_URL}/api/logout`, {}, { withCredentials: true });
    toast.success('Logged out successfully');
    navigate('/login');
}
  catch (err:any) {
    console.error('Logout error:', err);
    toast.error(err?.response?.data?.message ||'Failed to log out');
    
  }
}

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">My Tasks</h1>

        <div className='align-items'>
          

         

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



          <NotificationBell />
        </div>
      </div>

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

      {/* Charts row */}
      {!loading && tasks.length > 0 && <TasksSummary tasks={tasks} />}
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

      {/* Task list */}
      <GetUserTasks statusFilter={statusFilter} />
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

//Code 2 : With Dummy Components
// import React, { useEffect, useState } from 'react'; 
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useNavigate } from "react-router-dom";
// import './Dashboard.css';
// import GetUserTasks from '../components/GetTasks';
// import Typewriter from 'typewriter-effect';
// import TasksSummary from './Charts'; // updated chart component
// import NotificationBell from '../NotificationBell/NotificationBell';
// import type { Task } from '../types/Task';
// import { FiLogOut } from "react-icons/fi";



// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all tasks for charts
//   useEffect(() => {
//     axios.get('http://localhost:5402/api/tasks', { withCredentials: true })
//       .then(res => setTasks(res.data))
//       .catch(err => {
//         console.error('Error fetching tasks:', err);
//         toast.error(err?.response?.data?.message || 'Failed to fetch tasks for charts');
//       })
//       .finally(() => setLoading(false));
//   }, []);

// const handleLogout = async () => {
//   try {
//     await axios.post('http://localhost:5402/api/logout', {}, { withCredentials: true });
//     toast.success('Logged out successfully');
//     navigate('/login');
// }
//   catch (err:any) {
//     console.error('Logout error:', err);
//     toast.error(err?.response?.data?.message ||'Failed to log out');
    
//   }
// }

// const LogoutButton=()=>{
//   return(
// <button 
//   className="add-task-btn" 
//   onClick={handleLogout}
// >
//     <span className="plus-icon">
//   <FiLogOut size={18} /> 
//   </span>
//   Logout
// </button>
//   )
// }




// const TasksStatus=()=>{
// return(
//    <select 
//             value={statusFilter} 
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="all">All</option>
//             <option value="pending">Pending</option>
//             <option value="in-progress">In Progress</option>
//             <option value="completed">Completed</option>
//           </select>
// )

// }



// const AddTaskButton=()=>{
// return(
//   <button 
//             className="add-task-btn" 
//             onClick={() => navigate('/dashboard/createTask')}
//           >
//             <span className="plus-icon">+</span> Add Task
//           </button>
// )
// }


//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1 className="page-title">My Tasks</h1>

//         <div className='align-items'>
//          <TasksStatus/>
//          <AddTaskButton/>
//          <LogoutButton/>
//          <NotificationBell />
//         </div>
//       </div>

//       <h2 className="typewriter-title">
//         <Typewriter
//           options={{
//             strings: [
//               'Stay organized Stay productive.',
//               'All your tasks, in one place.',
//               'Plan Track Complete.',
//             ],
//             autoStart: true,
//             loop: true,
//             delay: 60,
//             deleteSpeed: 40,
//           }}
//         />
//       </h2>

//       {/* Charts row */}
//       {!loading && tasks.length > 0 && <TasksSummary tasks={tasks} />}

//       {/* Task list */}
//       <GetUserTasks statusFilter={statusFilter} />
//     </div>
//   );
// }


//####################################################################

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useNavigate } from "react-router-dom";
// import './Dashboard.css';
// import GetUserTasks from '../components/GetTasks';
// import Typewriter from 'typewriter-effect';
// import TasksSummary from './Charts';
// import NotificationBell from '../NotificationBell/NotificationBell';
// import type { Task } from '../types/Task';
// import { FiLogOut } from "react-icons/fi";

// ─────────────────────────────────────────────────────────────
// Sub-components (defined OUTSIDE Dashboard to avoid re-creation)
// ─────────────────────────────────────────────────────────────

// interface StatusFilterProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// function StatusFilter({ value, onChange }: StatusFilterProps) {
//   return (
//     <select value={value} onChange={(e) => onChange(e.target.value)}>
//       <option value="all">All</option>
//       <option value="pending">Pending</option>
//       <option value="in-progress">In Progress</option>
//       <option value="completed">Completed</option>
//     </select>
//   );
// }

// interface AddTaskButtonProps {
//   onClick: () => void;
// }

// function AddTaskButton({ onClick }: AddTaskButtonProps) {
//   return (
//     <button className="add-task-btn" onClick={onClick}>
//       <span className="plus-icon">+</span> Add Task
//     </button>
//   );
// }

// interface LogoutButtonProps {
//   onClick: () => void;
// }

// function LogoutButton({ onClick }: LogoutButtonProps) {
//   return (
//     <button className="add-task-btn" onClick={onClick}>
//       <span className="plus-icon">
//         <FiLogOut size={18} />
//       </span>
//       Logout
//     </button>
//   );
// }

// function TypewriterHeader() {
//   return (
//     <h2 className="typewriter-title">
//       <Typewriter
//         options={{
//           strings: [
//             'Stay organized. Stay productive.',
//             'All your tasks, in one place.',
//             'Plan. Track. Complete.',
//           ],
//           autoStart: true,
//           loop: true,
//           delay: 60,
//           deleteSpeed: 40,
//         }}
//       />
//     </h2>
//   );
// }

// ─────────────────────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────────────────────

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get('http://localhost:5402/api/tasks', { withCredentials: true })
//       .then((res) => setTasks(res.data))
//       .catch((err) => {
//         console.error('Error fetching tasks:', err);
//         toast.error(err?.response?.data?.message || 'Failed to fetch tasks');
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post('http://localhost:5402/api/logout', {}, { withCredentials: true });
//       toast.success('Logged out successfully');
//       navigate('/login');
//     } catch (err: any) {
//       console.error('Logout error:', err);
//       toast.error(err?.response?.data?.message || 'Failed to log out');
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1 className="page-title">My Tasks</h1>

//         <div className="align-items">
//           <StatusFilter value={statusFilter} onChange={setStatusFilter} />
//           <AddTaskButton onClick={() => navigate('/dashboard/createTask')} />
//           <LogoutButton onClick={handleLogout} />
//           <NotificationBell />
//         </div>
//       </div>

//       <TypewriterHeader />

//       {!loading && tasks.length > 0 && <TasksSummary tasks={tasks} />}

//       <GetUserTasks statusFilter={statusFilter} />
//     </div>
//   );
// }
// ```

// ---

// ## What's Better About This Version

// | Improvement | Benefit |
// |-------------|---------|
// | Components defined **outside** `Dashboard` | No re-creation on every render |
// | Typed props interfaces | Better type safety and documentation |
// | Props passed explicitly | Clear data flow, easier testing |
// | Semantic component names | Clean, readable JSX in `Dashboard` |
// | Single responsibility | Each component does one thing |

// ---

// ## Optional: Separate Files

// For larger projects, you'd move each sub-component to its own file:
// ```
// /components
//   /StatusFilter/StatusFilter.tsx
//   /AddTaskButton/AddTaskButton.tsx
//   /LogoutButton/LogoutButton.tsx
//   /TypewriterHeader/TypewriterHeader.tsx
