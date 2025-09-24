import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Mentor {
  id: string;
  user_id: string;
  name: string;
  company: string;
  role: string;
  expertise: string;
  bio: string | null;
  rating: number;
  available: boolean;
}

interface FindMentorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FindMentorsModal({ open, onOpenChange }: FindMentorsModalProps) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [message, setMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchMentors();
    }
  }, [open]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('available', true);

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast({
        title: "Error",
        description: "Failed to load mentors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedMentor || !user || !message.trim()) {
      toast({
        title: "Error",
        description: "Please select a mentor and write a message",
        variant: "destructive"
      });
      return;
    }

    setApplying(true);
    try {
      const { error } = await supabase
        .from('mentor_applications')
        .insert({
          mentor_id: selectedMentor.user_id,
          student_id: user.id,
          message: message.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your mentor application has been sent!",
      });
      
      setSelectedMentor(null);
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying for mentor:', error);
      toast({
        title: "Error",
        description: "Failed to send application",
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
          <DialogTitle>Find Mentors</DialogTitle>
          <DialogDescription>
            Connect with alumni mentors who can guide your career
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading mentors...</div>
          </div>
        ) : selectedMentor ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/api/placeholder/64/64" />
                    <AvatarFallback>{selectedMentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold">{selectedMentor.name}</h3>
                    <p className="text-muted-foreground">{selectedMentor.role}</p>
                    <p className="text-primary font-medium">{selectedMentor.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{selectedMentor.rating}</span>
                      <Badge variant="secondary">{selectedMentor.expertise}</Badge>
                    </div>
                    {selectedMentor.bio && (
                      <p className="text-sm text-muted-foreground mt-2">{selectedMentor.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message to Mentor</label>
              <Textarea
                placeholder="Introduce yourself and explain why you'd like this mentor to guide you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setSelectedMentor(null)} variant="outline">
                Back to List
              </Button>
              <Button onClick={handleApply} disabled={applying || !message.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {applying ? "Sending..." : "Send Application"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/api/placeholder/48/48" />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <h4 className="font-semibold">{mentor.name}</h4>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <p className="text-sm text-primary">{mentor.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{mentor.rating}</span>
                        <Badge variant="outline" className="text-xs">{mentor.expertise}</Badge>
                      </div>
                      {mentor.bio && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mentor.bio}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedMentor(mentor)}
                    size="sm" 
                    className="w-full mt-3"
                  >
                    Apply for Mentorship
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!loading && mentors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No mentors available at the moment
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}