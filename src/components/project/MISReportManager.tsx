/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Upload, FileText, Video, Image, Mic, CheckCircle, XCircle, Clock, AlertTriangle, Target, TrendingUp, FileSpreadsheet } from "lucide-react";
// import { cn } from "@/lib/utils";
// import api from "../../api/axios";

// interface MISReport {
//   misReportSubmissionDateTime: any;
//   project: ReactNode;
//   reportingPeriod: ReactNode;
//   allocatedTarget: ReactNode;
//   completedTarget: ReactNode;
//   deviationReport: any;
//   id: string;
//   projectId: string;
//   projectName: string;
//   month: string;
//   year: number;
//   targetAllocated: number;
//   currentPerformance: number;
//   achievementPercentage: number;
//   status: 'submitted' | 'pending' | 'approved' | 'rejected';
//   submissionDate?: string;
//   deviation?: string;
//   mitigationPlan?: string;
//   carryForward?: number;
//   attachments: Array<{
//     type: 'excel' | 'word' | 'video' | 'pdf';
//     name: string;
//     url: string;
//   }>;
// }

// export function MISReportManager() {
//   const [selectedProject, setSelectedProject] = useState("");
//   const [reports, setReports] = useState<MISReport[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [reportFormData, setReportFormData] = useState({
//     targetAllocated: "",
//     currentPerformance: "",
//     deviation: "",
//     mitigationPlan: "",
//     attachments: [] as File[]
//   });

//   // 🔹 Auto-calculate submission period and current month dates
//   const today = new Date();
//   const day = today.getDate();
//   const isSubmissionPeriodOpen = day >= 1 && day <= 25;
  
//   // Get current month's start and end dates
//   const getCurrentMonthDateRange = () => {
//     const year = today.getFullYear();
//     const month = today.getMonth();
    
//     const startDate = new Date(year, month, 1);
//     const endDate = new Date(year, month + 1, 0, 23, 59, 59);
    
//     return {
//       startDate: startDate.toISOString(),
//       endDate: endDate.toISOString()
//     };
//   };

//   // Get month name from date
//   const getMonthName = (date: Date) => {
//     return date.toLocaleString('default', { month: 'long' });
//   };

//   // Get current reporting period (month and year)
//   const currentReportingPeriod = {
//     month: getMonthName(today),
//     year: today.getFullYear()
//   };

//   // Fetch reports from API
//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const { startDate, endDate } = getCurrentMonthDateRange();
      
//        const response = await api.get(`api/mis-reports/date-range`, {
//         params: {
//           startDate,
//           endDate
//         }
//       });
      
//       // Ensure reports is always an array, even if API returns null
//       setReports(Array.isArray(response.data) ? response.data : []);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching MIS reports:', err);
//       setError('Failed to load reports. Please try again.');
//       setReports([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Submit new report
//   const submitReport = async () => {
//     if (!selectedProject) {
//       alert('Please select a project');
//       return;
//     }

//     try {
//       const achievementPercentage = calculateAchievementPercentage();
      
//       const reportData = {
//         projectId: selectedProject,
//         month: currentReportingPeriod.month,
//         year: currentReportingPeriod.year,
//         targetAllocated: Number(reportFormData.targetAllocated),
//         currentPerformance: Number(reportFormData.currentPerformance),
//         achievementPercentage,
//         deviation: reportFormData.deviation || null,
//         mitigationPlan: reportFormData.mitigationPlan || null,
//         carryForward: achievementPercentage < 100 ? 
//           Number(reportFormData.targetAllocated) - Number(reportFormData.currentPerformance) : 0,
//         status: 'submitted' as const,
//         submissionDate: new Date().toISOString(),
//         attachments: [] // You'll need to handle file uploads separately
//       };

//       await api.post('/mis-reports', reportData);
      
//       // Refresh reports
//       await fetchReports();
      
//       // Reset form
//       setReportFormData({
//         targetAllocated: "",
//         currentPerformance: "",
//         deviation: "",
//         mitigationPlan: "",
//         attachments: []
//       });
//       setSelectedProject("");
      
