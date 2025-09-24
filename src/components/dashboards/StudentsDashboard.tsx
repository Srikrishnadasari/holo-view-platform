import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Calendar, 
  Briefcase, 
  Users, 
  BookOpen, 
  Target,
  Clock,
  MapPin,
  Star,
  MessageCircle,
  TrendingUp,
  Award,
  GraduationCap,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import FindMentorsModal from "@/components/modals/FindMentorsModal";
import ApplyInternshipModal from "@/components/modals/ApplyInternshipModal";
import JoinEventsModal from "@/components/modals/JoinEventsModal";
import MessagingModal from "@/components/modals/MessagingModal";

export default function StudentsDashboard() {
  const { signOut, profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [mentors, setMentors] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [mentorshipApplications, setMentorshipApplications] = useState<any[]>([]);
  const [showFindMentors, setShowFindMentors] = useState(false);
  const [showApplyInternship, setShowApplyInternship] = useState(false);
  const [showJoinEvents, setShowJoinEvents] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState<string | undefined>();
  const [selectedMentorName, setSelectedMentorName] = useState<string | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch mentorship applications
      const { data: applications } = await supabase
        .from('mentor_applications')
        .select(`
          *,
          mentors (name, company, role, user_id)
        `)
        .eq('student_id', user.id)
        .eq('status', 'accepted');

      setMentorshipApplications(applications || []);
      setMentors(applications?.map(app => app.mentors).filter(Boolean) || []);

      // Fetch available internships (sample)
      const { data: internshipsData } = await supabase
        .from('internships')
        .select('*')
        .eq('active', true)
        .limit(3);

      setInternships(internshipsData || []);

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(3);

      setUpcomingEvents(eventsData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const stats = [
    { title: "Active Mentorships", value: mentors.length.toString(), icon: Users, color: "primary", trend: "+1" },
    { title: "Internship Applications", value: "8", icon: Briefcase, color: "secondary", trend: "+2" },
    { title: "Events Attended", value: "12", icon: Calendar, color: "accent", trend: "+4" },
    { title: "Skills Learned", value: "15", icon: BookOpen, color: "muted", trend: "+3" }
  ];

  const handleMessageMentor = (mentorId: string, mentorName: string) => {
    setSelectedMentorId(mentorId);
    setSelectedMentorName(mentorName);
    setShowMessaging(true);
  };



  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                <Avatar className="h-10 w-10 ring-2 ring-primary ring-offset-2">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback>{profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="font-semibold text-sm">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-background border border-border">
              <div className="px-3 py-2">
                <p className="font-medium">{profile?.full_name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary" className="mt-1">Student</Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2 group"
                    onClick={() => setShowFindMentors(true)}
                  >
                    <Search className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Find Mentors</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2 group"
                    onClick={() => setShowApplyInternship(true)}
                  >
                    <Briefcase className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Apply Internships</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex flex-col gap-2 group"
                    onClick={() => setShowJoinEvents(true)}
                  >
                    <Calendar className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Join Events</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Internships */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-secondary" />
                  Available Internships
                </CardTitle>
                <CardDescription>Apply for internships from top companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {internships.map((internship, index) => (
                    <div key={index} className="p-4 glass-card rounded-lg interactive-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{internship.role}</h4>
                          <p className="text-primary font-medium">{internship.company}</p>
                        </div>
                        <Badge variant={internship.applied ? "default" : "outline"}>
                          {internship.applied ? "Applied" : "Apply Now"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {internship.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {internship.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {internship.stipend}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {internship.deadline}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          disabled={internship.applied}
                          className={internship.applied ? "opacity-50" : ""}
                        >
                          {internship.applied ? "Applied" : "Apply Now"}
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
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
            {/* Current Mentors */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  My Mentors
                </CardTitle>
                <CardDescription>Your assigned mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mentors.map((mentor, index) => (
                    <div key={index} className="p-3 glass-card rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`/api/placeholder/40/40`} />
                          <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                          <h4 className="font-medium text-sm">{mentor.name}</h4>
                          <p className="text-xs text-muted-foreground">{mentor.role}</p>
                          <p className="text-xs text-primary">{mentor.company}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-xs">{mentor.rating}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {mentor.sessions} sessions
                            </span>
                          </div>
                          <p className="text-xs text-accent mt-1">{mentor.nextSession}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => handleMessageMentor(mentor.user_id, mentor.name)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </Button>
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
                <CardDescription>Alumni events you can attend</CardDescription>
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
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{event.date}</span>
                        <span>{event.time}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3 text-xs"
                        onClick={() => setShowJoinEvents(true)}
                      >
                        Register Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-secondary" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>React Development</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Data Structures</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Machine Learning</span>
                    <span>58%</span>
                  </div>
                  <Progress value={58} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <FindMentorsModal open={showFindMentors} onOpenChange={setShowFindMentors} />
        <ApplyInternshipModal open={showApplyInternship} onOpenChange={setShowApplyInternship} />
        <JoinEventsModal open={showJoinEvents} onOpenChange={setShowJoinEvents} />
        <MessagingModal 
          open={showMessaging} 
          onOpenChange={setShowMessaging}
          recipientId={selectedMentorId}
          recipientName={selectedMentorName}
        />
      </div>
    </div>
  );
}