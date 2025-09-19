import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Trophy, 
  Users, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Star,
  Heart,
  Share2,
  Award,
  Briefcase,
  BookOpen,
  Phone
} from "lucide-react";

interface AlumniDashboardProps {
  onBack: () => void;
}

export default function AlumniDashboard({ onBack }: AlumniDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Students Mentored", value: "24", icon: Users, color: "primary", trend: "+12%" },
    { title: "Achievements Shared", value: "8", icon: Trophy, color: "secondary", trend: "+3" },
    { title: "Donations Made", value: "$2,450", icon: DollarSign, color: "accent", trend: "+$500" },
    { title: "Events Created", value: "6", icon: Calendar, color: "muted", trend: "+2" }
  ];

  const achievements = [
    { title: "Senior Software Engineer at Google", date: "2024", type: "career", likes: 45 },
    { title: "Published Research on AI Ethics", date: "2024", type: "academic", likes: 32 },
    { title: "Startup Funding Round Completed", date: "2023", type: "business", likes: 67 },
    { title: "IEEE Outstanding Engineer Award", date: "2023", type: "award", likes: 89 }
  ];

  const mentees = [
    { name: "Priya Sharma", year: "3rd Year", field: "Computer Science", progress: 78 },
    { name: "Rahul Kumar", year: "4th Year", field: "Data Science", progress: 65 },
    { name: "Anita Patel", year: "2nd Year", field: "AI/ML", progress: 45 },
    { name: "Vikram Singh", year: "3rd Year", field: "Web Development", progress: 82 }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
              ← Back to Home
            </Button>
            <div className="h-8 w-px bg-border"></div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Alumni Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Alex Johnson</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary ring-offset-2">
              <AvatarImage src="/api/placeholder/48/48" />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-semibold">Alex Johnson</p>
              <p className="text-sm text-muted-foreground">Class of 2020</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title} className="glass-card animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-accent">↗ {stat.trend}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color} bg-opacity-10 flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 text-${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <User className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Update Profile</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Trophy className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Share Achievement</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Users className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Find Mentees</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Calendar className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Create Event</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-secondary" />
                  Recent Achievements
                </CardTitle>
                <CardDescription>Share your professional milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 glass-card rounded-lg interactive-card">
                      <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center">
                        {achievement.type === 'career' && <Briefcase className="w-5 h-5 text-primary" />}
                        {achievement.type === 'academic' && <BookOpen className="w-5 h-5 text-primary" />}
                        {achievement.type === 'business' && <TrendingUp className="w-5 h-5 text-primary" />}
                        {achievement.type === 'award' && <Award className="w-5 h-5 text-primary" />}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.date}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        {achievement.likes}
                        <Share2 className="w-4 h-4 ml-2 cursor-pointer hover:text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4 ring-2 ring-primary ring-offset-2">
                    <AvatarImage src="/api/placeholder/96/96" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">Alex Johnson</h3>
                  <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
                  <p className="text-sm text-muted-foreground">Google Inc.</p>
                  <Badge variant="secondary" className="mt-2">Class of 2020</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span>alex.johnson@gmail.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Mentees */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Current Mentees
                </CardTitle>
                <CardDescription>Students you're currently mentoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentees.map((mentee, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{mentee.name}</p>
                          <p className="text-xs text-muted-foreground">{mentee.year} • {mentee.field}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {mentee.progress}%
                        </Badge>
                      </div>
                      <Progress value={mentee.progress} className="h-2" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Mentees
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}