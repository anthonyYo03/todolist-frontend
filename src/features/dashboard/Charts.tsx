import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Task } from '../types/Task';
import './Charts.css';

ChartJS.register(ArcElement, Tooltip, Legend);

type TasksSummaryProps = {
  tasks: Task[];
};

const TasksSummary: React.FC<TasksSummaryProps> = ({ tasks }) => {
  const total = tasks.length;

  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;

  const data = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [pending, inProgress, completed],
        backgroundColor: ['#f6c23e', '#36a2eb', '#1cc88a'],
        hoverBackgroundColor: ['#f4b619', '#2e95d3', '#17a673'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = total
              ? ((value / total) * 100).toFixed(0)
              : 0;

            return `${context.label}: ${value} tasks (${percentage}%)`;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
         labels: {
        usePointStyle: true,   // 👈 makes indicators circles
        pointStyle: 'circle',  // 👈 explicitly circle
        boxWidth: 10,          // 👈 size of the dot
        padding: 20,           // 👈 spacing between items
        font: {
          size: 14,
        },
      },
        
      },
    },
    cutout: '70%',
  };

  return (
    <div className="tasks-summary-container">
      <h3 className="tasks-summary-title">Tasks Overview</h3>

      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
      </div>

      <p className="tasks-total">Total Tasks: {total}</p>
    </div>
  );
};

export default TasksSummary;
