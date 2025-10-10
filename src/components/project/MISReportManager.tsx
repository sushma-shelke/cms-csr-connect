// // import { useState, useEffect } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Progress } from "@/components/ui/progress";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Upload, FileText, Video, Image, Mic, CheckCircle, XCircle, Clock, AlertTriangle, Target, TrendingUp, FileSpreadsheet, Plus, Trash2, Settings } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import api from "../../api/axios";

// // interface MISReport {
// //   misReportSubmissionDateTime: any;
// //   project: ReactNode;
// //   reportingPeriod: ReactNode;
// //   allocatedTarget: ReactNode;
// //   completedTarget: ReactNode;
// //   deviationReport: any;
// //   id: string;
// //   projectId: string;
// //   projectName: string;
// //   month: string;
// //   year: number;
// //   targetAllocated: number;
// //   currentPerformance: number;
// //   achievementPercentage: number;
// //   status: 'submitted' | 'pending' | 'approved' | 'rejected';
// //   submissionDate?: string;
// //   deviation?: string;
// //   mitigationPlan?: string;
// //   carryForward?: number;
// //   attachments: Array<{
// //     type: 'excel' | 'word' | 'video' | 'pdf';
// //     name: string;
// //     url: string;
// //   }>;
// // }

// // interface BudgetColumn {
// //   id: string;
// //   title: string;
// //   type: 'text' | 'number' | 'integer' | 'date' | 'time' | 'currency' | 'percentage';
// //   required: boolean;
// // }

// // interface BudgetRow {
// //   id: string;
// //   [key: string]: any;
// // }

// // export function MISReportManager() {
// //   const [selectedProject, setSelectedProject] = useState("");
// //   const [reports, setReports] = useState<MISReport[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [reportFormData, setReportFormData] = useState({
// //     targetAllocated: "",
// //     currentPerformance: "",
// //     deviation: "",
// //     mitigationPlan: "",
// //     projectSummary: "",
// //     budgetHead: "",
// //     attachments: [] as File[]
// //   });

// //   // Budget Matrix State
// //   const [budgetColumns, setBudgetColumns] = useState<BudgetColumn[]>([
// //     { id: 'date', title: 'Date', type: 'date', required: true },
// //     { id: 'description', title: 'Description', type: 'text', required: true },
// //     { id: 'unit', title: 'Unit', type: 'text', required: true },
// //     { id: 'unitCost', title: 'Unit Cost', type: 'currency', required: true },
// //     { id: 'key', title: 'Key', type: 'number', required: false },
// //     { id: 'cmb', title: 'CMB', type: 'number', required: false },
// //     { id: 'ngo', title: 'NGO', type: 'number', required: false },
// //     { id: 'beneficiary', title: 'Beneficiary', type: 'number', required: false },
// //   ]);

// //   const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([
// //     { id: '1' }
// //   ]);

// //   const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
// //   const [newColumn, setNewColumn] = useState({
// //     title: '',
// //     type: 'text' as const,
// //     required: false
// //   });

// //   // 🔹 Auto-calculate submission period and current month dates
// //   const today = new Date();
// //   const day = today.getDate();
// //   const isSubmissionPeriodOpen = day >= 1 && day <= 25;
  
// //   // Get current month's start and end dates
// //   const getCurrentMonthDateRange = () => {
// //     const year = today.getFullYear();
// //     const month = today.getMonth();
    
// //     const startDate = new Date(year, month, 1);
// //     const endDate = new Date(year, month + 1, 0, 23, 59, 59);
    
// //     return {
// //       startDate: startDate.toISOString(),
// //       endDate: endDate.toISOString()
// //     };
// //   };

// //   // Get month name from date
// //   const getMonthName = (date: Date) => {
// //     return date.toLocaleString('default', { month: 'long' });
// //   };

// //   // Get current reporting period (month and year)
// //   const currentReportingPeriod = {
// //     month: getMonthName(today),
// //     year: today.getFullYear()
// //   };

// //   // Helper functions for previous month
// //   const getPreviousMonthName = () => {
// //     const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
// //     return previousMonth.toLocaleString('default', { month: 'long' });
// //   };

// //   const getPreviousMonthYear = () => {
// //     const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
// //     return previousMonth.getFullYear();
// //   };

// //   // Fetch reports from API
// //   const fetchReports = async () => {
// //     try {
// //       setLoading(true);
// //       const { startDate, endDate } = getCurrentMonthDateRange();
      
// //       const response = await api.get(`api/mis-reports/date-range`, {
// //         params: {
// //           startDate,
// //           endDate
// //         }
// //       });
      
// //       // Ensure reports is always an array, even if API returns null
// //       setReports(Array.isArray(response.data) ? response.data : []);
// //       setError(null);
// //     } catch (err) {
// //       console.error('Error fetching MIS reports:', err);
// //       setError('Failed to load reports. Please try again.');
// //       setReports([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Submit new report
// //   const submitReport = async () => {
// //     if (!selectedProject) {
// //       alert('Please select a project');
// //       return;
// //     }

// //     try {
// //       const achievementPercentage = calculateAchievementPercentage();
      
// //       const reportData = {
// //         projectId: selectedProject,
// //         month: getPreviousMonthName(),
// //         year: getPreviousMonthYear(),
// //         targetAllocated: Number(reportFormData.targetAllocated),
// //         currentPerformance: Number(reportFormData.currentPerformance),
// //         achievementPercentage,
// //         deviation: reportFormData.deviation || null,
// //         mitigationPlan: reportFormData.mitigationPlan || null,
// //         projectSummary: reportFormData.projectSummary || null,
// //         budgetHead: reportFormData.budgetHead || null,
// //         budgetMatrix: {
// //           columns: budgetColumns,
// //           rows: budgetRows
// //         },
// //         carryForward: achievementPercentage < 100 ? 
// //           Number(reportFormData.targetAllocated) - Number(reportFormData.currentPerformance) : 0,
// //         status: 'submitted' as const,
// //         submissionDate: new Date().toISOString(),
// //         attachments: [] // You'll need to handle file uploads separately
// //       };

// //       await api.post('/mis-reports', reportData);
      
// //       // Refresh reports
// //       await fetchReports();
      
// //       // Reset form
// //       setReportFormData({
// //         targetAllocated: "",
// //         currentPerformance: "",
// //         deviation: "",
// //         mitigationPlan: "",
// //         projectSummary: "",
// //         budgetHead: "",
// //         attachments: []
// //       });
// //       setSelectedProject("");
      
// //       alert('Report submitted successfully!');
// //     } catch (err) {
// //       console.error('Error submitting report:', err);
// //       alert('Failed to submit report. Please try again.');
// //     }
// //   };

// //   useEffect(() => {
// //     fetchReports();
// //   }, []);

// //   // Budget Matrix Functions
// //   const addColumn = () => {
// //     if (!newColumn.title.trim()) return;

// //     const columnId = newColumn.title.toLowerCase().replace(/\s+/g, '-');
// //     const newColumnData: BudgetColumn = {
// //       id: columnId,
// //       title: newColumn.title,
// //       type: newColumn.type,
// //       required: newColumn.required
// //     };

// //     setBudgetColumns([...budgetColumns, newColumnData]);
    
// //     // Initialize this column for all existing rows
// //     const updatedRows = budgetRows.map(row => ({
// //       ...row,
// //       [columnId]: ''
// //     }));

// //     setBudgetRows(updatedRows);
// //     setNewColumn({ title: '', type: 'text', required: false });
// //     setShowAddColumnDialog(false);
// //   };

// //   const removeColumn = (columnId: string) => {
// //     if (['date', 'description', 'unit', 'unitCost'].includes(columnId)) {
// //       alert('Core columns cannot be removed');
// //       return;
// //     }

// //     setBudgetColumns(budgetColumns.filter(col => col.id !== columnId));
    
// //     // Remove this column data from all rows
// //     const updatedRows = budgetRows.map(row => {
// //       const newRow = { ...row };
// //       delete newRow[columnId];
// //       return newRow;
// //     });

// //     setBudgetRows(updatedRows);
// //   };

// //   const addRow = () => {
// //     const newRow: BudgetRow = { id: Date.now().toString() };
// //     // Initialize all columns for the new row
// //     budgetColumns.forEach(col => {
// //       newRow[col.id] = '';
// //     });
// //     setBudgetRows([...budgetRows, newRow]);
// //   };

// //   const removeRow = (rowId: string) => {
// //     if (budgetRows.length === 1) {
// //       alert('At least one row is required');
// //       return;
// //     }
// //     setBudgetRows(budgetRows.filter(row => row.id !== rowId));
// //   };

// //   const updateRowData = (rowId: string, columnId: string, value: string) => {
// //     const updatedRows = budgetRows.map(row => 
// //       row.id === rowId ? { ...row, [columnId]: value } : row
// //     );
// //     setBudgetRows(updatedRows);
// //   };

// //   const getInputType = (columnType: string) => {
// //     switch (columnType) {
// //       case 'number':
// //       case 'integer':
// //       case 'currency':
// //       case 'percentage':
// //         return 'number';
// //       case 'date':
// //         return 'date';
// //       case 'time':
// //         return 'time';
// //       default:
// //         return 'text';
// //     }
// //   };

// //   const getInputPlaceholder = (columnType: string) => {
// //     switch (columnType) {
// //       case 'currency':
// //         return '0.00';
// //       case 'percentage':
// //         return '0%';
// //       case 'number':
// //       case 'integer':
// //         return '0';
// //       case 'date':
// //         return 'mm/dd/yyyy';
// //       case 'time':
// //         return 'HH:MM';
// //       default:
// //         return 'Enter text';
// //     }
// //   };

// //   // Calculate totals
// //   const calculateTotals = () => {
// //     const ngoTotal = budgetRows.reduce((sum, row) => sum + (parseFloat(row.ngo) || 0), 0);
// //     const beneficiaryTotal = budgetRows.reduce((sum, row) => sum + (parseFloat(row.beneficiary) || 0), 0);
// //     const totalCost = ngoTotal + beneficiaryTotal;

// //     return { ngoTotal, beneficiaryTotal, totalCost };
// //   };

// //   const totals = calculateTotals();

// //   const getPerformanceColor = (percentage: number) => {
// //     if (percentage >= 80) return "text-impact-green";
// //     if (percentage >= 50) return "text-impact-blue";
// //     if (percentage >= 30) return "text-impact-yellow";
// //     return "text-impact-red";
// //   };

// //   const getPerformanceBadge = (percentage: number) => {
// //     if (percentage >= 80) return { color: "bg-impact-green", text: "Excellent" };
// //     if (percentage >= 50) return { color: "bg-impact-blue", text: "Good" };
// //     if (percentage >= 30) return { color: "bg-impact-yellow", text: "Needs Attention" };
// //     return { color: "bg-impact-red", text: "Critical" };
// //   };

// //   const getStatusIcon = (status: string) => {
// //     switch (status) {
// //       case 'approved':
// //         return <CheckCircle className="h-4 w-4 text-impact-green" />;
// //       case 'rejected':
// //         return <XCircle className="h-4 w-4 text-impact-red" />;
// //       case 'pending':
// //         return <Clock className="h-4 w-4 text-impact-yellow" />;
// //       default:
// //         return <Clock className="h-4 w-4 text-muted-foreground" />;
// //     }
// //   };

// //   const handleFileUpload = (files: FileList | null) => {
// //     if (files) {
// //       const newFiles = Array.from(files);
// //       setReportFormData({
// //         ...reportFormData,
// //         attachments: [...reportFormData.attachments, ...newFiles]
// //       });
// //     }
// //   };

// //   const calculateAchievementPercentage = () => {
// //     const target = Number(reportFormData.targetAllocated);
// //     const performance = Number(reportFormData.currentPerformance);
// //     return target > 0 ? Math.round((performance / target) * 100) : 0;
// //   };

// //   // Calculate performance statistics
// //   const performanceStats = {
// //     excellent: reports.filter(report => report.achievementPercentage >= 80).length,
// //     good: reports.filter(report => report.achievementPercentage >= 50 && report.achievementPercentage < 80).length,
// //     needsAttention: reports.filter(report => report.achievementPercentage >= 30 && report.achievementPercentage < 50).length,
// //     critical: reports.filter(report => report.achievementPercentage < 30).length
// //   };

// //   // Placeholder functions for actions
// //   const openEditDialog = (reportId: string) => {
// //     console.log('Open edit dialog for report:', reportId);
// //     // Implement edit functionality
// //   };

// //   const handleDelete = (reportId: string) => {
// //     if (confirm('Are you sure you want to delete this report?')) {
// //       console.log('Delete report:', reportId);
// //       // Implement delete functionality
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="text-center">
// //           <Clock className="h-8 w-8 mx-auto mb-2 animate-spin" />
// //           <p>Loading reports...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex justify-between items-center">
// //         <div>
// //           <h2 className="text-2xl font-bold text-foreground">MIS Report Management</h2>
// //           <p className="text-muted-foreground">
// //             Monthly reporting portal (21st-25th) - {currentReportingPeriod.month} {currentReportingPeriod.year}
// //           </p>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           {isSubmissionPeriodOpen ? (
// //             <Badge className="bg-impact-green text-white">
// //               Submission Period Open
// //             </Badge>
// //           ) : (
// //             <Badge className="bg-impact-red text-white">
// //               Submission Period Closed
// //             </Badge>
// //           )}
// //         </div>
// //       </div>

