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
  isDesktop: boolean;
}

export function ChatFab({ onClick, isDesktop }: ChatFabProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            className={`fixed rounded-full shadow-lg z-500 ${isDesktop ? 'top-5 right-130 w-13 h-13' : 'top-52 right-4 w-13 h-13'}`}
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
