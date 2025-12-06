import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type IncidentStatus = 'active' | 'investigating' | 'resolved' | 'closed';
type IncidentRisk = 'critical' | 'high' | 'medium' | 'low';

interface Incident {
  id: string;
  title: string;
  risk: IncidentRisk;
  status: IncidentStatus;
  timestamp: string;
  affectedAssets: number;
  assignee: string;
}

interface IncidentsTableProps {
  incidents: Incident[];
  filterStatus: string;
  filterRisk: string;
  onFilterStatusChange: (value: string) => void;
  onFilterRiskChange: (value: string) => void;
  onIncidentSelect: (id: string) => void;
}

const IncidentsTable = ({
  incidents,
  filterStatus,
  filterRisk,
  onFilterStatusChange,
  onFilterRiskChange,
  onIncidentSelect
}: IncidentsTableProps) => {
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

  const filteredIncidents = incidents.filter(inc => {
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (filterRisk !== 'all' && inc.risk !== filterRisk) return false;
    return true;
  });

  return (
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
            <Select value={filterRisk} onValueChange={onFilterRiskChange}>
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
            
            <Select value={filterStatus} onValueChange={onFilterStatusChange}>
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
                onClick={() => onIncidentSelect(incident.id)}
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
  );
};

export default IncidentsTable;
