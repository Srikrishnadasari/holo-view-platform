import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Building, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Mentor {
  id: string;
  name: string;
  company: string;
  role: string;
  expertise: string;
  rating: number;
  bio: string;
}

interface FindMentorsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FindMentorsModal({ open, onOpenChange }: FindMentorsModalProps) {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

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
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const applyToMentor = async (mentorId: string) => {
    if (!user) return;
    
    setApplying(mentorId);
    try {
      const { error } = await supabase
        .from('mentor_applications')
        .insert({
          student_id: user.id,
          mentor_id: mentorId,
          message: message || 'I would like to connect with you as my mentor.'
        });

      if (error) throw error;
      
      toast.success('Application sent successfully!');
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error applying to mentor:', error);
      toast.error('Failed to send application');
    } finally {
      setApplying(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Find Mentors
          </DialogTitle>
          <DialogDescription>
            Connect with experienced professionals who can guide your career journey
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/api/placeholder/48/48" />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">{mentor.company}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{mentor.rating}</span>
                      </div>
                      <Badge variant="secondary" className="mt-2">{mentor.expertise}</Badge>
                      <p className="text-xs text-muted-foreground mt-2">{mentor.bio}</p>
                      
                      <div className="mt-3 space-y-2">
                        <Textarea
                          placeholder="Write a message to introduce yourself..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="min-h-[60px]"
                        />
                        <Button
                          onClick={() => applyToMentor(mentor.id)}
                          disabled={applying === mentor.id}
                          className="w-full"
                          size="sm"
                        >
                          {applying === mentor.id ? 'Sending...' : 'Request Mentorship'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}