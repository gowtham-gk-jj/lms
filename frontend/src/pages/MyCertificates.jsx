import React, { useEffect, useState } from "react";
import api from "../api/axios";
import CertificateCard from "../components/CertificateCard";
import "./MyCertificates.css";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await api.get("/certificates/my");
        setCertificates(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Certificate fetch failed", err);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCerts();
  }, []);

  return (
    <div className="container">
      <h2>My Certificates</h2>

      {loading ? (
        <p>Loading...</p>
      ) : certificates.length > 0 ? (
        certificates.map((c) => (
          <CertificateCard key={c._id} cert={c} />
        ))
      ) : (
        <p>No certificates yet</p>
      )}
    </div>
  );
};

export default MyCertificates;
