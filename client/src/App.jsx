import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import SetNewPassword from "./pages/SetNewPassword";
import AboutPage from "./dashboard/userDashboard/AboutPage";
import LogoutPage from "./dashboard/userDashboard/LogoutPage";
import ProjectsPage from "./dashboard/userDashboard/ProjectsPage";
import TasksPage from "./dashboard/userDashboard/TasksPage";
import SettingsPage from "./dashboard/userDashboard/SettingsPage";

// Import context providers
import { ProjectsProvider } from "./utils/ProjectsContext";
import { UserProvider } from "./utils/UserContext";

// Import the PrivateRoute component
import PrivateRoute from "./utils/PrivateRoute";
import ProjectDetails from "./dashboard/dashPageComponent/projects/ProjectDetails";
import DashboardPage from "./dashboard/dashPageComponent/dashboard/DashboardPage";
import AdminDashboard from "./dashboard/adminDashboard/AdminDashboard";

function App() {
  return (
    <Router>
      <UserProvider>
        <ProjectsProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<Signup />} />
            {/* Protect the /home route */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:projectId" element={<ProjectDetails />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="logout" element={<LogoutPage />} />
              <Route path="admin" element={<AdminDashboard />} />
              {/* Default nested route */}
              <Route index element={<AboutPage />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<SetNewPassword />} />
          </Routes>
        </ProjectsProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
