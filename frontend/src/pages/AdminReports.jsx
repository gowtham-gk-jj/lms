import { downloadReportCSV } from "../services/reportService";
import api from "../api/axios";


const AdminReports = () => {
  const handleDownload = async () => {
    try {
      

      if (!token) {
        alert("Please login again");
        return;
      }

      const csvData = await downloadReportCSV(token);

      const blob = new Blob([csvData], { type: "text/csv" });
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
      <p>Download organization-wide learning reports</p>

      <button
        onClick={handleDownload}
        style={{
          padding: "12px 24px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        ⬇️ Download CSV Report
      </button>
    </div>
  );
};

export default AdminReports;
