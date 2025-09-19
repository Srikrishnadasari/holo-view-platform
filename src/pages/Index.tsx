import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import AlumniDashboard from "@/components/dashboards/AlumniDashboard";
import StudentsDashboard from "@/components/dashboards/StudentsDashboard";
import FacultyDashboard from "@/components/dashboards/FacultyDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleBackToHome = () => {
    setSelectedRole(null);
  };

  if (selectedRole === "alumni") {
    return <AlumniDashboard onBack={handleBackToHome} />;
  }

  if (selectedRole === "students") {
    return <StudentsDashboard onBack={handleBackToHome} />;
  }

  if (selectedRole === "faculty") {
    return <FacultyDashboard onBack={handleBackToHome} />;
  }

  if (selectedRole === "college admin") {
    return <AdminDashboard onBack={handleBackToHome} />;
  }

  return <HeroSection onRoleSelect={handleRoleSelect} />;
};

export default Index;
