const mongoose = require("mongoose");
const QuizQuestion = require("../models/QuizQuestion");
const QuizResult = require("../models/QuizResult");
const CourseProgress = require("../models/CourseProgress");

/* ===============================
   CREATE QUIZ (TRAINER)
================================ */
exports.createQuiz = async (req, res) => {
  try {
    const { courseId, level, questions } = req.body;

    if (!courseId || !level || !Array.isArray(questions) || !questions.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz data",
      });
    }

    const quizDocs = questions.map((q) => ({
      courseId: new mongoose.Types.ObjectId(courseId),
      level,
      question: q.question,
      type: q.type,
      options: q.options.map((o) => ({
        text: o.text,
        isCorrect: Boolean(o.isCorrect),
      })),
    }));

    await QuizQuestion.insertMany(quizDocs);

    return res.status(201).json({
      success: true,
      message: "Quiz saved successfully",
    });
  } catch (error) {
    console.error("QUIZ CREATE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Quiz creation failed",
    });
  }
};

/* ===============================
   GET QUIZ BY COURSE (TRAINER)
================================ */
exports.getQuizByCourse = async (req, res) => {
  try {
    const quiz = await QuizQuestion.find({
      courseId: req.params.courseId,
    });

    return res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error("GET QUIZ BY COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

/* ===============================
   GET ALL CREATED QUIZZES (TRAINER)
================================ */
exports.getTrainerQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizQuestion.aggregate([
      {
        $group: {
          _id: { courseId: "$courseId", level: "$level" },
          questionCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id.courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: 0,
          courseId: "$course._id",
          courseTitle: "$course.title",
          courseImage: "$course.image",
          level: "$_id.level",
          questionCount: 1,
        },
      },
      { $sort: { courseTitle: 1, level: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("GET TRAINER QUIZZES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};

/* ===============================
   GET SINGLE QUESTION
================================ */
exports.getSingleQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.status(200).json(question);
  } catch (error) {
    console.error("GET SINGLE QUESTION ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch question" });
  }
};

/* ===============================
   UPDATE QUESTION
================================ */
exports.updateQuizQuestion = async (req, res) => {
  try {
    const { question, options } = req.body;

    if (!question || !Array.isArray(options)) {
      return res.status(400).json({ message: "Invalid update data" });
    }

    const updated = await QuizQuestion.findByIdAndUpdate(
      req.params.id,
      { question, options },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question: updated,
    });
  } catch (error) {
    console.error("UPDATE QUESTION ERROR:", error);
    return res.status(500).json({ message: "Failed to update question" });
  }
};

/* ===============================
   DELETE SINGLE QUESTION
================================ */
exports.deleteQuizQuestion = async (req, res) => {
  try {
    await QuizQuestion.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("DELETE QUESTION ERROR:", error);
    return res.status(500).json({ message: "Failed to delete question" });
  }
};

/* ===============================
   DELETE ALL QUESTIONS
================================ */
exports.deleteAllQuestionsByLevel = async (req, res) => {
  try {
    const { courseId, level } = req.params;

    await QuizQuestion.deleteMany({
      courseId: new mongoose.Types.ObjectId(courseId),
      level: Number(level),
    });

    return res.status(200).json({
      success: true,
      message: "All questions deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ALL QUESTIONS ERROR:", error);
    return res.status(500).json({ message: "Failed to delete all questions" });
  }
};

/* ===============================
   ▶️ START QUIZ (STUDENT) 🔒 LOCK CHECK
================================ */
exports.playQuizByLevel = async (req, res) => {
  try {
    const { courseId, level } = req.params;

    const levelMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };

    const levelNumber =
      isNaN(level) ? levelMap[level.toLowerCase()] : Number(level);

    if (!levelNumber) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz level",
      });
    }

    const progress = await CourseProgress.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (progress && !progress.unlockedLevels.includes(levelNumber)) {
      return res.status(403).json({
        success: false,
        message: "This level is locked. Complete previous level first.",
      });
    }

    const questions = await QuizQuestion.aggregate([
      {
        $match: {
          courseId: new mongoose.Types.ObjectId(courseId),
          level: levelNumber,
        },
      },
      { $sample: { size: 30 } },
      { $project: { question: 1, options: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("PLAY QUIZ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to start quiz",
    });
  }
};

/* ===============================
   ▶️ SUBMIT QUIZ (STUDENT) 🔓 UNLOCK
================================ */
exports.submitQuiz = async (req, res) => {
  try {
    const { courseId, level, score, total, answers } = req.body;

    const levelMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
    };

    const levelNumber = levelMap[level];
    const passed = score >= Math.ceil(total * 0.6);

    const result = await QuizResult.create({
      user: req.user.id,
      course: new mongoose.Types.ObjectId(courseId),
      level,
      score,
      totalQuestions: total,
      answers,
      passed,
    });

    if (passed) {
      const nextLevel = levelNumber + 1;

      let progress = await CourseProgress.findOne({
        user: req.user.id,
        course: courseId,
      });

      if (!progress) {
        progress = await CourseProgress.create({
          user: req.user.id,
          course: courseId,
          unlockedLevels: nextLevel <= 3 ? [1, nextLevel] : [1],
          completedLevels: [levelNumber],
        });
      } else {
        if (!progress.completedLevels.includes(levelNumber)) {
          progress.completedLevels.push(levelNumber);
        }
        if (nextLevel <= 3 && !progress.unlockedLevels.includes(nextLevel)) {
          progress.unlockedLevels.push(nextLevel);
        }
        await progress.save();
      }
    }

    return res.status(201).json({
      success: true,
      message: passed
        ? "Quiz passed 🎉 Next level unlocked"
        : "Quiz failed ❌ Try again",
      result,
    });
  } catch (error) {
    console.error("SUBMIT QUIZ ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};

/* ===============================
   ▶️ GET QUIZ RESULT
================================ */
exports.getQuizResult = async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.attemptId);
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }
    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load result" });
  }
};

/* ===============================
   ▶️ GET QUIZ REVIEW
================================ */
exports.getQuizReview = async (req, res) => {
  try {
    const result = await QuizResult.findById(req.params.attemptId);
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }

    const questionIds = Array.from(result.answers.keys());
    const questions = await QuizQuestion.find({ _id: { $in: questionIds } });

    return res.status(200).json({
      success: true,
      questions,
      answers: Object.fromEntries(result.answers),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load quiz review" });
  }
};

/* ===============================
   ▶️ TRAINER ATTEMPTS
================================ */
exports.getTrainerQuizAttempts = async (req, res) => {
  try {
    const attempts = await QuizResult.find()
      .populate("user", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    const formatted = attempts.map((a) => ({
      attemptId: a._id,
      userId: a.user?.email || "N/A",
      userName: a.user?.name || "N/A",
      courseTitle: a.course?.title || "N/A",
      level: a.level,
      score: a.score,
      totalQuestions: a.totalQuestions,
      percentage: a.percentage,
      passed: a.passed,
      date: a.createdAt,
    }));

    return res.status(200).json({
      success: true,
      attempts: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch quiz attempts",
    });
  }
};
