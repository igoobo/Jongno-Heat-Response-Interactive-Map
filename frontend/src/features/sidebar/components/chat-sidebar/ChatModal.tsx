import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
        <DialogFooter className="text-xs text-muted-foreground text-center w-full">
            본 저작물은 공공누리 제4유형에 따라 [질병관리청(https://www.kdca.go.kr), 작성자: 기후보건·건강위해대비과]의 공공저작물을 이용하였습니다.
        </DialogFooter>   
      </DialogContent>
    </Dialog>
  )
}
