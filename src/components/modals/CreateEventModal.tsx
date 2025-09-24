import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "",
    date: "",
    time: "",
    type: "",
    max_participants: ""
  });
  const [creating, setCreating] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!user || !formData.title.trim() || !formData.speaker.trim() || !formData.date || !formData.time || !formData.type.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          speaker: formData.speaker.trim(),
          date: formData.date,
          time: formData.time,
          type: formData.type.trim(),
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          active: false // Events need admin approval
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Event created and sent for admin approval!",
      });
      
      setFormData({
        title: "",
        description: "",
        speaker: "",
        date: "",
        time: "",
        type: "",
        max_participants: ""
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Create a new event for the alumni community (requires admin approval)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Tech Talk: Future of AI"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="speaker">Speaker/Organizer *</Label>
            <Input
              id="speaker"
              value={formData.speaker}
              onChange={(e) => setFormData(prev => ({ ...prev, speaker: e.target.value }))}
              placeholder="e.g., Dr. John Smith"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type *</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              placeholder="e.g., Virtual, In-Person, Hybrid"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_participants">Max Participants (Optional)</Label>
            <Input
              id="max_participants"
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData(prev => ({ ...prev, max_participants: e.target.value }))}
              placeholder="e.g., 100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the event, agenda, and what attendees can expect..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            <Plus className="w-4 h-4 mr-2" />
            {creating ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}