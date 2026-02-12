import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CertificateCard from "../components/CertificateCard";
import "./MyCertificates.css";

const MyCertificates = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅ Added
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
  <div className="container mt-4">

    {/* Header Row */}
    <div className="page-top-bar">
      <button
        className="top-back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="top-title">
        My Achievement Certificates
      </h2>
    </div>


      {/* ================= CONTENT ================= */}

      {loading ? (
        <p style={{ textAlign: "center" }}>
          Loading your certificates...
        </p>
      ) : certificates.length > 0 ? (
        <div className="cert-grid">
          {certificates.map((cert) => (
            <CertificateCard key={cert._id} cert={cert} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>
          You haven’t earned any certificates yet.
          Complete a course to see them here!
        </p>
      )}
    </div>
  );
};

export default MyCertificates;
