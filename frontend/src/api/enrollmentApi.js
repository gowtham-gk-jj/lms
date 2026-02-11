import api from "./axios";

export const getMyCourses = () => {
  return api.get("/api/enrollment/my-courses");
};

export const updateProgress = (courseId, level) => {
  return api.post(`/api/progress/lesson/${courseId}/${level}`);
};

export const enrollLearner = (data) => {
  return api.post("/api/enrollment/enroll", data);
};

export const getEnrollmentDetails = (enrollmentId) => {
  return api.get(`/api/enrollment/${enrollmentId}`);
};
