import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  GraduationCap,
  Award,
  Building,
  Mail,
  Video,
  FileText,
  Star,
  Clock,
  Target,
  Lightbulb
} from "lucide-react";

interface FacultyDashboardProps {
  onBack: () => void;
}

export default function FacultyDashboard({ onBack }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Active Collaborations", value: "18", icon: Users, color: "primary", trend: "+3" },
    { title: "Student Connections", value: "156", icon: GraduationCap, color: "secondary", trend: "+12" },
    { title: "Alumni Partnerships", value: "24", icon: Building, color: "accent", trend: "+5" },
    { title: "Academic Events", value: "7", icon: Calendar, color: "muted", trend: "+2" }
  ];

  const collaborations = [
    {
      title: "AI Research Mentorship Program",
      alumni: "Dr. Sarah Chen",
      company: "Google AI",
      students: 8,
      status: "active",
      startDate: "Sept 2024",
      type: "research"
    },
    {
      title: "Industry Project Partnership",
      alumni: "Raj Patel",
      company: "Microsoft",
      students: 12,
      status: "active", 
      startDate: "Aug 2024",
      type: "project"
    },
    {
      title: "Startup Incubation Workshop",
      alumni: "Lisa Wang",
      company: "Apple",
      students: 15,
      status: "pending",
      startDate: "Nov 2024",
      type: "workshop"
    }
  ];

  const studentProgress = [
    { name: "Priya Sharma", program: "M.Tech AI", mentor: "Dr. Sarah Chen", progress: 85, grade: "A" },
    { name: "Rahul Kumar", program: "B.Tech CSE", mentor: "Raj Patel", progress: 72, grade: "B+" },
    { name: "Anita Patel", program: "M.Tech Data Science", mentor: "Lisa Wang", progress: 68, grade: "B" },
    { name: "Vikram Singh", program: "B.Tech IT", mentor: "Alex Johnson", progress: 91, grade: "A+" }
  ];

  const upcomingEvents = [
    {
      title: "Guest Lecture: Future of AI",
      speaker: "Dr. Sarah Chen (Google AI)",
      date: "Oct 25, 2024",
      time: "3:00 PM",
      audience: "M.Tech Students",
      type: "lecture"
    },
    {
      title: "Industry Connect Webinar",
      speaker: "Tech Leaders Panel",
      date: "Nov 2, 2024", 
      time: "5:00 PM",
      audience: "All Students",
      type: "webinar"
    },
    {
      title: "Research Symposium",
      speaker: "Alumni Researchers",
      date: "Nov 10, 2024",
      time: "10:00 AM",
      audience: "Research Students",
      type: "symposium"
    }
  ];

  const researchProjects = [
    {
      title: "Machine Learning in Healthcare",
      lead: "Dr. Kumar",
      alumni: ["Dr. Sarah Chen", "Alex Johnson"],
      students: 6,
      funding: "₹15L",
      status: "ongoing"
    },
    {
      title: "Blockchain for Supply Chain",
      lead: "Dr. Sharma",
      alumni: ["Raj Patel"],
      students: 4,
      funding: "₹8L",
      status: "completed"
    }
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
              <h1 className="text-3xl font-bold gradient-text">Faculty Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Dr. Priya Sharma</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary ring-offset-2">
              <AvatarImage src="/api/placeholder/48/48" />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="font-semibold">Dr. Priya Sharma</p>
              <p className="text-sm text-muted-foreground">Professor, Computer Science</p>
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
                  <Target className="w-5 h-5 text-primary" />
                  Faculty Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Coordinate Alumni</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Calendar className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Schedule Events</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <BookOpen className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Academic Support</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Lightbulb className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Research Projects</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Collaborations */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Active Alumni Collaborations
                </CardTitle>
                <CardDescription>Alumni-Faculty partnerships and programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collaborations.map((collab, index) => (
                    <div key={index} className="p-4 glass-card rounded-lg interactive-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{collab.title}</h4>
                          <p className="text-primary font-medium">
                            {collab.alumni} • {collab.company}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {collab.students} students enrolled • Started {collab.startDate}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={collab.status === 'active' ? 'default' : 'outline'}>
                            {collab.status}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {collab.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact Alumni
                        </Button>
                        <Button size="sm" variant="outline">
                          <Users className="w-4 h-4 mr-1" />
                          View Students
                        </Button>
                        <Button size="sm" variant="ghost">
                          <FileText className="w-4 h-4 mr-1" />
                          Reports
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Research Projects */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Research Projects
                </CardTitle>
                <CardDescription>Alumni-supported research initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {researchProjects.map((project, index) => (
                    <div key={index} className="p-4 glass-card rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">Lead: {project.lead}</p>
                          <p className="text-sm text-primary">
                            Alumni: {project.alumni.join(', ')}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{project.students} students</span>
                            <span>Funding: {project.funding}</span>
                          </div>
                        </div>
                        <Badge variant={project.status === 'ongoing' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        View Project Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Student Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-secondary" />
                  Student Progress
                </CardTitle>
                <CardDescription>Students under alumni mentorship</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.map((student, index) => (
                    <div key={index} className="p-3 glass-card rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{student.name}</h4>
                          <p className="text-xs text-muted-foreground">{student.program}</p>
                          <p className="text-xs text-primary">Mentor: {student.mentor}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs mb-1">
                            Grade: {student.grade}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{student.progress}%</p>
                        </div>
                      </div>
                      <Progress value={student.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Upcoming Events
                </CardTitle>
                <CardDescription>Alumni-faculty academic events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-3 glass-card rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{event.speaker}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </div>
                      </div>
                      <p className="text-xs text-primary mb-2">For: {event.audience}</p>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        Join/Manage
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Department Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Alumni Engagement</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Student Satisfaction</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Project Success Rate</span>
                    <span>87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}