// //       {/* Error Alert */}
// //       {error && (
// //         <Card className="border-impact-red bg-impact-red/5">
// //           <CardContent className="p-4">
// //             <div className="flex items-center gap-2">
// //               <AlertTriangle className="h-5 w-5 text-impact-red" />
// //               <p className="text-impact-red">{error}</p>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {/* Submission Period Alert */}
// //       {isSubmissionPeriodOpen && (
// //         <Card className="border-impact-green bg-impact-green/5">
// //           <CardContent className="p-4">
// //             <div className="flex items-center gap-2">
// //               <Target className="h-5 w-5 text-impact-green" />
// //               <div>
// //                 <p className="font-medium text-impact-green">Submission Period Active</p>
// //                 <p className="text-sm text-muted-foreground">
// //                   Submit your monthly reports between 21st-25th of each month. 
// //                   Reports will remain visible until the next submission period.
// //                 </p>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       <Tabs defaultValue="reports" className="space-y-6">
// //         <TabsList>
// //           <TabsTrigger value="reports">All Reports</TabsTrigger>
// //           <TabsTrigger value="submit">Submit Report</TabsTrigger>
// //           <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
// //         </TabsList>

// //         <TabsContent value="reports" className="space-y-6">
// //           {/* Reports Table */}
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>
// //                 Monthly Reports - {currentReportingPeriod.month} {currentReportingPeriod.year}
// //                 {reports.length > 0 && (
// //                   <span className="text-sm font-normal text-muted-foreground ml-2">
// //                     ({reports.length} reports found)
// //                   </span>
// //                 )}
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               {reports.length === 0 ? (
// //                 <div className="text-center py-8 text-muted-foreground">
// //                   <FileText className="h-16 w-16 mx-auto mb-4" />
// //                   <p>No reports found for {currentReportingPeriod.month} {currentReportingPeriod.year}</p>
// //                   <p className="text-sm">Reports submitted between 21st-25th will appear here</p>
// //                 </div>
// //               ) : (
// //                 <Table>
// //                   <TableHeader>
// //                     <TableRow>
// //                       <TableHead>Sr. No</TableHead>
// //                       <TableHead>Project</TableHead>
// //                       <TableHead>Period</TableHead>
// //                       <TableHead>Target</TableHead>
// //                       <TableHead>Performance</TableHead>
// //                       <TableHead>Status</TableHead>
// //                       <TableHead>Actions</TableHead>
// //                     </TableRow>
// //                   </TableHeader>
// //                   <TableBody>
// //                     {reports.map((report, index) => {
// //                       const achievementValue = parseInt(report.achievementPercentage.toString().replace("%", ""), 10);

// //                       return (
// //                         <TableRow key={report.id}>
// //                           {/* Sr. No. */}
// //                           <TableCell>{index + 1}</TableCell>

// //                           {/* Project */}
// //                           <TableCell>
// //                             <div>
// //                               <p className="font-medium">{report.project}</p>
// //                             </div>
// //                           </TableCell>

// //                           {/* Reporting Period + Submission Date */}
// //                           <TableCell>
// //                             <div>
// //                               <p className="font-medium">{report.reportingPeriod}</p>
// //                               {report.misReportSubmissionDateTime && (
// //                                 <p className="text-sm text-muted-foreground">
// //                                   Submitted: {new Date(report.misReportSubmissionDateTime).toLocaleDateString()}
// //                                 </p>
// //                               )}
// //                             </div>
// //                           </TableCell>

// //                           {/* Targets + Progress */}
// //                           <TableCell>
// //                             <div className="space-y-1">
// //                               <div className="flex justify-between text-sm">
// //                                 <span>Target: {report.allocatedTarget}</span>
// //                               </div>
// //                               <Progress value={achievementValue} className="w-24" />
// //                             </div>
// //                           </TableCell>

// //                           {/* Achievement % + Badge */}
// //                           <TableCell>
// //                             <div className="flex items-center gap-2">
// //                               <span className={cn("font-medium", getPerformanceColor(achievementValue))}>
// //                                 {report.achievementPercentage}%
// //                               </span>
// //                             </div>
// //                           </TableCell>
// //                           <TableCell>
// //                             <div className="flex items-center gap-2">
// //                               <Badge className={getPerformanceBadge(achievementValue).color + " text-white"}>
// //                                 {getPerformanceBadge(achievementValue).text}
// //                               </Badge>
// //                             </div>
// //                           </TableCell>

// //                           {/* Actions (View + Update + Delete) */}
// //                           <TableCell>
// //                             <div className="flex space-x-2">
// //                               {/* View Button with Dialog */}
// //                               <Dialog>
// //                                 <DialogTrigger asChild>
// //                                   <Button variant="secondary" size="sm">View</Button>
// //                                 </DialogTrigger>
// //                                 <DialogContent className="max-w-4xl">
// //                                   <DialogHeader>
// //                                     <DialogTitle>{report.project} - {report.reportingPeriod}</DialogTitle>
// //                                   </DialogHeader>

// //                                   <div className="space-y-6">
// //                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                                       <Card>
// //                                         <CardContent className="p-4">
// //                                           <div className="text-center">
// //                                             <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
// //                                             <p className="text-sm text-muted-foreground">Target Allocated</p>
// //                                             <p className="text-2xl font-bold">{report.allocatedTarget}</p>
// //                                           </div>
// //                                         </CardContent>
// //                                       </Card>

// //                                       <Card>
// //                                         <CardContent className="p-4">
// //                                           <div className="text-center">
// //                                             <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
// //                                             <p className="text-sm text-muted-foreground">Current Performance</p>
// //                                             <p className="text-2xl font-bold">{report.completedTarget}</p>
// //                                           </div>
// //                                         </CardContent>
// //                                       </Card>

// //                                       <Card>
// //                                         <CardContent className="p-4">
// //                                           <div className="text-center">
// //                                             <div className={cn("text-2xl font-bold", getPerformanceColor(achievementValue))}>
// //                                               {report.achievementPercentage}%
// //                                             </div>
// //                                             <p className="text-sm text-muted-foreground">Achievement</p>
// //                                             <Badge className={getPerformanceBadge(achievementValue).color + " text-white mt-1"}>
// //                                               {getPerformanceBadge(achievementValue).text}
// //                                             </Badge>
// //                                           </div>
// //                                         </CardContent>
// //                                       </Card>
// //                                     </div>

// //                                     {report.deviationReport && (
// //                                       <Card>
// //                                         <CardHeader>
// //                                           <CardTitle className="text-sm">Deviation Report</CardTitle>
// //                                         </CardHeader>
// //                                         <CardContent>
// //                                           <p className="text-sm">{report.deviationReport}</p>
// //                                         </CardContent>
// //                                       </Card>
// //                                     )}

// //                                     {report.mitigationPlan && (
// //                                       <Card>
// //                                         <CardHeader>
// //                                           <CardTitle className="text-sm">Mitigation Plan</CardTitle>
// //                                         </CardHeader>
// //                                         <CardContent>
// //                                           <p className="text-sm">{report.mitigationPlan}</p>
// //                                         </CardContent>
// //                                       </Card>
// //                                     )}

// //                                     {report.attachments && Array.isArray(report.attachments) && report.attachments.length > 0 && (
// //                                       <Card>
// //                                         <CardHeader>
// //                                           <CardTitle className="text-sm">Attachments</CardTitle>
// //                                         </CardHeader>
// //                                         <CardContent>
// //                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
// //                                             {report.attachments.map((attachment, index) => (
// //                                               <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
// //                                                 {attachment.type === 'excel' && <FileSpreadsheet className="h-4 w-4 text-success" />}
// //                                                 {attachment.type === 'word' && <FileText className="h-4 w-4 text-info" />}
// //                                                 {attachment.type === 'video' && <Video className="h-4 w-4 text-warning" />}
// //                                                 {attachment.type === 'pdf' && <FileText className="h-4 w-4 text-destructive" />}
// //                                                 <span className="text-sm">{attachment.name}</span>
// //                                               </div>
// //                                             ))}
// //                                           </div>
// //                                         </CardContent>
// //                                       </Card>
// //                                     )}
// //                                   </div>
// //                                 </DialogContent>
// //                               </Dialog>

// //                               {/* Update Button */}
// //                               <Button
// //                                 variant="outline"
// //                                 size="sm"
// //                                 onClick={() => openEditDialog(report.id)}
// //                               >
// //                                 Update
// //                               </Button>

// //                               {/* Delete Button */}
// //                               <Button
// //                                 variant="destructive"
// //                                 size="sm"
// //                                 onClick={() => handleDelete(report.id)}
// //                               >
// //                                 Delete
// //                               </Button>
// //                             </div>
// //                           </TableCell>
// //                         </TableRow>
// //                       );
// //                     })}
// //                   </TableBody>
// //                 </Table>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </TabsContent>

// //         <TabsContent value="submit" className="space-y-6">
// //           {isSubmissionPeriodOpen ? (
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Submit Monthly Report</CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-6">
// //                 {/* Previous Month Display */}
// //                 <div className="space-y-2">
// //                   <Label>Reporting Period</Label>
// //                   <div className="flex items-center gap-4">
// //                     <Input 
// //                       value={`${getPreviousMonthName()} ${getPreviousMonthYear()}`} 
// //                       disabled 
// //                       className="bg-muted font-medium" 
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Project Selection */}
// //                 <div className="space-y-2">
// //                   <Label htmlFor="project">Select Project *</Label>
// //                   <Select value={selectedProject} onValueChange={setSelectedProject}>
// //                     <SelectTrigger>
// //                       <SelectValue placeholder="Select project" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="1">Rural Health Initiative</SelectItem>
// //                       <SelectItem value="2">Digital Education Program</SelectItem>
// //                       <SelectItem value="3">Climate Awareness Campaign</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {/* Project Summary */}
// //                 <div className="space-y-2">
// //                   <Label htmlFor="projectSummary">Project Summary</Label>
// //                   <Textarea
// //                     id="projectSummary"
// //                     value={reportFormData.projectSummary}
// //                     onChange={(e) => setReportFormData({...reportFormData, projectSummary: e.target.value})}
// //                     placeholder="Provide a summary of the selected project..."
// //                     className="min-h-[80px]"
// //                   />
// //                 </div>

// //                 {/* Budget Head Selection */}
// //                 <div className="space-y-2">
// //                   <Label htmlFor="budgetHead">Budget Head *</Label>
// //                   <Select value={reportFormData.budgetHead} onValueChange={(value) => setReportFormData({...reportFormData, budgetHead: value})}>
// //                     <SelectTrigger>
// //                       <SelectValue placeholder="Select budget head" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="procurement">1. Procurement Cost</SelectItem>
// //                       <SelectItem value="training">2. Training Cost</SelectItem>
// //                       <SelectItem value="civil">3. Civil/Construction Cost</SelectItem>
// //                       <SelectItem value="contingency">4. Contingency/Miscellaneous Cost</SelectItem>
// //                       <SelectItem value="hr">5. HR Cost</SelectItem>
// //                       <SelectItem value="admin">6. Admin Cost</SelectItem>
// //                       <SelectItem value="management">7. Management and Coordination</SelectItem>
// //                       <SelectItem value="government">8. Government Convergence</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {/* Budget Allocation Matrix */}
// //                 <Card>
// //                   <CardHeader>
// //                     <div className="flex justify-between items-center">
// //                       <div>
// //                         <CardTitle className="text-lg">Budget Allocation Matrix</CardTitle>
// //                         <p className="text-sm text-muted-foreground">
// //                           Build to address each contributor's tracking
// //                         </p>
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <Dialog open={showAddColumnDialog} onOpenChange={setShowAddColumnDialog}>
// //                           <DialogTrigger asChild>
// //                             <Button variant="outline" size="sm" className="flex items-center gap-2">
// //                               <Plus className="h-4 w-4" />
// //                               Add Column
// //                             </Button>
// //                           </DialogTrigger>
// //                           <DialogContent className="sm:max-w-md">
// //                             <DialogHeader>
// //                               <DialogTitle>Add New Column</DialogTitle>
// //                             </DialogHeader>
// //                             <div className="space-y-4">
// //                               <div className="space-y-2">
// //                                 <Label htmlFor="columnTitle">Column Title</Label>
// //                                 <Input
// //                                   id="columnTitle"
// //                                   value={newColumn.title}
// //                                   onChange={(e) => setNewColumn({...newColumn, title: e.target.value})}
// //                                   placeholder="Enter column title"
// //                                 />
// //                               </div>
// //                               <div className="space-y-2">
// //                                 <Label htmlFor="columnType">Data Type</Label>
// //                                 <Select 
// //                                   value={newColumn.type} 
// //                                   onValueChange={(value: any) => setNewColumn({...newColumn, type: value})}
// //                                 >
// //                                   <SelectTrigger>
// //                                     <SelectValue placeholder="Select data type" />
// //                                   </SelectTrigger>
// //                                   <SelectContent>
// //                                     <SelectItem value="text">Text</SelectItem>
// //                                     <SelectItem value="number">Number</SelectItem>
// //                                     <SelectItem value="integer">Integer</SelectItem>
// //                                     <SelectItem value="date">Date</SelectItem>
// //                                     <SelectItem value="time">Time</SelectItem>
// //                                     <SelectItem value="currency">Currency</SelectItem>
// //                                     <SelectItem value="percentage">Percentage</SelectItem>
// //                                   </SelectContent>
// //                                 </Select>
// //                               </div>
// //                               <div className="flex items-center space-x-2">
// //                                 <input
// //                                   type="checkbox"
// //                                   id="required"
// //                                   checked={newColumn.required}
// //                                   onChange={(e) => setNewColumn({...newColumn, required: e.target.checked})}
// //                                   className="rounded border-gray-300"
// //                                 />
// //                                 <Label htmlFor="required">Required Field</Label>
// //                               </div>
// //                               <div className="flex justify-end gap-2">
// //                                 <Button variant="outline" onClick={() => setShowAddColumnDialog(false)}>
// //                                   Cancel
// //                                 </Button>
// //                                 <Button onClick={addColumn} disabled={!newColumn.title.trim()}>
// //                                   Add Column
// //                                 </Button>
// //                               </div>
// //                             </div>
// //                           </DialogContent>
// //                         </Dialog>
// //                         <Button variant="outline" size="sm" onClick={addRow} className="flex items-center gap-2">
// //                           <Plus className="h-4 w-4" />
// //                           Add Row
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </CardHeader>
// //                   <CardContent>
// //                     {/* Compact Budget Table */}
// //                     <div className="border rounded-lg overflow-hidden">
// //                       <Table>
// //                         <TableHeader>
// //                           <TableRow>
// //                             {budgetColumns.slice(0, 8).map((column) => (
// //                               <TableHead key={column.id} className="text-xs px-2 py-3">
// //                                 <div className="flex items-center justify-between">
// //                                   <span className="font-medium">
// //                                     {column.title}
// //                                     {column.required && <span className="text-red-500 ml-1">*</span>}
// //                                   </span>
// //                                 </div>
// //                               </TableHead>
// //                             ))}
// //                             <TableHead className="w-12 px-2 py-3">Actions</TableHead>
// //                           </TableRow>
// //                         </TableHeader>
// //                         <TableBody>
// //                           {budgetRows.map((row) => (
// //                             <TableRow key={row.id}>
// //                               {budgetColumns.slice(0, 8).map((column) => (
// //                                 <TableCell key={column.id} className="px-2 py-2">
// //                                   <Input
// //                                     type={getInputType(column.type)}
// //                                     value={row[column.id] || ''}
// //                                     onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
// //                                     placeholder={getInputPlaceholder(column.type)}
// //                                     className="h-8 text-xs"
// //                                     required={column.required}
// //                                   />
// //                                 </TableCell>
// //                               ))}
// //                               <TableCell className="px-2 py-2">
// //                                 <Button
// //                                   variant="ghost"
// //                                   size="sm"
// //                                   onClick={() => removeRow(row.id)}
// //                                   className="h-7 w-7 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
// //                                 >
// //                                   <Trash2 className="h-3 w-3" />
// //                                 </Button>
// //                               </TableCell>
// //                             </TableRow>
// //                           ))}
// //                         </TableBody>
// //                       </Table>
// //                     </div>

// //                     {/* Additional Columns Section (if any beyond 8) */}
// //                     {budgetColumns.length > 8 && (
// //                       <div className="mt-4">
// //                         <Label className="text-sm font-medium mb-2 block">Additional Columns</Label>
// //                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
// //                           {budgetColumns.slice(8).map((column) => (
// //                             <div key={column.id} className="space-y-1">
// //                               <Label className="text-xs">
// //                                 {column.title}
// //                                 {column.required && <span className="text-red-500 ml-1">*</span>}
// //                               </Label>
// //                               {budgetRows.map((row, index) => (
// //                                 <Input
// //                                   key={`${row.id}-${column.id}`}
// //                                   type={getInputType(column.type)}
// //                                   value={row[column.id] || ''}
// //                                   onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
// //                                   placeholder={getInputPlaceholder(column.type)}
// //                                   className="h-7 text-xs"
// //                                   required={column.required}
// //                                 />
// //                               ))}
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     )}

