import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import AlumniDashboard from "@/components/dashboards/AlumniDashboard";
import StudentsDashboard from "@/components/dashboards/StudentsDashboard";
import FacultyDashboard from "@/components/dashboards/FacultyDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

const Index = () => {
  const { user, profile, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Show appropriate dashboard for authenticated users
  if (user && profile) {
    if (profile.role === "alumni") {
      return <AlumniDashboard />;
    }
    if (profile.role === "student") {
      return <StudentsDashboard />;
    }
    if (profile.role === "faculty") {
      return <FacultyDashboard />;
    }
    if (profile.role === "admin") {
      return <AdminDashboard />;
    }
  }

  return <HeroSection />;
};

export default Index;
