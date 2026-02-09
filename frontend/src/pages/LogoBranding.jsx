import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function LogoBranding() {
  const fileRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [themeColor, setThemeColor] = useState("#2563eb");
  const [loading, setLoading] = useState(false);

  // 1. Fetch current branding on load
  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/organization/branding");
        const data = await res.json();
        if (data.themeColor) setThemeColor(data.themeColor);
        if (data.logoUrl) setLogoPreview(data.logoUrl);
      } catch (err) {
        console.warn("No existing branding found.");
      }
    };
    fetchBranding();
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    // 🔹 MATCHING THE LOGIN PAGE DATA
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token || localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (logoFile) formData.append("logo", logoFile);
      formData.append("themeColor", themeColor);

      const response = await fetch("http://localhost:5000/api/organization/logo", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}` 
          // Note: Do NOT set Content-Type for FormData, browser does it automatically
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Update failed");
      
      alert("✅ Branding updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving settings. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <Link to="/admin-dashboard" style={{ textDecoration: "none", color: "#0284c7", fontWeight: "bold" }}>← Back to Dashboard</Link>
      
      <div style={{ background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", marginTop: "20px" }}>
        <h2>Logo & Branding</h2>
        
        <div style={{ display: "flex", gap: "20px", alignItems: "center", margin: "20px 0" }}>
          <div style={{ width: "120px", height: "120px", border: "2px dashed #ccc", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {logoPreview ? <img src={logoPreview} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : "No Logo"}
          </div>
          
          <button onClick={() => fileRef.current.click()} style={{ padding: "10px", cursor: "pointer" }}>Change Logo</button>
          <input ref={fileRef} type="file" hidden onChange={handleLogoUpload} />
        </div>

        <h4>Theme Color</h4>
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          {["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"].map(color => (
            <div 
              key={color} 
              onClick={() => setThemeColor(color)}
              style={{ width: "35px", height: "35px", borderRadius: "50%", background: color, cursor: "pointer", border: themeColor === color ? "3px solid black" : "1px solid #ddd" }}
            />
          ))}
        </div>

        <button 
          onClick={handleSave} 
          disabled={loading}
          style={{ width: "100%", padding: "15px", background: "#0284c7", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
        >
          {loading ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}