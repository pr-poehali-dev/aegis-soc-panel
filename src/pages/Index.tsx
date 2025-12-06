import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import IncidentsTable from '@/components/IncidentsTable';
import AttackGraphView from '@/components/AttackGraphView';
import RecommendationsPanel from '@/components/RecommendationsPanel';
import EventTimeline from '@/components/EventTimeline';

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
            <IncidentsTable
              incidents={incidents}
              filterStatus={filterStatus}
              filterRisk={filterRisk}
              onFilterStatusChange={setFilterStatus}
              onFilterRiskChange={setFilterRisk}
              onIncidentSelect={setSelectedIncident}
            />

            <AttackGraphView
              selectedIncident={selectedIncident}
              attackGraph={attackGraph}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <RecommendationsPanel recommendations={recommendations} />
            <EventTimeline events={timelineEvents} />
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
