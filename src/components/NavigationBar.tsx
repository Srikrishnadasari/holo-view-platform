import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  Building, 
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface NavigationBarProps {
  currentRole?: string;
  onRoleChange?: (role: string) => void;
  onHome?: () => void;
}

export default function NavigationBar({ currentRole, onRoleChange, onHome }: NavigationBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roles = [
    { id: "alumni", label: "Alumni", icon: GraduationCap, color: "primary" },
    { id: "students", label: "Students", icon: Users, color: "secondary" },
    { id: "faculty", label: "Faculty", icon: UserCheck, color: "accent" },
    { id: "college admin", label: "Admin", icon: Building, color: "muted" }
  ];

  return (
    <nav className="glass-card border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg gradient-text">AlumniConnect</h1>
              <p className="text-xs text-muted-foreground">SIH 2025</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {roles.map((role) => {
              const IconComponent = role.icon;
              const isActive = currentRole === role.id;
              
              return (
                <Button
                  key={role.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onRoleChange?.(role.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {role.label}
                  {isActive && <Badge variant="secondary" className="ml-1 text-xs">Active</Badge>}
                </Button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="flex flex-col gap-2">
              {roles.map((role) => {
                const IconComponent = role.icon;
                const isActive = currentRole === role.id;
                
                return (
                  <Button
                    key={role.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      onRoleChange?.(role.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 justify-start"
                  >
                    <IconComponent className="w-4 h-4" />
                    {role.label}
                    {isActive && <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}