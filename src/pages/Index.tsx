import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ChatInterface, ChatInterfaceRef } from "@/components/ChatInterface";
import { SymptomsChecker } from "@/components/SymptomsChecker";
import { ChatHistory } from "@/components/ChatHistory";
import { Button } from "@/components/ui/button";
import { Activity, LogOut, Phone, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [session, setSession] = useState<Session | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const chatInterfaceRef = useRef<ChatInterfaceRef>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSymptomsSubmit = (symptoms: string[]) => {
    const symptomsMessage = `I have the following symptoms: ${symptoms.join(", ")}. Can you provide relevant health information and advice?`;
    chatInterfaceRef.current?.sendSymptoms([symptomsMessage]);
  };

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    chatInterfaceRef.current?.loadConversation(conversationId);
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    chatInterfaceRef.current?.clearMessages();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleEmergency = () => {
    toast({
      title: "⚠️ Emergency Detected",
      description: "Please call your local emergency services immediately. Stay calm and follow their instructions.",
      variant: "destructive",
    });
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Activity className="w-10 h-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Multilanguage's Medical Chatbot using Large Language Models (LLMs)
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check your symptoms and get health information in your preferred language
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            <Button onClick={handleEmergency} variant="destructive" size="sm" className="gap-2">
              <Phone className="w-4 h-4" />
              Safety+ Emergency
            </Button>
            <Button onClick={() => navigate("/emergency-contacts")} variant="default" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Emergency Contacts
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
          <ChatHistory
            onConversationSelect={handleConversationSelect}
            onNewChat={handleNewChat}
            currentConversationId={currentConversationId}
          />
          <SymptomsChecker onSymptomsSubmit={handleSymptomsSubmit} language={selectedLanguage} />
          <ChatInterface
            ref={chatInterfaceRef}
            language={selectedLanguage}
            conversationId={currentConversationId}
            onConversationCreated={setCurrentConversationId}
          />
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground space-y-4">
          <div>
            <h3 className="font-semibold text-base mb-2 text-foreground">Project Description</h3>
            <p className="max-w-3xl mx-auto">
              This project involves the development of a multilanguages medical chatbot designed to assist users in obtaining reliable health-related information through natural language interactions. The system is powered by Large Language Models (LLMs), enabling it to understand and respond to user queries in multiple languages with high contextual accuracy.
            </p>
            <p className="max-w-3xl mx-auto mt-2">
              The chatbot also incorporates a user history management system, allowing it to store and retrieve previous conversations — similar to how platforms like ChatGPT.com manage user chat histories. This feature enhances personalization and continuity in user interactions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-base mb-2 text-foreground">Contributors</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
              <span>Rushi (23BDS030)</span>
              <span>•</span>
              <span>Harsha (23BDS073)</span>
              <span>•</span>
              <span>Likhith (23BDS034)</span>
              <span>•</span>
              <span>Manasa (23BDS051)</span>
              <span>•</span>
              <span>Teja (23BDS064)</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
