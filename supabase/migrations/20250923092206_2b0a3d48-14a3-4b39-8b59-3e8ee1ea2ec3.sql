-- Create mentors table
CREATE TABLE public.mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  expertise TEXT NOT NULL,
  rating DECIMAL DEFAULT 5.0,
  bio TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create internships table
CREATE TABLE public.internships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  stipend TEXT NOT NULL,
  deadline DATE NOT NULL,
  description TEXT,
  requirements TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Virtual', 'In-Person', 'Hybrid')),
  description TEXT,
  max_participants INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mentor_applications table
CREATE TABLE public.mentor_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  mentor_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create internship_applications table
CREATE TABLE public.internship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  internship_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'shortlisted', 'rejected', 'accepted')),
  cover_letter TEXT,
  resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  event_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for mentors
CREATE POLICY "Anyone can view active mentors" ON public.mentors FOR SELECT USING (active = true);
CREATE POLICY "Mentors can update their own profile" ON public.mentors FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for internships
CREATE POLICY "Anyone can view active internships" ON public.internships FOR SELECT USING (active = true);

-- Create policies for events
CREATE POLICY "Anyone can view active events" ON public.events FOR SELECT USING (active = true);

-- Create policies for mentor_applications
CREATE POLICY "Students can view their own mentor applications" ON public.mentor_applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create mentor applications" ON public.mentor_applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Mentors can view applications to them" ON public.mentor_applications FOR SELECT USING (mentor_id IN (SELECT user_id FROM public.mentors WHERE user_id = auth.uid()));

-- Create policies for internship_applications
CREATE POLICY "Students can view their own internship applications" ON public.internship_applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create internship applications" ON public.internship_applications FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Create policies for event_registrations
CREATE POLICY "Students can view their own event registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can create event registrations" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Create policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update read status of received messages" ON public.messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_mentors_updated_at BEFORE UPDATE ON public.mentors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON public.internships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentor_applications_updated_at BEFORE UPDATE ON public.mentor_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_internship_applications_updated_at BEFORE UPDATE ON public.internship_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for mentors
INSERT INTO public.mentors (user_id, name, company, role, expertise, rating, bio) VALUES
('00000000-0000-0000-0000-000000000001', 'Dr. Sarah Chen', 'Microsoft', 'Senior Data Scientist', 'Machine Learning', 4.9, 'Expert in ML and AI with 10+ years experience'),
('00000000-0000-0000-0000-000000000002', 'Raj Patel', 'Amazon', 'Software Engineer', 'Full Stack Development', 4.8, 'Full-stack developer specializing in web technologies'),
('00000000-0000-0000-0000-000000000003', 'Lisa Wang', 'Apple', 'UX Designer', 'Product Design', 4.9, 'Product design expert with focus on user experience');

-- Insert sample data for internships
INSERT INTO public.internships (company, role, location, duration, stipend, deadline, description, requirements) VALUES
('Google', 'Software Engineering Intern', 'Bangalore', '3 months', '₹50,000/month', '2024-10-15', 'Work on cutting-edge software projects', 'Programming skills in Java/Python, CS background'),
('Microsoft', 'Data Science Intern', 'Hyderabad', '6 months', '₹45,000/month', '2024-10-20', 'Analyze data and build ML models', 'Python, Statistics, ML knowledge'),
('Amazon', 'Product Management Intern', 'Mumbai', '4 months', '₹55,000/month', '2024-10-25', 'Support product development lifecycle', 'Analytical skills, Business acumen');

-- Insert sample data for events
INSERT INTO public.events (title, speaker, date, time, type, description, max_participants) VALUES
('Tech Talk: Future of AI', 'Dr. Priya Sharma (Google AI)', '2024-10-25', '18:00', 'Virtual', 'Exploring the future trends in AI technology', 500),
('Alumni Networking Meet', 'Multiple Alumni', '2024-11-02', '16:00', 'In-Person', 'Network with successful alumni from various industries', 100),
('Career Guidance Workshop', 'HR Leaders Panel', '2024-11-08', '17:30', 'Hybrid', 'Get career advice from industry HR leaders', 200);