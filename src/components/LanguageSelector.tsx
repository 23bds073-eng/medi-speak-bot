import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'english', name: 'English', native: 'English' },
  { code: 'telugu-english', name: 'Telugu + English', native: 'తెలుగు + English' },
  { code: 'hindi-english', name: 'Hindi + English', native: 'हिंदी + English' },
  { code: 'kannada-english', name: 'Kannada + English', native: 'ಕನ್ನಡ + English' },
  { code: 'tamil-english', name: 'Tamil + English', native: 'தமிழ் + English' },
  { code: 'marathi-english', name: 'Marathi + English', native: 'मराठी + English' },
  { code: 'urdu-english', name: 'Urdu + English', native: 'اردو + English' },
  { code: 'malayalam-english', name: 'Malayalam + English', native: 'മലയാളം + English' },
  { code: 'bengali-english', name: 'Bengali + English', native: 'বাংলা + English' },
];

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <Card className="p-6 bg-card border-border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Select Language</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={selectedLanguage === lang.code ? "default" : "outline"}
            onClick={() => onLanguageChange(lang.code)}
            className="flex flex-col h-auto py-3 px-4 transition-all hover:scale-105"
          >
            <span className="text-sm font-medium">{lang.name}</span>
            <span className="text-xs opacity-80">{lang.native}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
