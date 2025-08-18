import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatFabProps {
  onClick: () => void;
}

export function ChatFab({ onClick }: ChatFabProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className="fixed top-5 right-130 w-13 h-13 rounded-full shadow-lg z-500"
            size="icon"
          >
            <MessageSquare className="h-8 w-8" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>온열질환 정보 도우미랑 이야기를 나눠보세요</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
