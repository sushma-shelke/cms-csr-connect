import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Image,
  Eye
} from "lucide-react";
import { format } from "date-fns";

interface Update {
  id: string;
  projectName: string;
  updateType: string;
  title: string;
  description: string;
  progress: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  submittedBy: string;
  challenges?: string;
  nextSteps?: string;
  mediaCount: number;
}

const mockUpdates: Update[] = [
  {
    id: "1",
    projectName: "Rural Health Initiative - Phase 1",
    updateType: "Weekly Progress",
    title: "Mobile Health Camp Completed in Village A",
    description: "Successfully conducted a 3-day mobile health camp serving 450+ villagers. Provided basic health checkups, vaccinations, and health awareness sessions.",
    progress: 65,
    status: "approved",
    submittedAt: new Date(2024, 8, 10),
    submittedBy: "Dr. Priya Sharma",
    challenges: "Limited transportation to remote areas",
    nextSteps: "Plan next camp in Village B, arrange for medical supplies",
    mediaCount: 8
  },
  {
    id: "2",
    projectName: "Education Access Program",
    updateType: "Milestone Achievement",
    title: "100 Students Enrolled in Digital Literacy Program",
    description: "Reached our Q3 target of 100 student enrollments. Set up computer lab with 20 workstations and trained 5 local teachers.",
    progress: 75,
    status: "pending",
    submittedAt: new Date(2024, 8, 9),
    submittedBy: "Rajesh Kumar",
    nextSteps: "Begin advanced modules, expand to neighboring schools",
    mediaCount: 12
  },
  {
    id: "3",
    projectName: "Clean Water Project",
    updateType: "Challenge Alert",
    title: "Delay in Borewell Construction",
    description: "Encountered rocky terrain at the planned borewell site. Need to relocate to alternative site identified by geological survey.",
    progress: 40,
    status: "pending",
    submittedAt: new Date(2024, 8, 8),
    submittedBy: "Anita Desai",
    challenges: "Geological challenges, need additional machinery",
    nextSteps: "Complete geological survey of new site, arrange heavy machinery",
    mediaCount: 5
  }
];

export function UpdatesList() {
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success text-white";
      case "pending":
        return "bg-warning text-white";
      case "rejected":
        return "bg-destructive text-white";
      default:
        return "bg-muted";
    }
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case "Weekly Progress":
        return <Calendar className="h-4 w-4" />;
      case "Milestone Achievement":
        return <TrendingUp className="h-4 w-4" />;
      case "Challenge Alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "Budget Update":
        return <FileText className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Recent Updates</h2>
          <p className="text-muted-foreground">Track your submitted project updates</p>
        </div>
      </div>

      <div className="grid gap-4">
        {mockUpdates.map((update) => (
          <Card key={update.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {update.submittedBy.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getUpdateTypeIcon(update.updateType)}
                      <Badge variant="outline">{update.updateType}</Badge>
                      <Badge className={getStatusColor(update.status)}>
                        {update.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{update.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {update.projectName} • by {update.submittedBy}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {format(update.submittedAt, "MMM dd, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(update.status)}
                </div>
              </div>

              <p className="text-sm mb-4 line-clamp-2">{update.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{update.progress}%</span>
                  </div>
                  <Progress value={update.progress} className="h-2" />
                </div>

                {update.challenges && (
                  <div>
                    <span className="text-sm font-medium text-destructive">Challenges:</span>
                    <p className="text-sm text-muted-foreground mt-1">{update.challenges}</p>
                  </div>
                )}

                {update.nextSteps && (
                  <div>
                    <span className="text-sm font-medium text-primary">Next Steps:</span>
                    <p className="text-sm text-muted-foreground mt-1">{update.nextSteps}</p>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {update.mediaCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Image className="h-4 w-4" />
                      <span>{update.mediaCount} media files</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}