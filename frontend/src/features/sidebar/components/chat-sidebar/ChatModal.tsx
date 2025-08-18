import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChatInterface } from "./ChatInterface"

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] z-[10002] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>온열질환에 대해 물어보세요</DialogTitle>
        </DialogHeader>
        <ChatInterface />
      </DialogContent>
    </Dialog>
  )
}
