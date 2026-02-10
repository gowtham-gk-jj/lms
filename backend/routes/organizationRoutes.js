const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");
const multer = require("multer");
const path = require("path");

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= CREATE ORGANIZATION ================= */
router.post("/", async (req, res) => {
  try {
    const { name, shortName, description, website, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Organization name and email are required",
      });
    }

    const existingOrg = await Organization.findOne({ email });
    if (existingOrg) {
      return res.status(409).json({
        message: "Organization already exists",
      });
    }

    const org = await Organization.create({
      name,
      shortName,
      description,
      website,
      email,
      phone,
    });

    res.status(201).json(org);
  } catch (error) {
    console.error("Create failed:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================= GET ORGANIZATION (SINGLE) ================= */
/* ✅ Used by LogoBranding & Certificates */
router.get("/", async (req, res) => {
  try {
    const org = await Organization.findOne();
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= SAVE LOGO & BRANDING ================= */
router.put("/branding", upload.single("logo"), async (req, res) => {
  try {
    let org = await Organization.findOne();
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (req.file) {
      org.logo = `/uploads/${req.file.filename}`;
    }

    if (req.body.themeColor) {
      org.themeColor = req.body.themeColor;
    }

    await org.save();

    res.json({
      success: true,
      org,
    });
  } catch (error) {
    console.error("Branding save failed:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================= GET ORGANIZATION BY ID (OPTIONAL) ================= */
router.get("/:orgId", async (req, res) => {
  try {
    const org = await Organization.findById(req.params.orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
