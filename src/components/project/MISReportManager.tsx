import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Video, Image, Mic, CheckCircle, XCircle, Clock, AlertTriangle, Target, TrendingUp, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface MISReport {
  id: string;
  projectId: string;
  projectName: string;
  month: string;
  year: number;
  targetAllocated: number;
  currentPerformance: number;
  achievementPercentage: number;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  submissionDate?: string;
  deviation?: string;
  mitigationPlan?: string;
  carryForward?: number;
  attachments: Array<{
    type: 'excel' | 'word' | 'video' | 'pdf';
    name: string;
    url: string;
  }>;
}

const mockReports: MISReport[] = [
  {
    id: "1",
    projectId: "1",
    projectName: "Rural Health Initiative",
    month: "August",
    year: 2024,
    targetAllocated: 100,
    currentPerformance: 85,
    achievementPercentage: 85,
    status: 'approved',
    submissionDate: "2024-08-25",
    attachments: [
      { type: 'excel', name: 'Monthly_Report_Aug.xlsx', url: '#' },
      { type: 'pdf', name: 'Evidence_Aug.pdf', url: '#' }
    ]
  },
  {
    id: "2", 
    projectId: "2",
    projectName: "Digital Education Program",
    month: "August",
    year: 2024,
    targetAllocated: 80,
    currentPerformance: 56,
    achievementPercentage: 70,
    status: 'pending',
    submissionDate: "2024-08-22",
    deviation: "Delayed due to monsoon season affecting field activities",
    mitigationPlan: "Extended training sessions in September, additional resources allocated",
    attachments: [
      { type: 'video', name: 'Training_Session.mp4', url: '#' },
      { type: 'word', name: 'Progress_Report.docx', url: '#' }
    ]
  },
  {
    id: "3",
    projectId: "3", 
    projectName: "Climate Awareness Campaign",
    month: "August",
    year: 2024,
    targetAllocated: 60,
    currentPerformance: 25,
    achievementPercentage: 42,
    status: 'rejected',
    submissionDate: "2024-08-20",
    deviation: "Low community participation due to festival season",
    mitigationPlan: "Reschedule activities post-festival, community leader engagement",
    carryForward: 35,
    attachments: [
      { type: 'pdf', name: 'Community_Feedback.pdf', url: '#' }
    ]
  }
];

