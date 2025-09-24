import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string | null;
  speaker: string;
  date: string;
  time: string;
  type: string;
  max_participants: number | null;
  active: boolean;
}

interface JoinEventsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JoinEventsModal({ open, onOpenChange }: JoinEventsModalProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [registering, setRegistering] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchEvents();
      fetchRegistrations();
    }
  }, [open]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('active', true)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('student_id', user.id);

      if (error) throw error;
      setRegisteredEvents(new Set(data?.map(reg => reg.event_id) || []));
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const handleRegister = async (eventId: string) => {
    if (!user) return;

    setRegistering(eventId);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          student_id: user.id,
          status: 'registered'
        });

      if (error) throw error;

      setRegisteredEvents(prev => new Set([...prev, eventId]));
      toast({
        title: "Success",
        description: "Successfully registered for the event!",
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Failed to register for event",
        variant: "destructive"
      });
    } finally {
      setRegistering(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Join Events</DialogTitle>
          <DialogDescription>
            Register for upcoming alumni events and workshops
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading events...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const isRegistered = registeredEvents.has(event.id);
              const isRegistering = registering === event.id;
              const isPastDate = new Date(event.date) < new Date();
              
              return (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {event.speaker}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(event.time)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{event.type}</Badge>
                          {event.max_participants && (
                            <Badge variant="secondary">
                              Max {event.max_participants} participants
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {isRegistered ? (
                          <Button disabled variant="outline" className="text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Registered
                          </Button>
                        ) : isPastDate ? (
                          <Button disabled variant="outline">
                            Event Passed
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleRegister(event.id)}
                            disabled={isRegistering}
                          >
                            {isRegistering ? "Registering..." : "Register Now"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {!loading && events.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No events available at the moment
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}