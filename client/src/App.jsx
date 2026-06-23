import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import AIPlanner from "./pages/AIPlanner";
import PlanResult from "./pages/PlanResult";
import PlanHistory from "./pages/PlanHistory";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* Public Routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* AI Planner */}

        <Route
          path="/ai-planner"
          element={
            <ProtectedRoute>
              <AIPlanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plan-result"
          element={
            <ProtectedRoute>
              <PlanResult />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plan-history"
          element={
            <ProtectedRoute>
              <PlanHistory />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;