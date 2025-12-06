import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type IncidentRisk = 'critical' | 'high' | 'medium' | 'low';
type NodeType = 'user' | 'host' | 'process' | 'file' | 'network';

interface AttackNode {
  id: string;
  type: NodeType;
  label: string;
  risk: IncidentRisk;
}

interface AttackEdge {
  from: string;
  to: string;
  label: string;
}

interface AttackGraphViewProps {
  selectedIncident: string | null;
  attackGraph: {
    nodes: AttackNode[];
    edges: AttackEdge[];
  };
}

const AttackGraphView = ({ selectedIncident, attackGraph }: AttackGraphViewProps) => {
  const getRiskBadge = (risk: IncidentRisk) => {
    const colors = {
      critical: 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]',
      high: 'bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]',
      medium: 'bg-yellow-600 text-white',
      low: 'bg-green-600 text-white'
    };

    return (
      <Badge className={`${colors[risk]} font-mono text-xs uppercase`}>
        {risk}
      </Badge>
    );
  };

  const getNodeIcon = (type: NodeType) => {
    const icons = {
      user: 'User',
      host: 'Server',
      process: 'Cpu',
      file: 'FileText',
      network: 'Globe'
    };
    return icons[type];
  };

  return (
    <Card className="border-border mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Attack Graph Analysis</CardTitle>
        <CardDescription className="font-mono text-xs mt-1">
          Incident: {selectedIncident || 'INC-2024-1847'} | Entity relationships
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary/30 rounded-lg p-8 min-h-[400px] relative border border-border">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <div className="flex justify-center items-center gap-8">
              {attackGraph.nodes.map((node, index) => (
                <div 
                  key={node.id}
                  className="relative group"
                  style={{ 
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className={`
                    w-24 h-24 rounded-lg flex flex-col items-center justify-center gap-2 border-2 
                    ${node.risk === 'critical' ? 'border-red-500 bg-red-500/10' : 
                      node.risk === 'high' ? 'border-orange-500 bg-orange-500/10' : 
                      'border-blue-500 bg-blue-500/10'}
                    hover:scale-110 transition-transform cursor-pointer
                  `}>
                    <Icon name={getNodeIcon(node.type)} size={28} className="text-foreground" />
                    <span className="text-xs font-mono font-medium text-center px-1">{node.label}</span>
                  </div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {getRiskBadge(node.risk)}
                  </div>
                  
                  {index < attackGraph.nodes.length - 1 && (
                    <div className="absolute top-1/2 -right-8 w-16 flex items-center">
                      <div className="w-full h-[2px] bg-primary/50"></div>
                      <Icon name="ChevronRight" size={16} className="text-primary absolute -right-2" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-6 mt-12">
              {attackGraph.edges.map((edge, index) => (
                <div 
                  key={index} 
                  className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1 rounded border border-border"
                >
                  {edge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttackGraphView;
