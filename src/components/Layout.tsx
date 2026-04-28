import React from 'react';
import { Home, Users, PieChart, Settings } from 'lucide-react';
import './Layout.css';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout-container">
      <nav className="sidebar glass-panel">
        <div className="logo-container">
          <h1 className="text-gradient">hoopaid</h1>
        </div>
        <ul className="nav-links">
          <li className="nav-item active">
            <Home size={20} />
            <span>Dashboard</span>
          </li>
          <li className="nav-item">
            <Users size={20} />
            <span>Friends</span>
          </li>
          <li className="nav-item">
            <PieChart size={20} />
            <span>Activity</span>
          </li>
          <li className="nav-item mt-auto">
            <Settings size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};
