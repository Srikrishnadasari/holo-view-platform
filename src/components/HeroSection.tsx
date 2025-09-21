import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, GraduationCap, Building, UserCheck, LogIn, UserPlus, LogOut } from "lucide-react";
import heroImage from "@/assets/hero-alumni-platform.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";


export default function HeroSection() {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  
  console.log('HeroSection render:', { user, loading });
  
  const handleLoginClick = () => {
    console.log('Login button clicked - about to navigate');
    try {
      navigate('/auth');
      console.log('Navigation completed');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleSignUpClick = () => {
    console.log('Sign Up button clicked - about to navigate');
    try {
      navigate('/auth');
      console.log('Navigation completed');  
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="floating absolute top-20 left-10 w-8 h-8 bg-primary rounded-full"></div>
        <div className="floating absolute top-40 right-20 w-6 h-6 bg-secondary rounded-full" style={{animationDelay: '1s'}}></div>
        <div className="floating absolute bottom-40 left-20 w-10 h-10 bg-accent rounded-full" style={{animationDelay: '2s'}}></div>
        <div className="floating absolute bottom-20 right-10 w-4 h-4 bg-primary-glow rounded-full" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Auth Navigation */}
        <div className="flex justify-end mb-8">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={handleLoginClick}
                 className="flex items-center gap-2"
               >
                 <LogIn className="h-4 w-4" />
                 Login
               </Button>
               <Button
                 size="sm"
                 onClick={handleSignUpClick}
                 className="flex items-center gap-2"
               >
                 <UserPlus className="h-4 w-4" />
                 Sign Up
               </Button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 glass-card rounded-full">
            <span className="w-2 h-2 bg-accent rounded-full pulse-glow"></span>
            <span className="text-sm font-medium">Smart India Hackathon 2025</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text font-heading">
            Alumni Engagement
            <br />
            <span className="text-4xl md:text-6xl">Platform</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            A centralized digital platform connecting alumni, students, faculty, and institutions 
            for meaningful engagement, mentorship, and growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="text-lg px-8 py-6 group glow-primary">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mb-20 animate-scale-in">
          <div className="relative mx-auto max-w-5xl">
            <img 
              src={heroImage} 
              alt="Alumni Engagement Platform Architecture" 
              className="w-full h-auto rounded-2xl shadow-floating glass-card"
            />
            <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"></div>
          </div>
        </div>


        {/* Message for authenticated users */}
        {user && profile && (
          <div className="mb-16 text-center">
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 font-heading">
                Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
              </h2>
              <p className="text-xl text-muted-foreground mb-4">
                You are logged in as a <span className="font-semibold gradient-text capitalize">{profile.role}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                You will be automatically redirected to your {profile.role} dashboard.
              </p>
            </div>
          </div>
        )}

        {/* Features Preview */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 font-heading">
            Platform <span className="gradient-text">Features</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6 text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Centralized Management</h3>
              <p className="text-sm text-muted-foreground">
                One platform for all colleges with secure, independent data management
              </p>
            </div>
            
            <div className="glass-card p-6 text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-secondary bg-opacity-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Networking</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered matching for mentorship, internships, and collaborations
              </p>
            </div>
            
            <div className="glass-card p-6 text-center animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Building className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive reports and insights for better engagement strategies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}