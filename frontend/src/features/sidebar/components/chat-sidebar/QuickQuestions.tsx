import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export function QuickQuestions({ onQuestionClick }: QuickQuestionsProps) {
  const quickQuestions = [
    "열탈진의 증상은 무엇인가요?",
    "열사병을 예방하려면 어떻게 해야 하나요?", 
    "누군가 열사병에 걸렸을 때 어떻게 해야 하나요?",
    "더운 날씨에는 물을 얼마나 마셔야 하나요?",
    "온열질환의 위험 요인은 무엇인가요?",
    "온열질환 발생 시 언제 병원을 가야 하나요?"
  ];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Quick Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="text-left h-auto p-3 whitespace-normal"
              onClick={() => onQuestionClick(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}