// //                     {/* Total Cost Summary */}
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
// //                       <div className="text-center p-3 bg-blue-50 rounded-lg border">
// //                         <p className="text-xs font-medium text-blue-700">NGO Contribution</p>
// //                         <p className="text-lg font-bold text-blue-900">₹{totals.ngoTotal.toLocaleString()}</p>
// //                       </div>
// //                       <div className="text-center p-3 bg-green-50 rounded-lg border">
// //                         <p className="text-xs font-medium text-green-700">Beneficiary Contribution</p>
// //                         <p className="text-lg font-bold text-green-900">₹{totals.beneficiaryTotal.toLocaleString()}</p>
// //                       </div>
// //                       <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
// //                         <p className="text-xs font-medium text-primary">Total Cost</p>
// //                         <p className="text-lg font-bold text-primary">₹{totals.totalCost.toLocaleString()}</p>
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>

// //                 {/* Target Fields in Compact Layout */}
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   <Card>
// //                     <CardHeader className="pb-3">
// //                       <CardTitle className="text-sm">NGO Contribution</CardTitle>
// //                     </CardHeader>
// //                     <CardContent>
// //                       <div className="space-y-2">
// //                         <Label htmlFor="targetAllocated" className="text-sm font-medium">
// //                           Target Allocated *
// //                         </Label>
// //                         <Input
// //                           id="targetAllocated"
// //                           type="number"
// //                           value={reportFormData.targetAllocated}
// //                           onChange={(e) => setReportFormData({...reportFormData, targetAllocated: e.target.value})}
// //                           placeholder="Enter target allocated"
// //                           className="h-9"
// //                         />
// //                       </div>
// //                     </CardContent>
// //                   </Card>

// //                   <Card>
// //                     <CardHeader className="pb-3">
// //                       <CardTitle className="text-sm">Beneficiary Contribution</CardTitle>
// //                     </CardHeader>
// //                     <CardContent>
// //                       <div className="space-y-2">
// //                         <Label htmlFor="currentPerformance" className="text-sm font-medium">
// //                           Completed Target *
// //                         </Label>
// //                         <Input
// //                           id="currentPerformance" 
// //                           type="number"
// //                           value={reportFormData.currentPerformance}
// //                           onChange={(e) => setReportFormData({...reportFormData, currentPerformance: e.target.value})}
// //                           placeholder="Enter completed target"
// //                           className="h-9"
// //                         />
// //                       </div>
// //                     </CardContent>
// //                   </Card>
// //                 </div>

// //                 {/* Achievement Percentage Display */}
// //                 {reportFormData.targetAllocated && reportFormData.currentPerformance && (
// //                   <Card className="bg-muted/50">
// //                     <CardContent className="p-4">
// //                       <div className="flex items-center justify-between">
// //                         <span className="text-sm font-medium">Achievement Percentage:</span>
// //                         <div className="flex items-center gap-2">
// //                           <span className={cn("text-xl font-bold", getPerformanceColor(calculateAchievementPercentage()))}>
// //                             {calculateAchievementPercentage()}%
// //                           </span>
// //                           <Badge className={getPerformanceBadge(calculateAchievementPercentage()).color + " text-white text-xs"}>
// //                             {getPerformanceBadge(calculateAchievementPercentage()).text}
// //                           </Badge>
// //                         </div>
// //                       </div>
// //                     </CardContent>
// //                   </Card>
// //                 )}

// //                 {/* Deviation Report */}
// //                 <Card>
// //                   <CardHeader className="pb-3">
// //                     <CardTitle className="text-sm">Deviation Report (if applicable)</CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <Textarea
// //                       value={reportFormData.deviation}
// //                       onChange={(e) => setReportFormData({...reportFormData, deviation: e.target.value})}
// //                       placeholder="Describe any deviations from planned targets..."
// //                       className="min-h-[80px] text-sm"
// //                     />
// //                   </CardContent>
// //                 </Card>

// //                 {/* File Upload Section */}
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle className="text-sm">File Attachments</CardTitle>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
// //                       <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
// //                       <div className="space-y-1">
// //                         <p className="text-sm font-medium">Upload supporting documents</p>
// //                         <p className="text-xs text-muted-foreground">
// //                           Excel, Word, PDF, Video files supported
// //                         </p>
// //                         <Input
// //                           type="file"
// //                           multiple
// //                           accept=".xlsx,.xls,.docx,.doc,.pdf,.mp4,.mov,.avi"
// //                           onChange={(e) => handleFileUpload(e.target.files)}
// //                           className="w-full mt-2"
// //                         />
// //                       </div>
// //                     </div>
                    
// //                     {reportFormData.attachments.length > 0 && (
// //                       <div className="mt-3 space-y-2">
// //                         <Label className="text-sm">Uploaded Files:</Label>
// //                         {reportFormData.attachments.map((file, index) => (
// //                           <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
// //                             <FileText className="h-3 w-3" />
// //                             <span>{file.name}</span>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     )}
// //                   </CardContent>
// //                 </Card>

// //                 {/* Submit Button */}
// //                 <div className="flex justify-end">
// //                   <Button 
// //                     className="bg-primary hover:bg-primary/90"
// //                     onClick={submitReport}
// //                     disabled={!selectedProject || !reportFormData.budgetHead || !reportFormData.targetAllocated || !reportFormData.currentPerformance}
// //                   >
// //                     Submit Report
// //                   </Button>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           ) : (
// //             <Card className="border-impact-red bg-impact-red/5">
// //               <CardContent className="p-8 text-center">
// //                 <XCircle className="h-16 w-16 mx-auto mb-4 text-impact-red" />
// //                 <h3 className="text-lg font-semibold mb-2">Submission Period Closed</h3>
// //                 <p className="text-muted-foreground">
// //                   Monthly report submissions are only accepted between 21st-25th of each month.
// //                   Please check back during the submission period.
// //                 </p>
// //               </CardContent>
// //             </Card>
// //           )}
// //         </TabsContent>

// //         <TabsContent value="analytics" className="space-y-6">
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// //             <Card>
// //               <CardContent className="p-6">
// //                 <div className="text-center">
// //                   <Target className="h-8 w-8 mx-auto mb-2 text-success" />
// //                   <p className="text-sm text-muted-foreground">Excellent Performance</p>
// //                   <p className="text-2xl font-bold text-impact-green">{performanceStats.excellent}</p>
// //                 </div>
// //               </CardContent>
// //             </Card>
            
// //             <Card>
// //               <CardContent className="p-6">
// //                 <div className="text-center">
// //                   <TrendingUp className="h-8 w-8 mx-auto mb-2 text-info" />
// //                   <p className="text-sm text-muted-foreground">Good Performance</p>
// //                   <p className="text-2xl font-bold text-impact-blue">{performanceStats.good}</p>
// //                 </div>
// //               </CardContent>
// //             </Card>
            
// //             <Card>
// //               <CardContent className="p-6">
// //                 <div className="text-center">
// //                   <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-warning" />
// //                   <p className="text-sm text-muted-foreground">Needs Attention</p>
// //                   <p className="text-2xl font-bold text-impact-yellow">{performanceStats.needsAttention}</p>
// //                 </div>
// //               </CardContent>
// //             </Card>
            
// //             <Card>
// //               <CardContent className="p-6">
// //                 <div className="text-center">
// //                   <XCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
// //                   <p className="text-sm text-muted-foreground">Critical</p>
// //                   <p className="text-2xl font-bold text-impact-red">{performanceStats.critical}</p>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Performance Trend Analysis - {currentReportingPeriod.month} {currentReportingPeriod.year}</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               {reports.length === 0 ? (
// //                 <div className="text-center py-8 text-muted-foreground">
// //                   <TrendingUp className="h-16 w-16 mx-auto mb-4" />
// //                   <p>No data available for analysis</p>
// //                   <p className="text-sm">Submit reports to see performance analytics</p>
// //                 </div>
// //               ) : (
// //                 <div className="text-center py-8 text-muted-foreground">
// //                   <TrendingUp className="h-16 w-16 mx-auto mb-4" />
// //                   <p>Performance analytics visualization would be implemented here</p>
// //                   <p className="text-sm">Charts showing monthly trends, comparative analysis, etc.</p>
// //                   <div className="mt-4 text-left">
// //                     <p className="font-medium">Current Month Summary:</p>
// //                     <ul className="text-sm mt-2 space-y-1">
// //                       <li>• Total Reports: {reports.length}</li>
// //                       <li>• Average Achievement: {Math.round(reports.reduce((sum, r) => sum + r.achievementPercentage, 0) / reports.length)}%</li>
// //                       <li>• Highest Performance: {Math.max(...reports.map(r => r.achievementPercentage))}%</li>
// //                       <li>• Lowest Performance: {Math.min(...reports.map(r => r.achievementPercentage))}%</li>
// //                     </ul>
// //                   </div>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </TabsContent>
// //       </Tabs>
// //     </div>
// //   );
// // }


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect, ReactNode } from "react";
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
// import { Upload, FileText, Video, Image, Mic, CheckCircle, XCircle, Clock, AlertTriangle, Target, TrendingUp, FileSpreadsheet, Plus, Trash2, Settings } from "lucide-react";
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

// interface BudgetColumn {
//   id: string;
//   title: string;
//   type: 'text' | 'number' | 'integer' | 'date' | 'time' | 'currency' | 'percentage';
//   required: boolean;
// }

// interface BudgetRow {
//   id: string;
//   [key: string]: any;
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
//     projectSummary: "",
//     budgetHead: "",
//     attachments: [] as File[]
//   });

//   // File upload states
//   const [uploading, setUploading] = useState(false);
//   const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
//   const [uploadError, setUploadError] = useState<string | null>(null);
//   const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

