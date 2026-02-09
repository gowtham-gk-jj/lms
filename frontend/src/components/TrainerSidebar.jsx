import React from "react";
import { NavLink } from "react-router-dom"; // ✅ Use NavLink for automatic active state
import "./TrainerSidebar.css";

export default function TrainerSidebar() {
  return (
    <aside className="trainer-sidebar">
      <h2 className="trainer-title">Trainer Panel</h2>

      <nav className="trainer-nav">
        {/* ✅ MODULE 5 FIX: dynamic active classes */}
        <NavLink 
          to="/trainer/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          📚 View Courses
        </NavLink>

        <NavLink 
          to="/trainer/create-course" 
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          ➕ Create Course
        </NavLink>
        
        <NavLink 
          to="/trainer/students" 
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
          👥 My Students
        </NavLink>
      </nav>
    </aside>
  );
}