import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      <div className={cn(
        "max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
        isBot 
          ? "bg-card text-card-foreground rounded-tl-none" 
          : "bg-primary text-primary-foreground rounded-tr-none"
      )}>
        <p className="text-sm md:text-base whitespace-pre-wrap break-words">{message}</p>
      </div>
      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};