//   // Budget Matrix State
//   const [budgetColumns, setBudgetColumns] = useState<BudgetColumn[]>([
//     { id: 'date', title: 'Date', type: 'date', required: true },
//     { id: 'description', title: 'Description', type: 'text', required: true },
//     { id: 'unit', title: 'Unit', type: 'text', required: true },
//     { id: 'unitCost', title: 'Unit Cost', type: 'currency', required: true },
//     { id: 'quantity', title: 'Qty', type: 'number', required: false },
//     { id: 'cms', title: 'CMS', type: 'number', required: false },
//     { id: 'ngo', title: 'NGO', type: 'number', required: false },
//     { id: 'beneficiary', title: 'Beneficiary', type: 'number', required: false },
//     { id: 'government', title: 'Government', type: 'number', required: false },
//   ]);

//   const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([
//     { id: '1' }
//   ]);

//   const [showAddColumnDialog, setShowAddColumnDialog] = useState(false);
//   const [newColumn, setNewColumn] = useState({
//     title: '',
//     type: 'text' as const,
//     required: false
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

//   // Helper functions for previous month
//   const getPreviousMonthName = () => {
//     const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//     return previousMonth.toLocaleString('default', { month: 'long' });
//   };

//   const getPreviousMonthYear = () => {
//     const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//     return previousMonth.getFullYear();
//   };

//   // Fetch reports from API
//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const { startDate, endDate } = getCurrentMonthDateRange();
      
//       const response = await api.get(`api/mis-reports/date-range`, {
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

//   // File validation function
//   const validateFiles = (files: FileList | null): string | null => {
//     if (!files) return null;
    
//     const newFiles = Array.from(files);
//     const totalFiles = reportFormData.attachments.length + newFiles.length;
    
//     if (totalFiles > 3) {
//       return 'Maximum 3 files allowed. Please select fewer files.';
//     }
    
//     // Check file sizes (limit to 10MB per file)
//     const maxSize = 10 * 1024 * 1024; // 10MB in bytes
//     for (const file of newFiles) {
//       if (file.size > maxSize) {
//         return `File "${file.name}" is too large. Maximum size is 10MB.`;
//       }
      
//       // Check file types
//       const allowedTypes = [
//         'application/pdf',
//         'application/vnd.ms-excel',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'image/jpeg',
//         'image/png',
//         'image/gif',
//         'video/mp4',
//         'video/mpeg',
//         'video/quicktime'
//       ];
      
//       if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|xlsx?|docx?|jpe?g|png|gif|mp4|mov|avi)$/i)) {
//         return `File "${file.name}" has an unsupported format. Supported formats: PDF, Excel, Word, Images, Videos.`;
//       }
//     }
    
//     return null;
//   };

//   // File upload functions
//   const uploadFilesToServer = async () => {
//     if (reportFormData.attachments.length === 0) {
//       setUploadError('Please select at least one file to upload');
//       return;
//     }

//     if (reportFormData.attachments.length > 3) {
//       setUploadError('Maximum 3 files allowed');
//       return;
//     }

//     try {
//       setUploading(true);
//       setUploadError(null);
//       setUploadSuccess(null);

//       const formData = new FormData();
      
//       // Append all files to FormData - try different field names
//       reportFormData.attachments.forEach((file, index) => {
//         // Try different field names - some APIs expect specific field names
//         formData.append('files', file); // Try 'files'
//         formData.append('documents', file); // Try 'documents' 
//         formData.append(`file${index}`, file); // Try individual file names
//       });

//       // Add debug logging
//       console.log('Files to upload:', reportFormData.attachments);
//       console.log('FormData entries:');
//       for (let pair of formData.entries()) {
//         console.log(pair[0], pair[1]);
//       }

//       // Try different approaches for the API call
//       const response = await fetch('https://mumbailocal.org:8089/upload/documents', {
//         method: 'POST',
//         body: formData,
//         // Don't set Content-Type header - let browser set it with boundary
//         headers: {
//           // Some APIs might need authentication
//           // 'Authorization': 'Bearer your-token-here',
//         },
//         // Add credentials if needed
//         credentials: 'include'
//       });

//       console.log('Response status:', response.status);
//       console.log('Response headers:', response.headers);

//       if (!response.ok) {
//         // Try to get more detailed error information
//         let errorMessage = `Upload failed with status: ${response.status}`;
//         try {
//           const errorData = await response.json();
//           errorMessage = errorData.message || errorMessage;
//           console.error('Error response data:', errorData);
//         } catch (e) {
//           // If response is not JSON, try to get text
//           try {
//             const errorText = await response.text();
//             errorMessage = errorText || errorMessage;
//             console.error('Error response text:', errorText);
//           } catch (textError) {
//             console.error('Could not read error response');
//           }
//         }
//         throw new Error(errorMessage);
//       }

//       const result = await response.json();
//       console.log('Upload success response:', result);
      
//       if (result.status === 200) {
//         setUploadedUrls(result.uploadedUrls || []);
//         setUploadSuccess(result.message || 'Files uploaded successfully!');
        
//         // Clear the file input after successful upload
//         setReportFormData({
//           ...reportFormData,
//           attachments: []
//         });
//       } else {
//         throw new Error(result.message || 'Upload failed with unknown error');
//       }
//     } catch (err) {
//       console.error('Error uploading files:', err);
//       const errorMessage = err instanceof Error ? err.message : 'Failed to upload files. Please try again.';
//       setUploadError(errorMessage);
      
//       // Provide more specific guidance based on error
//       if (errorMessage.includes('400')) {
//         setUploadError('Bad Request (400): Please check file types and sizes. Supported formats: PDF, Excel, Word, Images, Videos.');
//       } else if (errorMessage.includes('413')) {
//         setUploadError('File too large: Please check file sizes and try again.');
//       } else if (errorMessage.includes('415')) {
//         setUploadError('Unsupported file type: Please check file formats.');
//       }
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleFileUpload = (files: FileList | null) => {
//     if (files) {
//       const validationError = validateFiles(files);
//       if (validationError) {
//         setUploadError(validationError);
//         return;
//       }
      
//       const newFiles = Array.from(files);
//       setReportFormData({
//         ...reportFormData,
//         attachments: [...reportFormData.attachments, ...newFiles]
//       });
//       setUploadError(null);
//     }
//   };

//   const removeFile = (index: number) => {
//     const updatedAttachments = [...reportFormData.attachments];
//     updatedAttachments.splice(index, 1);
//     setReportFormData({
//       ...reportFormData,
//       attachments: updatedAttachments
//     });
//   };

//   const clearAllFiles = () => {
//     setReportFormData({
//       ...reportFormData,
//       attachments: []
//     });
//     setUploadedUrls([]);
//     setUploadError(null);
//     setUploadSuccess(null);
//   };

//   // Submit new report
//   const submitReport = async () => {
//     if (!selectedProject) {
//       alert('Please select a project');
//       return;
//     }

//     // Check if files are uploaded but not attached
//     if (reportFormData.attachments.length > 0 && uploadedUrls.length === 0) {
//       const shouldUpload = confirm('You have selected files but haven\'t uploaded them yet. Do you want to upload them before submitting the report?');
//       if (shouldUpload) {
//         await uploadFilesToServer();
//         // Wait a moment for upload to complete
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     }

//     try {
//       const achievementPercentage = calculateAchievementPercentage();
      
//       const reportData = {
//         projectId: selectedProject,
//         month: getPreviousMonthName(),
//         year: getPreviousMonthYear(),
//         targetAllocated: Number(reportFormData.targetAllocated),
//         currentPerformance: Number(reportFormData.currentPerformance),
//         achievementPercentage,
//         deviation: reportFormData.deviation || null,
//         mitigationPlan: reportFormData.mitigationPlan || null,
//         projectSummary: reportFormData.projectSummary || null,
//         budgetHead: reportFormData.budgetHead || null,
//         budgetMatrix: {
//           columns: budgetColumns,
//           rows: budgetRows
//         },
//         carryForward: achievementPercentage < 100 ? 
//           Number(reportFormData.targetAllocated) - Number(reportFormData.currentPerformance) : 0,
//         status: 'submitted' as const,
//         submissionDate: new Date().toISOString(),
//         attachments: uploadedUrls.map(url => ({
//           type: 'pdf' as const,
//           name: url.split('/').pop() || 'document',
//           url: url
//         }))
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
//         projectSummary: "",
//         budgetHead: "",
//         attachments: []
//       });
//       setSelectedProject("");
//       setUploadedUrls([]);
//       setUploadError(null);
//       setUploadSuccess(null);
      
//       alert('Report submitted successfully!');
//     } catch (err) {
//       console.error('Error submitting report:', err);
//       alert('Failed to submit report. Please try again.');
//     }
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   // Budget Matrix Functions
//   const addColumn = () => {
//     if (!newColumn.title.trim()) return;

//     const columnId = newColumn.title.toLowerCase().replace(/\s+/g, '-');
//     const newColumnData: BudgetColumn = {
//       id: columnId,
//       title: newColumn.title,
//       type: newColumn.type,
//       required: newColumn.required
//     };

//     setBudgetColumns([...budgetColumns, newColumnData]);
    
//     // Initialize this column for all existing rows
//     const updatedRows = budgetRows.map(row => ({
//       ...row,
//       [columnId]: ''
//     }));

//     setBudgetRows(updatedRows);
//     setNewColumn({ title: '', type: 'text', required: false });
//     setShowAddColumnDialog(false);
//   };

//   const removeColumn = (columnId: string) => {
//     if (['date', 'description', 'unit', 'unitCost'].includes(columnId)) {
//       alert('Core columns cannot be removed');
//       return;
//     }

//     setBudgetColumns(budgetColumns.filter(col => col.id !== columnId));
    
//     // Remove this column data from all rows
//     const updatedRows = budgetRows.map(row => {
//       const newRow = { ...row };
//       delete newRow[columnId];
//       return newRow;
//     });

//     setBudgetRows(updatedRows);
//   };

//   const addRow = () => {
//     const newRow: BudgetRow = { id: Date.now().toString() };
//     // Initialize all columns for the new row
//     budgetColumns.forEach(col => {
//       newRow[col.id] = '';
//     });
//     setBudgetRows([...budgetRows, newRow]);
//   };

//   const removeRow = (rowId: string) => {
//     if (budgetRows.length === 1) {
//       alert('At least one row is required');
//       return;
//     }
//     setBudgetRows(budgetRows.filter(row => row.id !== rowId));
//   };

//   const updateRowData = (rowId: string, columnId: string, value: string) => {
//     const updatedRows = budgetRows.map(row => 
//       row.id === rowId ? { ...row, [columnId]: value } : row
//     );
//     setBudgetRows(updatedRows);
//   };

//   const getInputType = (columnType: string) => {
//     switch (columnType) {
//       case 'number':
//       case 'integer':
//       case 'currency':
//       case 'percentage':
//         return 'number';
//       case 'date':
//         return 'date';
//       case 'time':
//         return 'time';
//       default:
//         return 'text';
//     }
//   };

//   const getInputPlaceholder = (columnType: string) => {
//     switch (columnType) {
//       case 'currency':
//         return '0.00';
//       case 'percentage':
//         return '0%';
//       case 'number':
//       case 'integer':
//         return '0';
//       case 'date':
//         return 'mm/dd/yyyy';
//       case 'time':
//         return 'HH:MM';
//       default:
//         return 'Enter text';
//     }
//   };

//   // Calculate totals
//   const calculateTotals = () => {
//     const ngoTotal = budgetRows.reduce((sum, row) => sum + (parseFloat(row.ngo) || 0), 0);
//     const beneficiaryTotal = budgetRows.reduce((sum, row) => sum + (parseFloat(row.beneficiary) || 0), 0);
//     const totalCost = ngoTotal + beneficiaryTotal;

//     return { ngoTotal, beneficiaryTotal, totalCost };
//   };

//   const totals = calculateTotals();

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

//   // Placeholder functions for actions
//   const openEditDialog = (reportId: string) => {
//     console.log('Open edit dialog for report:', reportId);
//     // Implement edit functionality
//   };

//   const handleDelete = (reportId: string) => {
//     if (confirm('Are you sure you want to delete this report?')) {
//       console.log('Delete report:', reportId);
//       // Implement delete functionality
//     }
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
//                     {reports.map((report, index) => {
//                       const achievementValue = parseInt(report.achievementPercentage.toString().replace("%", ""), 10);

//                       return (
//                         <TableRow key={report.id}>
//                           {/* Sr. No. */}
//                           <TableCell>{index + 1}</TableCell>

//                           {/* Project */}
//                           <TableCell>
//                             <div>
//                               <p className="font-medium">{report.project}</p>
//                             </div>
//                           </TableCell>

//                           {/* Reporting Period + Submission Date */}
//                           <TableCell>
//                             <div>
//                               <p className="font-medium">{report.reportingPeriod}</p>
//                               {report.misReportSubmissionDateTime && (
//                                 <p className="text-sm text-muted-foreground">
//                                   Submitted: {new Date(report.misReportSubmissionDateTime).toLocaleDateString()}
//                                 </p>
//                               )}
//                             </div>
//                           </TableCell>

//                           {/* Targets + Progress */}
//                           <TableCell>
//                             <div className="space-y-1">
//                               <div className="flex justify-between text-sm">
//                                 <span>Target: {report.allocatedTarget}</span>
//                               </div>
//                               <Progress value={achievementValue} className="w-24" />
//                             </div>
//                           </TableCell>

