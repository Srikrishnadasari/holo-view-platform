import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, TrendingUp, Calendar, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  stipend: string;
  deadline: string;
  description: string;
  requirements: string;
}

interface ApplyInternshipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplyInternshipModal({ open, onOpenChange }: ApplyInternshipModalProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      fetchInternships();
      fetchApplications();
    }
  }, [open]);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('internship_applications')
        .select('internship_id')
        .eq('student_id', user.id);

      if (error) throw error;
      
      const appliedIds = new Set(data?.map(app => app.internship_id) || []);
      setAppliedInternships(appliedIds);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const applyToInternship = async (internshipId: string) => {
    if (!user) return;
    
    setApplying(internshipId);
    try {
      const { error } = await supabase
        .from('internship_applications')
        .insert({
          student_id: user.id,
          internship_id: internshipId,
          cover_letter: coverLetter || 'I am interested in this internship opportunity.'
        });

      if (error) throw error;
      
      toast.success('Application submitted successfully!');
      setCoverLetter("");
      setAppliedInternships(prev => new Set([...prev, internshipId]));
    } catch (error) {
      console.error('Error applying to internship:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-secondary" />
            Apply for Internships
          </DialogTitle>
          <DialogDescription>
            Explore and apply for internship opportunities from top companies
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {internships.map((internship) => {
              const isApplied = appliedInternships.has(internship.id);
              return (
                <Card key={internship.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{internship.role}</h3>
                        <p className="text-lg text-primary font-medium">{internship.company}</p>
                      </div>
                      <Badge variant={isApplied ? "default" : "outline"}>
                        {isApplied ? "Applied" : "Apply Now"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {internship.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {internship.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {internship.stipend}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Due {new Date(internship.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{internship.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-1">Requirements</h4>
                        <p className="text-sm text-muted-foreground">{internship.requirements}</p>
                      </div>
                    </div>

                    {!isApplied && (
                      <div className="mt-4 space-y-3">
                        <Textarea
                          placeholder="Write a cover letter explaining why you're interested in this internship..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <Button
                          onClick={() => applyToInternship(internship.id)}
                          disabled={applying === internship.id}
                          className="w-full"
                        >
                          {applying === internship.id ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}