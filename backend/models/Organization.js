const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },

    logo: { type: String },
    primaryColor: { type: String },

    /* ✅ ADD THIS */
    learningRules: {
      access: { type: String, default: "Free" },
      completion: { type: Number, default: 80 },
      passMark: { type: Number, default: 50 },
      certificateType: { type: String, default: "Auto" },
      enabled: { type: Boolean, default: true },
    },

    /* ✅ ADD THIS */
    systemSettings: {
      language: { type: String, default: "English" },
      timezone: { type: String, default: "GMT+5:30" },
      dateFormat: { type: String, default: "DD/MM/YYYY" },
      notifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", organizationSchema);