//                           {/* Achievement % + Badge */}
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <span className={cn("font-medium", getPerformanceColor(achievementValue))}>
//                                 {report.achievementPercentage}%
//                               </span>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <Badge className={getPerformanceBadge(achievementValue).color + " text-white"}>
//                                 {getPerformanceBadge(achievementValue).text}
//                               </Badge>
//                             </div>
//                           </TableCell>

//                           {/* Actions (View + Update + Delete) */}
//                           <TableCell>
//                             <div className="flex space-x-2">
//                               {/* View Button with Dialog */}
//                               <Dialog>
//                                 <DialogTrigger asChild>
//                                   <Button variant="secondary" size="sm">View</Button>
//                                 </DialogTrigger>
//                                 <DialogContent className="max-w-4xl">
//                                   <DialogHeader>
//                                     <DialogTitle>{report.project} - {report.reportingPeriod}</DialogTitle>
//                                   </DialogHeader>

//                                   <div className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                       <Card>
//                                         <CardContent className="p-4">
//                                           <div className="text-center">
//                                             <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
//                                             <p className="text-sm text-muted-foreground">Target Allocated</p>
//                                             <p className="text-2xl font-bold">{report.allocatedTarget}</p>
//                                           </div>
//                                         </CardContent>
//                                       </Card>

//                                       <Card>
//                                         <CardContent className="p-4">
//                                           <div className="text-center">
//                                             <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
//                                             <p className="text-sm text-muted-foreground">Current Performance</p>
//                                             <p className="text-2xl font-bold">{report.completedTarget}</p>
//                                           </div>
//                                         </CardContent>
//                                       </Card>

//                                       <Card>
//                                         <CardContent className="p-4">
//                                           <div className="text-center">
//                                             <div className={cn("text-2xl font-bold", getPerformanceColor(achievementValue))}>
//                                               {report.achievementPercentage}%
//                                             </div>
//                                             <p className="text-sm text-muted-foreground">Achievement</p>
//                                             <Badge className={getPerformanceBadge(achievementValue).color + " text-white mt-1"}>
//                                               {getPerformanceBadge(achievementValue).text}
//                                             </Badge>
//                                           </div>
//                                         </CardContent>
//                                       </Card>
//                                     </div>

//                                     {report.deviationReport && (
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle className="text-sm">Deviation Report</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <p className="text-sm">{report.deviationReport}</p>
//                                         </CardContent>
//                                       </Card>
//                                     )}

//                                     {report.mitigationPlan && (
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle className="text-sm">Mitigation Plan</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <p className="text-sm">{report.mitigationPlan}</p>
//                                         </CardContent>
//                                       </Card>
//                                     )}

//                                     {report.attachments && Array.isArray(report.attachments) && report.attachments.length > 0 && (
//                                       <Card>
//                                         <CardHeader>
//                                           <CardTitle className="text-sm">Attachments</CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//                                             {report.attachments.map((attachment, index) => (
//                                               <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
//                                                 {attachment.type === 'excel' && <FileSpreadsheet className="h-4 w-4 text-success" />}
//                                                 {attachment.type === 'word' && <FileText className="h-4 w-4 text-info" />}
//                                                 {attachment.type === 'video' && <Video className="h-4 w-4 text-warning" />}
//                                                 {attachment.type === 'pdf' && <FileText className="h-4 w-4 text-destructive" />}
//                                                 <span className="text-sm">{attachment.name}</span>
//                                               </div>
//                                             ))}
//                                           </div>
//                                         </CardContent>
//                                       </Card>
//                                     )}
//                                   </div>
//                                 </DialogContent>
//                               </Dialog>

//                               {/* Update Button */}
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => openEditDialog(report.id)}
//                               >
//                                 Update
//                               </Button>

//                               {/* Delete Button */}
//                               <Button
//                                 variant="destructive"
//                                 size="sm"
//                                 onClick={() => handleDelete(report.id)}
//                               >
//                                 Delete
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
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
//                 {/* Previous Month Display */}
//                 <div className="space-y-2">
//                   <Label>Reporting Period</Label>
//                   <div className="flex items-center gap-4">
//                     <Input 
//                       value={`${getPreviousMonthName()} ${getPreviousMonthYear()}`} 
//                       disabled 
//                       className="bg-muted font-medium" 
//                     />
//                   </div>
//                 </div>

//                 {/* Project Selection */}
//                 <div className="space-y-2">
//                   <Label htmlFor="project">Select Project *</Label>
//                   <Select value={selectedProject} onValueChange={setSelectedProject}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select project" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="1">Rural Health Initiative</SelectItem>
//                       <SelectItem value="2">Digital Education Program</SelectItem>
//                       <SelectItem value="3">Climate Awareness Campaign</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Project Summary */}
//                 <div className="space-y-2">
//                   <Label htmlFor="projectSummary">Project Summary</Label>
//                   <Textarea
//                     id="projectSummary"
//                     value={reportFormData.projectSummary}
//                     onChange={(e) => setReportFormData({...reportFormData, projectSummary: e.target.value})}
//                     placeholder="Provide a summary of the selected project..."
//                     className="min-h-[80px]"
//                   />
//                 </div>

//                 {/* Budget Head Selection */}
//                 <div className="space-y-2">
//                   <Label htmlFor="budgetHead">Budget Head *</Label>
//                   <Select value={reportFormData.budgetHead} onValueChange={(value) => setReportFormData({...reportFormData, budgetHead: value})}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select budget head" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="procurement">1. Procurement Cost</SelectItem>
//                       <SelectItem value="training">2. Training Cost</SelectItem>
//                       <SelectItem value="civil">3. Civil/Construction Cost</SelectItem>
//                       <SelectItem value="contingency">4. Contingency/Miscellaneous Cost</SelectItem>
//                       <SelectItem value="hr">5. HR Cost</SelectItem>
//                       <SelectItem value="admin">6. Admin Cost</SelectItem>
//                       <SelectItem value="management">7. Management and Coordination</SelectItem>
//                       <SelectItem value="government">8. Government Convergence</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Budget Allocation Matrix */}
//                 <Card>
//                   <CardHeader>
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <CardTitle className="text-lg">Budget Allocation Matrix</CardTitle>
//                         <p className="text-sm text-muted-foreground">
//                           Build to address each contributor's tracking
//                         </p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Dialog open={showAddColumnDialog} onOpenChange={setShowAddColumnDialog}>
//                           <DialogTrigger asChild>
//                             {/* <Button variant="outline" size="sm" className="flex items-center gap-2">
//                               <Plus className="h-4 w-4" />
//                               Add Column
//                             </Button> */}
//                           </DialogTrigger>
//                           <DialogContent className="sm:max-w-md">
//                             <DialogHeader>
//                               <DialogTitle>Add New Column</DialogTitle>
//                             </DialogHeader>
//                             <div className="space-y-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor="columnTitle">Column Title</Label>
//                                 <Input
//                                   id="columnTitle"
//                                   value={newColumn.title}
//                                   onChange={(e) => setNewColumn({...newColumn, title: e.target.value})}
//                                   placeholder="Enter column title"
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor="columnType">Data Type</Label>
//                                 <Select 
//                                   value={newColumn.type} 
//                                   onValueChange={(value: any) => setNewColumn({...newColumn, type: value})}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select data type" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectItem value="text">Text</SelectItem>
//                                     <SelectItem value="number">Number</SelectItem>
//                                     <SelectItem value="integer">Integer</SelectItem>
//                                     <SelectItem value="date">Date</SelectItem>
//                                     <SelectItem value="time">Time</SelectItem>
//                                     <SelectItem value="currency">Currency</SelectItem>
//                                     <SelectItem value="percentage">Percentage</SelectItem>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                               <div className="flex items-center space-x-2">
//                                 <input
//                                   type="checkbox"
//                                   id="required"
//                                   checked={newColumn.required}
//                                   onChange={(e) => setNewColumn({...newColumn, required: e.target.checked})}
//                                   className="rounded border-gray-300"
//                                 />
//                                 <Label htmlFor="required">Required Field</Label>
//                               </div>
//                               <div className="flex justify-end gap-2">
//                                 <Button variant="outline" onClick={() => setShowAddColumnDialog(false)}>
//                                   Cancel
//                                 </Button>
//                                 <Button onClick={addColumn} disabled={!newColumn.title.trim()}>
//                                   Add Column
//                                 </Button>
//                               </div>
//                             </div>
//                           </DialogContent>
//                         </Dialog>
//                         <Button variant="outline" size="sm" onClick={addRow} className="flex items-center gap-2">
//                           <Plus className="h-4 w-4" />
//                           Add Row
//                         </Button>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     {/* Compact Budget Table */}
//                     <div className="border rounded-lg overflow-hidden">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             {budgetColumns.slice(0, 9).map((column) => (
//                               <TableHead key={column.id} className="text-xs px-2 py-3">
//                                 <div className="flex items-center justify-between">
//                                   <span className="font-medium">
//                                     {column.title}
//                                     {column.required && <span className="text-red-500 ml-1">*</span>}
//                                   </span>
//                                 </div>
//                               </TableHead>
//                             ))}
//                             <TableHead className="w-12 px-2 py-3">Actions</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {budgetRows.map((row) => (
//                             <TableRow key={row.id}>
//                               {budgetColumns.slice(0, 9).map((column) => (
//                                 <TableCell key={column.id} className="px-2 py-2">
//                                   <Input
//                                     type={getInputType(column.type)}
//                                     value={row[column.id] || ''}
//                                     onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
//                                     placeholder={getInputPlaceholder(column.type)}
//                                     className="h-8 text-xs"
//                                     required={column.required}
//                                   />
//                                 </TableCell>
//                               ))}
//                               <TableCell className="px-2 py-2">
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   onClick={() => removeRow(row.id)}
//                                   className="h-7 w-7 p-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
//                                 >
//                                   <Trash2 className="h-3 w-3" />
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>

//                     {/* Additional Columns Section (if any beyond 8) */}
//                     {budgetColumns.length > 9 && (
//                       <div className="mt-4">
//                         <Label className="text-sm font-medium mb-2 block">Additional Columns</Label>
//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                           {budgetColumns.slice(9).map((column) => (
//                             <div key={column.id} className="space-y-1">
//                               <Label className="text-xs">
//                                 {column.title}
//                                 {column.required && <span className="text-red-500 ml-1">*</span>}
//                               </Label>
//                               {budgetRows.map((row, index) => (
//                                 <Input
//                                   key={`${row.id}-${column.id}`}
//                                   type={getInputType(column.type)}
//                                   value={row[column.id] || ''}
//                                   onChange={(e) => updateRowData(row.id, column.id, e.target.value)}
//                                   placeholder={getInputPlaceholder(column.type)}
//                                   className="h-7 text-xs"
//                                   required={column.required}
//                                 />
//                               ))}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Total Cost Summary */}
//                     {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
//                       <div className="text-center p-3 bg-blue-50 rounded-lg border">
//                         <p className="text-xs font-medium text-blue-700">NGO Contribution</p>
//                         <p className="text-lg font-bold text-blue-900">₹{totals.ngoTotal.toLocaleString()}</p>
//                       </div>
//                       <div className="text-center p-3 bg-green-50 rounded-lg border">
//                         <p className="text-xs font-medium text-green-700">Beneficiary Contribution</p>
//                         <p className="text-lg font-bold text-green-900">₹{totals.beneficiaryTotal.toLocaleString()}</p>
//                       </div>
//                       <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
//                         <p className="text-xs font-medium text-primary">Total Cost</p>
//                         <p className="text-lg font-bold text-primary">₹{totals.totalCost.toLocaleString()}</p>
//                       </div>
//                     </div> */}
//                   </CardContent>
//                 </Card>

//                 {/* Target Fields in Compact Layout */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <Card>
//                     <CardHeader className="pb-3">
//                       {/* <CardTitle className="text-sm">NGO Contribution</CardTitle> */}
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2">
//                         <Label htmlFor="targetAllocated" className="text-sm font-medium">
//                           Target Allocated *
//                         </Label>
//                         <Input
//                           id="targetAllocated"
//                           type="number"
//                           value={reportFormData.targetAllocated}
//                           onChange={(e) => setReportFormData({...reportFormData, targetAllocated: e.target.value})}
//                           placeholder="Enter target allocated"
//                           className="h-9"
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader className="pb-3">
//                       {/* <CardTitle className="text-sm">Beneficiary Contribution</CardTitle> */}
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-2">
//                         <Label htmlFor="currentPerformance" className="text-sm font-medium">
//                           Completed Target *
//                         </Label>
//                         <Input
//                           id="currentPerformance" 
//                           type="number"
//                           value={reportFormData.currentPerformance}
//                           onChange={(e) => setReportFormData({...reportFormData, currentPerformance: e.target.value})}
//                           placeholder="Enter completed target"
//                           className="h-9"
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Achievement Percentage Display */}
//                 {reportFormData.targetAllocated && reportFormData.currentPerformance && (
//                   <Card className="bg-muted/50">
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium">Achievement Percentage:</span>
//                         <div className="flex items-center gap-2">
//                           <span className={cn("text-xl font-bold", getPerformanceColor(calculateAchievementPercentage()))}>
//                             {calculateAchievementPercentage()}%
//                           </span>
//                           <Badge className={getPerformanceBadge(calculateAchievementPercentage()).color + " text-white text-xs"}>
//                             {getPerformanceBadge(calculateAchievementPercentage()).text}
//                           </Badge>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {/* Deviation Report */}
//                 <Card>
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-sm">Deviation Report (if applicable)</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <Textarea
//                       value={reportFormData.deviation}
//                       onChange={(e) => setReportFormData({...reportFormData, deviation: e.target.value})}
//                       placeholder="Describe any deviations from planned targets..."
//                       className="min-h-[80px] text-sm"
//                     />
//                   </CardContent>
//                 </Card>


