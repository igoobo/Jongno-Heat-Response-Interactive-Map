import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Navigation, Layers, Info } from 'lucide-react';

const quickActions = [
  { label: '현재 위치', icon: Navigation },
  { label: '전체보기', icon: Layers },
  { label: '정보', icon: Info },
];

const QuickActions = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">빠른 작업</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            className="w-full justify-start gap-3 h-auto py-3"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;