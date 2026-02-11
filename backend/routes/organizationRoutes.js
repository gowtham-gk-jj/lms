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

/* =========================================================
   GET MAIN ORGANIZATION
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const org = await Organization.findOne();
    res.json(org || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   CREATE OR UPDATE ORGANIZATION PROFILE
   ========================================================= */
router.put("/", async (req, res) => {
  try {
    const updated = await Organization.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   BRANDING (LOGO + THEME COLOR)
   ========================================================= */
router.put("/branding", upload.single("logo"), async (req, res) => {
  try {
    let org = await Organization.findOne();
    if (!org) org = new Organization();

    if (req.file) {
      org.logo = `/uploads/${req.file.filename}`;
    }

    if (req.body.themeColor) {
      org.themeColor = req.body.themeColor;
    }

    await org.save();

    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   LEARNING RULES
   ========================================================= */
router.get("/rules", async (req, res) => {
  try {
    const org = await Organization.findOne();
    res.json(org?.learningRules || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/rules", async (req, res) => {
  try {
    const updated = await Organization.findOneAndUpdate(
      {},
      { $set: { learningRules: req.body } },
      { new: true, upsert: true }
    );

    res.json(updated.learningRules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   SYSTEM SETTINGS
   ========================================================= */
router.get("/settings", async (req, res) => {
  try {
    const org = await Organization.findOne();
    res.json(org?.systemSettings || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const updated = await Organization.findOneAndUpdate(
      {},
      { $set: { systemSettings: req.body } },
      { new: true, upsert: true }
    );

    res.json(updated.systemSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
