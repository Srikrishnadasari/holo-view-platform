import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ShareAchievementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ShareAchievementModal({ open, onOpenChange }: ShareAchievementModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "career" as "career" | "academic" | "business" | "award"
  });
  const [sharing, setSharing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleShare = async () => {
    if (!user || !formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please fill in the achievement title",
        variant: "destructive"
      });
      return;
    }

    setSharing(true);
    try {
      const { error } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          type: formData.type
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Achievement shared successfully!",
      });
      
      setFormData({
        title: "",
        description: "",
        type: "career"
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error sharing achievement:', error);
      toast({
        title: "Error",
        description: "Failed to share achievement",
        variant: "destructive"
      });
    } finally {
      setSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Achievement</DialogTitle>
          <DialogDescription>
            Share your professional milestone with the alumni community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Achievement Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Promoted to Senior Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select achievement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="award">Award</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Share more details about your achievement..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={sharing}>
            <Share2 className="w-4 h-4 mr-2" />
            {sharing ? "Sharing..." : "Share Achievement"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}