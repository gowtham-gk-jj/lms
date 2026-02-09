const express = require("express");
const router = express.Router();
const Organization = require("../models/Organization");
const { protect, admin } = require("../middleware/authMiddleware");

/**
 * @desc    Fetch Organization settings
 * @route   GET /api/organization
 * @access  Public (So anyone can see the logo/name)
 */
router.get("/", async (req, res) => {
  try {
    // We use findOne() without filters because there is only one organization document
    const org = await Organization.findOne();
    
    if (!org) {
      return res.status(200).json({}); // Return empty object if not setup yet
    }

    res.json(org);
  } catch (error) {
    console.error("Fetch Organization Error:", error);
    res.status(500).json({ message: "Failed to load organization settings" });
  }
});

/**
 * @desc    Create or Update Organization settings
 * @route   PUT /api/organization
 * @access  Private/Admin (Only Admins can change branding/rules)
 */
router.put("/", protect, admin, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      address, 
      logo, 
      primaryColor, 
      learningRules, 
      systemSettings 
    } = req.body;

    // Use findOneAndUpdate with upsert: true
    // This finds the first document and updates it, or creates it if it doesn't exist
    const updatedOrg = await Organization.findOneAndUpdate(
      {}, // Search for any document
      {
        $set: {
          name,
          email,
          phone,
          address,
          logo,
          primaryColor,
          learningRules,
          systemSettings,
          updatedAt: Date.now()
        }
      },
      {
        new: true,           // Return the modified document
        upsert: true,        // Create if it doesn't exist
        runValidators: true, // Ensure data matches the Model rules
        setDefaultsOnInsert: true
      }
    );

    console.log("✅ Organization settings updated successfully");
    res.json(updatedOrg);
  } catch (error) {
    console.error("Update Organization Error:", error);
    res.status(400).json({ 
      message: "Update failed", 
      details: error.message 
    });
  }
});

module.exports = router;