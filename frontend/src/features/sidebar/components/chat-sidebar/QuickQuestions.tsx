import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export function QuickQuestions({ onQuestionClick }: QuickQuestionsProps) {
  const quickQuestions = [
    "What are the symptoms of heat exhaustion?",
    "How can I prevent heat stroke?", 
    "What should I do if someone has heat stroke?",
    "How much water should I drink in hot weather?",
    "What are the risk factors for heat-related illness?",
    "When should I seek medical attention for heat illness?"
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