export function MISReportManager() {
  const [selectedProject, setSelectedProject] = useState("");
  const [isSubmissionPeriodOpen, setIsSubmissionPeriodOpen] = useState(true); // Simulating 21st-25th period
  const [reportFormData, setReportFormData] = useState({
    targetAllocated: "",
    currentPerformance: "",
    deviation: "",
    mitigationPlan: "",
    attachments: [] as File[]
  });

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-impact-green";
    if (percentage >= 50) return "text-impact-blue";
    if (percentage >= 30) return "text-impact-yellow";
    return "text-impact-red";
  };

  const getPerformanceBadge = (percentage: number) => {
    if (percentage >= 80) return { color: "bg-impact-green", text: "Excellent" };
    if (percentage >= 50) return { color: "bg-impact-blue", text: "Good" };
    if (percentage >= 30) return { color: "bg-impact-yellow", text: "Needs Attention" };
    return { color: "bg-impact-red", text: "Critical" };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-impact-green" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-impact-red" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-impact-yellow" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setReportFormData({
        ...reportFormData,
        attachments: [...reportFormData.attachments, ...newFiles]
      });
    }
  };

  const calculateAchievementPercentage = () => {
    const target = Number(reportFormData.targetAllocated);
    const performance = Number(reportFormData.currentPerformance);
    return target > 0 ? Math.round((performance / target) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">MIS Report Management</h2>
          <p className="text-muted-foreground">Monthly reporting portal (21st-25th)</p>
        </div>
        <div className="flex items-center gap-2">
          {isSubmissionPeriodOpen ? (
            <Badge className="bg-impact-green text-white">
              Submission Period Open
            </Badge>
          ) : (
            <Badge className="bg-impact-red text-white">
              Submission Period Closed
            </Badge>
          )}
        </div>
      </div>

      {/* Submission Period Alert */}
      {isSubmissionPeriodOpen && (
        <Card className="border-impact-green bg-impact-green/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-impact-green" />
              <div>
                <p className="font-medium text-impact-green">Submission Period Active</p>
                <p className="text-sm text-muted-foreground">Submit your monthly reports between 21st-25th of each month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="submit">Submit Report</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Target vs Achievement</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.projectName}</p>
                          <p className="text-sm text-muted-foreground">ID: {report.projectId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.month} {report.year}</p>
                          {report.submissionDate && (
                            <p className="text-sm text-muted-foreground">
                              Submitted: {new Date(report.submissionDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Target: {report.targetAllocated}</span>
                            <span>Achieved: {report.currentPerformance}</span>
                          </div>
                          <Progress value={report.achievementPercentage} className="w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium", getPerformanceColor(report.achievementPercentage))}>
                            {report.achievementPercentage}%
                          </span>
                          <Badge className={getPerformanceBadge(report.achievementPercentage).color + " text-white"}>
                            {getPerformanceBadge(report.achievementPercentage).text}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <span className="capitalize">{report.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Details</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{report.projectName} - {report.month} {report.year}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                                      <p className="text-sm text-muted-foreground">Target Allocated</p>
                                      <p className="text-2xl font-bold">{report.targetAllocated}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
                                      <p className="text-sm text-muted-foreground">Current Performance</p>
                                      <p className="text-2xl font-bold">{report.currentPerformance}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <div className={cn("text-2xl font-bold", getPerformanceColor(report.achievementPercentage))}>
                                        {report.achievementPercentage}%
                                      </div>
                                      <p className="text-sm text-muted-foreground">Achievement</p>
                                      <Badge className={getPerformanceBadge(report.achievementPercentage).color + " text-white mt-1"}>
                                        {getPerformanceBadge(report.achievementPercentage).text}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {report.deviation && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Deviation Report</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm">{report.deviation}</p>
                                  </CardContent>
                                </Card>
                              )}

                              {report.mitigationPlan && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Mitigation Plan</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm">{report.mitigationPlan}</p>
                                  </CardContent>
                                </Card>
                              )}

                              {report.carryForward && (
                                <Card className="border-impact-yellow bg-impact-yellow/5">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5 text-impact-yellow" />
                                      <div>
                                        <p className="font-medium">Target Carry Forward</p>
                                        <p className="text-sm text-muted-foreground">
                                          {report.carryForward} targets carried forward to next month
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">Attachments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {report.attachments.map((attachment, index) => (
                                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                                        {attachment.type === 'excel' && <FileSpreadsheet className="h-4 w-4 text-success" />}
                                        {attachment.type === 'word' && <FileText className="h-4 w-4 text-info" />}
                                        {attachment.type === 'video' && <Video className="h-4 w-4 text-warning" />}
                                        {attachment.type === 'pdf' && <FileText className="h-4 w-4 text-destructive" />}
                                        <span className="text-sm">{attachment.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit" className="space-y-6">
          {isSubmissionPeriodOpen ? (
            <Card>
              <CardHeader>
                <CardTitle>Submit Monthly Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project">Select Project *</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Rural Health Initiative</SelectItem>
                        <SelectItem value="2">Digital Education Program</SelectItem>
                        <SelectItem value="3">Climate Awareness Campaign</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Reporting Period</Label>
                    <Input value="September 2024" disabled className="bg-muted" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAllocated">Target Allocated *</Label>
                    <Input
                      id="targetAllocated"
                      type="number"
                      value={reportFormData.targetAllocated}
                      onChange={(e) => setReportFormData({...reportFormData, targetAllocated: e.target.value})}
                      placeholder="Enter target allocated"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPerformance">Achieved Target *</Label>
                    <Input
                      id="currentPerformance" 
                      type="number"
                      value={reportFormData.currentPerformance}
                      onChange={(e) => setReportFormData({...reportFormData, currentPerformance: e.target.value})}
                      placeholder="Enter Achieved Target"
                    />
                  </div>
                </div>

                {reportFormData.targetAllocated && reportFormData.currentPerformance && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span>Achievement Percentage:</span>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-2xl font-bold", getPerformanceColor(calculateAchievementPercentage()))}>
                            {calculateAchievementPercentage()}%
                          </span>
                          <Badge className={getPerformanceBadge(calculateAchievementPercentage()).color + " text-white"}>
                            {getPerformanceBadge(calculateAchievementPercentage()).text}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  <Label htmlFor="deviation">Deviation Report (if applicable)</Label>
                  <Textarea
                    id="deviation"
                    value={reportFormData.deviation}
                    onChange={(e) => setReportFormData({...reportFormData, deviation: e.target.value})}
                    placeholder="Describe any deviations from planned targets..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mitigationPlan">Mitigation Plan (if deviation exists)</Label>
                  <Textarea
                    id="mitigationPlan"
                    value={reportFormData.mitigationPlan}
                    onChange={(e) => setReportFormData({...reportFormData, mitigationPlan: e.target.value})}
                    placeholder="Describe your plan to address the deviations..."
                    className="min-h-[100px]"
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">File Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Upload supporting documents</p>
                        <p className="text-xs text-muted-foreground">
                          Excel, Word, PDF, Video files supported
                        </p>
                        <Input
                          type="file"
                          multiple
                          accept=".xlsx,.xls,.docx,.doc,.pdf,.mp4,.mov,.avi"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    {reportFormData.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label>Uploaded Files:</Label>
                        {reportFormData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90">
                    Submit Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-impact-red bg-impact-red/5">
              <CardContent className="p-8 text-center">
                <XCircle className="h-16 w-16 mx-auto mb-4 text-impact-red" />
                <h3 className="text-lg font-semibold mb-2">Submission Period Closed</h3>
                <p className="text-muted-foreground">
                  Monthly report submissions are only accepted between 21st-25th of each month.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-success" />
                  <p className="text-sm text-muted-foreground">Excellent Performance</p>
                  <p className="text-2xl font-bold text-impact-green">1</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-info" />
                  <p className="text-sm text-muted-foreground">Good Performance</p>
                  <p className="text-2xl font-bold text-impact-blue">1</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                  <p className="text-2xl font-bold text-impact-yellow">0</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-impact-red">1</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <p>Performance analytics visualization would be implemented here</p>
                <p className="text-sm">Charts showing monthly trends, comparative analysis, etc.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}