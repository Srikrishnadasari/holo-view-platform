import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface Conversation {
  other_user_id: string;
  other_user_name: string;
  other_user_role: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface MessagingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId?: string;
  recipientName?: string;
}

export default function MessagingModal({ open, onOpenChange, recipientId, recipientName }: MessagingModalProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchConversations();
      
      // If recipientId is provided, start a conversation with them
      if (recipientId && recipientName) {
        setSelectedConversation({
          other_user_id: recipientId,
          other_user_name: recipientName,
          other_user_role: 'mentor',
          last_message: '',
          last_message_time: '',
          unread_count: 0
        });
        fetchMessages(recipientId);
      }
    }
  }, [open, recipientId, recipientName]);

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch messages where user is sender or receiver
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each unique user
      const userIds = new Set<string>();
      messagesData?.forEach((message: any) => {
        userIds.add(message.sender_id);
        userIds.add(message.receiver_id);
      });

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, role')
        .in('user_id', Array.from(userIds));

      if (profilesError) throw profilesError;

      const profileMap = new Map();
      profiles?.forEach((profile: any) => {
        profileMap.set(profile.user_id, profile);
      });

      // Group messages by conversation
      const conversationMap = new Map<string, Conversation>();
      
      messagesData?.forEach((message: any) => {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        const otherUserProfile = profileMap.get(otherUserId);
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            other_user_id: otherUserId,
            other_user_name: otherUserProfile?.full_name || 'Unknown User',
            other_user_role: otherUserProfile?.role || 'user',
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: 0
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', user.id)
        .eq('read', false);

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!user || !selectedConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedConversation.other_user_id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage("");
      fetchMessages(selectedConversation.other_user_id);
      toast({
        title: "Success",
        description: "Message sent!",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <div className="flex h-[70vh]">
          {/* Conversations List */}
          <div className={`${selectedConversation ? 'hidden md:block' : ''} w-full md:w-1/3 border-r border-border`}>
            <DialogHeader className="p-4 border-b border-border">
              <DialogTitle>Messages</DialogTitle>
              <DialogDescription>
                Your conversations
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[calc(70vh-80px)]">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading conversations...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                <div className="p-2">
                  {conversations.map((conversation) => (
                    <Card 
                      key={conversation.other_user_id}
                      className={`mb-2 cursor-pointer hover:shadow-md transition-shadow ${
                        selectedConversation?.other_user_id === conversation.other_user_id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        fetchMessages(conversation.other_user_id);
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/api/placeholder/40/40" />
                            <AvatarFallback>
                              {conversation.other_user_name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{conversation.other_user_name}</p>
                              <Badge variant="outline" className="text-xs">{conversation.other_user_role}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {conversation.last_message || 'Start a conversation'}
                            </p>
                          </div>
                          {conversation.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Messages View */}
          {selectedConversation && (
            <div className="flex flex-col w-full md:w-2/3">
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>
                    {selectedConversation.other_user_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedConversation.other_user_name}</p>
                  <Badge variant="outline" className="text-xs">{selectedConversation.other_user_role}</Badge>
                </div>
              </div>

              <ScrollArea className="flex-grow p-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a conversation</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isFromUser = message.sender_id === user?.id;
                      return (
                        <div 
                          key={message.id}
                          className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            isFromUser 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              isFromUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatTime(message.created_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={2}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}