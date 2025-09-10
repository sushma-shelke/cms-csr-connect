import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";
import { ProjectCreationWizard } from "@/components/project/ProjectCreationWizard";
import { MISReportManager } from "@/components/project/MISReportManager";

const projectsData = [
  {
    id: 1,
    name: "Rural Health Initiative",
    ngo: "Health Care Foundation",
    theme: "Health",
    status: "green",
    progress: 85,
    budget: 500000,
    spent: 425000,
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    beneficiaries: 1200,
    lastUpdate: "2024-08-25"
  },
  {
    id: 2,
    name: "Digital Education Program",
    ngo: "Education First NGO",
    theme: "Education",
    status: "blue",
    progress: 70,
    budget: 750000,
    spent: 525000,
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    beneficiaries: 800,
    lastUpdate: "2024-08-20"
  },
  {
    id: 3,
    name: "Climate Awareness Campaign",
    ngo: "Green Earth Society",
    theme: "Climate Resilience",
    status: "yellow",
    progress: 45,
    budget: 300000,
    spent: 135000,
    startDate: "2024-06-01",
    endDate: "2024-11-30",
    beneficiaries: 500,
    lastUpdate: "2024-08-15"
  },
  {
    id: 4,
    name: "Women Skill Development",
    ngo: "Rural Livelihood Trust",
    theme: "Livelihood",
    status: "green",
    progress: 92,
    budget: 400000,
    spent: 368000,
    startDate: "2024-02-01",
    endDate: "2024-09-30",
    beneficiaries: 600,
    lastUpdate: "2024-08-28"
  },
  {
    id: 5,
    name: "Child Nutrition Program",
    ngo: "Health Care Foundation",
    theme: "Health",
    status: "red",
    progress: 25,
    budget: 600000,
    spent: 150000,
    startDate: "2024-07-01",
    endDate: "2025-06-30",
    beneficiaries: 1000,
    lastUpdate: "2024-08-10"
  }
];

