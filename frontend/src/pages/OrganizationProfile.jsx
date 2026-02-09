import { useEffect, useState } from "react";

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
    fetch("http://localhost:5000/api/organization")
      .then((res) => res.json())
      .then((data) => {
        if (data) setOrg(data);
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

      await fetch("http://localhost:5000/api/organization", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(org),
      });

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
