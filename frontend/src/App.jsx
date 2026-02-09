import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* ================= PUBLIC ================= */
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import UserArticles from "./pages/UserArticles";
import Unauthorized from "./pages/Unauthorized";
import CourseDetails from "./pages/CourseDetails";

/* ================= LEARNER ================= */
import LearnerDashboard from "./pages/Learnerdashboard";
import LearningPage from "./pages/LearningPage";

/* ================= ADMIN ================= */
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import CreateUser from "./pages/CreateUser";
import AdminArticles from "./pages/AdminArticles";
import AdminEnrollment from "./pages/AdminEnrollment";
import AdminProgressPage from "./pages/AdminProgressPage";
import RoleDashboard from "./pages/RoleDashboard";

/* ================= ORGANIZATION ================= */
import OrganizationSetup from "./pages/OrganizationSetup";
import OrganizationProfile from "./pages/OrganizationProfile";
import LogoBranding from "./pages/LogoBranding";
import LearningRules from "./pages/LearningRules";
import SystemSettings from "./pages/SystemSettings";

/* ================= TRAINER ================= */
import TrainerDashboard from "./pages/TrainerDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import AddLevel from "./pages/AddLevel";

/* ================= TRAINER QUIZ ================= */
import TrainerQuizDashboard from "./pages/trainer/TrainerQuizDashboard";
import CreateQuiz from "./pages/trainer/CreateQuiz";
import CourseQuizList from "./pages/trainer/CourseQuizList";
import TrainerQuizQuestions from "./pages/trainer/TrainerQuizQuestions";
import EditQuizQuestion from "./pages/trainer/EditQuizQuestion";
import EditAllQuizQuestions from "./pages/trainer/EditAllQuizQuestions";
import TrainerQuizAttempts from "./pages/trainer/TrainerQuizAttempts";

/* ================= LEARNER QUIZ ================= */
import QuizStart from "./pages/quiz/QuizStart";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResult from "./pages/quiz/QuizResult";
import QuizReview from "./pages/quiz/QuizReview";

/* ================= CERTIFICATION ================= */
import MyCertificates from "./pages/MyCertificates";
import CertificateManager from "./pages/trainer/CertificateManager";

/* ================= NOTIFICATIONS ================= */
import NotificationsPage from "./pages/NotificationsPage";


function App() {
  const location = useLocation();

  /* ================= HIDE NAVBAR ================= */
  const hideNavbar =
    ["/login", "/forgot-password", "/unauthorized"].includes(location.pathname) ||
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/trainer-dashboard") ||
    location.pathname.startsWith("/trainer") ||
    location.pathname.startsWith("/learner-dashboard") ||
    location.pathname.startsWith("/learn") ||
    location.pathname.startsWith("/quiz") ||
    location.pathname.startsWith("/my-certificates");

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "main-with-navbar" : "main-full"}>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/articles" element={<UserArticles />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/course/:id" element={<CourseDetails />} />

          {/* ================= LEARNER ================= */}
          <Route
            path="/learner-dashboard"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <LearnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/learn/:courseId/:level"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <LearningPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-certificates"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <MyCertificates />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* 🔥 ADMIN OVERVIEW */}
            <Route
              path="overview"
              element={<RoleDashboard role="Admin" full />}
            />

            <Route path="users" element={<UserManagement />} />
            <Route path="users/create" element={<CreateUser />} />
            <Route path="articles/create" element={<AdminArticles />} />
            <Route path="enroll" element={<AdminEnrollment />} />
            <Route path="progress" element={<AdminProgressPage />} />

            <Route path="organization" element={<OrganizationSetup />}>
              <Route index element={<OrganizationProfile />} />
              <Route path="branding" element={<LogoBranding />} />
              <Route path="rules" element={<LearningRules />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>
          </Route>

          {/* ================= TRAINER ================= */}

          {/* 🔥 TRAINER OVERVIEW */}
          <Route
            path="/trainer-dashboard/overview"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <RoleDashboard role="Trainer" full />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer-dashboard"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/create-course"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <CreateCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/edit-course/:id"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/add-level/:id"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <AddLevel />
              </ProtectedRoute>
            }
          />

          {/* ================= TRAINER QUIZ ================= */}
          <Route
            path="/trainer/quizzes"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <TrainerQuizDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/create-quiz"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/course/:courseId/quizzes"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <CourseQuizList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/course/:courseId/quiz/level/:level"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <TrainerQuizQuestions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/edit-question/:questionId"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <EditQuizQuestion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/edit-questions/:courseId/:level"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <EditAllQuizQuestions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trainer/quiz-attempts"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <TrainerQuizAttempts />
              </ProtectedRoute>
            }
          />
          {/* 🔥 LEARNER OVERVIEW */}
          <Route
            path="/learner-dashboard/overview"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <RoleDashboard role="Learner" full />
              </ProtectedRoute>
            }
          />


          <Route
            path="/trainer/certificates"
            element={
              <ProtectedRoute allowedRoles={["trainer", "instructor"]}>
                <CertificateManager />
              </ProtectedRoute>
            }
          />

          {/* ================= LEARNER QUIZ ================= */}
          <Route
            path="/quiz/:courseId/:level"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <QuizStart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/:courseId/:level/play"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/result/:attemptId"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <QuizResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz/review/:attemptId"
            element={
              <ProtectedRoute allowedRoles={["learner", "student"]}>
                <QuizReview />
              </ProtectedRoute>
            }
          />
          {/* ================= NOTIFICATIONS ================= */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={["admin", "trainer", "instructor", "learner", "student"]}>
               <NotificationsPage />
              </ProtectedRoute>
            }
          />


          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
