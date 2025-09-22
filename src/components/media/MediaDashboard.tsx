import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Camera, 
  Image, 
  Video, 
  FileText, 
  Upload, 
  Eye, 
  Download,
  MapPin,
  Calendar,
  HardDrive,
  TrendingUp
} from "lucide-react";
import { MediaUpload } from "./MediaUpload";
import { MediaGallery } from "./MediaGallery";

export function MediaDashboard() {
  const [activeTab, setActiveTab] = useState("gallery");

  const stats = {
    totalFiles: 1247,
    totalSize: 8.6, // GB
    storageUsed: 65, // percentage
    monthlyUploads: 89,
    imagesCount: 856,
    videosCount: 234,
    documentsCount: 157,
    geoTaggedCount: 743
  };

  const recentActivity = [
    {
      id: 1,
      type: "upload",
      title: "Mobile Health Camp Photos",
      count: 12,
      project: "Rural Health Initiative",
      time: "2 hours ago",
      user: "Dr. Priya Sharma"
    },
    {
      id: 2,
      type: "view",
      title: "Training Session Video",
      count: 1,
      project: "Education Access Program",
      time: "4 hours ago",
      user: "CMS Foundation Team"
    },
    {
      id: 3,
      type: "download",
      title: "Quarterly Impact Report",
      count: 1,
      project: "Clean Water Project",
      time: "1 day ago",
      user: "Anita Desai"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4 text-primary" />;
      case "view":
        return <Eye className="h-4 w-4 text-info" />;
      case "download":
        return <Download className="h-4 w-4 text-success" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const projectMediaStats = [
    { 
      name: "Rural Health Initiative", 
      files: 423, 
      size: 3.2, 
      color: "bg-thematic-health" 
    },
    { 
      name: "Education Access Program", 
      files: 356, 
      size: 2.8, 
      color: "bg-thematic-education" 
    },
    { 
      name: "Clean Water Project", 
      files: 289, 
      size: 1.9, 
      color: "bg-thematic-climate" 
    },
    { 
      name: "Livelihood Skills Training", 
      files: 179, 
      size: 0.7, 
      color: "bg-thematic-livelihood" 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Media & Evidence Management</h1>
        <p className="text-muted-foreground">
          Manage project photos, videos, and documents with geo-tagging and compliance tracking
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card style={{ borderLeft:'5px solid #6F49F8' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{stats.totalFiles.toLocaleString()}</p>
              </div>
              <Camera className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft:'5px solid #8ECE33FF' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                <p className="text-2xl font-bold">{stats.totalSize} GB</p>
              </div>
              <HardDrive className="h-8 w-8 " color="#8ECE33FF" />
            </div>
            {/* <Progress value={stats.storageUsed} className="h-2 mt-2" /> */}
          </CardContent>
        </Card>

        <Card style={{ borderLeft:'5px solid #FFB800' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Uploads</p>
                <p className="text-2xl font-bold">{stats.monthlyUploads}</p>
              </div>
              <TrendingUp className="h-8 w-8" color="#FFB800" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft:'5px solid #FF74DAFF' }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Geo-tagged</p>
                <p className="text-2xl font-bold">{stats.geoTaggedCount}</p>
              </div>
              <MapPin className="h-8 w-8 " color="#FF74DAFF" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                <Image className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                <p className="text-xl font-bold">{stats.imagesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                <Video className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Videos</p>
                <p className="text-xl font-bold">{stats.videosCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-900">
                <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents</p>
                <p className="text-xl font-bold">{stats.documentsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Media Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <MediaGallery />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <MediaUpload />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Project Media Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Media by Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectMediaStats.map((project, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{project.name}</span>
                        <div className="text-sm text-muted-foreground">
                          {project.files} files • {project.size} GB
                        </div>
                      </div>
                      <Progress 
                        value={(project.files / stats.totalFiles) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{activity.title}</span>
                          <Badge variant="outline" className="capitalize">
                            {activity.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.project}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span>by {activity.user}</span>
                          {activity.count > 1 && (
                            <>
                              <span>•</span>
                              <span>{activity.count} files</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}