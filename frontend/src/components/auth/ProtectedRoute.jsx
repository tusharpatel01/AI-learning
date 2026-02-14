import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // While auth state is being checked
  if (loading) {
    return null; // or a spinner component
  }

  // Force boolean check to avoid rendering numbers like "2"
  const isAuth = Boolean(isAuthenticated);

  // If not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render layout + protected pages
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtectedRoute;
