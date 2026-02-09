const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getQuizByCourse,
  getTrainerQuizzes,
  getSingleQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  deleteAllQuestionsByLevel,
  playQuizByLevel,
  submitQuiz,
  getQuizResult,
  getQuizReview,
  getTrainerQuizAttempts, // ✅ TRAINER ATTEMPTS
} = require("../controllers/quizController");

const { protect, authorize } = require("../middleware/authMiddleware");

/* ===============================
   ▶️ START QUIZ (STUDENT)
================================ */
router.get(
  "/play/:courseId/:level",
  protect,
  playQuizByLevel
);

/* ===============================
   ▶️ SUBMIT QUIZ (STUDENT)
================================ */
router.post(
  "/submit",
  protect,
  submitQuiz
);

/* ===============================
   ▶️ GET QUIZ RESULT (STUDENT)
================================ */
router.get(
  "/result/:attemptId",
  protect,
  getQuizResult
);

/* ===============================
   ▶️ GET QUIZ REVIEW (STUDENT)
================================ */
router.get(
  "/review/:attemptId",
  protect,
  getQuizReview
);

/* ===============================
   ▶️ TRAINER – VIEW QUIZ ATTEMPTS ✅ NEW
================================ */
router.get(
  "/trainer/attempts",
  protect,
  authorize("trainer", "instructor"),
  getTrainerQuizAttempts
);

/* ===============================
   CREATE QUIZ (TRAINER)
================================ */
router.post(
  "/",
  protect,
  authorize("trainer"),
  createQuiz
);

/* ===============================
   DELETE ALL QUESTIONS (TRAINER)
================================ */
router.delete(
  "/course/:courseId/level/:level",
  protect,
  authorize("trainer"),
  deleteAllQuestionsByLevel
);

/* ===============================
   GET QUIZ BY COURSE (TRAINER)
================================ */
router.get(
  "/course/:courseId",
  protect,
  getQuizByCourse
);

/* ===============================
   TRAINER QUIZZES
================================ */
router.get(
  "/trainer/quizzes",
  protect,
  authorize("trainer"),
  getTrainerQuizzes
);

/* ===============================
   SINGLE QUESTION CRUD (TRAINER)
================================ */
router.get(
  "/question/:id",
  protect,
  authorize("trainer"),
  getSingleQuestion
);

router.put(
  "/question/:id",
  protect,
  authorize("trainer"),
  updateQuizQuestion
);

router.delete(
  "/question/:id",
  protect,
  authorize("trainer"),
  deleteQuizQuestion
);

module.exports = router;
