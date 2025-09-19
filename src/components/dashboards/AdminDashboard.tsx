import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  CheckCircle, 
  Calendar, 
  BarChart3, 
  Users, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Filter,
  Download,
  Settings,
  Eye,
  Mail,
  Bell,
  Search,
  Plus
} from "lucide-react";

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Total Alumni", value: "2,847", icon: Users, color: "primary", trend: "+12%" },
    { title: "Pending Approvals", value: "23", icon: AlertCircle, color: "secondary", trend: "+5" },
    { title: "Active Events", value: "8", icon: Calendar, color: "accent", trend: "+2" },
    { title: "Monthly Reports", value: "15", icon: BarChart3, color: "muted", trend: "Generated" }
  ];

  const pendingApprovals = [
    {
      type: "Event Creation",
      requester: "Sarah Chen",
      role: "Alumni",
      details: "Tech Meetup 2024",
      date: "2024-10-20",
      priority: "high"
    },
    {
      type: "Mentor Registration",
      requester: "Raj Patel",
      role: "Alumni", 
      details: "Machine Learning Mentorship",
      date: "2024-10-19",
      priority: "medium"
    },
    {
      type: "Donation Initiative",
      requester: "Dr. Kumar",
      role: "Faculty",
      details: "Student Scholarship Fund",
      date: "2024-10-18",
      priority: "high"
    },
    {
      type: "Internship Posting",
      requester: "Lisa Wang",
      role: "Alumni",
      details: "UX Design Internship",
      date: "2024-10-17",
      priority: "low"
    }
  ];

  const recentActivities = [
    { action: "Alumni registration approved", user: "Alex Johnson", time: "2 hours ago" },
    { action: "Event 'AI Workshop' created", user: "Dr. Sharma", time: "4 hours ago" },
    { action: "Monthly report generated", user: "System", time: "6 hours ago" },
    { action: "Bulk email sent to alumni", user: "Admin", time: "8 hours ago" },
    { action: "Database backup completed", user: "System", time: "12 hours ago" }
  ];

  const upcomingEvents = [
    {
      title: "Annual Alumni Meet 2024",
      organizer: "College Administration",
      date: "Nov 15, 2024",
      attendees: 250,
      status: "confirmed"
    },
    {
      title: "Tech Innovation Summit",
      organizer: "Sarah Chen",
      date: "Oct 28, 2024", 
      attendees: 120,
      status: "pending"
    },
    {
      title: "Startup Pitch Day",
      organizer: "Alumni Committee",
      date: "Dec 5, 2024",
      attendees: 80,
      status: "confirmed"
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
              <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
              <p className="text-muted-foreground">College Management Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Avatar className="h-12 w-12 ring-2 ring-primary ring-offset-2">
              <AvatarImage src="/api/placeholder/48/48" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
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
                  <Settings className="w-5 h-5 text-primary" />
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Database className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Manage Database</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Mail className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Send Alumni Email</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <BarChart3 className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Generate Reports</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 group">
                    <Calendar className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Manage Events</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-secondary" />
                  Pending Approvals
                  <Badge variant="secondary" className="ml-auto">
                    {pendingApprovals.length}
                  </Badge>
                </CardTitle>
                <CardDescription>Review and approve requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((item, index) => (
                    <div key={index} className="p-4 glass-card rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{item.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {item.requester} ({item.role})
                          </p>
                          <p className="text-sm text-primary">{item.details}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge 
                            variant={
                              item.priority === 'high' ? 'destructive' : 
                              item.priority === 'medium' ? 'default' : 'outline'
                            }
                            className="text-xs"
                          >
                            {item.priority} priority
                          </Badge>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="default">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive">
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Event Management */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  Event Management
                </CardTitle>
                <CardDescription>Manage upcoming alumni events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-4 glass-card rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">by {event.organizer}</p>
                          <p className="text-sm text-primary">{event.date}</p>
                          <p className="text-xs text-muted-foreground">{event.attendees} expected attendees</p>
                        </div>
                        <Badge variant={event.status === 'confirmed' ? 'default' : 'outline'}>
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-1" />
                          Send Invites
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* System Health */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Database Performance</span>
                    <span className="text-accent">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Server Uptime</span>
                    <span className="text-accent">99.8%</span>
                  </div>
                  <Progress value={99.8} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>User Engagement</span>
                    <span className="text-accent">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Storage Usage</span>
                    <span className="text-secondary">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/5">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-grow">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">New Alumni This Month</span>
                  <Badge variant="secondary">+47</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Mentorships</span>
                  <Badge variant="default">124</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Events This Quarter</span>
                  <Badge variant="outline">18</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Donations</span>
                  <Badge variant="secondary">₹12.5L</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}