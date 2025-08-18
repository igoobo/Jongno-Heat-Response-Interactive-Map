import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
}

export function MessageBubble({ message, isUser, timestamp }: MessageBubbleProps) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={`text-sm ${isUser ? 'bg-primary text-primary-foreground' : 'bg-orange-100 text-orange-700'}`}>
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`p-3 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
          <p className="whitespace-pre-wrap">{message}</p>
        </Card>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {timestamp}
        </span>
      </div>
    </div>
  );
}