import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

export default function RoleDashboard({ role = "Learner", full = false }) {
  const { user } = useAuth();
  const token = user?.token;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!token) {
          setStats(null);
          return;
        }

        const res = await api.get(
          `/api/dashboard/stats/${role}`
        );

        const data = res.data;
        setStats(data);

        if (role === "Learner") {
          setChartData([
            { name: "Completed", value: data.personalProgress || 0 },
            { name: "Remaining", value: 100 - (data.personalProgress || 0) },
          ]);
        } else {
          setChartData([
            { name: "Completed", value: data.averageCompletion || 0 },
            { name: "Remaining", value: 100 - (data.averageCompletion || 0) },
          ]);
        }
      } catch (err) {
        console.error("Dashboard API error:", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [role, token]);

  if (loading) return <p style={{ padding: "20px" }}>Loading overview...</p>;
  if (!stats) return <p style={{ padding: "20px" }}>No dashboard data available</p>;

  return (
    <div style={{ padding: full ? "30px" : "10px" }}>
      <h2 style={{ marginBottom: "20px" }}>Overview</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {role === "Admin" && (
          <>
            <KpiCard title="Total Users" value={stats.users} />
            <KpiCard title="Total Courses" value={stats.courses} />
            <KpiCard title="Average Completion" value={`${stats.averageCompletion}%`} />
          </>
        )}

        {role === "Trainer" && (
          <>
            <KpiCard title="Courses Handled" value={stats.coursesHandled} />
            <KpiCard title="Average Progress" value={`${stats.avgCompletion}%`} />
          </>
        )}

        {role === "Learner" && (
          <>
            <KpiCard title="Enrolled Courses" value={stats.enrolledCourses} />
            <KpiCard title="Your Progress" value={`${stats.personalProgress}%`} />
          </>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h4 style={{ marginBottom: "15px" }}>
          {role === "Learner"
            ? "Your Learning Progress"
            : "Overall Learning Progress"}
        </h4>

        <div style={{ height: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5">
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid #e5e7eb",
      }}
    >
      <p style={{ color: "#6b7280", fontSize: "14px" }}>{title}</p>
      <h3 style={{ fontSize: "28px", marginTop: "10px" }}>{value}</h3>
    </div>
  );
}
