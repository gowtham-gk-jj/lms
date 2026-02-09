import React from "react";
import { useNavigate } from "react-router-dom";
import AdminProgressTable from "./AdminProgressTable"; // We look in the same folder now

const AdminProgressPage = () => {
  const navigate = useNavigate();

  return (
    <div className="db-wrapper">
      {/* Back Button to return to the Dashboard Grid */}
      <button 
        onClick={() => navigate(-1)} 
        style={{
          marginBottom: '20px', 
          padding: '10px 20px', 
          cursor: 'pointer',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          background: '#fff',
          fontWeight: 'bold',
          transition: '0.3s'
        }}
        onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
        onMouseOut={(e) => e.target.style.background = '#fff'}
      >
        ← Back to Dashboard
      </button>

      <header className="db-welcome">
        <h1>Detailed Student Progress</h1>
        <p>Viewing all active course enrollments and completion percentages.</p>
      </header>
      
      {/* This renders the table you just created */}
      <div className="table-container" style={{ marginTop: '30px' }}>
        <AdminProgressTable />
      </div>
    </div>
  );
};

export default AdminProgressPage;