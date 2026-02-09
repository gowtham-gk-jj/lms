import { useEffect, useState } from "react";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    language: "English",
    timezone: "GMT+5:30",
    dateFormat: "DD/MM/YYYY",
    notifications: true,
  });

  const [loading, setLoading] = useState(false);

  /* 🔹 LOAD EXISTING SETTINGS (Module 5 Update) */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organization/settings");
        const data = await res.json();
        if (data) setSettings(data);
      } catch (err) {
        console.warn("No system settings found on server.");
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* 🔹 SAVE SETTINGS (Module 5 Authorized logic) */
  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token;

    if (!token) {
      alert("Unauthorized: Please login as Admin.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Backend API Call with Authorization
      const res = await fetch("http://localhost:5000/api/organization/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to update system settings");

      alert("System settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>System Settings</h2>

      <div className="settings-field">
        <label>Default Language</label>
        <select
          name="language"
          value={settings.language}
          onChange={handleChange}
        >
          <option value="English">English</option>
          <option value="Tamil">Tamil</option>
        </select>
      </div>

      <div className="settings-field">
        <label>Time Zone</label>
        <select
          name="timezone"
          value={settings.timezone}
          onChange={handleChange}
        >
          <option value="GMT+5:30">GMT +5:30 (India)</option>
          <option value="GMT">GMT</option>
        </select>
      </div>

      <div className="settings-field">
        <label>Date Format</label>
        <select
          name="dateFormat"
          value={settings.dateFormat}
          onChange={handleChange}
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
        <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }}>
          Enable System Notifications
        </span>
        <input
          type="checkbox"
          name="notifications"
          style={{ width: "auto", margin: 0 }}
          checked={settings.notifications}
          onChange={handleChange}
        />
      </div>

      <button className="save" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}