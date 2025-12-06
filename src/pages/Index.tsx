import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type IncidentStatus = 'active' | 'investigating' | 'resolved' | 'closed';
type IncidentRisk = 'critical' | 'high' | 'medium' | 'low';
type NodeType = 'user' | 'host' | 'process' | 'file' | 'network';

interface Incident {
  id: string;
  title: string;
  risk: IncidentRisk;
  status: IncidentStatus;
  timestamp: string;
  affectedAssets: number;
  assignee: string;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: string;
  user: string;
  action: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

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

const Index = () => {
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const incidents: Incident[] = [
    {
      id: 'INC-2024-1847',
      title: 'Suspicious PowerShell execution detected',
      risk: 'critical',
      status: 'active',
      timestamp: '2024-12-06 14:23:15',
      affectedAssets: 3,
      assignee: 'A.Ivanov'
    },
    {
      id: 'INC-2024-1846',
      title: 'Multiple failed login attempts from external IP',
      risk: 'high',
      status: 'investigating',
      timestamp: '2024-12-06 13:45:02',
      affectedAssets: 1,
      assignee: 'M.Petrov'
    },
    {
      id: 'INC-2024-1845',
      title: 'Unusual data transfer to cloud storage',
      risk: 'high',
      status: 'investigating',
      timestamp: '2024-12-06 12:18:33',
      affectedAssets: 2,
      assignee: 'A.Ivanov'
    },
    {
      id: 'INC-2024-1844',
      title: 'Unauthorized registry modification',
      risk: 'medium',
      status: 'resolved',
      timestamp: '2024-12-06 11:05:47',
      affectedAssets: 1,
      assignee: 'S.Kozlov'
    },
    {
      id: 'INC-2024-1843',
      title: 'Malware signature detected in email attachment',
      risk: 'critical',
      status: 'closed',
      timestamp: '2024-12-06 09:32:11',
      affectedAssets: 1,
      assignee: 'M.Petrov'
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: 'evt-001',
      timestamp: '2024-12-06 14:23:15',
      type: 'Process Execution',
      user: 'admin@corp.local',
      action: 'powershell.exe -ExecutionPolicy Bypass -EncodedCommand ...',
      severity: 'critical'
    },
    {
      id: 'evt-002',
      timestamp: '2024-12-06 14:22:48',
      type: 'File Access',
      user: 'admin@corp.local',
      action: 'Read access: C:\\Windows\\System32\\config\\SAM',
      severity: 'critical'
    },
    {
      id: 'evt-003',
      timestamp: '2024-12-06 14:21:33',
      type: 'Network Connection',
      user: 'SYSTEM',
      action: 'Outbound connection to 185.220.101.47:443',
      severity: 'high'
    },
    {
      id: 'evt-004',
      timestamp: '2024-12-06 14:20:15',
      type: 'Authentication',
      user: 'admin@corp.local',
      action: 'Successful login from 10.10.15.42',
      severity: 'info'
    },
    {
      id: 'evt-005',
      timestamp: '2024-12-06 14:18:02',
      type: 'File Creation',
      user: 'admin@corp.local',
      action: 'Created: C:\\Users\\Public\\temp_installer.exe',
      severity: 'high'
    }
  ];

  const attackGraph: { nodes: AttackNode[]; edges: AttackEdge[] } = {
    nodes: [
      { id: 'user-1', type: 'user', label: 'admin@corp.local', risk: 'high' },
      { id: 'host-1', type: 'host', label: 'WS-042', risk: 'critical' },
      { id: 'process-1', type: 'process', label: 'powershell.exe', risk: 'critical' },
      { id: 'file-1', type: 'file', label: 'SAM', risk: 'critical' },
      { id: 'network-1', type: 'network', label: '185.220.101.47', risk: 'high' }
    ],
    edges: [
      { from: 'user-1', to: 'host-1', label: 'logged in' },
      { from: 'host-1', to: 'process-1', label: 'spawned' },
      { from: 'process-1', to: 'file-1', label: 'accessed' },
      { from: 'process-1', to: 'network-1', label: 'connected to' }
    ]
  };

  const recommendations = [
    {
      id: 'rec-1',
      priority: 'critical',
      title: 'Isolate compromised host',
      description: 'Immediately disconnect WS-042 from network to prevent lateral movement',
      actions: ['Isolate Host', 'Notify IT']
    },
    {
      id: 'rec-2',
      priority: 'high',
      title: 'Reset user credentials',
      description: 'Force password reset for admin@corp.local and enable MFA',
      actions: ['Reset Password', 'Enable MFA']
    },
    {
      id: 'rec-3',
      priority: 'high',
      title: 'Block malicious IP',
      description: 'Add 185.220.101.47 to firewall blocklist',
      actions: ['Block IP', 'Update Rules']
    },
    {
      id: 'rec-4',
      priority: 'medium',
      title: 'Scan for persistence mechanisms',
      description: 'Check registry, scheduled tasks, and startup folders for backdoors',
      actions: ['Run Scan', 'Generate Report']
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const notifications = [
        { message: '🚨 Critical: New ransomware activity detected', type: 'error' },
        { message: '⚠️ High: Privilege escalation attempt blocked', type: 'warning' },
        { message: '✓ Investigation completed for INC-2024-1844', type: 'success' }
      ];
      
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      if (Math.random() > 0.7) {
        if (randomNotification.type === 'error') {
          toast.error(randomNotification.message);
        } else if (randomNotification.type === 'warning') {
          toast.warning(randomNotification.message);
        } else {
          toast.success(randomNotification.message);
        }
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getRiskBadge = (risk: IncidentRisk) => {
    const variants = {
      critical: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline'
    };
    
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

  const getStatusBadge = (status: IncidentStatus) => {
    const colors = {
      active: 'bg-red-600 text-white',
      investigating: 'bg-orange-600 text-white',
      resolved: 'bg-blue-600 text-white',
      closed: 'bg-gray-600 text-white'
    };

    return (
      <Badge className={`${colors[status]} font-mono text-xs`}>
        {status}
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

  const filteredIncidents = incidents.filter(inc => {
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (filterRisk !== 'all' && inc.risk !== filterRisk) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <Icon name="Shield" className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AegisSOC</h1>
              <p className="text-xs text-muted-foreground font-mono">Security Operations Center</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded border border-border">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono">Live</span>
            </div>
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={20} />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded">
              <Icon name="User" size={16} />
              <span className="text-sm font-medium">Analyst</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Active Incidents</CardTitle>
                    <CardDescription className="font-mono text-xs mt-1">
                      {filteredIncidents.length} incidents | Last updated: 2024-12-06 14:23:15
                    </CardDescription>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={filterRisk} onValueChange={setFilterRisk}>
                      <SelectTrigger className="w-[140px] font-mono text-xs">
                        <SelectValue placeholder="Risk Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risks</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[140px] font-mono text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="investigating">Investigating</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="font-mono text-xs uppercase">ID</TableHead>
                      <TableHead className="font-mono text-xs uppercase">Incident</TableHead>
                      <TableHead className="font-mono text-xs uppercase">Risk</TableHead>
                      <TableHead className="font-mono text-xs uppercase">Status</TableHead>
                      <TableHead className="font-mono text-xs uppercase">Timestamp</TableHead>
                      <TableHead className="font-mono text-xs uppercase">Assets</TableHead>
                      <TableHead className="font-mono text-xs uppercase">Assignee</TableHead>
                      <TableHead className="font-mono text-xs uppercase">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => (
                      <TableRow 
                        key={incident.id}
                        className="border-border cursor-pointer hover:bg-secondary/50"
                        onClick={() => setSelectedIncident(incident.id)}
                      >
                        <TableCell className="font-mono text-xs">{incident.id}</TableCell>
                        <TableCell className="text-sm max-w-[300px] truncate">{incident.title}</TableCell>
                        <TableCell>{getRiskBadge(incident.risk)}</TableCell>
                        <TableCell>{getStatusBadge(incident.status)}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{incident.timestamp}</TableCell>
                        <TableCell className="font-mono text-xs">{incident.affectedAssets}</TableCell>
                        <TableCell className="font-mono text-xs">{incident.assignee}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="h-7 px-2">
                            <Icon name="ExternalLink" size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

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
          </div>

          <div className="col-span-12 lg:col-span-4">
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
                    
                    {timelineEvents.map((event, index) => (
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
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
