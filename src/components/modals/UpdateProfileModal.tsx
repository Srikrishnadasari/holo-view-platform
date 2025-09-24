import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UpdateProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpdateProfileModal({ open, onOpenChange }: UpdateProfileModalProps) {
  const [formData, setFormData] = useState({
    full_name: "",
    company: "",
    role: "",
    bio: "",
    expertise: ""
  });
  const [saving, setSaving] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && profile) {
      setFormData({
        full_name: profile.full_name || "",
        company: "",
        role: "",
        bio: "",
        expertise: ""
      });
      
      // Fetch mentor profile if exists
      fetchMentorProfile();
    }
  }, [open, profile]);

  const fetchMentorProfile = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('mentors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setFormData(prev => ({
          ...prev,
          company: data.company || "",
          role: data.role || "",
          bio: data.bio || "",
          expertise: data.expertise || ""
        }));
      }
    } catch (error) {
      // Mentor profile might not exist yet
      console.log('No mentor profile found');
    }
  };

  const handleSave = async () => {
    if (!user || !formData.full_name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in your full name",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Update main profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim()
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update or create mentor profile if alumni
      if (profile?.role === 'alumni' && formData.company && formData.role && formData.expertise) {
        const { error: mentorError } = await supabase
          .from('mentors')
          .upsert({
            user_id: user.id,
            name: formData.full_name.trim(),
            company: formData.company.trim(),
            role: formData.role.trim(),
            bio: formData.bio.trim() || null,
            expertise: formData.expertise.trim()
          });

        if (mentorError) throw mentorError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>

          {profile?.role === 'alumni' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter your company"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Enter your role"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise</Label>
                <Input
                  id="expertise"
                  value={formData.expertise}
                  onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                  placeholder="e.g., Machine Learning, Web Development"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell students about yourself..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}