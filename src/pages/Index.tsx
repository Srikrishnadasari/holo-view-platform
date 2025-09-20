import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import AlumniDashboard from "@/components/dashboards/AlumniDashboard";
import StudentsDashboard from "@/components/dashboards/StudentsDashboard";
import FacultyDashboard from "@/components/dashboards/FacultyDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Automatically set role based on user profile
  useEffect(() => {
    if (user && profile) {
      setSelectedRole(profile.role);
    } else if (!user) {
      setSelectedRole(null);
    }
  }, [user, profile]);

  const handleRoleSelect = (role: string) => {
    // Only allow role selection if user is not authenticated
    if (!user) {
      setSelectedRole(role);
    }
  };

  const handleBackToHome = () => {
    setSelectedRole(null);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (selectedRole === "alumni") {
    return <AlumniDashboard onBack={handleBackToHome} />;
  }

  if (selectedRole === "student") {
    return <StudentsDashboard onBack={handleBackToHome} />;
  }

  if (selectedRole === "faculty") {
    return <FacultyDashboard onBack={handleBackToHome} />;
  }

  if (selectedRole === "admin") {
    return <AdminDashboard onBack={handleBackToHome} />;
  }

  return <HeroSection onRoleSelect={handleRoleSelect} />;
};

export default Index;
