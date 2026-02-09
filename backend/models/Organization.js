const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortName: String,
    description: String,
    website: String,
    email: { type: String, required: true },
    phone: String,

    // Branding
    logo: { type: String, default: "" },
    themeColor: { type: String, default: "#2563eb" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", OrganizationSchema);
