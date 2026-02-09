import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './CertificateManager.css';

const CertificateManager = () => {
  const { user } = useAuth();
  const [allCerts, setAllCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/certificates/all', config);
        setAllCerts(data);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchAll();
  }, [user]);

  return (
    <div className="cert-manager-container"> {/* 2. Use class names instead of inline styles */}
      <div className="cert-manager-header">
        <h2>Certificate Issuance Log</h2>
        <p>View all certificates issued to learners across the system.</p>
      </div>
      
      {loading ? (
        <p className="loading-text">Loading records...</p>
      ) : (
        <div className="cert-table-wrapper">
          <table className="cert-table">
            <thead>
              <tr>
                <th>Learner Name</th>
                <th>Course Title</th>
                <th>Certificate ID</th>
                <th>Date Issued</th>
              </tr>
            </thead>
            <tbody>
              {allCerts.length > 0 ? (
                allCerts.map((cert) => (
                  <tr key={cert._id}>
                    <td className="cert-name-cell">{cert.learnerName}</td>
                    <td>{cert.courseName}</td>
                    <td>
                      <span className="cert-id-cell">{cert.certificateId}</span>
                    </td>
                    <td className="cert-date-cell">
                      {new Date(cert.issueDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-certs-row">
                    No certificates have been issued yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CertificateManager;