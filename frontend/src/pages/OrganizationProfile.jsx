import { useEffect, useState } from "react";
import api from "../api/axios";


export default function OrganizationProfile() {
  const [org, setOrg] = useState({
    name: "",
    shortName: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    heroTitle: "",
    heroSubtitle: "",
  });

  const [loading, setLoading] = useState(false);

  /* LOAD ORGANIZATION */
  useEffect(() => {
    api.get("/organization")
  .then((res) => {
    if (res.data) setOrg(res.data);
  })
  .catch(console.error);

  }, []);

  const handleChange = (e) => {
    setOrg({ ...org, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!org.name || !org.email) {
      alert("Organization Name & Email required");
      return;
    }

    try {
      setLoading(true);

      await api.put("/organization", org);

      alert("Organization updated successfully!");
    } catch {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Organization Profile</h2>

      <input name="name" value={org.name} onChange={handleChange} placeholder="Organization Name *" />
      <input name="shortName" value={org.shortName} onChange={handleChange} placeholder="Short Name" />
      <textarea name="description" value={org.description} onChange={handleChange} placeholder="Description" />
      <input name="website" value={org.website} onChange={handleChange} placeholder="Website" />
      <input name="email" value={org.email} onChange={handleChange} placeholder="Email *" />
      <input name="phone" value={org.phone} onChange={handleChange} placeholder="Phone" />

      {/* 🔥 HERO CONTROLS */}
      <input name="heroTitle" value={org.heroTitle} onChange={handleChange} placeholder="Hero Title" />
      <input name="heroSubtitle" value={org.heroSubtitle} onChange={handleChange} placeholder="Hero Subtitle" />

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