//                 {/* mitigation plan  */}
//                 <Card>
//                   <CardHeader className="pb-3">
//                     <CardTitle className="text-sm">Mitigation plan ( if deviation exist )</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <Textarea
//                       value={reportFormData.mitigationPlan}
                     
//                       placeholder="Describe any mitigation plan..."
//                       className="min-h-[80px] text-sm"
//                     />
//                   </CardContent>
//                 </Card>
//                 {/* File Upload Section */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-sm">File Attachments</CardTitle>
//                     <p className="text-xs text-muted-foreground">
//                       Maximum 3 files allowed (10MB each). Supported formats: PDF, Excel (.xlsx, .xls), Word (.docx, .doc)
//                       {/* , Images (JPEG, PNG, GIF), Videos (MP4, MOV, AVI) */}
//                     </p>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
//                       <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
//                       <div className="space-y-1">
//                         <p className="text-sm font-medium">Upload supporting documents</p>
//                         <p className="text-xs text-muted-foreground">
//                           Select files first, then click Upload Files
//                         </p>
//                         <Input
//                           type="file"
//                           multiple
//                           accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
//                           onChange={(e) => handleFileUpload(e.target.files)}
//                           className="w-full mt-2"
//                           disabled={reportFormData.attachments.length >= 3 || uploading}
//                         />
                        
//                         {/* Upload Button */}
//                         <Button
//                           type="button"
//                           onClick={uploadFilesToServer}
//                           disabled={reportFormData.attachments.length === 0 || uploading}
//                           className="mt-3"
//                           size="sm"
//                         >
//                           {uploading ? (
//                             <>
//                               <Clock className="h-4 w-4 mr-2 animate-spin" />
//                               Uploading...
//                             </>
//                           ) : (
//                             <>
//                               <Upload className="h-4 w-4 mr-2" />
//                               Upload Files ({reportFormData.attachments.length}/3)
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </div>
                    
//                     {/* Upload Status Messages */}
//                     {uploadError && (
//                       <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
//                         <AlertTriangle className="h-4 w-4 inline mr-2" />
//                         {uploadError}
//                       </div>
//                     )}
                    
//                     {uploadSuccess && (
//                       <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
//                         <CheckCircle className="h-4 w-4 inline mr-2" />
//                         {uploadSuccess}
//                       </div>
//                     )}
                    
//                     {/* Selected Files List */}
//                     {reportFormData.attachments.length > 0 && (
//                       <div className="mt-3 space-y-2">
//                         <div className="flex justify-between items-center">
//                           <Label className="text-sm">Selected Files:</Label>
//                           <div className="flex gap-2">
//                             <Button
//                               type="button"
//                               variant="outline"
//                               size="sm"
//                               onClick={uploadFilesToServer}
//                               disabled={uploading}
//                               className="text-xs h-7"
//                             >
//                               {uploading ? 'Uploading...' : 'Upload All'}
//                             </Button>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={clearAllFiles}
//                               className="text-destructive hover:text-destructive h-7 text-xs"
//                             >
//                               Clear All
//                             </Button>
//                           </div>
//                         </div>
//                         {reportFormData.attachments.map((file, index) => (
//                           <div key={index} className="flex items-center justify-between gap-2 p-2 bg-muted rounded text-sm">
//                             <div className="flex items-center gap-2 flex-1 min-w-0">
//                               <FileText className="h-3 w-3 flex-shrink-0" />
//                               <span className="truncate">{file.name}</span>
//                               <span className="text-xs text-muted-foreground flex-shrink-0">
//                                 ({(file.size / 1024 / 1024).toFixed(2)} MB)
//                               </span>
//                             </div>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => removeFile(index)}
//                               className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
//                             >
//                               <Trash2 className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
                    
//                     {/* Uploaded URLs Display */}
//                     {uploadedUrls.length > 0 && (
//                       <div className="mt-3 space-y-2">
//                         <Label className="text-sm">Uploaded File URLs:</Label>
//                         {uploadedUrls.map((url, index) => (
//                           <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
//                             <FileText className="h-3 w-3 text-blue-600" />
//                             <a 
//                               href={url} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:text-blue-800 underline truncate flex-1"
//                               title={url}
//                             >
//                               {url.split('/').pop() || `File ${index + 1}`}
//                             </a>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => navigator.clipboard.writeText(url)}
//                               className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
//                               title="Copy URL"
//                             >
//                               <FileText className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Submit Button */}
//                 <div className="flex justify-end">
//                   <Button 
//                     className="bg-primary hover:bg-primary/90"
//                     onClick={submitReport}
//                     disabled={!selectedProject || !reportFormData.budgetHead || !reportFormData.targetAllocated || !reportFormData.currentPerformance}
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


/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, ReactNode } from "react";
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

interface Project {
  id: string;
  projectType: string;
  projectHead: string;
  projectName: string;
  projectTheme: string;
  projectNgoPartnerName: string;
  expectedBeneficiaries: string;
  projectLocation: string;
  projectStartDate: string;
  projectEndDate: string;
  projectDescription: string;
  projectObjectives: string;
  budget: {
    procurementCost: number;
    trainingCost: number;
    civilConstructionCost: number;
    contingencyMiscellaneousCost: number;
    humanResourcesCost: number;
    adminCost: number;
    managementAndCoordinationCost: number;
    governmentConvergenceCost: number;
    totalBudget: number;
    totalCmsContribution: number;
    totalNgoContribution: number;
    totalGovernmentContribution: number;
    totalBeneficiaryContribution: number;
  };
  budgetAllocationItems: Array<{
    id?: string;
    srNo: string;
    itemName: string;
    description: string;
    units: number;
    unitCost: number;
    total?: number;
    cmsContribution: number;
    ngoContribution: number;
    governmentContribution: number;
    beneficiaryContribution: number;
    budgetType: string;
    monthlyTargets?: Array<{
      id: string;
      targetMonth: string;
      plannedTarget: number;
      targetDescription: string;
      achievedTarget: number;
      deviation: number;
      achievementPercentage: number;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
  monthlyTargets: Array<any>;
  misReports: Array<any>;
  projectStatus: string;
  workPlan?: {
    workPlanDetails: string;
  };
  projectdpr?: string;
  financialPerformance?: {
    remainingBudget: number;
    spentAmount: number;
    utilizationPercentage: number;
    totalAllocated: number;
  };
  totalBudgetFromItems?: number;
  budgetSummaryByHead?: any;
  overallAchievementPercentage?: number;
  performanceByBudgetHead?: any;
  currentAchievementPercentage?: number;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectData, setSelectedProjectData] = useState<Project | null>(null);
  const [reports, setReports] = useState<MISReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(false);
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

  // File upload states
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Budget Matrix State
  const [budgetColumns, setBudgetColumns] = useState<BudgetColumn[]>([
    { id: 'date', title: 'Date', type: 'date', required: true },
    { id: 'description', title: 'Description', type: 'text', required: true },
    { id: 'unit', title: 'Unit', type: 'text', required: true },
    { id: 'unitCost', title: 'Unit Cost', type: 'currency', required: true },
    { id: 'quantity', title: 'Qty', type: 'number', required: false },
    { id: 'cms', title: 'CMS', type: 'number', required: false },
    { id: 'ngo', title: 'NGO', type: 'number', required: false },
    { id: 'beneficiary', title: 'Beneficiary', type: 'number', required: false },
    { id: 'government', title: 'Government', type: 'number', required: false },
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get budget type display name
  const getBudgetTypeDisplayName = (budgetType: string) => {
    const typeMap: { [key: string]: string } = {
      'PROCUREMENT_COST': 'Procurement Cost',
      'TRAINING_COST': 'Training Cost',
      'CIVIL_CONSTRUCTION_COST': 'Civil Construction Cost',
      'CONTINGENCY_MISCELLANEOUS_COST': 'Contingency/Miscellaneous Cost',
      'HUMAN_RESOURCES_COST': 'Human Resources Cost',
      'ADMIN_COST': 'Admin Cost',
      'MANAGEMENT_COORDINATION_COST': 'Management and Coordination Cost',
      'GOVERNMENT_CONVERGENCE_COST': 'Government Convergence Cost'
    };
    return typeMap[budgetType] || budgetType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get budget type mapping for dropdown
  const getBudgetTypeMapping = () => {
    return {
      'procurement': 'PROCUREMENT_COST',
      'training': 'TRAINING_COST',
      'civil': 'CIVIL_CONSTRUCTION_COST',
      'contingency': 'CONTINGENCY_MISCELLANEOUS_COST',
      'hr': 'HUMAN_RESOURCES_COST',
      'admin': 'ADMIN_COST',
      'management': 'MANAGEMENT_COORDINATION_COST',
      'government': 'GOVERNMENT_CONVERGENCE_COST'
    };
  };

  // Get filtered budget items based on selected budget head
  const getFilteredBudgetItems = () => {
    if (!selectedProjectData || !reportFormData.budgetHead) {
      return selectedProjectData?.budgetAllocationItems || [];
    }
    
    const budgetTypeMapping = getBudgetTypeMapping();
    const selectedBudgetType = budgetTypeMapping[reportFormData.budgetHead as keyof typeof budgetTypeMapping];
    
    return selectedProjectData.budgetAllocationItems.filter(item => 
      item.budgetType === selectedBudgetType
    );
  };

  // Calculate total targets and performance for filtered items
  const calculateFilteredTotals = () => {
    const filteredItems = getFilteredBudgetItems();
    let totalPlanned = 0;
    let totalAchieved = 0;

    filteredItems.forEach(item => {
      if (item.monthlyTargets) {
        const currentMonthTarget = item.monthlyTargets.find(target => {
          const targetDate = new Date(target.targetMonth);
          return targetDate.getMonth() === today.getMonth() && 
                 targetDate.getFullYear() === today.getFullYear();
        });
        
        if (currentMonthTarget) {
          totalPlanned += currentMonthTarget.plannedTarget || 0;
          totalAchieved += currentMonthTarget.achievedTarget || 0;
        }
      }
    });

    return {
      totalPlanned,
      totalAchieved,
      achievementPercentage: totalPlanned > 0 ? Math.round((totalAchieved / totalPlanned) * 100) : 0
    };
  };

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await api.get("/api/projects");
      console.log(response.data, "GET");
      
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setProjectsLoading(false);
    }
  };

  // Fetch project details by ID
  const fetchProjectDetails = async (projectId: string) => {
    try {
      const response = await api.get(`/api/projects/${projectId}`);
      const projectData = response.data;
      setSelectedProjectData(projectData);
      
      // Set project summary from project description
      setReportFormData(prev => ({
        ...prev,
        projectSummary: projectData.projectDescription || ""
      }));

      // Set budget head from budgetAllocationItems if available
      if (projectData.budgetAllocationItems && projectData.budgetAllocationItems.length > 0) {
        const firstBudgetItem = projectData.budgetAllocationItems[0];
        if (firstBudgetItem.budgetType) {
          // Map budgetType to the corresponding value in the dropdown
          const budgetTypeMapping = getBudgetTypeMapping();
          const reverseMapping = Object.entries(budgetTypeMapping).find(
            ([key, value]) => value === firstBudgetItem.budgetType
          );
          
          if (reverseMapping) {
            setReportFormData(prev => ({
              ...prev,
              budgetHead: reverseMapping[0]
            }));
          }
        }
      }

      // Initialize budget allocation matrix from project data
      initializeBudgetMatrix(projectData);
      
    } catch (err) {
      console.error('Error fetching project details:', err);
      setError('Failed to load project details. Please try again.');
    }
  };

  // Initialize budget matrix from project data
  const initializeBudgetMatrix = (projectData: Project) => {
    if (projectData.budgetAllocationItems && projectData.budgetAllocationItems.length > 0) {
      const initialRows: BudgetRow[] = projectData.budgetAllocationItems.map((item, index) => ({
        id: (index + 1).toString(),
        date: new Date().toISOString().split('T')[0], // Current date
        description: item.description || item.itemName,
        unit: item.units?.toString() || '1',
        unitCost: item.unitCost?.toString() || '0',
        quantity: item.units?.toString() || '1',
        cms: item.cmsContribution?.toString() || '0',
        ngo: item.ngoContribution?.toString() || '0',
        beneficiary: item.beneficiaryContribution?.toString() || '0',
        government: item.governmentContribution?.toString() || '0'
      }));
      
      setBudgetRows(initialRows);
    } else {
      // Fallback to empty row if no budget items
      setBudgetRows([{ id: '1' }]);
    }
  };

// Update achieved target for specific budget item and month
const updateAchievedTarget = (budgetItemId: string, targetId: string, achievedValue: number) => {
  if (!selectedProjectData) return;

  const updatedProjectData = { ...selectedProjectData };
  
  let foundAndUpdated = false;

  // Update the achieved target in budgetAllocationItems
  updatedProjectData.budgetAllocationItems = updatedProjectData.budgetAllocationItems.map(item => {
    if (item.id === budgetItemId && item.monthlyTargets) {
      return {
        ...item,
        monthlyTargets: item.monthlyTargets.map(target => {
          if (target.id === targetId) {
            foundAndUpdated = true;
            const deviation = target.plannedTarget - achievedValue;
            const achievementPercentage = target.plannedTarget > 0 ? 
              Math.round((achievedValue / target.plannedTarget) * 100) : 0;
            
            console.log(`🎯 Updated Target: Item ${item.srNo}, Month ${target.targetMonth}, ` +
              `Planned: ${target.plannedTarget}, Achieved: ${achievedValue}, ` +
              `Deviation: ${deviation}, Achievement: ${achievementPercentage}%`);
            
            return {
              ...target,
              achievedTarget: achievedValue,
              deviation: deviation,
              achievementPercentage: achievementPercentage
            };
          }
          return target;
        })
      };
    }
    return item;
  });

  // Also update in monthlyTargets array
  updatedProjectData.monthlyTargets = updatedProjectData.monthlyTargets.map(target => {
    if (target.id === targetId) {
      const deviation = target.plannedTarget - achievedValue;
      const achievementPercentage = target.plannedTarget > 0 ? 
        Math.round((achievedValue / target.plannedTarget) * 100) : 0;
      
      return {
        ...target,
        achievedTarget: achievedValue,
        deviation: deviation,
        achievementPercentage: achievementPercentage
      };
    }
    return target;
  });

  if (!foundAndUpdated) {
    console.warn(`⚠️ Target not found: Item ID ${budgetItemId}, Target ID ${targetId}`);
  }

  setSelectedProjectData(updatedProjectData);

  // Update the form totals based on filtered items
  const totals = calculateFilteredTotals();
  setReportFormData(prev => ({
    ...prev,
    targetAllocated: totals.totalPlanned.toString(),
    currentPerformance: totals.totalAchieved.toString()
  }));

  // Force immediate re-render of the component
  setSelectedProjectData({ ...updatedProjectData });
};

  // Prepare project update payload according to the desired format
// Prepare project update payload according to the desired format
const prepareProjectUpdatePayload = () => {
  if (!selectedProjectData) return null;

  // Calculate budget summary from budget items
  const budgetSummary = {
    procurementCost: 0,
    trainingCost: 0,
    civilConstructionCost: 0,
    contingencyMiscellaneousCost: 0,
    humanResourcesCost: 0,
    adminCost: 0,
    managementAndCoordinationCost: 0,
    governmentConvergenceCost: 0,
    totalBudget: 0,
    totalCmsContribution: 0,
    totalNgoContribution: 0,
    totalGovernmentContribution: 0,
    totalBeneficiaryContribution: 0
  };

  // Prepare monthly target items array
  const monthlyTargetItems: any[] = [];

  // Process budget allocation items and calculate totals
  const budgetAllocationItems = selectedProjectData.budgetAllocationItems.map(item => {
    const totalCost = item.units * item.unitCost;
    
    // Update budget summary
    budgetSummary.totalBudget += totalCost;
    budgetSummary.totalCmsContribution += item.cmsContribution;
    budgetSummary.totalNgoContribution += item.ngoContribution;
    budgetSummary.totalGovernmentContribution += item.governmentContribution;
    budgetSummary.totalBeneficiaryContribution += item.beneficiaryContribution;

    // Update specific budget type costs
    switch (item.budgetType) {
      case "PROCUREMENT_COST":
        budgetSummary.procurementCost += totalCost;
        break;
      case "TRAINING_COST":
        budgetSummary.trainingCost += totalCost;
        break;
      case "CIVIL_CONSTRUCTION_COST":
        budgetSummary.civilConstructionCost += totalCost;
        break;
      case "CONTINGENCY_MISCELLANEOUS_COST":
        budgetSummary.contingencyMiscellaneousCost += totalCost;
        break;
      case "HR_COST":
        budgetSummary.humanResourcesCost += totalCost;
        break;
      case "ADMIN_COST":
        budgetSummary.adminCost += totalCost;
        break;
      case "MANAGEMENT_COORDINATION_COST":
        budgetSummary.managementAndCoordinationCost += totalCost;
        break;
      case "GOVERNMENT_CONVERGENCE_COST":
        budgetSummary.governmentConvergenceCost += totalCost;
        break;
    }

    // Process monthly targets for this item
    if (item.monthlyTargets) {
      item.monthlyTargets.forEach(target => {
        monthlyTargetItems.push({
          budgetAllocationItemSrNo: item.srNo, // ✅ FIXED: Use the actual item serial number
          targetMonth: target.targetMonth,
          plannedTarget: target.plannedTarget,
          targetDescription: target.targetDescription,
          achievedTarget: target.achievedTarget,
          deviation: target.deviation,
          achievementPercentage: target.achievementPercentage
        });
      });
    }

    return {
      srNo: item.srNo,
      itemName: item.itemName,
      description: item.description,
      units: item.units,
      unitCost: item.unitCost,
      total: totalCost,
      cmsContribution: item.cmsContribution,
      ngoContribution: item.ngoContribution,
      governmentContribution: item.governmentContribution,
      beneficiaryContribution: item.beneficiaryContribution,
      budgetType: item.budgetType,
      monthlyTargets: item.monthlyTargets || []
    };
  });

  const payload = {
    projectType: selectedProjectData.projectType,
    projectHead: selectedProjectData.projectHead,
    projectName: selectedProjectData.projectName,
    projectTheme: selectedProjectData.projectTheme,
    expectedBeneficiaries: selectedProjectData.expectedBeneficiaries,
    projectLocation: selectedProjectData.projectLocation,
    projectStartDate: selectedProjectData.projectStartDate,
    projectEndDate: selectedProjectData.projectEndDate,
    projectDescription: selectedProjectData.projectDescription,
    projectObjectives: selectedProjectData.projectObjectives,
    projectdpr: selectedProjectData.projectdpr || "",
    projectStatus: selectedProjectData.projectStatus,

    budget: budgetSummary,

    workPlan: {
      workPlanDetails: selectedProjectData.workPlan?.workPlanDetails || ""
    },

    budgetAllocationItems: budgetAllocationItems,

    monthlyTargetItems: monthlyTargetItems
  };

  console.log("📤 Prepared Update Payload:", JSON.stringify(payload, null, 2));
  return payload;
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

  // Handle project selection change
  const handleProjectChange = async (projectId: string) => {
    setSelectedProject(projectId);
    if (projectId) {
      await fetchProjectDetails(projectId);
    } else {
      setSelectedProjectData(null);
      setReportFormData(prev => ({
        ...prev,
        projectSummary: "",
        targetAllocated: "",
        currentPerformance: "",
        budgetHead: ""
      }));
      setBudgetRows([{ id: '1' }]);
    }
  };

  // Handle budget head change
  const handleBudgetHeadChange = (value: string) => {
    setReportFormData(prev => ({
      ...prev,
      budgetHead: value
    }));

    // Update totals when budget head changes
    if (selectedProjectData) {
      const totals = calculateFilteredTotals();
      setReportFormData(prev => ({
        ...prev,
        targetAllocated: totals.totalPlanned.toString(),
        currentPerformance: totals.totalAchieved.toString()
      }));
    }
  };

  // File validation function
  const validateFiles = (files: FileList | null): string | null => {
    if (!files) return null;
    
    const newFiles = Array.from(files);
    const totalFiles = reportFormData.attachments.length + newFiles.length;
    
    if (totalFiles > 3) {
      return 'Maximum 3 files allowed. Please select fewer files.';
    }
    
    // Check file sizes (limit to 10MB per file)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    for (const file of newFiles) {
      if (file.size > maxSize) {
        return `File "${file.name}" is too large. Maximum size is 10MB.`;
      }
      
      // Check file types
      const allowedTypes = [
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/mpeg',
        'video/quicktime'
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|xlsx?|docx?|jpe?g|png|gif|mp4|mov|avi)$/i)) {
        return `File "${file.name}" has an unsupported format. Supported formats: PDF, Excel, Word, Images, Videos.`;
      }
    }
    
    return null;
  };

