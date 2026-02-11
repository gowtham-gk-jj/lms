import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function LearningRules() {
  const [rules, setRules] = useState({
    access: "Free",
    completion: "",
    passMark: "",
    certificateType: "Auto",
    enabled: true,
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD RULES ================= */
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await api.get("/api/organization/rules"); // ✅ FIXED
        if (res.data) setRules(res.data);
      } catch (err) {
        console.warn("No existing rules found", err);
      }
    };

    fetchRules();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if ((name === "completion" || name === "passMark") && value !== "") {
      const num = Number(value);
      if (num < 0 || num > 100) return;
    }

    setRules({
      ...rules,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    });
  };

  /* ================= SAVE RULES ================= */
  const handleSave = async () => {
    if (rules.completion === "" || rules.passMark === "") {
      alert("Completion % and Pass Mark are required");
      return;
    }

    try {
      setLoading(true);

      await api.put("/api/organization/rules", rules); // ✅ FIXED

      alert("Learning rules saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save learning rules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "50px 20px", background: "#f4f7fe", minHeight: "100vh" }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/admin-dashboard">← Back to Dashboard</Link>
      </div>

      <div style={{
        background: "#fff",
        padding: 30,
        borderRadius: 16,
        maxWidth: 500
      }}>
        <h2>Learning Rules & Policies</h2>

        <div>
          <label>Course Access</label>
          <select
            name="access"
            value={rules.access}
            onChange={handleChange}
          >
            <option value="Free">Free Access</option>
            <option value="Restricted">Restricted</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 15 }}>
          <div>
            <label>Completion (%)</label>
            <input
              name="completion"
              type="number"
              value={rules.completion}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Pass Mark (%)</label>
            <input
              name="passMark"
              type="number"
              value={rules.passMark}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label>Certificate Issue Type</label>
          <select
            name="certificateType"
            value={rules.certificateType}
            onChange={handleChange}
          >
            <option value="Auto">On Completion</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div style={{ marginTop: 15 }}>
          <label>
            <input
              type="checkbox"
              name="enabled"
              checked={rules.enabled}
              onChange={handleChange}
            />
            Policy Enabled
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          {loading ? "Saving..." : "Save Policies"}
        </button>
      </div>
    </div>
  );
}
