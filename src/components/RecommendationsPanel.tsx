import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Recommendation {
  id: string;
  priority: string;
  title: string;
  description: string;
  actions: string[];
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
}

const RecommendationsPanel = ({ recommendations }: RecommendationsPanelProps) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          Recommendations
        </CardTitle>
        <CardDescription className="font-mono text-xs mt-1">
          {recommendations.length} action items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                className={`
                  p-4 rounded-lg border-l-4 bg-secondary/30
                  ${rec.priority === 'critical' ? 'border-l-red-500' : 
                    rec.priority === 'high' ? 'border-l-orange-500' : 
                    'border-l-yellow-500'}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold">{rec.title}</h4>
                  <Badge variant="outline" className="font-mono text-xs">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                <div className="flex gap-2">
                  {rec.actions.map((action, idx) => (
                    <Button 
                      key={idx} 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs font-mono"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;
