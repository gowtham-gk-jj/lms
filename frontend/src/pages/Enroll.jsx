import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function Enroll() {
  const { id, level } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setLoading(true);

      await api.post(
        `/api/courses/${id}/enroll`,
        { level }
      );

      alert(`Successfully enrolled in ${level} level! 🎉`);
      navigate(`/course/${id}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Enrollment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleEnroll} disabled={loading}>
        {loading ? "Processing..." : "Confirm & Start"}
      </button>
    </div>
  );
}


const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f8fafc",
    padding: "20px"
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    maxWidth: "450px",
    width: "100%",
    textAlign: "center",
    border: "1px solid #e2e8f0"
  },
  badge: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
    padding: "5px 15px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  title: {
    fontSize: "24px",
    color: "#1e293b",
    marginTop: "20px"
  },
  subtitle: {
    color: "#64748b",
    lineHeight: "1.6",
    margin: "15px 0 30px 0"
  },
  btnGroup: {
    display: "flex",
    gap: "15px"
  },
  confirmBtn: {
    flex: 2,
    padding: "12px",
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};