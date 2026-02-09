const express = require("express");
const {
  getPublishedArticles,
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublish,
} = require("../controllers/articleController");

const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

/* ===== PUBLIC ===== */
router.get("/published", getPublishedArticles);

/* ===== PROTECTED ===== */
router.get("/", protect, (req, res, next) => {
  if (req.user.role === "admin") {
    return getAllArticles(req, res, next);
  } else {
    return getPublishedArticles(req, res, next);
  }
});

router.get("/:id", protect, getArticle);

/* ===== ADMIN ONLY ===== */
router.post("/", protect, adminOnly, createArticle);
router.put("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);
router.patch("/:id/publish", protect, adminOnly, togglePublish);

module.exports = router;
