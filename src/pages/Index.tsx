import { useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ChatInterface } from "@/components/ChatInterface";
import { Heart } from "lucide-react";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("english");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="text-center mb-8 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Heart className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Medical Assistant
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get general health information and suggestions in your preferred language
          </p>
        </header>

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
          <ChatInterface language={selectedLanguage} />
        </div>

        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p className="font-semibold mb-1">⚕️ Important Medical Disclaimer</p>
          <p className="max-w-2xl mx-auto">
            This AI assistant provides general health information for educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or qualified healthcare provider with any questions 
            you may have regarding a medical condition. Never disregard professional medical advice or 
            delay in seeking it because of something you have read here. In case of emergency, 
            call your local emergency services immediately.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
