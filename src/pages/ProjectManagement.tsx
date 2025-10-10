// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Plus,
//   Search,
//   Calendar,
//   IndianRupee,
//   TrendingUp,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   Users,
//   FileText,
//   BarChart3,
// } from "lucide-react";
// import { ProjectCreationWizard } from "@/components/project/ProjectCreationWizard";
// import { MISReportManager } from "@/components/project/MISReportManager";

// // ✅ Import API services
// import {
//   getProjects,
//   getProjectById,
//   createProject,
//   updateProject,
//   deleteProject,
// } from "@/api/projects";

// export default function ProjectManagement() {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [projects, setProjects] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [themeFilter, setThemeFilter] = useState("all");
//   const [showCreateWizard, setShowCreateWizard] = useState(false);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [editProject, setEditProject] = useState<any | null>(null);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [editForm, setEditForm] = useState<any | null>(null);

//   // ✅ Load projects on mount
//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       const data = await getProjects();
//       setProjects(data);
//     } catch (err) {
//       console.error("Failed to fetch projects:", err);
//     }
//   };

//   // ✅ Create project
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleCreate = async (formData: any) => {
//     try {
//       const payload = {
//         projectType: formData.projectType,
//         projectHead: formData.projectHead,
//         projectName: formData.projectName,
//         projectTheme: formData.projectTheme,
//         projectNgoPartner: formData.projectNgoPartner,
//         expectedBeneficiaries: formData.expectedBeneficiaries,
//         projectLocation: formData.projectLocation,
//         projectStartDate: formData.projectStartDate,
//         projectEndDate: formData.projectEndDate,
//         projectDescription: formData.projectDescription,
//         projectObjectives: formData.projectObjectives,
//         budget: {
//           humanResourcesCost: formData.budget?.humanResourcesCost || 0,
//           adminCost: formData.budget?.adminCost || 0,
//           managementAndCoordinationCost:
//             formData.budget?.managementAndCoordinationCost || 0,
//           miscellaneousCost: formData.budget?.miscellaneousCost || 0,
//           governmentConvergenceCost:
//             formData.budget?.governmentConvergenceCost || 0,
//           totalBudget: formData.budget?.totalBudget || 0,
//         },
//         budgetAllocationMatrix: {
//           srNo: formData.budgetAllocationMatrix?.srNo || "1",
//           description: formData.budgetAllocationMatrix?.description || "",
//           unit: formData.budgetAllocationMatrix?.unit || 0,
//           unitCost: formData.budgetAllocationMatrix?.unitCost || 0,
//           quantity: formData.budgetAllocationMatrix?.quantity || 0,
//           cmsContri: formData.budgetAllocationMatrix?.cmsContri || 0,
//           ngoContri: formData.budgetAllocationMatrix?.ngoContri || 0,
//           beneficiaryContri:
//             formData.budgetAllocationMatrix?.beneficiaryContri || 0,
//           governmentContri:
//             formData.budgetAllocationMatrix?.governmentContri || 0,
//         },
//         workPlan: {
//           workPlanDetails: formData.workPlan?.workPlanDetails || "",
//         },
//         monthlyTarget: {
//           jan: formData.monthlyTarget?.jan || 0,
//           feb: formData.monthlyTarget?.feb || 0,
//           mar: formData.monthlyTarget?.mar || 0,
//           apr: formData.monthlyTarget?.apr || 0,
//           may: formData.monthlyTarget?.may || 0,
//           june: formData.monthlyTarget?.june || 0,
//           july: formData.monthlyTarget?.july || 0,
//           aug: formData.monthlyTarget?.aug || 0,
//           sep: formData.monthlyTarget?.sep || 0,
//           oct: formData.monthlyTarget?.oct || 0,
//           nov: formData.monthlyTarget?.nov || 0,
//           dec: formData.monthlyTarget?.dec || 0,
//         },
//         projectStatus: formData.projectStatus,
//       };

//       await createProject(payload);
//       fetchProjects();
//       setShowCreateWizard(false);
//     } catch (err) {
//       console.error("Failed to create project:", err);
//     }
//   };

//   // ✅ Update project
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleUpdate = async (id: number, projectData: any) => {
//     try {
//       await updateProject(id, projectData);
//       fetchProjects();
//       setEditProject(null);
//     } catch (err) {
//       console.error("Failed to update project:", err);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteProject(id);
//       fetchProjects();
//     } catch (err) {
//       console.error("Failed to delete project:", err);
//     }
//   };

//   const openEditDialog = async (id: number) => {
//     try {
//       const data = await getProjectById(id);
//       setEditProject(data);
//       setEditForm({ ...data }); // editable copy
//     } catch (err) {
//       console.error("Failed to load project:", err);
//     }
//   };

//   // ✅ Filtering
//   const filteredProjects = projects.filter((project) => {
//     const matchesSearch =
//       project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       project.projectNgoPartner?.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" ||
//       (statusFilter === "green" && project.projectStatus === "Active") ||
//       (statusFilter === "red" && project.projectStatus === "Inactive");

//     const matchesTheme =
//       themeFilter === "all" || project.projectTheme === themeFilter;

//     return matchesSearch && matchesStatus && matchesTheme;
//   });

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "Active":
//         return <CheckCircle2 className="h-4 w-4 text-impact-green" />;
//       case "In Progress":
//         return <TrendingUp className="h-4 w-4 text-impact-blue" />;
//       case "Attention":
//         return <Clock className="h-4 w-4 text-impact-yellow" />;
//       case "Inactive":
//         return <AlertCircle className="h-4 w-4 text-impact-red" />;
//       default:
//         return null;
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "On Track";
//       case "In Progress":
//         return "In Progress";
//       case "Attention":
//         return "Attention Needed";
//       case "Inactive":
//         return "At Risk";
//       default:
//         return "Unknown";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-impact-green text-white";
//       case "In Progress":
//         return "bg-impact-blue text-white";
//       case "Attention":
//         return "bg-impact-yellow text-white";
//       case "Inactive":
//         return "bg-impact-red text-white";
//       default:
//         return "bg-muted";
//     }
//   };

//   const getThemeColor = (theme: string) => {
//     switch (theme) {
//       case "Health":
//         return "text-thematic-health";
//       case "Education":
//         return "text-thematic-education";
//       case "Climate Resilience":
//         return "text-thematic-climate";
//       case "Livelihood":
//         return "text-thematic-livelihood";
//       case "Government Convergence":
//         return "text-success";
//       default:
//         return "text-muted-foreground";
//     }
//   };

//   // ✅ Totals
//   const totalBudget = projects.reduce(
//     (sum, project) => sum + (project.budget?.total || 0),
//     0
//   );
//   const totalSpent = projects.reduce(
//     (sum, project) => sum + (project.budget?.spent || 0),
//     0
//   );
//   const totalBeneficiaries = projects.reduce(
//     (sum, project) => sum + (parseInt(project.expectedBeneficiaries) || 0),
//     0
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
//           <p className="text-muted-foreground">
//             Monitor and track CSR project execution and impact
//           </p>
//         </div>
//         <Button
//           className="bg-primary hover:bg-primary/90"
//           onClick={() => setShowCreateWizard(true)}
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Create Project
//         </Button>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card style={{ borderLeft:'5px solid #6F49F8' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Total Projects
//                 </p>
//                 <p className="text-2xl font-bold">{projects.length}</p>
//               </div>
//               <TrendingUp className="h-8 w-8 text-primary" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card style={{ borderLeft:'5px solid #8ECE33FF' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Total Budget
//                 </p>
//                 <p className="text-2xl font-bold">
//                   ₹{(totalBudget / 100000).toFixed(1)}L
//                 </p>
//               </div>
//               <IndianRupee className="h-8 w-8 text-success" color="#8ECE33FF" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card style={{ borderLeft:'5px solid #FFB800' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Budget Utilized
//                 </p>
//                 <p className="text-2xl font-bold">
//                   {totalBudget > 0
//                     ? ((totalSpent / totalBudget) * 100).toFixed(1)
//                     : 0}
//                   %
//                 </p>
//               </div>
//               <CheckCircle2 className="h-8 w-8 " color="#FFB74BFF" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card style={{ borderLeft:'5px solid #FF74DAFF' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">
//                   Beneficiaries
//                 </p>
//                 <p className="text-2xl font-bold">
//                   {totalBeneficiaries.toLocaleString()}
//                 </p>
//               </div>
//               <Users className="h-8 w-8 " color="#FF74DAFF" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Table Section */}
//       <Tabs defaultValue="projects" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="projects">
//             <TrendingUp className="h-4 w-4 mr-2" />
//             Project Portfolio
//           </TabsTrigger>
//           <TabsTrigger value="mis-reports">
//             <FileText className="h-4 w-4 mr-2" />
//             MIS Reports
//           </TabsTrigger>
//           <TabsTrigger value="analytics">
//             <BarChart3 className="h-4 w-4 mr-2" />
//             Analytics
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="projects">
//           {/* Filters + Search */}
//           <Card>
//             <CardHeader>
//               <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
//                 <CardTitle>Active Projects</CardTitle>
//                 <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                     <Input
//                       placeholder="Search projects..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pl-10 w-full sm:w-80"
//                     />
//                   </div>
//                   <Select value={statusFilter} onValueChange={setStatusFilter}>
//                     <SelectTrigger className="w-full sm:w-40">
//                       <SelectValue placeholder="Status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="green">On Track</SelectItem>
//                       <SelectItem value="blue">In Progress</SelectItem>
//                       <SelectItem value="yellow">Attention</SelectItem>
//                       <SelectItem value="red">At Risk</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <Select value={themeFilter} onValueChange={setThemeFilter}>
//                     <SelectTrigger className="w-full sm:w-40">
//                       <SelectValue placeholder="Theme" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Themes</SelectItem>
//                       <SelectItem value="Health">Health</SelectItem>
//                       <SelectItem value="Education">Education</SelectItem>
//                       <SelectItem value="Climate Resilience">Climate</SelectItem>
//                       <SelectItem value="Livelihood">Livelihood</SelectItem>
//                       <SelectItem value="Government Convergence">
//                         Government Convergence
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </CardHeader>

//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Project</TableHead>
//                     <TableHead>NGO Partner</TableHead>
//                     <TableHead>Theme</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Timeline</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredProjects.map((project) => (
//                     <TableRow key={project.id}>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">{project.projectName}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {project.expectedBeneficiaries} beneficiaries
//                           </p>
//                         </div>
//                       </TableCell>
//                       <TableCell>{project.projectNgoPartner}</TableCell>
//                       <TableCell>
//                         <span
//                           className={`font-medium ${getThemeColor(
//                             project.projectTheme
//                           )}`}
//                         >
//                           {project.projectTheme}
//                         </span>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-2">
//                           {getStatusIcon(project.projectStatus)}
//                           <Badge className={getStatusColor(project.projectStatus)}>
//                             {getStatusText(project.projectStatus)}
//                           </Badge>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div className="flex items-center gap-1">
//                             <Calendar className="h-3 w-3" />
//                             {new Date(project.projectStartDate).toLocaleDateString()}
//                           </div>
//                           <div className="text-muted-foreground">
//                             to {new Date(project.projectEndDate).toLocaleDateString()}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => openEditDialog(project.id)}
//                           >
//                             Edit
//                           </Button>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => handleDelete(project.id)}
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="mis-reports">
//           <MISReportManager />
//         </TabsContent>

//         <TabsContent value="analytics">
//           <div className="grid gap-6">{/* Analytics UI here */}</div>
//         </TabsContent>
//       </Tabs>

//       {/* Create Project */}
//       <ProjectCreationWizard
//         open={showCreateWizard}
//         onOpenChange={(val) => setShowCreateWizard(val)}
//         onSubmit={handleCreate}
//       />

//       {/* Edit Project Dialog */}
//       {editProject && editForm && (
//         <Dialog open={!!editProject} onOpenChange={() => setEditProject(null)}>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Edit Project</DialogTitle>
//             </DialogHeader>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleUpdate(editProject.id, editForm);
//               }}
//               className="space-y-4"
//             >
//               <Input
//                 placeholder="Project Name"
//                 value={editForm.projectName}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, projectName: e.target.value })
//                 }
//               />
//               <Input
//                 placeholder="NGO Partner"
//                 value={editForm.projectNgoPartner}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, projectNgoPartner: e.target.value })
//                 }
//               />
//               <Input
//                 placeholder="Theme"
//                 value={editForm.projectTheme}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, projectTheme: e.target.value })
//                 }
//               />
//               <Input
//                 placeholder="Location"
//                 value={editForm.projectLocation}
//                 onChange={(e) =>
//                   setEditForm({ ...editForm, projectLocation: e.target.value })
//                 }
//               />
//               <Button type="submit">Update Project</Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Calendar,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  FileText,
  BarChart3,
  Edit,
  Trash2,
} from "lucide-react";
import { ProjectCreationWizard } from "@/components/project/ProjectCreationWizard";
import { MISReportManager } from "@/components/project/MISReportManager";

// ✅ Import API services
import {
  getProjects,
  getProjectById,
  // createProject,
  // updateProject,
  deleteProject,
} from "@/api/projects";

// ✅ Define themes array
const themes = [
  "Health",
  "Education",
  "Climate Resilience", 
  "Livelihood",
  "Government Convergence"
];

export default function ProjectManagement() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [projects, setProjects] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editProject, setEditProject] = useState<any | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Create project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreate = async (formData: any) => {
    try {
      console.log("🆕 Creating new project with data:", formData);
      
      // const response = await createProject(formData);
      // console.log("✅ Project created successfully:", response);
      
      fetchProjects();
      setShowCreateWizard(false);
      
      // Reset edit mode states
      setIsEditMode(false);
      setEditingProjectId(null);
      setEditProject(null);
    } catch (err) {
      console.error("❌ Failed to create project:", err);
      alert("Failed to create project. Please try again.");
    }
  };

  // ✅ Update project
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (id: number, projectData: any) => {
    try {
      console.log("🔄 Updating project ID:", id, "with data:", projectData);
      
      // const response = await updateProject(id, projectData);
      // console.log("✅ Project updated successfully:", response);
      
      fetchProjects();
      setEditProject(null);
      setIsEditMode(false);
      setEditingProjectId(null);
      setShowCreateWizard(false);
    } catch (err) {
      console.error("❌ Failed to update project:", err);
      alert("Failed to update project. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(id);
        fetchProjects();
        alert("Project deleted successfully!");
      } catch (err) {
        console.error("Failed to delete project:", err);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  // ✅ Open project creation wizard in edit mode with full details
  const handleEditProject = async (id: number) => {
    try {
      console.log("📝 Opening EDIT mode for project ID:", id);
      setIsLoading(true);
      const projectData = await getProjectById(id);
      console.log("📋 Fetched project data for editing:", projectData);
      
      setEditingProjectId(id);
      setIsEditMode(true);
      setEditProject(projectData);
      setShowCreateWizard(true);
    } catch (err) {
      console.error("❌ Failed to load project for editing:", err);
      alert("Failed to load project data for editing");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle wizard submission (both create and update)
  const handleWizardSubmit = async (formData: any) => {
    console.log("🚀 Wizard submit triggered - Edit mode:", isEditMode, "Project ID:", editingProjectId);
    
    if (isEditMode && editingProjectId) {
      await handleUpdate(editingProjectId, formData);
    } else {
      await handleCreate(formData);
    }
  };

  // ✅ Close wizard and reset state
  const handleWizardClose = (open: boolean) => {
    console.log("🔒 Wizard close triggered, open:", open);
    
    if (!open) {
      setShowCreateWizard(false);
      // Reset states when wizard closes
      setTimeout(() => {
        setIsEditMode(false);
        setEditingProjectId(null);
        setEditProject(null);
      }, 300);
    }
  };

  // ✅ Create new project - reset all states
  const handleCreateNewProject = () => {
    console.log("🆕 Creating new project - resetting states");
    setIsEditMode(false);
    setEditingProjectId(null);
    setEditProject(null);
    setShowCreateWizard(true);
  };

  // ✅ Filtering
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectNgoPartner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectLocation?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "green" && project.projectStatus === "Active") ||
      (statusFilter === "blue" && project.projectStatus === "In Progress") ||
      (statusFilter === "yellow" && project.projectStatus === "Attention") ||
      (statusFilter === "red" && project.projectStatus === "Inactive");

    const matchesTheme =
      themeFilter === "all" || project.projectTheme === themeFilter;

    return matchesSearch && matchesStatus && matchesTheme;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle2 className="h-4 w-4 text-impact-green" />;
      case "In Progress":
        return <TrendingUp className="h-4 w-4 text-impact-blue" />;
      case "Attention":
        return <Clock className="h-4 w-4 text-impact-yellow" />;
      case "Inactive":
        return <AlertCircle className="h-4 w-4 text-impact-red" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Active":
        return "On Track";
      case "In Progress":
        return "In Progress";
      case "Attention":
        return "Attention Needed";
      case "Inactive":
        return "At Risk";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-impact-green text-white";
      case "In Progress":
        return "bg-impact-blue text-white";
      case "Attention":
        return "bg-impact-yellow text-white";
      case "Inactive":
        return "bg-impact-red text-white";
      default:
        return "bg-muted";
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case "Health":
        return "text-thematic-health";
      case "Education":
        return "text-thematic-education";
      case "Climate Resilience":
        return "text-thematic-climate";
      case "Livelihood":
        return "text-thematic-livelihood";
      case "Government Convergence":
        return "text-success";
      default:
        return "text-muted-foreground";
    }
  };

  // ✅ Totals
  const totalBudget = projects.reduce(
    (sum, project) => sum + (project.budget?.totalBudget || 0),
    0
  );
  const totalSpent = projects.reduce(
    (sum, project) => sum + (project.budget?.spent || 0),
    0
  );
  const totalBeneficiaries = projects.reduce(
    (sum, project) => sum + (parseInt(project.expectedBeneficiaries) || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground">
            Monitor and track CSR project execution and impact
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={handleCreateNewProject}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card style={{ borderLeft:'5px solid #6F49F8' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Projects
                </p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft:'5px solid #8ECE33FF' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Budget
                </p>
                <p className="text-2xl font-bold">
                  ₹{(totalBudget / 100000).toFixed(1)}L
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-success" color="#8ECE33FF" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft:'5px solid #FFB800' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Budget Utilized
                </p>
                <p className="text-2xl font-bold">
                  {totalBudget > 0
                    ? ((totalSpent / totalBudget) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 " color="#FFB74BFF" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft:'5px solid #FF74DAFF' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Beneficiaries
                </p>
                <p className="text-2xl font-bold">
                  {totalBeneficiaries.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 " color="#FF74DAFF" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">
            <TrendingUp className="h-4 w-4 mr-2" />
            Project Portfolio
          </TabsTrigger>

          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          {/* Filters + Search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle>Active Projects</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-80"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="green">On Track</SelectItem>
                      <SelectItem value="blue">In Progress</SelectItem>
                      <SelectItem value="yellow">Attention</SelectItem>
                      <SelectItem value="red">At Risk</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={themeFilter} onValueChange={setThemeFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Themes</SelectItem>
                      {themes.map(theme => (
                        <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading projects...</p>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No projects found matching your criteria.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>NGO Partner</TableHead>
                      <TableHead>Theme</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{project.projectName}</p>
                            <p className="text-sm text-muted-foreground">
                              {project.expectedBeneficiaries} beneficiaries
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {project.projectLocation}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{project.projectNgoPartner}</p>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${getThemeColor(
                              project.projectTheme
                            )}`}
                          >
                            {project.projectTheme}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(project.projectStatus)}
                            <Badge className={getStatusColor(project.projectStatus)}>
                              {getStatusText(project.projectStatus)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {project.projectStartDate ? new Date(project.projectStartDate).toLocaleDateString() : 'Not set'}
                            </div>
                            <div className="text-muted-foreground">
                              to {project.projectEndDate ? new Date(project.projectEndDate).toLocaleDateString() : 'Not set'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            ₹{(project.budget?.totalBudget || 0).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProject(project.id)}
                              disabled={isLoading}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(project.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-primary">{projects.length}</p>
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-success">
                        {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Budget Utilization</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-orange-500">
                        {projects.filter(p => p.projectStatus === 'Active').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-500">
                        {totalBeneficiaries.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Projects by Theme</h4>
                    <div className="space-y-2">
                      {themes.map(theme => {
                        const count = projects.filter(p => p.projectTheme === theme).length;
                        return (
                          <div key={theme} className="flex justify-between items-center">
                            <span className="text-sm">{theme}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Project Wizard */}
      <ProjectCreationWizard
        open={showCreateWizard}
        onOpenChange={handleWizardClose}
        onSubmit={handleWizardSubmit}
        editProjectId={isEditMode ? editingProjectId?.toString() : undefined}
        editProjectData={editProject}
      />
    </div>
  );
}