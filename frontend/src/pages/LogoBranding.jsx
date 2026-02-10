import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./LogoBranding.css";
import api from "../api/axios";


export default function LogoBranding() {
  const fileRef = useRef(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [themeColor, setThemeColor] = useState("#2563eb");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const res = await api.get("/organization");
        const data = res.data;

        if (data?.themeColor) setThemeColor(data.themeColor);
        if (data?.logo)
          setLogoPreview(`${import.meta.env.VITE_API_BASE_URL}${data.logo}`);

      } catch {
        console.log("No branding found");
      }
    };
    loadBranding();
  }, []);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
   

    setLoading(true);
    try {
      const formData = new FormData();
      if (logoFile) formData.append("logo", logoFile);
      formData.append("themeColor", themeColor);

      await api.put("/organization/branding", formData);


      alert("✅ Branding updated successfully");
    } catch {
      alert("❌ Failed to save branding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="branding-page">
      <Link to="/admin-dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="branding-card">
        <h2 className="branding-title">Logo & Branding</h2>

        <div className="logo-section">
          <div className="logo-preview">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" />
            ) : (
              <span>No Logo</span>
            )}
          </div>

          <button
            className="change-logo-btn"
            onClick={() => fileRef.current.click()}
          >
            Change Logo
          </button>
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={handleLogoUpload}
          />
        </div>

        <h4 className="section-label">Theme Color</h4>
        <div className="color-picker">
          {["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"].map(
            (color) => (
              <div
                key={color}
                className={`color-dot ${
                  themeColor === color ? "active" : ""
                }`}
                style={{ background: color }}
                onClick={() => setThemeColor(color)}
              />
            )
          )}
        </div>

        <button
          className="save-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
