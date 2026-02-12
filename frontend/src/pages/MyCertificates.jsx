import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CertificateCard from "../components/CertificateCard";
import "./MyCertificates.css";

const MyCertificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const fetchCerts = async () => {
      try {
        const res = await api.get("/api/certificates/my");

        console.log("🎓 Certificates from backend:", res.data);

        setCertificates(
          Array.isArray(res.data)
            ? res.data
            : res.data.certificates || []
        );
      } catch (err) {
        console.error(
          "❌ Error fetching certificates:",
          err.response?.data || err.message
        );
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, [user?.token]);

  return (
    <>
      {/* ================= FULL WIDTH HEADER ================= */}
      <div className="full-header">
        <button
          className="header-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2 className="header-title">
          My Achievement Certificates
        </h2>
      </div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div className="container mt-4">

        {loading ? (
          <p className="loading-text">
            Loading your certificates...
          </p>
        ) : certificates.length > 0 ? (
          <div className="cert-grid">
            {certificates.map((cert) => (
              <CertificateCard key={cert._id} cert={cert} />
            ))}
          </div>
        ) : (
          <div className="no-certs-message">
            <p>
              You haven’t earned any certificates yet.
              Complete a course to see them here!
            </p>
          </div>
        )}

      </div>
    </>
  );
};

export default MyCertificates;
