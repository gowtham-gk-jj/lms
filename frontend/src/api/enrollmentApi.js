import api from "./axios";

/**
 * ===============================
 * 1. LEARNER – VIEW MY COURSES
 * ===============================
 */
export const getMyCourses = () => {
  return api.get("/enrollment/my-courses");
};

/**
 * ===============================
 * 2. UPDATE LEARNING PROGRESS ✅ FIXED
 * ===============================
 * Backend expects:
 * POST /api/progress/lesson/:courseId/:level
 */
export const updateProgress = (courseId, level) => {
  return api.post(`/progress/lesson/${courseId}/${level}`);
};

/**
 * ===============================
 * 3. ADMIN / TRAINER ENROLL LEARNER
 * ===============================
 */
export const enrollLearner = (data) => {
  return api.post("/enrollment/enroll", data);
};

/**
 * ===============================
 * 4. GET ENROLLMENT DETAILS
 * ===============================
 */
export const getEnrollmentDetails = (enrollmentId) => {
  return api.get(`/enrollment/${enrollmentId}`);
};
