import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatInterfaceProps {
  language: string;
}

export const ChatInterface = ({ language }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your medical assistant. How can I help you today? Please remember that I provide general information only, and you should always consult healthcare professionals for medical advice.",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('medical-chat', {
        body: { message: userMessage, language }
      });

      if (error) throw error;

      setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        { 
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.", 
          isBot: true 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] bg-card border-border shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg.text} isBot={msg.isBot} />
        ))}
        {isLoading && (
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary-foreground animate-spin" />
            </div>
            <div className="bg-card text-card-foreground rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <p className="text-sm text-muted-foreground">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-border p-4 bg-muted/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your health concerns..."
            disabled={isLoading}
            className="flex-1 bg-background"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          This AI provides general information only. Always consult healthcare professionals.
        </p>
      </div>
    </Card>
  );
};
