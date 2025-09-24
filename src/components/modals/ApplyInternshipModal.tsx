import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, TrendingUp, Calendar, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  stipend: string;
  deadline: string;
  description: string | null;
  requirements: string | null;
  active: boolean;
}

interface ApplyInternshipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApplyInternshipModal({ open, onOpenChange }: ApplyInternshipModalProps) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchInternships();
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
      toast({
        title: "Error",
        description: "Failed to load internships",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedInternship || !user || !coverLetter.trim()) {
      toast({
        title: "Error",
        description: "Please write a cover letter",
        variant: "destructive"
      });
      return;
    }

    setApplying(true);
    try {
      const { error } = await supabase
        .from('internship_applications')
        .insert({
          internship_id: selectedInternship.id,
          student_id: user.id,
          cover_letter: coverLetter.trim(),
          resume_url: resumeUrl.trim() || null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your internship application has been submitted!",
      });
      
      setSelectedInternship(null);
      setCoverLetter("");
      setResumeUrl("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying for internship:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for Internships</DialogTitle>
          <DialogDescription>
            Browse and apply for internship opportunities
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading internships...</div>
          </div>
        ) : selectedInternship ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedInternship.role}</h3>
                    <p className="text-primary font-medium text-lg">{selectedInternship.company}</p>
                  </div>
                  <Badge variant="outline">Apply by {new Date(selectedInternship.deadline).toLocaleDateString()}</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedInternship.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedInternship.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {selectedInternship.stipend}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Deadline {new Date(selectedInternship.deadline).toLocaleDateString()}
                  </div>
                </div>

                {selectedInternship.description && (
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedInternship.description}</p>
                  </div>
                )}

                {selectedInternship.requirements && (
                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <p className="text-sm text-muted-foreground">{selectedInternship.requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume URL (Optional)</label>
                <Input
                  placeholder="https://drive.google.com/your-resume-link"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Letter *</label>
                <Textarea
                  placeholder="Explain why you're interested in this internship and what makes you a good fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setSelectedInternship(null)} variant="outline">
                Back to List
              </Button>
              <Button onClick={handleApply} disabled={applying || !coverLetter.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {applying ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {internships.map((internship) => (
              <Card key={internship.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{internship.role}</h4>
                      <p className="text-primary font-medium">{internship.company}</p>
                    </div>
                    <Badge variant="outline">
                      Apply by {new Date(internship.deadline).toLocaleDateString()}
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
                      Due {new Date(internship.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedInternship(internship)}
                    >
                      Apply Now
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && internships.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No internships available at the moment
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}