import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  speaker: string;
  date: string;
  time: string;
  type: string;
  description: string;
  max_participants: number;
}

interface JoinEventsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JoinEventsModal({ open, onOpenChange }: JoinEventsModalProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const { user } = useAuth();

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
      toast.error('Failed to load events');
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
        .eq('student_id', user.id)
        .eq('status', 'registered');

      if (error) throw error;
      
      const registeredIds = new Set(data?.map(reg => reg.event_id) || []);
      setRegisteredEvents(registeredIds);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const registerForEvent = async (eventId: string) => {
    if (!user) return;
    
    setRegistering(eventId);
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          student_id: user.id,
          event_id: eventId,
          status: 'registered'
        });

      if (error) throw error;
      
      toast.success('Successfully registered for the event!');
      setRegisteredEvents(prev => new Set([...prev, eventId]));
    } catch (error) {
      console.error('Error registering for event:', error);
      toast.error('Failed to register for event');
    } finally {
      setRegistering(null);
    }
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Join Events
          </DialogTitle>
          <DialogDescription>
            Register for upcoming alumni events and networking opportunities
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {events.map((event) => {
              const isRegistered = registeredEvents.has(event.id);
              const eventDate = new Date(event.date);
              const isUpcoming = eventDate > new Date();
              
              return (
                <Card key={event.id} className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <p className="text-lg text-muted-foreground">{event.speaker}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{event.type}</Badge>
                        {isRegistered && <Badge variant="default">Registered</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {eventDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {formatTime(event.time)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Max {event.max_participants} participants
                      </div>
                    </div>

                    {event.description && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">About this event</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!isRegistered && isUpcoming ? (
                        <Button
                          onClick={() => registerForEvent(event.id)}
                          disabled={registering === event.id}
                          className="flex-1"
                        >
                          {registering === event.id ? 'Registering...' : 'Register Now'}
                        </Button>
                      ) : !isUpcoming ? (
                        <Button disabled className="flex-1">
                          Event Passed
                        </Button>
                      ) : (
                        <Button disabled className="flex-1">
                          Already Registered
                        </Button>
                      )}
                    </div>
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