export default function ProjectManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [themeFilter, setThemeFilter] = useState("all");
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  const filteredProjects = projectsData.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.ngo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesTheme = themeFilter === "all" || project.theme === themeFilter;
    
    return matchesSearch && matchesStatus && matchesTheme;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "green":
        return <CheckCircle2 className="h-4 w-4 text-impact-green" />;
      case "blue":
        return <TrendingUp className="h-4 w-4 text-impact-blue" />;
      case "yellow":
        return <Clock className="h-4 w-4 text-impact-yellow" />;
      case "red":
        return <AlertCircle className="h-4 w-4 text-impact-red" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "green":
        return "On Track";
      case "blue":
        return "In Progress";
      case "yellow":
        return "Attention Needed";
      case "red":
        return "At Risk";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-impact-green text-white";
      case "blue":
        return "bg-impact-blue text-white";
      case "yellow":
        return "bg-impact-yellow text-white";
      case "red":
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

  const totalBudget = projectsData.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projectsData.reduce((sum, project) => sum + project.spent, 0);
  const totalBeneficiaries = projectsData.reduce((sum, project) => sum + project.beneficiaries, 0);

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
          onClick={() => setShowCreateWizard(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projectsData.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">₹{(totalBudget / 100000).toFixed(1)}L</p>
              </div>
              <IndianRupee className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Utilized</p>
                <p className="text-2xl font-bold">{((totalSpent / totalBudget) * 100).toFixed(1)}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beneficiaries</p>
                <p className="text-2xl font-bold">{totalBeneficiaries.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">
            <TrendingUp className="h-4 w-4 mr-2" />
            Project Portfolio
          </TabsTrigger>
          <TabsTrigger value="mis-reports">
            <FileText className="h-4 w-4 mr-2" />
            MIS Reports
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">

      {/* Filters and Search */}
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
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Climate Resilience">Climate</SelectItem>
                    <SelectItem value="Livelihood">Livelihood</SelectItem>
                    <SelectItem value="Government Convergence">Government Convergence</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>NGO Partner</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {project.beneficiaries} beneficiaries
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{project.ngo}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getThemeColor(project.theme)}`}>
                      {project.theme}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>₹{(project.spent / 100000).toFixed(1)}L</div>
                      <div className="text-muted-foreground">
                        / ₹{(project.budget / 100000).toFixed(1)}L
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(project.status)}
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-muted-foreground">
                        to {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{project.name}</DialogTitle>
                          <DialogDescription>
                            Implemented by {project.ngo} • {project.theme}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-muted-foreground">Progress</p>
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-muted-foreground">Budget Status</p>
                              <div>
                                <p className="font-medium">₹{(project.spent / 100000).toFixed(1)}L spent</p>
                                <p className="text-sm text-muted-foreground">
                                  of ₹{(project.budget / 100000).toFixed(1)}L total
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                              <div>
                                <p className="text-sm">{new Date(project.startDate).toLocaleDateString()}</p>
                                <p className="text-sm text-muted-foreground">
                                  to {new Date(project.endDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-muted-foreground">Beneficiaries</p>
                              <p className="font-medium">{project.beneficiaries.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(project.status)}
                              <span className="font-medium">{getStatusText(project.status)}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Last updated: {new Date(project.lastUpdate).toLocaleDateString()}
                            </div>
                          </div>
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

        <TabsContent value="mis-reports">
          <MISReportManager />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thematic Wise Budget Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-thematic-health border-2">
                    <CardContent className="p-4 text-center">
                      <div className="text-thematic-health font-bold text-lg">Health</div>
                      <div className="text-2xl font-bold">₹{((900000 / 100000)).toFixed(1)}L</div>
                      <div className="text-sm text-muted-foreground">2 Projects</div>
                    </CardContent>
                  </Card>
                  <Card className="border-thematic-education border-2">
                    <CardContent className="p-4 text-center">
                      <div className="text-thematic-education font-bold text-lg">Education</div>
                      <div className="text-2xl font-bold">₹{((750000 / 100000)).toFixed(1)}L</div>
                      <div className="text-sm text-muted-foreground">1 Project</div>
                    </CardContent>
                  </Card>
                  <Card className="border-thematic-climate border-2">
                    <CardContent className="p-4 text-center">
                      <div className="text-thematic-climate font-bold text-lg">Climate</div>
                      <div className="text-2xl font-bold">₹{((300000 / 100000)).toFixed(1)}L</div>
                      <div className="text-sm text-muted-foreground">1 Project</div>
                    </CardContent>
                  </Card>
                  <Card className="border-thematic-livelihood border-2">
                    <CardContent className="p-4 text-center">
                      <div className="text-thematic-livelihood font-bold text-lg">Livelihood</div>
                      <div className="text-2xl font-bold">₹{((400000 / 100000)).toFixed(1)}L</div>
                      <div className="text-sm text-muted-foreground">1 Project</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-impact-green rounded-full"></div>
                        Excellent (≥80%)
                      </span>
                      <span className="font-medium">2 Projects</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-impact-blue rounded-full"></div>
                        Good (50-80%)
                      </span>
                      <span className="font-medium">1 Project</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-impact-yellow rounded-full"></div>
                        Attention (30-50%)
                      </span>
                      <span className="font-medium">1 Project</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-impact-red rounded-full"></div>
                        Critical (≤30%)
                      </span>
                      <span className="font-medium">1 Project</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Utilization Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Total Allocated Budget</span>
                        <span className="font-medium">₹{(totalBudget / 100000).toFixed(1)}L</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Budget Utilized</span>
                        <span className="font-medium">₹{(totalSpent / 100000).toFixed(1)}L</span>
                      </div>
                      <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Remaining Budget</span>
                        <span className="font-medium">₹{((totalBudget - totalSpent) / 100000).toFixed(1)}L</span>
                      </div>
                      <Progress value={((totalBudget - totalSpent) / totalBudget) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ProjectCreationWizard 
        open={showCreateWizard} 
        onOpenChange={setShowCreateWizard} 
      />
    </div>
  );
}