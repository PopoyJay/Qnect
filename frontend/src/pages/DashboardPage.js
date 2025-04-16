import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import '../styles/dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    // Replace this with API call later
    setStats({
      total: 80,
      open: 35,
      resolved: 25,
      closed: 20,
    });
  }, []);

  const chartData = {
    labels: ['Open', 'Resolved', 'Closed'],
    datasets: [
      {
        label: 'Tickets',
        data: [stats.open, stats.resolved, stats.closed],
        backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Ticket Status Overview',
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <div className="stats-cards">
        <div className="card total">
          <h4>Total Tickets</h4>
          <p>{stats.total}</p>
        </div>
        <div className="card open">
          <h4>Open Tickets</h4>
          <p>{stats.open}</p>
        </div>
        <div className="card resolved">
          <h4>Resolved Tickets</h4>
          <p>{stats.resolved}</p>
        </div>
        <div className="card closed">
          <h4>Closed Tickets</h4>
          <p>{stats.closed}</p>
        </div>
      </div>
      <div className="chart-wrapper">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default DashboardPage;
