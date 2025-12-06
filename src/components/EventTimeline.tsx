import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  user: string;
  action: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

interface EventTimelineProps {
  events: TimelineEvent[];
}

const EventTimeline = ({ events }: EventTimelineProps) => {
  return (
    <Card className="border-border mt-6">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-primary" />
          Event Timeline
        </CardTitle>
        <CardDescription className="font-mono text-xs mt-1">
          Last 30 minutes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 relative">
            <div className="absolute left-[9px] top-0 bottom-0 w-[2px] bg-border"></div>
            
            {events.map((event) => (
              <div key={event.id} className="relative pl-8">
                <div className={`
                  absolute left-0 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center
                  ${event.severity === 'critical' ? 'bg-red-500' :
                    event.severity === 'high' ? 'bg-orange-500' :
                    event.severity === 'medium' ? 'bg-yellow-500' :
                    event.severity === 'low' ? 'bg-green-500' :
                    'bg-blue-500'}
                `}>
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                <div className="bg-secondary/30 p-3 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold">{event.type}</span>
                    <span className="text-xs font-mono text-muted-foreground">{event.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">User: {event.user}</p>
                  <p className="text-xs font-mono bg-background/50 p-2 rounded mt-2 break-all">
                    {event.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EventTimeline;
