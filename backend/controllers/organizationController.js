const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");
const { protect, admin } = require("../middleware/authMiddleware");

/* =====================================================
   GET MAIN ORGANIZATION PROFILE
   GET /api/organization
===================================================== */
router.get("/", async (req, res) => {
  try {
    let org = await Organization.findOne();

    if (!org) {
      return res.status(200).json({});
    }

    res.json(org);
  } catch (error) {
    console.error("Fetch Organization Error:", error);
    res.status(500).json({ message: "Failed to load organization" });
  }
});

/* =====================================================
   UPDATE MAIN ORGANIZATION PROFILE
   PUT /api/organization
===================================================== */
router.put("/", protect, admin, async (req, res) => {
  try {
    const updatedOrg = await Organization.findOneAndUpdate(
      {},
      { $set: req.body },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(updatedOrg);
  } catch (error) {
    console.error("Update Organization Error:", error);
    res.status(400).json({
      message: "Update failed",
      details: error.message,
    });
  }
});

/* =====================================================
   GET LEARNING RULES
   GET /api/organization/rules
===================================================== */
router.get("/rules", async (req, res) => {
  try {
    let org = await Organization.findOne();

    if (!org) {
      org = await Organization.create({});
    }

    res.json(org.learningRules || {});
  } catch (error) {
    console.error("Get Rules Error:", error);
    res.status(500).json({ message: "Failed to load rules" });
  }
});

/* =====================================================
   UPDATE LEARNING RULES
   PUT /api/organization/rules
===================================================== */
router.put("/rules", protect, admin, async (req, res) => {
  try {
    let org = await Organization.findOne();

    if (!org) {
      org = new Organization({});
    }

    org.learningRules = req.body;
    await org.save();

    res.json({ message: "Rules updated", rules: org.learningRules });
  } catch (error) {
    console.error("Update Rules Error:", error);
    res.status(500).json({ message: "Failed to update rules" });
  }
});

/* =====================================================
   GET SYSTEM SETTINGS
   GET /api/organization/settings
===================================================== */
router.get("/settings", async (req, res) => {
  try {
    let org = await Organization.findOne();

    if (!org) {
      org = await Organization.create({});
    }

    res.json(org.systemSettings || {});
  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ message: "Failed to load settings" });
  }
});

/* =====================================================
   UPDATE SYSTEM SETTINGS
   PUT /api/organization/settings
===================================================== */
router.put("/settings", protect, admin, async (req, res) => {
  try {
    let org = await Organization.findOne();

    if (!org) {
      org = new Organization({});
    }

    org.systemSettings = req.body;
    await org.save();

    res.json({
      message: "System settings updated",
      settings: org.systemSettings,
    });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