  // File upload functions
  const uploadFilesToServer = async () => {
    if (reportFormData.attachments.length === 0) {
      setUploadError('Please select at least one file to upload');
      return;
    }

    if (reportFormData.attachments.length > 3) {
      setUploadError('Maximum 3 files allowed');
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const formData = new FormData();
      
      // Append all files to FormData
      reportFormData.attachments.forEach((file, index) => {
        formData.append('files', file);
        formData.append('documents', file);
        formData.append(`file${index}`, file);
      });

      const response = await fetch('https://mumbailocal.org:8089/upload/documents', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        let errorMessage = `Upload failed with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            console.error('Could not read error response');
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.status === 200) {
        setUploadedUrls(result.uploadedUrls || []);
        setUploadSuccess(result.message || 'Files uploaded successfully!');
        
        // Clear the file input after successful upload
        setReportFormData({
          ...reportFormData,
          attachments: []
        });
      } else {
        throw new Error(result.message || 'Upload failed with unknown error');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload files. Please try again.';
      setUploadError(errorMessage);
      
      if (errorMessage.includes('400')) {
        setUploadError('Bad Request (400): Please check file types and sizes. Supported formats: PDF, Excel, Word, Images, Videos.');
      } else if (errorMessage.includes('413')) {
        setUploadError('File too large: Please check file sizes and try again.');
      } else if (errorMessage.includes('415')) {
        setUploadError('Unsupported file type: Please check file formats.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const validationError = validateFiles(files);
      if (validationError) {
        setUploadError(validationError);
        return;
      }
      
      const newFiles = Array.from(files);
      setReportFormData({
        ...reportFormData,
        attachments: [...reportFormData.attachments, ...newFiles]
      });
      setUploadError(null);
    }
  };

  const removeFile = (index: number) => {
    const updatedAttachments = [...reportFormData.attachments];
    updatedAttachments.splice(index, 1);
    setReportFormData({
      ...reportFormData,
      attachments: updatedAttachments
    });
  };

  const clearAllFiles = () => {
    setReportFormData({
      ...reportFormData,
      attachments: []
    });
    setUploadedUrls([]);
    setUploadError(null);
    setUploadSuccess(null);
  };

// ✅ UPDATED: Submit report using the same update API
const submitReport = async () => {
  if (!selectedProject) {
    alert('Please select a project');
    return;
  }

  if (!selectedProjectData) {
    alert('Project data not loaded properly');
    return;
  }

  try {
    // Prepare the project update payload with updated achieved targets
    const payload = prepareProjectUpdatePayload();
    
    if (!payload) {
      alert('Failed to prepare update data');
      return;
    }

    console.log("🚀 Submitting Project Update...");
    console.log("📤 Payload being sent:", JSON.stringify(payload, null, 2));

    // Use the same update API endpoint as project creation wizard
    const response = await api.put(`/api/projects/${selectedProject}/updateNestedDirect`, payload);

    console.log("✅ Project Update Response:", JSON.stringify(response.data, null, 2));

    // Verify the update worked by checking achieved targets
    const updatedTargets = payload.monthlyTargetItems.filter((target: any) => target.achievedTarget > 0);
    console.log(`📊 Updated ${updatedTargets.length} targets with achieved values`);

    // Create MIS report entry (optional - if you still want separate MIS reports)
    const achievementPercentage = calculateAchievementPercentage();
    
    const reportData = {
      projectId: selectedProject,
      month: currentReportingPeriod.month,
      year: currentReportingPeriod.year,
      targetAllocated: Number(reportFormData.targetAllocated),
      currentPerformance: Number(reportFormData.currentPerformance),
      achievementPercentage,
      deviation: reportFormData.deviation || null,
      mitigationPlan: reportFormData.mitigationPlan || null,
      projectSummary: reportFormData.projectSummary || null,
      budgetHead: reportFormData.budgetHead || null,
      carryForward: achievementPercentage < 100 ? 
        Number(reportFormData.targetAllocated) - Number(reportFormData.currentPerformance) : 0,
      status: 'submitted' as const,
      submissionDate: new Date().toISOString(),
      attachments: uploadedUrls.map(url => ({
        type: 'pdf' as const,
        name: url.split('/').pop() || 'document',
        url: url
      }))
    };

    // Submit MIS report (if you still want to maintain separate MIS reports)
    try {
      await api.post('/mis-reports', reportData);
      console.log("✅ MIS Report also submitted");
    } catch (misError) {
      console.warn("⚠️ MIS Report submission failed, but project was updated:", misError);
    }
    
    // Refresh reports and projects
    await fetchReports();
    await fetchProjects();
    
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
    setSelectedProjectData(null);
    setUploadedUrls([]);
    setUploadError(null);
    setUploadSuccess(null);
    
    alert('✅ Report submitted and project updated successfully! Achieved targets have been saved.');
  } catch (err: any) {
    console.error('❌ Error submitting report:', err);
    
    if (err.response) {
      console.error('❌ Server Response Data:', err.response.data);
      console.error('❌ Server Response Status:', err.response.status);
      
      const errorMessage = err.response.data.message || 
                          err.response.data.error || 
                          JSON.stringify(err.response.data);
      alert(`❌ Failed to submit report: ${errorMessage}`);
    } else if (err.request) {
      console.error('❌ No response received:', err.request);
      alert('❌ Network error. Please check your connection and try again.');
    } else {
      console.error('❌ Request setup error:', err.message);
      alert(`❌ Failed to submit report: ${err.message}`);
    }
  }
};

  useEffect(() => {
    fetchProjects();
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
    
    const updatedRows = budgetRows.map(row => {
      const newRow = { ...row };
      delete newRow[columnId];
      return newRow;
    });

    setBudgetRows(updatedRows);
  };

  const addRow = () => {
    const newRow: BudgetRow = { id: Date.now().toString() };
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
  };

  const handleDelete = (reportId: string) => {
    if (confirm('Are you sure you want to delete this report?')) {
      console.log('Delete report:', reportId);
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

  // Get filtered budget items
  const filteredBudgetItems = getFilteredBudgetItems();
  const totals = calculateFilteredTotals();

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
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{report.project}</p>
                            </div>
                          </TableCell>
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
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>Target: {report.allocatedTarget}</span>
                              </div>
                              <Progress value={achievementValue} className="w-24" />
                            </div>
                          </TableCell>
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
                          <TableCell>
                            <div className="flex space-x-2">
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(report.id)}
                              >
                                Update
                              </Button>
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
                {/* Current Month Display */}
                <div className="space-y-2">
                  <Label>Reporting Period</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      value={`${currentReportingPeriod.month} ${currentReportingPeriod.year}`} 
                      disabled 
                      className="bg-muted font-medium" 
                    />
                  </div>
                </div>

                {/* Project Selection */}
                <div className="space-y-2">
                  <Label htmlFor="project">Select Project *</Label>
                  <Select value={selectedProject} onValueChange={handleProjectChange} disabled={projectsLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select project"} />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.projectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {projectsLoading && (
                    <p className="text-sm text-muted-foreground">Loading projects...</p>
                  )}
                </div>

                {/* Show additional fields only when project is selected */}
                {selectedProjectData && (
                  <>
                    {/* Project Summary (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="projectSummary">Project Summary</Label>
                      <Textarea
                        id="projectSummary"
                        value={reportFormData.projectSummary}
                        readOnly
                        className="min-h-[80px] bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Project summary loaded from project data (read-only)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budgetHead">Budget Head *</Label>
                      <Select 
                        value={reportFormData.budgetHead} 
                        onValueChange={handleBudgetHeadChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget head to filter entries" />
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
                      <p className="text-xs text-muted-foreground">
                        Select a budget head to view and update specific entries
                      </p>
                    </div>

                    {/* Budget Allocation Matrix Display - Filtered by Budget Head */}
                    {reportFormData.budgetHead && filteredBudgetItems.length > 0 && (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg">
                                {getBudgetTypeDisplayName(getBudgetTypeMapping()[reportFormData.budgetHead as keyof ReturnType<typeof getBudgetTypeMapping>])} - Budget Items
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {filteredBudgetItems.length} item(s) found. Update achieved targets for each item below.
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                Overall Achievement: <span className={cn("font-bold", getPerformanceColor(totals.achievementPercentage))}>
                                  {totals.achievementPercentage}%
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Total: {totals.totalAchieved} / {totals.totalPlanned}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {filteredBudgetItems.map((item, index) => {
                            const currentMonthTarget = item.monthlyTargets?.find(target => {
                              const targetDate = new Date(target.targetMonth);
                              return targetDate.getMonth() === today.getMonth() && 
                                     targetDate.getFullYear() === today.getFullYear();
                            });

                            return (
                              <Card key={item.id || index} className="border-l-4 border-l-primary">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">
                                    {item.itemName} (Item {item.srNo})
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {/* Basic Item Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Units</Label>
                                      <p className="text-sm mt-1">{item.units?.toLocaleString() || '0'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Unit Cost</Label>
                                      <p className="text-sm mt-1">{formatCurrency(item.unitCost || 0)}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Total Cost</Label>
                                      <p className="text-sm mt-1 font-medium text-primary">
                                        {formatCurrency(item.total || 0)}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Contribution Breakdown */}
                                  <div>
                                    <Label className="text-sm font-medium mb-2">Contribution Breakdown</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                      <div className="text-center p-3 bg-muted rounded">
                                        <p className="text-xs text-muted-foreground">CMS</p>
                                        <p className="font-medium">{formatCurrency(item.cmsContribution || 0)}</p>
                                      </div>
                                      <div className="text-center p-3 bg-muted rounded">
                                        <p className="text-xs text-muted-foreground">NGO</p>
                                        <p className="font-medium">{formatCurrency(item.ngoContribution || 0)}</p>
                                      </div>
                                      <div className="text-center p-3 bg-muted rounded">
                                        <p className="text-xs text-muted-foreground">Government</p>
                                        <p className="font-medium">{formatCurrency(item.governmentContribution || 0)}</p>
                                      </div>
                                      <div className="text-center p-3 bg-muted rounded">
                                        <p className="text-xs text-muted-foreground">Beneficiary</p>
                                        <p className="font-medium">{formatCurrency(item.beneficiaryContribution || 0)}</p>
                                      </div>
                                      <div className="text-center p-3 bg-primary/10 rounded">
                                        <p className="text-xs text-muted-foreground">Total</p>
                                        <p className="font-medium text-primary">
                                          {formatCurrency(
                                            (item.cmsContribution || 0) + 
                                            (item.ngoContribution || 0) + 
                                            (item.governmentContribution || 0) + 
                                            (item.beneficiaryContribution || 0)
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Current Month Target Section - INTEGRATED */}
                                  <div className="border-t pt-4">
                                    <Label className="text-sm font-medium mb-3">
                                      Current Month Target - {currentReportingPeriod.month} {currentReportingPeriod.year}
                                    </Label>
                                    {currentMonthTarget ? (
                                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-muted/30 rounded-lg">
                                        {/* Planned Target (Read-only from API) */}
                                        <div>
                                          <Label className="text-xs font-medium">Planned Target</Label>
                                          <div className="bg-muted p-2 rounded mt-1">
                                            <p className="text-sm font-medium text-center">
                                              {currentMonthTarget.plannedTarget || 0}
                                            </p>
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1 text-center">From API</p>
                                        </div>

                                        {/* Achieved Target (User Input) */}
                                        <div>
                                          <Label className="text-xs font-medium">Achieved Target *</Label>
                                          <Input
                                            type="number"
                                            min="0"
                                            value={currentMonthTarget.achievedTarget || 0}
                                            onChange={(e) => updateAchievedTarget(
                                              item.id || '', 
                                              currentMonthTarget.id, 
                                              parseInt(e.target.value) || 0
                                            )}
                                            className="h-9 text-sm mt-1"
                                            placeholder="Enter achieved"
                                          />
                                          <p className="text-xs text-muted-foreground mt-1 text-center">User Input</p>
                                        </div>

                                        {/* Deviation (Auto-calculated) */}
                                        <div>
                                          <Label className="text-xs font-medium">Deviation</Label>
                                          <div className={cn(
                                            "p-2 rounded mt-1 text-center",
                                            currentMonthTarget.deviation > 0 ? "bg-impact-green/20 text-impact-green" : 
                                            currentMonthTarget.deviation < 0 ? "bg-impact-red/20 text-impact-red" : "bg-muted text-muted-foreground"
                                          )}>
                                            <p className="text-sm font-medium">
                                              {currentMonthTarget.deviation > 0 ? '+' : ''}{currentMonthTarget.deviation || 0}
                                            </p>
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1 text-center">Auto-calculated</p>
                                        </div>

                                        {/* Achievement Percentage (Auto-calculated) */}
                                        <div>
                                          <Label className="text-xs font-medium">Achievement %</Label>
                                          <div className={cn(
                                            "p-2 rounded mt-1 text-center",
                                            getPerformanceColor(currentMonthTarget.achievementPercentage || 0),
                                            "bg-muted"
                                          )}>
                                            <p className="text-sm font-medium">
                                              {currentMonthTarget.achievementPercentage || 0}%
                                            </p>
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1 text-center">Auto-calculated</p>
                                        </div>

                                        {/* Performance Status */}
                                        <div>
                                          <Label className="text-xs font-medium">Status</Label>
                                          <div className="mt-1">
                                            <Badge 
                                              variant={
                                                (currentMonthTarget.achievementPercentage || 0) >= 80 ? "default" :
                                                (currentMonthTarget.achievementPercentage || 0) >= 50 ? "secondary" :
                                                (currentMonthTarget.achievementPercentage || 0) >= 30 ? "outline" : "destructive"
                                              }
                                              className="text-xs w-full justify-center py-1"
                                            >
                                              {(currentMonthTarget.achievementPercentage || 0) >= 80 ? "Excellent" :
                                               (currentMonthTarget.achievementPercentage || 0) >= 50 ? "Good" :
                                               (currentMonthTarget.achievementPercentage || 0) >= 30 ? "Needs Attention" : "Critical"}
                                            </Badge>
                                          </div>
                                          <p className="text-xs text-muted-foreground mt-1 text-center">Performance</p>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded">
                                        <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                                        <p className="text-sm text-yellow-800 font-medium">
                                          No target set for {currentReportingPeriod.month} {currentReportingPeriod.year}
                                        </p>
                                        <p className="text-xs text-yellow-600 mt-1">
                                          Please set planned targets in the project configuration
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}

                          {/* Overall Summary Card */}
                          <Card className="bg-muted/50 border-primary/20">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium text-sm">Overall Summary - {getBudgetTypeDisplayName(getBudgetTypeMapping()[reportFormData.budgetHead as keyof ReturnType<typeof getBudgetTypeMapping>])}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    Based on {filteredBudgetItems.length} item(s)
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-3">
                                    <div className="text-center">
                                      <p className="text-xs text-muted-foreground">Total Planned</p>
                                      <p className="text-sm font-medium">{totals.totalPlanned}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs text-muted-foreground">Total Achieved</p>
                                      <p className="text-sm font-medium">{totals.totalAchieved}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs text-muted-foreground">Achievement</p>
                                      <p className={cn("text-sm font-bold", getPerformanceColor(totals.achievementPercentage))}>
                                        {totals.achievementPercentage}%
                                      </p>
                                    </div>
                                    <Badge className={getPerformanceBadge(totals.achievementPercentage).color + " text-white text-xs"}>
                                      {getPerformanceBadge(totals.achievementPercentage).text}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CardContent>
                      </Card>
                    )}

                    {/* Show message when no items match the filter */}
                    {reportFormData.budgetHead && filteredBudgetItems.length === 0 && (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                          <h3 className="text-lg font-semibold mb-2">No Items Found</h3>
                          <p className="text-muted-foreground">
                            No budget items found for the selected budget head. Please select a different budget head.
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Achievement Percentage Display */}
                    {reportFormData.targetAllocated && reportFormData.currentPerformance && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium">Overall Achievement for Selected Budget Head:</span>
                              <p className="text-xs text-muted-foreground">
                                Based on {filteredBudgetItems.length} item(s)
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-xl font-bold", getPerformanceColor(totals.achievementPercentage))}>
                                {totals.achievementPercentage}%
                              </span>
                              <Badge className={getPerformanceBadge(totals.achievementPercentage).color + " text-white text-xs"}>
                                {getPerformanceBadge(totals.achievementPercentage).text}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total Planned:</span>
                              <span className="font-medium ml-2">{totals.totalPlanned}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total Achieved:</span>
                              <span className="font-medium ml-2">{totals.totalAchieved}</span>
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

                    {/* Mitigation Plan */}
                    {/* <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Mitigation Plan (if deviation exists)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={reportFormData.mitigationPlan}
                          onChange={(e) => setReportFormData({...reportFormData, mitigationPlan: e.target.value})}
                          placeholder="Describe mitigation plan for any deviations..."
                          className="min-h-[80px] text-sm"
                        />
                      </CardContent>
                    </Card> */}

                    {/* File Upload Section */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">File Attachments</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          Maximum 3 files allowed (10MB each). Supported formats: PDF, Excel (.xlsx, .xls), Word (.docx, .doc)
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                          <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Upload supporting documents</p>
                            <p className="text-xs text-muted-foreground">
                              Select files first, then click Upload Files
                            </p>
                            <Input
                              type="file"
                              multiple
                              accept=".pdf,.xlsx,.xls,.docx,.doc,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="w-full mt-2"
                              disabled={reportFormData.attachments.length >= 3 || uploading}
                            />
                            
                            <Button
                              type="button"
                              onClick={uploadFilesToServer}
                              disabled={reportFormData.attachments.length === 0 || uploading}
                              className="mt-3"
                              size="sm"
                            >
                              {uploading ? (
                                <>
                                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Files ({reportFormData.attachments.length}/3)
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        {uploadError && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            <AlertTriangle className="h-4 w-4 inline mr-2" />
                            {uploadError}
                          </div>
                        )}
                        
                        {uploadSuccess && (
                          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                            <CheckCircle className="h-4 w-4 inline mr-2" />
                            {uploadSuccess}
                          </div>
                        )}
                        
                        {reportFormData.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm">Selected Files:</Label>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={uploadFilesToServer}
                                  disabled={uploading}
                                  className="text-xs h-7"
                                >
                                  {uploading ? 'Uploading...' : 'Upload All'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={clearAllFiles}
                                  className="text-destructive hover:text-destructive h-7 text-xs"
                                >
                                  Clear All
                                </Button>
                              </div>
                            </div>
                            {reportFormData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between gap-2 p-2 bg-muted rounded text-sm">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <FileText className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{file.name}</span>
                                  <span className="text-xs text-muted-foreground flex-shrink-0">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {uploadedUrls.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <Label className="text-sm">Uploaded File URLs:</Label>
                            {uploadedUrls.map((url, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded text-sm">
                                <FileText className="h-3 w-3 text-blue-600" />
                                <a 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline truncate flex-1"
                                  title={url}
                                >
                                  {url.split('/').pop() || `File ${index + 1}`}
                                </a>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigator.clipboard.writeText(url)}
                                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                  title="Copy URL"
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
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
                        Submit Report & Update Project
                      </Button>
                    </div>
                  </>
                )}
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