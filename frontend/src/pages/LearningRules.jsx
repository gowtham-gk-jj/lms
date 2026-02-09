import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const styles = {
  container: {
    padding: "50px 20px",
    backgroundColor: "#f4f7fe",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  topNav: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px"
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "38px",
    height: "38px",
    backgroundColor: "#0284c7",
    color: "white",
    textDecoration: "none",
    borderRadius: "50%",
    fontSize: "18px",
    fontWeight: "bold",
    boxShadow: "0 4px 6px -1px rgba(2, 132, 199, 0.3)",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "500px"
  },
  title: {
    fontSize: "22px",
    marginBottom: "25px",
    color: "#1b254b",
    textAlign: "center"
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
    flex: 1
  },
  row: {
    display: "flex",
    gap: "15px"
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#47548c",
    marginBottom: "8px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d9e2",
    fontSize: "14px",
    outline: "none"
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "15px 0"
  },
  saveBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#4318FF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px"
  }
};

export default function LearningRules() {
  const [rules, setRules] = useState({
    access: "Free",
    completion: "",
    passMark: "",
    certificateType: "Auto",
    enabled: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/organization/rules")
      .then((res) => res.json())
      .then((data) => {
        if (data) setRules(data);
      })
      .catch(() => console.warn("No existing rules found"));
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if ((name === "completion" || name === "passMark") && value !== "") {
      const num = Number(value);
      if (num < 0 || num > 100) return;
    }
    setRules({
      ...rules,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    });
  };

  const handleSave = async () => {
    if (rules.completion === "" || rules.passMark === "") {
      alert("Completion % and Pass Mark are required");
      return;
    }

    try {
      setLoading(true);
      const userString = localStorage.getItem("userInfo");
      const user = userString ? JSON.parse(userString) : null;
      
      await fetch("http://localhost:5000/api/organization/rules", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify(rules),
      });
      alert("Learning rules saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save learning rules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topNav}>
        <Link to="/admin-dashboard" style={styles.backBtn}>←</Link>
        <span style={styles.label}>Admin Settings</span>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Learning Rules & Policies</h2>
        
        <div style={styles.field}>
          <label style={styles.label}>Course Access</label>
          <select name="access" value={rules.access} onChange={handleChange} style={styles.input}>
            <option value="Free">Free Access</option>
            <option value="Restricted">Restricted</option>
          </select>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Completion (%)</label>
            <input
              name="completion"
              type="number"
              value={rules.completion}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Pass Mark (%)</label>
            <input
              name="passMark"
              type="number"
              value={rules.passMark}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Certificate Issue Type</label>
          <select name="certificateType" value={rules.certificateType} onChange={handleChange} style={styles.input}>
            <option value="Auto">On Completion</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div style={styles.toggleRow}>
          <span style={styles.label}>Policy Enabled</span>
          <input
            type="checkbox"
            checked={rules.enabled}
            onChange={() => setRules({ ...rules, enabled: !rules.enabled })}
          />
        </div>

        <button 
          onClick={handleSave} 
          disabled={loading}
          style={{...styles.saveBtn, opacity: loading ? 0.7 : 1}}
        >
          {loading ? "Saving..." : "Save Policies"}
        </button>
      </div>
    </div>
  );
}