//       alert('Report submitted successfully!');
//     } catch (err) {
//       console.error('Error submitting report:', err);
//       alert('Failed to submit report. Please try again.');
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const getPerformanceColor = (percentage: number) => {
//     if (percentage >= 80) return "text-impact-green";
//     if (percentage >= 50) return "text-impact-blue";
//     if (percentage >= 30) return "text-impact-yellow";
//     return "text-impact-red";
//   };

//   const getPerformanceBadge = (percentage: number) => {
//     if (percentage >= 80) return { color: "bg-impact-green", text: "Excellent" };
//     if (percentage >= 50) return { color: "bg-impact-blue", text: "Good" };
//     if (percentage >= 30) return { color: "bg-impact-yellow", text: "Needs Attention" };
//     return { color: "bg-impact-red", text: "Critical" };
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return <CheckCircle className="h-4 w-4 text-impact-green" />;
//       case 'rejected':
//         return <XCircle className="h-4 w-4 text-impact-red" />;
//       case 'pending':
//         return <Clock className="h-4 w-4 text-impact-yellow" />;
//       default:
//         return <Clock className="h-4 w-4 text-muted-foreground" />;
//     }
//   };

//   const handleFileUpload = (files: FileList | null) => {
//     if (files) {
//       const newFiles = Array.from(files);
//       setReportFormData({
//         ...reportFormData,
//         attachments: [...reportFormData.attachments, ...newFiles]
//       });
//     }
//   };

//   const calculateAchievementPercentage = () => {
//     const target = Number(reportFormData.targetAllocated);
//     const performance = Number(reportFormData.currentPerformance);
//     return target > 0 ? Math.round((performance / target) * 100) : 0;
//   };

//   // Calculate performance statistics
//   const performanceStats = {
//     excellent: reports.filter(report => report.achievementPercentage >= 80).length,
//     good: reports.filter(report => report.achievementPercentage >= 50 && report.achievementPercentage < 80).length,
//     needsAttention: reports.filter(report => report.achievementPercentage >= 30 && report.achievementPercentage < 50).length,
//     critical: reports.filter(report => report.achievementPercentage < 30).length
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
//           <p>Loading reports...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">MIS Report Management</h2>
//           <p className="text-muted-foreground">
//             Monthly reporting portal (21st-25th) - {currentReportingPeriod.month} {currentReportingPeriod.year}
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           {isSubmissionPeriodOpen ? (
//             <Badge className="bg-impact-green text-white">
//               Submission Period Open
//             </Badge>
//           ) : (
//             <Badge className="bg-impact-red text-white">
//               Submission Period Closed
//             </Badge>
//           )}
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <Card className="border-impact-red bg-impact-red/5">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-impact-red" />
//               <p className="text-impact-red">{error}</p>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Submission Period Alert */}
//       {isSubmissionPeriodOpen && (
//         <Card className="border-impact-green bg-impact-green/5">
//           <CardContent className="p-4">
//             <div className="flex items-center gap-2">
//               <Target className="h-5 w-5 text-impact-green" />
//               <div>
//                 <p className="font-medium text-impact-green">Submission Period Active</p>
//                 <p className="text-sm text-muted-foreground">
//                   Submit your monthly reports between 21st-25th of each month. 
//                   Reports will remain visible until the next submission period.
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       <Tabs defaultValue="reports" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="reports">All Reports</TabsTrigger>
//           <TabsTrigger value="submit">Submit Report</TabsTrigger>
//           <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
//         </TabsList>

//         <TabsContent value="reports" className="space-y-6">
//           {/* Reports Table */}
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 Monthly Reports - {currentReportingPeriod.month} {currentReportingPeriod.year}
//                 {reports.length > 0 && (
//                   <span className="text-sm font-normal text-muted-foreground ml-2">
//                     ({reports.length} reports found)
//                   </span>
//                 )}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {reports.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <FileText className="h-16 w-16 mx-auto mb-4" />
//                   <p>No reports found for {currentReportingPeriod.month} {currentReportingPeriod.year}</p>
//                   <p className="text-sm">Reports submitted between 21st-25th will appear here</p>
//                 </div>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Sr. No</TableHead>
//                       <TableHead>Project</TableHead>
//                       <TableHead>Period</TableHead>
//                       <TableHead>Target</TableHead>
//                       <TableHead>Performance</TableHead>
//                       <TableHead>Status</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                 {reports.map((report, index) => {
//   const achievementValue = parseInt(report.achievementPercentage.replace("%", ""), 10);

//   return (
//     <TableRow key={report.id}>
//       {/* Sr. No. */}
//       <TableCell>{index + 1}</TableCell>

//       {/* Project */}
//       <TableCell>
//         <div>
//           <p className="font-medium">{report.project}</p>
//         </div>
//       </TableCell>

//       {/* Reporting Period + Submission Date */}
//       <TableCell>
//         <div>
//           <p className="font-medium">{report.reportingPeriod}</p>
//           {report.misReportSubmissionDateTime && (
//             <p className="text-sm text-muted-foreground">
//               Submitted: {new Date(report.misReportSubmissionDateTime).toLocaleDateString()}
//             </p>
//           )}
//         </div>
//       </TableCell>

//       {/* Targets + Progress */}
//       <TableCell>
//         <div className="space-y-1">
//           <div className="flex justify-between text-sm">
//             <span>Target: {report.allocatedTarget}</span>
//             {/* <span>Achieved: {report.completedTarget}</span> */}
//           </div>
//           <Progress value={achievementValue} className="w-24" />
//         </div>
//       </TableCell>

//       {/* Achievement % + Badge */}
//       <TableCell>
//         <div className="flex items-center gap-2">
//           <span className={cn("font-medium", getPerformanceColor(achievementValue))}>
//             {report.achievementPercentage}
//           </span>
//         </div>
//       </TableCell>
//       <TableCell>
//         <div className="flex items-center gap-2">
//           <Badge className={getPerformanceBadge(achievementValue).color + " text-white"}>
//             {getPerformanceBadge(achievementValue).text}
//           </Badge>
//         </div>
//       </TableCell>

//       {/* Actions (View + Update + Delete) */}
//       <TableCell>
//         <div className="flex space-x-2">
//           {/* View Button with Dialog */}
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="secondary" size="sm">View</Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-4xl">
//               <DialogHeader>
//                 <DialogTitle>{report.project} - {report.reportingPeriod}</DialogTitle>
//               </DialogHeader>

//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <Card>
//                     <CardContent className="p-4">
//                       <div className="text-center">
//                         <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
//                         <p className="text-sm text-muted-foreground">Target Allocated</p>
//                         <p className="text-2xl font-bold">{report.allocatedTarget}</p>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardContent className="p-4">
//                       <div className="text-center">
//                         <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
//                         <p className="text-sm text-muted-foreground">Current Performance</p>
//                         <p className="text-2xl font-bold">{report.completedTarget}</p>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardContent className="p-4">
//                       <div className="text-center">
//                         <div className={cn("text-2xl font-bold", getPerformanceColor(achievementValue))}>
//                           {report.achievementPercentage}
//                         </div>
//                         <p className="text-sm text-muted-foreground">Achievement</p>
//                         <Badge className={getPerformanceBadge(achievementValue).color + " text-white mt-1"}>
//                           {getPerformanceBadge(achievementValue).text}
//                         </Badge>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {report.deviationReport && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-sm">Deviation Report</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm">{report.deviationReport}</p>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {report.mitigationPlan && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-sm">Mitigation Plan</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <p className="text-sm">{report.mitigationPlan}</p>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {report.attachments && Array.isArray(report.attachments) && report.attachments.length > 0 && (
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="text-sm">Attachments</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                         {report.attachments.map((attachment, index) => (
//                           <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
//                             {attachment.type === 'excel' && <FileSpreadsheet className="h-4 w-4 text-success" />}
//                             {attachment.type === 'word' && <FileText className="h-4 w-4 text-info" />}
//                             {attachment.type === 'video' && <Video className="h-4 w-4 text-warning" />}
//                             {attachment.type === 'pdf' && <FileText className="h-4 w-4 text-destructive" />}
//                             <span className="text-sm">{attachment.name}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             </DialogContent>
//           </Dialog>

//           {/* Update Button */}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => openEditDialog(report.id)}
//           >
//             Update
//           </Button>

//           {/* Delete Button */}
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={() => handleDelete(report.id)}
//           >
//             Delete
//           </Button>
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// })}


//                   </TableBody>
//                 </Table>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="submit" className="space-y-6">
//           {isSubmissionPeriodOpen ? (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Submit Monthly Report</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="project">Select Project *</Label>
//                     <Select value={selectedProject} onValueChange={setSelectedProject}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select project" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="1">Rural Health Initiative</SelectItem>
//                         <SelectItem value="2">Digital Education Program</SelectItem>
//                         <SelectItem value="3">Climate Awareness Campaign</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="period">Reporting Period</Label>
//                     <Input 
//                       value={`${currentReportingPeriod.month} ${currentReportingPeriod.year}`} 
//                       disabled 
//                       className="bg-muted" 
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="targetAllocated">Target Allocated *</Label>
//                     <Input
//                       id="targetAllocated"
//                       type="number"
//                       value={reportFormData.targetAllocated}
//                       onChange={(e) => setReportFormData({...reportFormData, targetAllocated: e.target.value})}
//                       placeholder="Enter target allocated"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="currentPerformance">Achieved Target *</Label>
//                     <Input
//                       id="currentPerformance" 
//                       type="number"
//                       value={reportFormData.currentPerformance}
//                       onChange={(e) => setReportFormData({...reportFormData, currentPerformance: e.target.value})}
//                       placeholder="Enter Achieved Target"
//                     />
//                   </div>
//                 </div>

//                 {reportFormData.targetAllocated && reportFormData.currentPerformance && (
//                   <Card className="bg-muted/50">
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <span>Achievement Percentage:</span>
//                         <div className="flex items-center gap-2">
//                           <span className={cn("text-2xl font-bold", getPerformanceColor(calculateAchievementPercentage()))}>
//                             {calculateAchievementPercentage()}%
//                           </span>
//                           <Badge className={getPerformanceBadge(calculateAchievementPercentage()).color + " text-white"}>
//                             {getPerformanceBadge(calculateAchievementPercentage()).text}
//                           </Badge>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 <div className="space-y-2">
//                   <Label htmlFor="deviation">Deviation Report (if applicable)</Label>
//                   <Textarea
//                     id="deviation"
//                     value={reportFormData.deviation}
//                     onChange={(e) => setReportFormData({...reportFormData, deviation: e.target.value})}
//                     placeholder="Describe any deviations from planned targets..."
//                     className="min-h-[100px]"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="mitigationPlan">Mitigation Plan (if deviation exists)</Label>
//                   <Textarea
//                     id="mitigationPlan"
//                     value={reportFormData.mitigationPlan}
//                     onChange={(e) => setReportFormData({...reportFormData, mitigationPlan: e.target.value})}
//                     placeholder="Describe your plan to address the deviations..."
//                     className="min-h-[100px]"
//                   />
//                 </div>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-sm">File Attachments</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
//                       <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
//                       <div className="space-y-2">
//                         <p className="text-sm font-medium">Upload supporting documents</p>
//                         <p className="text-xs text-muted-foreground">
//                           Excel, Word, PDF, Video files supported
//                         </p>
//                         <Input
//                           type="file"
//                           multiple
//                           accept=".xlsx,.xls,.docx,.doc,.pdf,.mp4,.mov,.avi"
//                           onChange={(e) => handleFileUpload(e.target.files)}
//                           className="w-full"
//                         />
//                       </div>
//                     </div>
                    
//                     {reportFormData.attachments.length > 0 && (
//                       <div className="mt-4 space-y-2">
//                         <Label>Uploaded Files:</Label>
//                         {reportFormData.attachments.map((file, index) => (
//                           <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
//                             <FileText className="h-4 w-4" />
//                             <span className="text-sm">{file.name}</span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 <div className="flex justify-end">
//                   <Button 
//                     className="bg-primary hover:bg-primary/90"
//                     onClick={submitReport}
//                     disabled={!selectedProject || !reportFormData.targetAllocated || !reportFormData.currentPerformance}
//                   >
//                     Submit Report
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : (
//             <Card className="border-impact-red bg-impact-red/5">
//               <CardContent className="p-8 text-center">
//                 <XCircle className="h-16 w-16 mx-auto mb-4 text-impact-red" />
//                 <h3 className="text-lg font-semibold mb-2">Submission Period Closed</h3>
//                 <p className="text-muted-foreground">
//                   Monthly report submissions are only accepted between 21st-25th of each month.
//                   Please check back during the submission period.
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>

//         <TabsContent value="analytics" className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <Target className="h-8 w-8 mx-auto mb-2 text-success" />
//                   <p className="text-sm text-muted-foreground">Excellent Performance</p>
//                   <p className="text-2xl font-bold text-impact-green">{performanceStats.excellent}</p>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <TrendingUp className="h-8 w-8 mx-auto mb-2 text-info" />
//                   <p className="text-sm text-muted-foreground">Good Performance</p>
//                   <p className="text-2xl font-bold text-impact-blue">{performanceStats.good}</p>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-warning" />
//                   <p className="text-sm text-muted-foreground">Needs Attention</p>
//                   <p className="text-2xl font-bold text-impact-yellow">{performanceStats.needsAttention}</p>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardContent className="p-6">
//                 <div className="text-center">
//                   <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
//                   <p className="text-sm text-muted-foreground">Critical</p>
//                   <p className="text-2xl font-bold text-impact-red">{performanceStats.critical}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Performance Trend Analysis - {currentReportingPeriod.month} {currentReportingPeriod.year}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {reports.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <TrendingUp className="h-16 w-16 mx-auto mb-4" />
//                   <p>No data available for analysis</p>
//                   <p className="text-sm">Submit reports to see performance analytics</p>
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-muted-foreground">
//                   <TrendingUp className="h-16 w-16 mx-auto mb-4" />
//                   <p>Performance analytics visualization would be implemented here</p>
//                   <p className="text-sm">Charts showing monthly trends, comparative analysis, etc.</p>
//                   <div className="mt-4 text-left">
//                     <p className="font-medium">Current Month Summary:</p>
//                     <ul className="text-sm mt-2 space-y-1">
//                       <li>• Total Reports: {reports.length}</li>
//                       <li>• Average Achievement: {Math.round(reports.reduce((sum, r) => sum + r.achievementPercentage, 0) / reports.length)}%</li>
//                       <li>• Highest Performance: {Math.max(...reports.map(r => r.achievementPercentage))}%</li>
//                       <li>• Lowest Performance: {Math.min(...reports.map(r => r.achievementPercentage))}%</li>
//                     </ul>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
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
import { Upload, FileText, Video, Image, Mic, CheckCircle, XCircle, Clock, AlertTriangle, Target, TrendingUp, FileSpreadsheet, Plus, Trash2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "../../api/axios";

interface MISReport {
  misReportSubmissionDateTime: any;
  project: ReactNode;
  reportingPeriod: ReactNode;
  allocatedTarget: ReactNode;
  completedTarget: ReactNode;
  deviationReport: any;
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

interface BudgetColumn {
  id: string;
  title: string;
  type: 'text' | 'number' | 'integer' | 'date' | 'time' | 'currency' | 'percentage';
  required: boolean;
}

interface BudgetRow {
  id: string;
  [key: string]: any;
}

export function MISReportManager() {
  const [selectedProject, setSelectedProject] = useState("");
  const [reports, setReports] = useState<MISReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportFormData, setReportFormData] = useState({
    targetAllocated: "",
    currentPerformance: "",
    deviation: "",
    mitigationPlan: "",
    projectSummary: "",
    budgetHead: "",
    attachments: [] as File[]
  });

  // Budget Matrix State
  const [budgetColumns, setBudgetColumns] = useState<BudgetColumn[]>([
    { id: 'date', title: 'Date', type: 'date', required: true },
    { id: 'description', title: 'Description', type: 'text', required: true },
    { id: 'unit', title: 'Unit', type: 'text', required: true },
    { id: 'unitCost', title: 'Unit Cost', type: 'currency', required: true },
    { id: 'key', title: 'Key', type: 'number', required: false },
    { id: 'cmb', title: 'CMB', type: 'number', required: false },
    { id: 'ngo', title: 'NGO', type: 'number', required: false },
    { id: 'beneficiary', title: 'Beneficiary', type: 'number', required: false },
  ]);

  const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([
    { id: '1' }
  ]);

  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
  const [newColumn, setNewColumn] = useState({
    title: '',
    type: 'text' as const,
    required: false
  });

  // 🔹 Auto-calculate submission period and current month dates
  const today = new Date();
  const day = today.getDate();
  const isSubmissionPeriodOpen = day >= 1 && day <= 25;
  
  // Get current month's start and end dates
  const getCurrentMonthDateRange = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  };

  // Get month name from date
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };

  // Get current reporting period (month and year)
  const currentReportingPeriod = {
    month: getMonthName(today),
    year: today.getFullYear()
  };

  // Helper functions for previous month
  const getPreviousMonthName = () => {
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return previousMonth.toLocaleString('default', { month: 'long' });
  };

  const getPreviousMonthYear = () => {
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return previousMonth.getFullYear();
  };

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getCurrentMonthDateRange();
      
      const response = await api.get(`api/mis-reports/date-range`, {
        params: {
          startDate,
          endDate
        }
      });
      
      // Ensure reports is always an array, even if API returns null
      setReports(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching MIS reports:', err);
      setError('Failed to load reports. Please try again.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit new report
  const submitReport = async () => {
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }

    try {
      const achievementPercentage = calculateAchievementPercentage();
      
      const reportData = {
        projectId: selectedProject,
        month: getPreviousMonthName(),
        year: getPreviousMonthYear(),
        targetAllocated: Number(reportFormData.targetAllocated),
        currentPerformance: Number(reportFormData.currentPerformance),
        achievementPercentage,
        deviation: reportFormData.deviation || null,
        mitigationPlan: reportFormData.mitigationPlan || null,
        projectSummary: reportFormData.projectSummary || null,
        budgetHead: reportFormData.budgetHead || null,
        budgetMatrix: {
          columns: budgetColumns,
          rows: budgetRows
        },
        carryForward: achievementPercentage < 100 ? 
          Number(reportFormData.targetAllocated) - Number(reportFormData.currentPerformance) : 0,
        status: 'submitted' as const,
        submissionDate: new Date().toISOString(),
        attachments: [] // You'll need to handle file uploads separately
      };

      await api.post('/mis-reports', reportData);
      
      // Refresh reports
      await fetchReports();
      
      // Reset form
      setReportFormData({
        targetAllocated: "",
        currentPerformance: "",
        deviation: "",
        mitigationPlan: "",
        projectSummary: "",
        budgetHead: "",
        attachments: []
      });
      setSelectedProject("");
      
      alert('Report submitted successfully!');
    } catch (err) {
      console.error('Error submitting report:', err);
      alert('Failed to submit report. Please try again.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Budget Matrix Functions
  const addColumn = () => {
    if (!newColumn.title.trim()) return;

    const columnId = newColumn.title.toLowerCase().replace(/\s+/g, '-');
    const newColumnData: BudgetColumn = {
      id: columnId,
      title: newColumn.title,
      type: newColumn.type,
      required: newColumn.required
    };

    setBudgetColumns([...budgetColumns, newColumnData]);
    
    // Initialize this column for all existing rows
    const updatedRows = budgetRows.map(row => ({
      ...row,
      [columnId]: ''
    }));

    setBudgetRows(updatedRows);
    setNewColumn({ title: '', type: 'text', required: false });
    setShowAddColumnDialog(false);
  };

  const removeColumn = (columnId: string) => {
    if (['date', 'description', 'unit', 'unitCost'].includes(columnId)) {
      alert('Core columns cannot be removed');
      return;
    }

    setBudgetColumns(budgetColumns.filter(col => col.id !== columnId));
    
    // Remove this column data from all rows
    const updatedRows = budgetRows.map(row => {
      const newRow = { ...row };
      delete newRow[columnId];
      return newRow;
    });

    setBudgetRows(updatedRows);
  };

  const addRow = () => {
    const newRow: BudgetRow = { id: Date.now().toString() };
    // Initialize all columns for the new row
    budgetColumns.forEach(col => {
      newRow[col.id] = '';
    });
    setBudgetRows([...budgetRows, newRow]);
  };

  const removeRow = (rowId: string) => {
    if (budgetRows.length === 1) {
      alert('At least one row is required');
      return;
    }
    setBudgetRows(budgetRows.filter(row => row.id !== rowId));
  };

  const updateRowData = (rowId: string, columnId: string, value: string) => {
    const updatedRows = budgetRows.map(row => 
      row.id === rowId ? { ...row, [columnId]: value } : row
    );
    setBudgetRows(updatedRows);
  };

  const getInputType = (columnType: string) => {
    switch (columnType) {
      case 'number':
      case 'integer':
      case 'currency':
      case 'percentage':
        return 'number';
      case 'date':
        return 'date';
      case 'time':
        return 'time';
      default:
        return 'text';
    }
  };

  const getInputPlaceholder = (columnType: string) => {
    switch (columnType) {
      case 'currency':
        return '0.00';
      case 'percentage':
        return '0%';
      case 'number':
      case 'integer':
        return '0';
      case 'date':
        return 'mm/dd/yyyy';
      case 'time':
        return 'HH:MM';
      default:
        return 'Enter text';
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const ngoTotal = budgetRows.reduce((sum, row) => sum + (parseFloat(row.ngo) || 0), 0);
    const beneficiaryTotal = budgetRows.reduce((sum, row) => sum + (parseFloat(row.beneficiary) || 0), 0);
    const totalCost = ngoTotal + beneficiaryTotal;

    return { ngoTotal, beneficiaryTotal, totalCost };
  };

  const totals = calculateTotals();

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

  // Calculate performance statistics
  const performanceStats = {
    excellent: reports.filter(report => report.achievementPercentage >= 80).length,
    good: reports.filter(report => report.achievementPercentage >= 50 && report.achievementPercentage < 80).length,
    needsAttention: reports.filter(report => report.achievementPercentage >= 30 && report.achievementPercentage < 50).length,
    critical: reports.filter(report => report.achievementPercentage < 30).length
  };

  // Placeholder functions for actions
  const openEditDialog = (reportId: string) => {
    console.log('Open edit dialog for report:', reportId);
    // Implement edit functionality
  };

  const handleDelete = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      console.log('Delete report:', reportId);
      // Implement delete functionality
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">MIS Report Management</h2>
          <p className="text-muted-foreground">
            Monthly reporting portal (21st-25th) - {currentReportingPeriod.month} {currentReportingPeriod.year}
          </p>
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

      {/* Error Alert */}
      {error && (
        <Card className="border-impact-red bg-impact-red/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-impact-red" />
              <p className="text-impact-red">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Period Alert */}
      {isSubmissionPeriodOpen && (
        <Card className="border-impact-green bg-impact-green/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-impact-green" />
              <div>
                <p className="font-medium text-impact-green">Submission Period Active</p>
                <p className="text-sm text-muted-foreground">
                  Submit your monthly reports between 21st-25th of each month. 
                  Reports will remain visible until the next submission period.
                </p>
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
              <CardTitle>
                Monthly Reports - {currentReportingPeriod.month} {currentReportingPeriod.year}
                {reports.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({reports.length} reports found)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4" />
                  <p>No reports found for {currentReportingPeriod.month} {currentReportingPeriod.year}</p>
                  <p className="text-sm">Reports submitted between 21st-25th will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sr. No</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report, index) => {
                      const achievementValue = parseInt(report.achievementPercentage.toString().replace("%", ""), 10);

                      return (
                        <TableRow key={report.id}>
                          {/* Sr. No. */}
                          <TableCell>{index + 1}</TableCell>

                          {/* Project */}
                          <TableCell>
                            <div>
                              <p className="font-medium">{report.project}</p>
                            </div>
                          </TableCell>

                          {/* Reporting Period + Submission Date */}
                          <TableCell>
                            <div>
                              <p className="font-medium">{report.reportingPeriod}</p>
                              {report.misReportSubmissionDateTime && (
                                <p className="text-sm text-muted-foreground">
                                  Submitted: {new Date(report.misReportSubmissionDateTime).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          {/* Targets + Progress */}
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Target: {report.allocatedTarget}</span>
                              </div>
                              <Progress value={achievementValue} className="w-24" />
                            </div>
                          </TableCell>

                          {/* Achievement % + Badge */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={cn("font-medium", getPerformanceColor(achievementValue))}>
                                {report.achievementPercentage}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={getPerformanceBadge(achievementValue).color + " text-white"}>
                                {getPerformanceBadge(achievementValue).text}
                              </Badge>
                            </div>
                          </TableCell>

                          {/* Actions (View + Update + Delete) */}
                          <TableCell>
                            <div className="flex space-x-2">
                              {/* View Button with Dialog */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="secondary" size="sm">View</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                  <DialogHeader>
                                    <DialogTitle>{report.project} - {report.reportingPeriod}</DialogTitle>
                                  </DialogHeader>

                                  <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <Card>
                                        <CardContent className="p-4">
                                          <div className="text-center">
                                            <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                                            <p className="text-sm text-muted-foreground">Target Allocated</p>
                                            <p className="text-2xl font-bold">{report.allocatedTarget}</p>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardContent className="p-4">
                                          <div className="text-center">
                                            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
                                            <p className="text-sm text-muted-foreground">Current Performance</p>
                                            <p className="text-2xl font-bold">{report.completedTarget}</p>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardContent className="p-4">
                                          <div className="text-center">
                                            <div className={cn("text-2xl font-bold", getPerformanceColor(achievementValue))}>
                                              {report.achievementPercentage}%
                                            </div>
                                            <p className="text-sm text-muted-foreground">Achievement</p>
                                            <Badge className={getPerformanceBadge(achievementValue).color + " text-white mt-1"}>
                                              {getPerformanceBadge(achievementValue).text}
                                            </Badge>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </div>

                                    {report.deviationReport && (
                                      <Card>
                                        <CardHeader>
                                          <CardTitle className="text-sm">Deviation Report</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <p className="text-sm">{report.deviationReport}</p>
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

                                    {report.attachments && Array.isArray(report.attachments) && report.attachments.length > 0 && (
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
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* Update Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(report.id)}
                              >
                                Update
                              </Button>

                              {/* Delete Button */}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(report.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
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
                {/* Previous Month Display */}
                <div className="space-y-2">
                  <Label>Reporting Period</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      value={`${getPreviousMonthName()} ${getPreviousMonthYear()}`} 
                      disabled 
                      className="bg-muted font-medium" 
                    />
                  </div>
                </div>

                {/* Project Selection */}
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

                {/* Project Summary */}
                <div className="space-y-2">
                  <Label htmlFor="projectSummary">Project Summary</Label>
                  <Textarea
                    id="projectSummary"
                    value={reportFormData.projectSummary}
                    onChange={(e) => setReportFormData({...reportFormData, projectSummary: e.target.value})}
                    placeholder="Provide a summary of the selected project..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Budget Head Selection */}
                <div className="space-y-2">
                  <Label htmlFor="budgetHead">Budget Head *</Label>
                  <Select value={reportFormData.budgetHead} onValueChange={(value) => setReportFormData({...reportFormData, budgetHead: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget head" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procurement">1. Procurement Cost</SelectItem>
                      <SelectItem value="training">2. Training Cost</SelectItem>
                      <SelectItem value="civil">3. Civil/Construction Cost</SelectItem>
                      <SelectItem value="contingency">4. Contingency/Miscellaneous Cost</SelectItem>
                      <SelectItem value="hr">5. HR Cost</SelectItem>
                      <SelectItem value="admin">6. Admin Cost</SelectItem>
                      <SelectItem value="management">7. Management and Coordination</SelectItem>
                      <SelectItem value="government">8. Government Convergence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Allocation Matrix */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Budget Allocation Matrix</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Build to address each contributor's tracking
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={showAddColumnDialog} onOpenChange={setShowAddColumnDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Add Column
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Add New Column</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="columnTitle">Column Title</Label>
                                <Input
                                  id="columnTitle"
                                  value={newColumn.title}
                                  onChange={(e) => setNewColumn({...newColumn, title: e.target.value})}
                                  placeholder="Enter column title"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="columnType">Data Type</Label>
                                <Select 
                                  value={newColumn.type} 
                                  onValueChange={(value: any) => setNewColumn({...newColumn, type: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select data type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="integer">Integer</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="time">Time</SelectItem>
                                    <SelectItem value="currency">Currency</SelectItem>
                                    <SelectItem value="percentage">Percentage</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="required"
                                  checked={newColumn.required}
                                  onChange={(e) => setNewColumn({...newColumn, required: e.target.checked})}
                                  className="rounded border-gray-300"
                                />
                                <Label htmlFor="required">Required Field</Label>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowAddColumnDialog(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={addColumn} disabled={!newColumn.title.trim()}>
                                  Add Column
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" onClick={addRow} className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add Row
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Compact Budget Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {budgetColumns.slice(0, 8).map((column) => (
                              <TableHead key={column.id} className="text-xs px-2 py-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    {column.title}
                                    {column.required && <span className="text-red-500 ml-1">*</span>}
                                  </span>
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="w-12 px-2 py-3">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {budgetRows.map((row) => (
                            <TableRow key={row.id}>
                              {budgetColumns.slice(0, 8).map((column) => (
                                <TableCell key={column.id} className="px-2 py-2">
                                  <Input
                                    type={getInputType(column.type)}
                                    value={row[column.id] || ''}
                                    onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
                                    placeholder={getInputPlaceholder(column.type)}
                                    className="h-8 text-xs"
                                    required={column.required}
                                  />
                                </TableCell>
                              ))}
                              <TableCell className="px-2 py-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRow(row.id)}
                                  className="h-7 w-7 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Additional Columns Section (if any beyond 8) */}
                    {budgetColumns.length > 8 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium mb-2 block">Additional Columns</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {budgetColumns.slice(8).map((column) => (
                            <div key={column.id} className="space-y-1">
                              <Label className="text-xs">
                                {column.title}
                                {column.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {budgetRows.map((row, index) => (
                                <Input
                                  key={`${row.id}-${column.id}`}
                                  type={getInputType(column.type)}
                                  value={row[column.id] || ''}
                                  onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
                                  placeholder={getInputPlaceholder(column.type)}
                                  className="h-7 text-xs"
                                  required={column.required}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total Cost Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg border">
                        <p className="text-xs font-medium text-blue-700">NGO Contribution</p>
                        <p className="text-lg font-bold text-blue-900">₹{totals.ngoTotal.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg border">
                        <p className="text-xs font-medium text-green-700">Beneficiary Contribution</p>
                        <p className="text-lg font-bold text-green-900">₹{totals.beneficiaryTotal.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-xs font-medium text-primary">Total Cost</p>
                        <p className="text-lg font-bold text-primary">₹{totals.totalCost.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Fields in Compact Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">NGO Contribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="targetAllocated" className="text-sm font-medium">
                          Target Allocated *
                        </Label>
                        <Input
                          id="targetAllocated"
                          type="number"
                          value={reportFormData.targetAllocated}
                          onChange={(e) => setReportFormData({...reportFormData, targetAllocated: e.target.value})}
                          placeholder="Enter target allocated"
                          className="h-9"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Beneficiary Contribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="currentPerformance" className="text-sm font-medium">
                          Completed Target *
                        </Label>
                        <Input
                          id="currentPerformance" 
                          type="number"
                          value={reportFormData.currentPerformance}
                          onChange={(e) => setReportFormData({...reportFormData, currentPerformance: e.target.value})}
                          placeholder="Enter completed target"
                          className="h-9"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Achievement Percentage Display */}
                {reportFormData.targetAllocated && reportFormData.currentPerformance && (
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Achievement Percentage:</span>
                        <div className="flex items-center gap-2">
                          <span className={cn("text-xl font-bold", getPerformanceColor(calculateAchievementPercentage()))}>
                            {calculateAchievementPercentage()}%
                          </span>
                          <Badge className={getPerformanceBadge(calculateAchievementPercentage()).color + " text-white text-xs"}>
                            {getPerformanceBadge(calculateAchievementPercentage()).text}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Deviation Report */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Deviation Report (if applicable)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={reportFormData.deviation}
                      onChange={(e) => setReportFormData({...reportFormData, deviation: e.target.value})}
                      placeholder="Describe any deviations from planned targets..."
                      className="min-h-[80px] text-sm"
                    />
                  </CardContent>
                </Card>

                {/* File Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">File Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Upload supporting documents</p>
                        <p className="text-xs text-muted-foreground">
                          Excel, Word, PDF, Video files supported
                        </p>
                        <Input
                          type="file"
                          multiple
                          accept=".xlsx,.xls,.docx,.doc,.pdf,.mp4,.mov,.avi"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="w-full mt-2"
                        />
                      </div>
                    </div>
                    
                    {reportFormData.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <Label className="text-sm">Uploaded Files:</Label>
                        {reportFormData.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                            <FileText className="h-3 w-3" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={submitReport}
                    disabled={!selectedProject || !reportFormData.budgetHead || !reportFormData.targetAllocated || !reportFormData.currentPerformance}
                  >
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
                  Please check back during the submission period.
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
                  <p className="text-2xl font-bold text-impact-green">{performanceStats.excellent}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-info" />
                  <p className="text-sm text-muted-foreground">Good Performance</p>
                  <p className="text-2xl font-bold text-impact-blue">{performanceStats.good}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                  <p className="text-2xl font-bold text-impact-yellow">{performanceStats.needsAttention}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-bold text-impact-red">{performanceStats.critical}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trend Analysis - {currentReportingPeriod.month} {currentReportingPeriod.year}</CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>No data available for analysis</p>
                  <p className="text-sm">Submit reports to see performance analytics</p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                  <p>Performance analytics visualization would be implemented here</p>
                  <p className="text-sm">Charts showing monthly trends, comparative analysis, etc.</p>
                  <div className="mt-4 text-left">
                    <p className="font-medium">Current Month Summary:</p>
                    <ul className="text-sm mt-2 space-y-1">
                      <li>• Total Reports: {reports.length}</li>
                      <li>• Average Achievement: {Math.round(reports.reduce((sum, r) => sum + r.achievementPercentage, 0) / reports.length)}%</li>
                      <li>• Highest Performance: {Math.max(...reports.map(r => r.achievementPercentage))}%</li>
                      <li>• Lowest Performance: {Math.min(...reports.map(r => r.achievementPercentage))}%</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}