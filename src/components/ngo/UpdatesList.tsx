import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import api from "../../api/axios"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Update {
  id: string;
  projectName: string;
  updateType: string;
  title: string;
  description: string;
  progress: number;
  status: "pending" | "approved" | "rejected" | "In Progress";
  submittedAt: Date;
  submittedBy: string;
  challenges?: string;
  nextSteps?: string;
  mediaCount: number;
}

interface UpdateDetailsApi {
  id: number;
  project: string;
  updateType: string;
  updateTitle: string;
  progressDescription: string;
  overallProgress: number;
  currentChallenges: string;
  nextSteps: string;
  mediaFilesCount: number;
  mediaFiles: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function UpdatesList() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateDetailsApi | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    api
      .get("/api/quick-updates")
      .then((res) => {
        const data = res.data;

        const mapped = data.map((item: any) => ({
          id: String(item.id),
          projectName: item.project,
          updateType: item.updateType,
          title: item.updateTitle,
          description: item.progressDescription,
          progress: item.overallProgress,
          status: item.status,
          submittedAt: new Date(item.createdAt),
          submittedBy: "System",
          challenges: item.currentChallenges,
          nextSteps: item.nextSteps,
          mediaCount: item.mediaFilesCount,
        }));

        setUpdates(mapped);
      })
      .catch((err) => {
        console.error("Error fetching updates:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleViewDetails = async (id: string) => {
    try {
      const res = await api.get(`/api/quick-updates/${id}`);
      setSelectedUpdate(res.data);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Error fetching update details:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-success text-white";
      case "pending":
        return "bg-warning text-white";
      case "rejected":
        return "bg-destructive text-white";
      case "in progress":
        return "bg-primary text-white";
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
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "rejected":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "in progress":
        return <Clock className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  if (loading) {
    return <p>Loading updates...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Recent Updates</h2>
          <p className="text-muted-foreground">Track your submitted project updates</p>
        </div>
      </div>

      <div className="grid gap-4">
        {updates.map((update) => (
          <Card key={update.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {update.submittedBy
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(update.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔹 Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedUpdate ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedUpdate.updateTitle}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Project:</strong> {selectedUpdate.project}
                </p>
                <p>{selectedUpdate.progressDescription}</p>
                <p>
                  <strong>Progress:</strong> {selectedUpdate.overallProgress}%
                </p>
                {selectedUpdate.currentChallenges && (
                  <p className="text-destructive">
                    <strong>Challenges:</strong> {selectedUpdate.currentChallenges}
                  </p>
                )}
                {selectedUpdate.nextSteps && (
                  <p className="text-primary">
                    <strong>Next Steps:</strong> {selectedUpdate.nextSteps}
                  </p>
                )}
                <p>
                  <strong>Status:</strong> {selectedUpdate.status}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {format(new Date(selectedUpdate.createdAt), "PPPp")}
                </p>
              </div>
            </>
          ) : (
            <p>Loading details...</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
