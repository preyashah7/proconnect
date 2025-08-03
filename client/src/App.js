// src/App.jsx
import React from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import HomeFeedPage from "./pages/HomeFeedPage";
import UserProfilePage from "./pages/UserProfilePage";
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <HomeFeedPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <PrivateRoute>
            <UserProfilePage  />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
