import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Image,
  Users,
  IndianRupee
} from "lucide-react";
import { QuickUpdateForm } from "./QuickUpdateForm";
import { UpdatesList } from "./UpdatesList";

export function NGODashboard() {
  const stats = {
    activeProjects: 3,
    totalBeneficiaries: 1250,
    monthlyUpdates: 8,
    pendingReports: 2,
    budgetUtilized: 65,
    overdueUpdates: 1
  };

  const recentActivities = [
    {
      id: 1,
      type: "update",
      title: "Weekly progress report submitted",
      project: "Rural Health Initiative",
      time: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      type: "milestone",
      title: "100 beneficiaries target achieved",
      project: "Education Access Program",
      time: "1 day ago",
      status: "approved"
    },
    {
      id: 3,
      type: "budget",
      title: "Monthly expense report submitted",
      project: "Clean Water Project",
      time: "2 days ago",
      status: "approved"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "update":
        return <FileText className="h-4 w-4 text-primary" />;
      case "milestone":
        return <Target className="h-4 w-4 text-success" />;
      case "budget":
        return <IndianRupee className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text">Quick Updates</h1>
        <p className="text-muted-foreground mt-2">
          Manage your projects and submit quick updates to CMS Foundation
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card variant="elevated" hover="lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover="lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beneficiaries</p>
                <p className="text-2xl font-bold">{stats.totalBeneficiaries.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8" color="#8ECE33FF" />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover="lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Utilized</p>
                <p className="text-2xl font-bold">{stats.budgetUtilized}%</p>
              </div>
              <IndianRupee className="h-8 w-8 " color="#FFB800" />
            </div>
            {/* <Progress value={stats.budgetUtilized} className="h-2 mt-2" fill="#FFB800" /> */}
          </CardContent>
        </Card>

        <Card variant="elevated" hover="lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                <p className="text-2xl font-bold">{stats.pendingReports}</p>
              </div>
              <AlertTriangle className="h-8 w-8" color="#FF74DAFF" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="submit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit">Submit Update</TabsTrigger>
          <TabsTrigger value="history">Update History</TabsTrigger>
          {/* <TabsTrigger value="activity">Recent Activity</TabsTrigger> */}
        </TabsList>

        <TabsContent value="submit" className="space-y-4">
          <QuickUpdateForm />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <UpdatesList />
        </TabsContent>

        {/* <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.project}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}