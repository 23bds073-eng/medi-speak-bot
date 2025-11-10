import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'english', name: 'English', native: 'English' },
  { code: 'telugu', name: 'Telugu', native: 'తెలుగు' },
  { code: 'hindi', name: 'Hindi', native: 'हिंदी' },
  { code: 'kannada', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'tamil', name: 'Tamil', native: 'தமிழ்' },
];

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  return (
    <Card className="p-6 bg-card border-border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Select Language</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
