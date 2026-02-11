import React from "react";
import api from "../api/axios";

const AdminReports = () => {
  const handleDownload = async () => {
    try {
      const res = await api.get("/api/reports/export", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "lms_reports.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download report");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📊 Admin Reports</h2>
      <button onClick={handleDownload}>
        ⬇️ Download CSV Report
      </button>
    </div>
  );
};

export default AdminReports;
