import React, { useState, useEffect } from "react";
import api from "../api/axios";

import { useAuth } from "../context/AuthContext";
import CertificateCard from "../components/CertificateCard";
import "./MyCertificates.css";

const MyCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    const fetchCerts = async () => {
      try {
        const res = await axios.get(
          "/certificates/my");

        console.log("🎓 Certificates from backend:", res.data);
        setCertificates(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(
          "❌ Error fetching certificates:",
          err.response?.data || err
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
      <h2 className="mb-4">My Achievement Certificates</h2>

      {loading ? (
        <p>Loading your certificates...</p>
      ) : certificates.length > 0 ? (
        <div className="cert-grid">
          {certificates.map((cert) => (
            <CertificateCard key={cert._id} cert={cert} />
          ))}
        </div>
      ) : (
        <p>
          You haven’t earned any certificates yet. Complete a course to see them
          here!
        </p>
      )}
    </div>
  );
};

export default MyCertificates;
