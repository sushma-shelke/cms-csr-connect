/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "../../api/axios";

interface ProjectCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: any) => void;
  editProjectId?: string; // For editing existing project
  editProjectData?: any; // Existing project data for editing
}

interface MonthlyTargetData {
  target: number;
  description: string;
}

interface BudgetItem {
  id: string;
  srNo: number;
  itemName: string;
  description: string;
  units: number;
  unitCost: number;
  cmsContribution: number;
  ngoContribution: number;
  beneficiaryContribution: number;
  governmentContribution: number;
  budgetType: string;
  monthlyTargets?: {
    [month: string]: MonthlyTargetData;
  };
}

interface SubProject {
  id: string;
  name: string;
  description: string;
  budget: number;
  startDate?: Date;
  endDate?: Date;
  orderIndex: number;
}

interface NGO {
  id: number;
  ngoName: string;
  location: string;
  founder: string;
  // ... other NGO fields as needed
}

export function ProjectCreationWizard({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editProjectId, 
  editProjectData 
}: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [selectedNgoId, setSelectedNgoId] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Basic Project Information
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    projectType: "thematic" as "thematic" | "integrated_village_development",
    theme: "",
    ngoPartner: "", // This will now store the NGO name for display
    projectHead: "",
    location: "",
    beneficiaries: "",
    objectives: "",
    reportFile: null as File | null
  });

  // Budget Allocation Matrix
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: "1",
      srNo: 1,
      itemName: "",
      description: "",
      units: 0,
      unitCost: 0,
      cmsContribution: 0,
      ngoContribution: 0,
      beneficiaryContribution: 0,
      governmentContribution: 0,
      budgetType: "PROCUREMENT_COST"
    }
  ]);

  // Sub-projects (for Integrated Village Development Program)
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);

  // Fetch NGOs when component opens
  useEffect(() => {
    if (open) {
      fetchNgos();
      
      // Load edit data if in edit mode
      if (editProjectId && editProjectData) {
        loadEditData(editProjectData);
      }
    }
  }, [open, editProjectId, editProjectData]);

  const fetchNgos = async () => {
    try {
      const response = await api.get("/api/ngos");
      setNgos(response.data);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
      // You can add toast notification here
    }
  };

  const loadEditData = (projectData: any) => {
    // Set basic project data
    setProjectData({
      name: projectData.projectName || "",
      description: projectData.projectDescription || "",
      projectType: projectData.projectType === "IVDP" ? "integrated_village_development" : "thematic",
      theme: projectData.projectTheme || "",
      ngoPartner: projectData.projectNgoPartner || "",
      projectHead: projectData.projectHead || "",
      location: projectData.projectLocation || "",
      beneficiaries: projectData.expectedBeneficiaries || "",
      objectives: projectData.projectObjectives || "",
      reportFile: null
    });

    // Set selected NGO ID if available
    if (projectData.ngoId) {
      setSelectedNgoId(projectData.ngoId);
    }

    // Set dates
    if (projectData.projectStartDate) {
      setStartDate(new Date(projectData.projectStartDate));
    }
    if (projectData.projectEndDate) {
      setEndDate(new Date(projectData.projectEndDate));
    }

    // Set budget items
    if (projectData.budgetAllocationItems && projectData.budgetAllocationItems.length > 0) {
      const loadedBudgetItems = projectData.budgetAllocationItems.map((item: any, index: number) => ({
        id: (index + 1).toString(),
        srNo: item.srNo || index + 1,
        itemName: item.itemName || "",
        description: item.description || "",
        units: item.units || 0,
        unitCost: item.unitCost || 0,
        cmsContribution: item.cmsContribution || 0,
        ngoContribution: item.ngoContribution || 0,
        beneficiaryContribution: item.beneficiaryContribution || 0,
        governmentContribution: item.governmentContribution || 0,
        budgetType: item.budgetType || "PROCUREMENT_COST",
        monthlyTargets: item.monthlyTargets || {}
      }));
      setBudgetItems(loadedBudgetItems);
    }

    // Set sub-projects if available for IVDP
    if (projectData.projectType === "IVDP" && projectData.subProjects) {
      const loadedSubProjects = projectData.subProjects.map((sub: any, index: number) => ({
        id: sub.id || Date.now().toString() + index,
        name: sub.name || "",
        description: sub.description || "",
        budget: sub.budget || 0,
        startDate: sub.startDate ? new Date(sub.startDate) : undefined,
        endDate: sub.endDate ? new Date(sub.endDate) : undefined,
        orderIndex: sub.orderIndex || index
      }));
      setSubProjects(loadedSubProjects);
    }
  };

  const themes = [
    "Health",
    "Education",
    "Climate Resilience", 
    "Livelihood",
    "Government Convergence"
  ];

  const projectHeads = [
        "Ms. Mala Mirchandani",
    "Mr. Shiraj Pathan"
  ];

  // Budget types based on project type
  const thematicBudgetTypes = [
    "PROCUREMENT_COST",
    "TRAINING_COST", 
    "CIVIL_CONSTRUCTION_COST",
    "CONTINGENCY_MISCELLANEOUS_COST",
    "HR_COST",
    "ADMIN_COST",
    "MANAGEMENT_COORDINATION_COST",
    "GOVERNMENT_CONVERGENCE_COST"
  ];

  const ivdpBudgetTypes = [
    "INVESTMENT_COST",
    "TRAINING_COST",
    "ON_CONTINUATION_COST", 
    "CHARTING_VALIDATION_COSTS",
    "HR_COST",
    "ADMIN_COST",
    "MANAGEMENT_COORDINATION_COST",
    "GOVERNMENT_CONVERGENCE_COST"
  ];

  const getBudgetTypes = () => {
    return projectData.projectType === 'thematic' ? thematicBudgetTypes : ivdpBudgetTypes;
  };

  const getMonthsBetweenDates = () => {
    if (!startDate || !endDate) return [];
    
    const months = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    while (start <= end) {
      months.push(format(start, "MMMM yyyy"));
      start.setMonth(start.getMonth() + 1);
    }
    
    return months;
  };

  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      srNo: budgetItems.length + 1,
      itemName: "",
      description: "",
      units: 0,
      unitCost: 0,
      cmsContribution: 0,
      ngoContribution: 0,
      beneficiaryContribution: 0,
      governmentContribution: 0,
      budgetType: getBudgetTypes()[0]
    };
    setBudgetItems([...budgetItems, newItem]);
  };

  const addSubProject = () => {
    const newSubProject: SubProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      budget: 0,
      orderIndex: subProjects.length
    };
    setSubProjects([...subProjects, newSubProject]);
  };

  const removeSubProject = (id: string) => {
    setSubProjects(subProjects.filter(sub => sub.id !== id));
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: any) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const updateMonthlyTarget = (itemId: string, month: string, field: 'target' | 'description', value: any) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item };
        if (!updatedItem.monthlyTargets) {
          updatedItem.monthlyTargets = {};
        }
        if (!updatedItem.monthlyTargets[month]) {
          updatedItem.monthlyTargets[month] = { target: 0, description: '' };
        }
        updatedItem.monthlyTargets[month] = {
          ...updatedItem.monthlyTargets[month],
          [field]: value
        };
        return updatedItem;
      }
      return item;
    }));
  };

  const getTotalAllocation = () => {
    return budgetItems.reduce((sum, item) => {
      const totalCost = item.units * item.unitCost;
      return sum + totalCost;
    }, 0);
  };

  // Helper to count total targets set
  const getTotalTargetsSet = () => {
    return budgetItems.reduce((count, item) => {
      if (item.monthlyTargets) {
        return count + Object.values(item.monthlyTargets).filter(target => 
          target.target > 0 || target.description.trim() !== ''
        ).length;
      }
      return count;
    }, 0);
  };

  // Calculate budget summary by type
  const getBudgetSummary = () => {
    const summary: any = {
      humanResourcesCost: 0,
      adminCost: 0,
      managementAndCoordinationCost: 0,
      miscellaneousCost: 0,
      governmentConvergenceCost: 0,
      procurementCost: 0,
      civilConstructionCost: 0,
      trainingCost: 0
    };

    budgetItems.forEach(item => {
      const totalCost = item.units * item.unitCost;
      switch (item.budgetType) {
        case "HR_COST":
          summary.humanResourcesCost += totalCost;
          break;
        case "ADMIN_COST":
          summary.adminCost += totalCost;
          break;
        case "MANAGEMENT_COORDINATION_COST":
          summary.managementAndCoordinationCost += totalCost;
          break;
        case "CONTINGENCY_MISCELLANEOUS_COST":
          summary.miscellaneousCost += totalCost;
          break;
        case "GOVERNMENT_CONVERGENCE_COST":
          summary.governmentConvergenceCost += totalCost;
          break;
        case "PROCUREMENT_COST":
          summary.procurementCost += totalCost;
          break;
        case "CIVIL_CONSTRUCTION_COST":
          summary.civilConstructionCost += totalCost;
          break;
        case "TRAINING_COST":
          summary.trainingCost += totalCost;
          break;
      }
    });

    return summary;
  };

  // Handle NGO selection
  const handleNgoSelect = (ngoId: string) => {
    const ngoIdNum = parseInt(ngoId);
    setSelectedNgoId(ngoIdNum);
    
    // Find the selected NGO to set the display name
    const selectedNgo = ngos.find(ngo => ngo.id === ngoIdNum);
    if (selectedNgo) {
      setProjectData({
        ...projectData,
        ngoPartner: selectedNgo.ngoName
      });
    }
  };

  // Updated steps - 7 step process
  const steps = [
    { id: 1, title: "Project Type & Head", icon: "🎯" },
    { id: 2, title: "Basic Information", icon: "📋" },
    { id: 3, title: "Budget Allocation", icon: "💰" },
    { id: 4, title: "Budget Review", icon: "📊" },
    { id: 5, title: "Work Plan", icon: "📅" },
    { id: 6, title: "Work Plan Review", icon: "🔍" },
    { id: 7, title: "Overall Review", icon: "✅" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Project Type & Project Head Selection</h3>
              <p className="text-muted-foreground">Choose the project type and assign a project head</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Project Type *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={`cursor-pointer transition-all ${projectData.projectType === 'thematic' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`} 
                        onClick={() => setProjectData({...projectData, projectType: 'thematic'})}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🎯</div>
                        <div>
                          <h4 className="font-semibold">Thematic Project</h4>
                          <p className="text-sm text-muted-foreground">Single focus area project</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={`cursor-pointer transition-all ${projectData.projectType === 'integrated_village_development' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                        onClick={() => setProjectData({...projectData, projectType: 'integrated_village_development'})}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">🏘️</div>
                        <div>
                          <h4 className="font-semibold">Integrated Village Development</h4>
                          <p className="text-sm text-muted-foreground">Multi-component village program</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectHead">Select Project Head *</Label>
                <Select value={projectData.projectHead} onValueChange={(value) => setProjectData({...projectData, projectHead: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose project head" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectHeads.map(head => (
                      <SelectItem key={head} value={head}>{head}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {projectData.projectType === 'integrated_village_development' && (
                <Card className="bg-info/5 border-info">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-info mb-2">Integrated Village Development Program</h4>
                    <p className="text-sm text-muted-foreground">
                      This project type allows multiple sub-projects with dynamic attributes. 
                      You can add multiple components like health, education, livelihood, etc. within a single village program.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  value={projectData.name}
                  onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme *</Label>
                <Select value={projectData.theme} onValueChange={(value) => setProjectData({...projectData, theme: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ngoPartner">NGO Partner *</Label>
                <Select 
                  value={selectedNgoId?.toString() || ""} 
                  onValueChange={handleNgoSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select NGO partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {ngos.map(ngo => (
                      <SelectItem key={ngo.id} value={ngo.id.toString()}>
                        {ngo.ngoName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedNgoId && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {projectData.ngoPartner}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiaries">Expected Beneficiaries *</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  value={projectData.beneficiaries}
                  onChange={(e) => setProjectData({...projectData, beneficiaries: e.target.value})}
                  placeholder="Number of beneficiaries"
                />
              </div>
            </div>

            {/* Sub-projects section for Integrated Village Development */}
            {projectData.projectType === 'integrated_village_development' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Sub-Projects</Label>
                  <Button type="button" onClick={addSubProject} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sub-Project
                  </Button>
                </div>
                {subProjects.map((subProject, index) => (
                  <Card key={subProject.id}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Sub-Project Name</Label>
                          <Input
                            value={subProject.name}
                            onChange={(e) => {
                              const updated = subProjects.map(sp => 
                                sp.id === subProject.id ? {...sp, name: e.target.value} : sp
                              );
                              setSubProjects(updated);
                            }}
                            placeholder="Enter sub-project name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Budget (₹)</Label>
                          <Input
                            type="number"
                            value={subProject.budget}
                            onChange={(e) => {
                              const updated = subProjects.map(sp => 
                                sp.id === subProject.id ? {...sp, budget: Number(e.target.value)} : sp
                              );
                              setSubProjects(updated);
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeSubProject(subProject.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={subProject.description}
                          onChange={(e) => {
                            const updated = subProjects.map(sp => 
                              sp.id === subProject.id ? {...sp, description: e.target.value} : sp
                            );
                            setSubProjects(updated);
                          }}
                          placeholder="Sub-project description"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={projectData.location}
                onChange={(e) => setProjectData({...projectData, location: e.target.value})}
                placeholder="Project location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Project End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                placeholder="Detailed project description"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Project Objectives *</Label>
              <Textarea
                id="objectives"
                value={projectData.objectives}
                onChange={(e) => setProjectData({...projectData, objectives: e.target.value})}
                placeholder="Key project objectives and goals"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectReport">Upload Project Report</Label>
              <Input 
                id="projectReport" 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setProjectData({ ...projectData, reportFile: file });
                }}
              />
              {projectData.reportFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {projectData.reportFile.name}
                </p>
              )}
            </div>
          </div>
        );

      case 3: // Budget Allocation Matrix - NEW FORMAT without month dropdown
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Budget Allocation Matrix</h3>
                <p className="text-muted-foreground">Detail breakdown with contribution tracking</p>
              </div>
              <Button onClick={addBudgetItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {budgetItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-9 gap-2 items-end mb-4">
                      <div className="space-y-2">
                        <Label className="text-xs">S.No</Label>
                        <Input
                          type="number"
                          value={item.srNo}
                          onChange={(e) => updateBudgetItem(item.id, 'srNo', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs">Item Name</Label>
                        <Input
                          value={item.itemName}
                          onChange={(e) => updateBudgetItem(item.id, 'itemName', e.target.value)}
                          placeholder="Item name"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Units</Label>
                        <Input
                          type="number"
                          value={item.units}
                          onChange={(e) => updateBudgetItem(item.id, 'units', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Unit Cost</Label>
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateBudgetItem(item.id, 'unitCost', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Budget Type</Label>
                        <Select 
                          value={item.budgetType} 
                          onValueChange={(value) => updateBudgetItem(item.id, 'budgetType', value)}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {getBudgetTypes().map((type, index) => (
                              <SelectItem key={index} value={type}>
                                {type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeBudgetItem(item.id)}
                          disabled={budgetItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Contribution Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 border-t pt-4">
                      <div className="space-y-2">
                        <Label className="text-xs">CMS Contribution</Label>
                        <Input
                          type="number"
                          value={item.cmsContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'cmsContribution', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">NGO Contribution</Label>
                        <Input
                          type="number"
                          value={item.ngoContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'ngoContribution', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Government Contribution</Label>
                        <Input
                          type="number"
                          value={item.governmentContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'governmentContribution', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Beneficiary Contribution</Label>
                        <Input
                          type="number"
                          value={item.beneficiaryContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'beneficiaryContribution', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* Total Cost Display */}
                    <div className="mt-4 p-3 bg-muted/50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Cost:</span>
                        <span className="text-lg font-bold text-primary">
                          ₹{(item.units * item.unitCost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Allocation:</span>
                  <span className="text-2xl font-bold text-primary">₹{getTotalAllocation().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4: // Budget Allocation Review
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Budget Allocation Review</h3>
              <p className="text-muted-foreground">Review your budget allocation before proceeding</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Budget Items:</span>
                    <span>{budgetItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Allocation:</span>
                    <span className="text-xl font-bold text-primary">₹{getTotalAllocation().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {budgetItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Budget Items Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {budgetItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{item.itemName || "Untitled Item"}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.units} units × ₹{item.unitCost.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {item.budgetType.replace(/_/g, ' ').toLowerCase()}
                          </p>
                        </div>
                        <span className="font-bold">₹{(item.units * item.unitCost).toLocaleString()}</span>
                      </div>
                    ))}
                    {budgetItems.length > 3 && (
                      <p className="text-center text-muted-foreground">
                        +{budgetItems.length - 3} more items
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 5: // Work Plan & Timeline - SET TARGETS FOR EACH MONTH for each budget item
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Work Plan & Timeline</h3>
              <p className="text-muted-foreground">Set monthly targets for each budget item</p>
            </div>

            {!startDate || !endDate ? (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Project Dates Required</h4>
                  <p className="text-muted-foreground">Please set project start and end dates in Basic Information to create work plan</p>
                </CardContent>
              </Card>
            ) : budgetItems.length === 0 ? (
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">No Budget Items</h4>
                  <p className="text-muted-foreground">Please add budget items in the previous step to create work plan</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="border rounded-lg">
                  <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-muted/50 z-20">
                        <tr>
                          <th className="border p-3 text-left font-semibold sticky left-0 bg-muted/50 z-30 min-w-[250px]">
                            Budget Items
                          </th>
                          {getMonthsBetweenDates().map((month) => (
                            <th key={month} className="border p-3 text-center font-semibold min-w-[180px]">
                              {month}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {budgetItems.map((item) => (
                          <tr key={item.id} className="hover:bg-muted/30">
                            <td className="border p-3 sticky left-0 bg-background z-10 min-w-[250px]">
                              <div>
                                <p className="font-medium text-sm">{item.itemName || `Item ${item.srNo}`}</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                <p className="text-xs text-primary font-medium mt-1">
                                  ₹{(item.units * item.unitCost).toLocaleString()}
                                </p>
                              </div>
                            </td>
                            {getMonthsBetweenDates().map((month) => {
                              const monthlyTarget = item.monthlyTargets?.[month] || { target: 0, description: '' };
                              return (
                                <td key={month} className="border p-2">
                                  <div className="space-y-2 min-h-[100px]">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Target</Label>
                                      <Input
                                        type="number"
                                        value={monthlyTarget.target}
                                        onChange={(e) => updateMonthlyTarget(item.id, month, 'target', Number(e.target.value))}
                                        placeholder="0"
                                        className="text-sm h-8"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Description</Label>
                                      <Textarea
                                        value={monthlyTarget.description}
                                        onChange={(e) => updateMonthlyTarget(item.id, month, 'description', e.target.value)}
                                        placeholder="Work description..."
                                        className="text-sm min-h-[60px] resize-none"
                                      />
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Summary Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Work Plan Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <Label className="text-muted-foreground block">Total Months</Label>
                        <p className="font-medium text-lg">{getMonthsBetweenDates().length}</p>
                      </div>
                      <div className="text-center">
                        <Label className="text-muted-foreground block">Budget Items</Label>
                        <p className="font-medium text-lg">{budgetItems.length}</p>
                      </div>
                      <div className="text-center">
                        <Label className="text-muted-foreground block">Targets Set</Label>
                        <p className="font-medium text-lg">
                          {getTotalTargetsSet()}
                        </p>
                      </div>
                      <div className="text-center">
                        <Label className="text-muted-foreground block">Completion</Label>
                        <p className="font-medium text-lg">
                          {Math.round((getTotalTargetsSet() / (getMonthsBetweenDates().length * budgetItems.length)) * 100)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case 6: // Work Plan Review
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Work Plan Review</h3>
              <p className="text-muted-foreground">Review your work plan and timeline</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Work Plan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Project Duration:</span>
                    <span>{getMonthsBetweenDates().length} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Budget Items:</span>
                    <span>{budgetItems.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Targets Defined:</span>
                    <span>{getTotalTargetsSet()} of {getMonthsBetweenDates().length * budgetItems.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {budgetItems.filter(item => item.monthlyTargets && Object.keys(item.monthlyTargets).length > 0).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Work Plan Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {budgetItems
                      .filter(item => item.monthlyTargets && Object.keys(item.monthlyTargets).length > 0)
                      .map((item) => (
                        <div key={item.id} className="p-4 border rounded-lg">
                          <div className="mb-4">
                            <p className="font-medium text-lg">{item.itemName || `Item ${item.srNo}`}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(item.monthlyTargets || {})
                              .filter(([_, target]) => target.target > 0 || target.description.trim() !== '')
                              .map(([month, target]) => (
                                <div key={month} className="border rounded p-3 bg-muted/20">
                                  <p className="font-medium text-sm mb-2">{month}</p>
                                  {target.target > 0 && (
                                    <p className="text-sm text-muted-foreground mb-1">
                                      <span className="font-medium">Target:</span> {target.target}
                                    </p>
                                  )}
                                  {target.description.trim() !== '' && (
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium">Description:</span> {target.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 7: // Overall Review
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Overall Review</h3>
              <p className="text-muted-foreground">Review all project details before final submission</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Project Name</Label>
                    <p className="font-medium">{projectData.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Theme</Label>
                    <p className="font-medium">{projectData.theme}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">NGO Partner</Label>
                    <p className="font-medium">{projectData.ngoPartner}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Beneficiaries</Label>
                    <p className="font-medium">{projectData.beneficiaries}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-medium">{projectData.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Duration</Label>
                    <p className="font-medium">
                      {startDate && endDate ? 
                        `${format(startDate, "PPP")} - ${format(endDate, "PPP")}` : 
                        "Not specified"
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Project Type</Label>
                    <p className="font-medium">
                      {projectData.projectType === 'thematic' ? 'Thematic Project' : 'Integrated Village Development'}
                    </p>
                  </div>
                  {projectData.projectType === 'integrated_village_development' && (
                    <div>
                      <Label className="text-muted-foreground">Sub-Projects</Label>
                      <p className="font-medium">{subProjects.length}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Total Budget Items</Label>
                    <p className="font-medium text-xl">{budgetItems.length}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Budget Allocation</Label>
                    <p className="font-medium text-xl">₹{getTotalAllocation().toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Plan Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Project Duration</Label>
                    <p className="font-medium">{getMonthsBetweenDates().length} months</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Targets Set</Label>
                    <p className="font-medium">{getTotalTargetsSet()} of {getMonthsBetweenDates().length * budgetItems.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

// Add this function to handle file upload
const uploadDocument = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('files', file);
    
    const response = await api.post('/upload/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.status === 200 && response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
      return response.data.uploadedUrls[0];
    }
    return null;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
};

// Update the handleSubmit function to fix these issues
const handleSubmit = async () => {
  if (!selectedNgoId) {
    alert("Please select an NGO partner");
    return;
  }

  setIsSubmitting(true);
  try {
    // Upload document if exists
    let uploadedDprUrl = null;
    if (projectData.reportFile) {
      uploadedDprUrl = await uploadDocument(projectData.reportFile);
      if (!uploadedDprUrl) {
        alert("❌ Failed to upload project report. Please try again.");
        setIsSubmitting(false);
        return;
      }
    }

    const budgetSummary = getBudgetSummary();
    
    // Create work plan details
    const workPlanDetails: string[] = [];

    // Format budget allocation items with monthly targets
    const budgetAllocationItems = budgetItems.map(item => {
      const itemMonthlyTargets = getMonthsBetweenDates().map(month => {
        const monthlyTarget = item.monthlyTargets?.[month] || { target: 0, description: '' };
        const targetMonth = new Date(month);
        
        // Add to work plan details if there's a description
        if (monthlyTarget.description.trim() !== '') {
          workPlanDetails.push(`${month} - ${item.itemName}: ${monthlyTarget.description}`);
        }
        
        return {
          targetMonth: format(targetMonth, "yyyy-MM-dd"),
          plannedTarget: monthlyTarget.target || 0,
          targetDescription: monthlyTarget.description.trim() || `No specific target set for ${month.split(' ')[0].toUpperCase()} ${month.split(' ')[1]}`,
          achievedTarget: 0,
          deviation: 0,
          achievementPercentage: 0.0
        };
      });

      return {
        srNo: item.srNo.toString(),
        itemName: item.itemName,
        description: item.description,
        units: item.units,
        unitCost: item.unitCost,
        total: item.units * item.unitCost,
        cmsContribution: item.cmsContribution,
        ngoContribution: item.ngoContribution,
        governmentContribution: item.governmentContribution,
        beneficiaryContribution: item.beneficiaryContribution,
        budgetType: item.budgetType,
        monthlyTargets: itemMonthlyTargets
      };
    });

    // Extract filename from uploaded URL or use existing filename
    const projectDprFilename = uploadedDprUrl ? uploadedDprUrl.split('/').pop() : null;

    const payload = {
      projectType: projectData.projectType === "thematic" ? "Thematic" : "IVDP",
      projectHead: projectData.projectHead,
      projectName: projectData.name,
      projectTheme: projectData.theme,
      ngoId: selectedNgoId, // Make sure NGO ID is included
      projectNgoPartnerName: projectData.ngoPartner,
      expectedBeneficiaries: projectData.beneficiaries,
      projectLocation: projectData.location,
      projectStartDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
      projectEndDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
      projectDescription: projectData.description,
      projectObjectives: projectData.objectives,
      projectdpr: projectDprFilename,
      projectStatus: "Planned",

      budget: {
        procurementCost: budgetSummary.procurementCost || 0,
        trainingCost: budgetSummary.trainingCost || 0,
        civilConstructionCost: budgetSummary.civilConstructionCost || 0,
        contingencyMiscellaneousCost: budgetSummary.miscellaneousCost || 0,
        humanResourcesCost: budgetSummary.humanResourcesCost || 0,
        adminCost: budgetSummary.adminCost || 0,
        managementAndCoordinationCost: budgetSummary.managementAndCoordinationCost || 0,
        governmentConvergenceCost: budgetSummary.governmentConvergenceCost || 0,
        totalBudget: getTotalAllocation(),
        totalCmsContribution: budgetItems.reduce((sum, item) => sum + item.cmsContribution, 0),
        totalNgoContribution: budgetItems.reduce((sum, item) => sum + item.ngoContribution, 0),
        totalGovernmentContribution: budgetItems.reduce((sum, item) => sum + item.governmentContribution, 0),
        totalBeneficiaryContribution: budgetItems.reduce((sum, item) => sum + item.beneficiaryContribution, 0)
      },

      workPlan: {
        workPlanDetails: workPlanDetails.join("\n")
      },

      budgetAllocationItems: budgetAllocationItems,

      // Remove the root monthlyTargets array to avoid duplication
      // monthlyTargets: monthlyTargets,

      ...(projectData.projectType === 'integrated_village_development' && {
        subProjects: subProjects.map((sub, index) => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          budget: sub.budget,
          startDate: sub.startDate ? format(sub.startDate, "yyyy-MM-dd") : null,
          endDate: sub.endDate ? format(sub.endDate, "yyyy-MM-dd") : null,
          orderIndex: index
        }))
      })
    };

    // Log the payload for debugging
    console.log("📤 Submitting Project Payload:", JSON.stringify(payload, null, 2));

    let response;
    if (editProjectId) {
      console.log(`🔄 Updating existing project with ID: ${editProjectId}`);
      response = await api.put(`/api/projects/${editProjectId}`, payload);
    } else {
      console.log("🆕 Creating new project");
      response = await api.post("/api/projects", payload);
    }

    // Log the response for debugging
    console.log("✅ Project API Response:", JSON.stringify(response.data, null, 2));

    // Verify if monthly targets were saved correctly
    const savedTargets = response.data.budgetAllocationItems?.flatMap((item: any) => 
      item.monthlyTargets?.filter((target: any) => target.plannedTarget > 0)
    ) || [];
    
    if (savedTargets.length > 0) {
      console.log("🎯 Monthly targets saved successfully:", savedTargets.length, "targets with values > 0");
    } else {
      console.warn("⚠️ No monthly targets with values > 0 were saved. Check API implementation.");
    }

    // Show success alert
    alert(`✅ ${editProjectId ? "Project updated" : "Project created"} successfully!`);

    // Call the onSubmit callback with the response data
    onSubmit(response.data);

  } catch (error: any) {
    console.error("❌ Error submitting project:", error);
    
    if (error.response) {
      console.error("🚨 API Error Response:", error.response.data);
      console.error("🚨 API Error Status:", error.response.status);
      alert(`❌ Failed to ${editProjectId ? "update" : "create"} project: ${error.response.data.message || 'Server error'}`);
    } else if (error.request) {
      console.error("🚨 Network Error:", error.request);
      alert("❌ Network error. Please check your connection and try again.");
    } else {
      console.error("🚨 Error:", error.message);
      alert(`❌ Failed to ${editProjectId ? "update" : "create"} project: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editProjectId ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center space-y-2",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.icon}
              </div>
              <span className="text-xs text-center">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === 7 ? (
  <Button 
    onClick={handleSubmit} 
    className="bg-success hover:bg-success/90"
    disabled={isSubmitting || isSubmitted}
  >
    {isSubmitting ? "Submitting..." : 
     isSubmitted ? "✅ Success!" : 
     (editProjectId ? "Update Project" : "Submit Project")}
  </Button>
) : (
  <Button onClick={handleNext}>
    Next
    <ArrowRight className="h-4 w-4 ml-2" />
  </Button>
)}
        </div>
      </DialogContent>
    </Dialog>
  );
}


/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { CalendarIcon, Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface ProjectCreationWizardProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSubmit: (payload: any) => void; // ✅ new
// }

// interface BudgetItem {
//   id: string;
//   serialNo: number;
//   description: string;
//   unit: string;
//   unitCost: number;
//   quantity: number;
//   cmsContribution: number;
//   ngoContribution: number;
//   beneficiaryContribution: number;
//   governmentContribution: number;
//   totalCost: number;
//   customColumns?: { [key: string]: any };
// }

// interface MonthlyTarget {
//   month: string;
//   target: number;
//   description: string;
// }

// interface SubProject {
//   id: string;
//   name: string;
//   description: string;
//   budget: number;
//   startDate?: Date;
//   endDate?: Date;
//   orderIndex: number;
// }

// interface CustomBudgetColumn {
//   id: string;
//   name: string;
//   type: 'string' | 'number' | 'date' | 'boolean';
// }

// export function ProjectCreationWizard({ open, onOpenChange, onSubmit }: ProjectCreationWizardProps) {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [startDate, setStartDate] = useState<Date>();
//   const [endDate, setEndDate] = useState<Date>();
  
//   // Basic Project Information
//   const [projectData, setProjectData] = useState({
//     name: "",
//     description: "",
//     projectType: "thematic" as "thematic" | "integrated_village_development",
//     theme: "",
//     ngoPartner: "",
//     projectHead: "",
//     location: "",
//     beneficiaries: "",
//     objectives: ""
//   });

//   // Budget Categories
//   const [budgetCategories, setBudgetCategories] = useState({
//     humanResources: 0,
//     adminCost: 0,
//     managementCoordination: 0,
//     miscellaneous: 0,
//     governmentConvergence: 0
//   });

//   // Budget Allocation Matrix
//   const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
//     {
//       id: "1",
//       serialNo: 1,
//       description: "",
//       unit: "",
//       unitCost: 0,
//       quantity: 0,
//       cmsContribution: 0,
//       ngoContribution: 0,
//       beneficiaryContribution: 0,
//       governmentContribution: 0,
//       totalCost: 0,
//       customColumns: {}
//     }
//   ]);

//   // Custom Budget Columns
//   const [customBudgetColumns, setCustomBudgetColumns] = useState<CustomBudgetColumn[]>([]);

//   // Sub-projects (for Integrated Village Development Program)
//   const [subProjects, setSubProjects] = useState<SubProject[]>([]);

//   // Work Plan & Timeline
//   const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTarget[]>(
//     Array.from({ length: 12 }, (_, i) => ({
//       month: format(new Date(2024, i, 1), "MMMM"),
//       target: 0,
//       description: ""
//     }))
//   );

//   const themes = [
//     "Health",
//     "Education",
//     "Climate Resilience", 
//     "Livelihood",
//     "Government Convergence"
//   ];

//   const ngoPartners = [
//     "Health Care Foundation",
//     "Education First NGO",
//     "Green Earth Society",
//     "Rural Livelihood Trust"
//   ];

//   const projectHeads = [
//     "Dr. Rajesh Kumar - Health Specialist",
//     "Prof. Priya Sharma - Education Expert", 
//     "Mr. Anil Verma - Climate Resilience Lead",
//     "Ms. Sunita Devi - Livelihood Coordinator",
//     "Mr. Vikash Singh - Government Liaison"
//   ];

//   const addBudgetItem = () => {
//     const newItem: BudgetItem = {
//       id: Date.now().toString(),
//       serialNo: budgetItems.length + 1,
//       description: "",
//       unit: "",
//       unitCost: 0,
//       quantity: 0,
//       cmsContribution: 0,
//       ngoContribution: 0,
//       beneficiaryContribution: 0,
//       governmentContribution: 0,
//       totalCost: 0,
//       customColumns: {}
//     };
//     setBudgetItems([...budgetItems, newItem]);
//   };

//   const addCustomColumn = () => {
//     const newColumn: CustomBudgetColumn = {
//       id: Date.now().toString(),
//       name: "",
//       type: "string"
//     };
//     setCustomBudgetColumns([...customBudgetColumns, newColumn]);
//   };

//   const removeCustomColumn = (id: string) => {
//     setCustomBudgetColumns(customBudgetColumns.filter(col => col.id !== id));
//     // Remove custom column values from all budget items
//     setBudgetItems(budgetItems.map(item => {
//       const newCustomColumns = { ...item.customColumns };
//       delete newCustomColumns[id];
//       return { ...item, customColumns: newCustomColumns };
//     }));
//   };

//   const addSubProject = () => {
//     const newSubProject: SubProject = {
//       id: Date.now().toString(),
//       name: "",
//       description: "",
//       budget: 0,
//       orderIndex: subProjects.length
//     };
//     setSubProjects([...subProjects, newSubProject]);
//   };

//   const removeSubProject = (id: string) => {
//     setSubProjects(subProjects.filter(sub => sub.id !== id));
//   };

//   const removeBudgetItem = (id: string) => {
//     setBudgetItems(budgetItems.filter(item => item.id !== id));
//   };

//   const updateBudgetItem = (id: string, field: keyof BudgetItem, value: any) => {
//     setBudgetItems(budgetItems.map(item => {
//       if (item.id === id) {
//         const updated = { ...item, [field]: value };
//         // Auto-calculate total cost
//         if (['unitCost', 'quantity', 'cmsContribution', 'ngoContribution', 'beneficiaryContribution', 'governmentContribution'].includes(field)) {
//           const customTotal = Object.values(updated.customColumns || {}).reduce((sum, val) => {
//             if (typeof val === 'number') return sum + (val || 0);
//             return sum;
//           }, 0);
//           updated.totalCost = updated.cmsContribution + updated.ngoContribution + updated.beneficiaryContribution + updated.governmentContribution + customTotal;
//         }
//         return updated;
//       }
//       return item;
//     }));
//   };

//   const updateCustomColumnValue = (itemId: string, columnId: string, value: any) => {
//     setBudgetItems(budgetItems.map(item => {
//       if (item.id === itemId) {
//         const customColumns = { ...item.customColumns, [columnId]: value };
        
//         // Calculate custom total (only numeric values)
//         const customTotal = Object.values(customColumns).reduce((sum, val) => {
//           if (typeof val === 'number') return sum + (val || 0);
//           return sum;
//         }, 0);
        
//         const totalCost = item.cmsContribution + item.ngoContribution + item.beneficiaryContribution + item.governmentContribution + customTotal;
//         return { ...item, customColumns, totalCost };
//       }
//       return item;
//     }));
//   };

//   const getTotalBudget = () => {
//     return Object.values(budgetCategories).reduce((sum, value) => sum + value, 0);
//   };

//   const getTotalAllocation = () => {
//     return budgetItems.reduce((sum, item) => sum + item.totalCost, 0);
//   };

//   const renderCustomColumnInput = (itemId: string, column: CustomBudgetColumn) => {
//     const currentValue = budgetItems.find(item => item.id === itemId)?.customColumns?.[column.id];
    
//     switch (column.type) {
//       case 'number':
//         return (
//           <Input
//             type="number"
//             value={currentValue || 0}
//             onChange={(e) => updateCustomColumnValue(itemId, column.id, Number(e.target.value))}
//             className="text-sm"
//             placeholder="0"
//           />
//         );
      
//       case 'date':
//         return (
//           <Input
//             type="date"
//             value={currentValue || ''}
//             onChange={(e) => updateCustomColumnValue(itemId, column.id, e.target.value)}
//             className="text-sm"
//           />
//         );
      
//       case 'boolean':
//         return (
//           <Select
//             value={currentValue?.toString() || 'false'}
//             onValueChange={(value) => updateCustomColumnValue(itemId, column.id, value === 'true')}
//           >
//             <SelectTrigger className="text-sm">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="true">Yes</SelectItem>
//               <SelectItem value="false">No</SelectItem>
//             </SelectContent>
//           </Select>
//         );
      
//       case 'string':
//       default:
//         return (
//           <Input
//             value={currentValue || ''}
//             onChange={(e) => updateCustomColumnValue(itemId, column.id, e.target.value)}
//             className="text-sm"
//             placeholder="Enter value"
//           />
//         );
//     }
//   };

//   const steps = [
//     { id: 1, title: "Project Type & Head", icon: "🎯" },
//     { id: 2, title: "Basic Information", icon: "📋" },
//     { id: 3, title: "Budget Categories", icon: "💰" },
//     { id: 4, title: "Budget Allocation", icon: "📊" },
//     { id: 5, title: "Work Plan & Timeline", icon: "📅" },
//     { id: 6, title: "Review & Submit", icon: "✅" }
//   ];

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div className="text-center mb-6">
//               <h3 className="text-lg font-semibold mb-2">Project Type & Project Head Selection</h3>
//               <p className="text-muted-foreground">Choose the project type and assign a project head</p>
//             </div>

//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <Label className="text-base font-semibold">Project Type *</Label>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <Card className={`cursor-pointer transition-all ${projectData.projectType === 'thematic' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`} 
//                         onClick={() => setProjectData({...projectData, projectType: 'thematic'})}>
//                     <CardContent className="p-6">
//                       <div className="flex items-center space-x-3">
//                         <div className="text-2xl">🎯</div>
//                         <div>
//                           <h4 className="font-semibold">Thematic Project</h4>
//                           <p className="text-sm text-muted-foreground">Single focus area project</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className={`cursor-pointer transition-all ${projectData.projectType === 'integrated_village_development' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'}`}
//                         onClick={() => setProjectData({...projectData, projectType: 'integrated_village_development'})}>
//                     <CardContent className="p-6">
//                       <div className="flex items-center space-x-3">
//                         <div className="text-2xl">🏘️</div>
//                         <div>
//                           <h4 className="font-semibold">Integrated Village Development</h4>
//                           <p className="text-sm text-muted-foreground">Multi-component village program</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="projectHead">Select Project Head *</Label>
//                 <Select value={projectData.projectHead} onValueChange={(value) => setProjectData({...projectData, projectHead: value})}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Choose project head" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {projectHeads.map(head => (
//                       <SelectItem key={head} value={head}>{head}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {projectData.projectType === 'integrated_village_development' && (
//                 <Card className="bg-info/5 border-info">
//                   <CardContent className="p-4">
//                     <h4 className="font-semibold text-info mb-2">Integrated Village Development Program</h4>
//                     <p className="text-sm text-muted-foreground">
//                       This project type allows multiple sub-projects with dynamic attributes. 
//                       You can add multiple components like health, education, livelihood, etc. within a single village program.
//                     </p>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         );

//       case 2:
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="projectName">Project Name *</Label>
//                 <Input
//                   id="projectName"
//                   value={projectData.name}
//                   onChange={(e) => setProjectData({...projectData, name: e.target.value})}
//                   placeholder="Enter project name"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="theme">Theme *</Label>
//                 <Select value={projectData.theme} onValueChange={(value) => setProjectData({...projectData, theme: value})}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select theme" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {themes.map(theme => (
//                       <SelectItem key={theme} value={theme}>{theme}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="ngoPartner">NGO Partner *</Label>
//                 <Select value={projectData.ngoPartner} onValueChange={(value) => setProjectData({...projectData, ngoPartner: value})}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select NGO partner" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {ngoPartners.map(ngo => (
//                       <SelectItem key={ngo} value={ngo}>{ngo}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="beneficiaries">Expected Beneficiaries *</Label>
//                 <Input
//                   id="beneficiaries"
//                   type="number"
//                   value={projectData.beneficiaries}
//                   onChange={(e) => setProjectData({...projectData, beneficiaries: e.target.value})}
//                   placeholder="Number of beneficiaries"
//                 />
//               </div>
//             </div>

//             {/* Sub-projects section for Integrated Village Development */}
//             {projectData.projectType === 'integrated_village_development' && (
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <Label className="text-base font-semibold">Sub-Projects</Label>
//                   <Button type="button" onClick={addSubProject} size="sm">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add Sub-Project
//                   </Button>
//                 </div>
//                 {subProjects.map((subProject, index) => (
//                   <Card key={subProject.id}>
//                     <CardContent className="p-4">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div className="space-y-2">
//                           <Label>Sub-Project Name</Label>
//                           <Input
//                             value={subProject.name}
//                             onChange={(e) => {
//                               const updated = subProjects.map(sp => 
//                                 sp.id === subProject.id ? {...sp, name: e.target.value} : sp
//                               );
//                               setSubProjects(updated);
//                             }}
//                             placeholder="Enter sub-project name"
//                           />
//                         </div>
//                         <div className="space-y-2">
//                           <Label>Budget (₹)</Label>
//                           <Input
//                             type="number"
//                             value={subProject.budget}
//                             onChange={(e) => {
//                               const updated = subProjects.map(sp => 
//                                 sp.id === subProject.id ? {...sp, budget: Number(e.target.value)} : sp
//                               );
//                               setSubProjects(updated);
//                             }}
//                             placeholder="0"
//                           />
//                         </div>
//                         <div className="flex items-end">
//                           <Button 
//                             type="button"
//                             variant="destructive" 
//                             size="sm"
//                             onClick={() => removeSubProject(subProject.id)}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                       <div className="mt-4 space-y-2">
//                         <Label>Description</Label>
//                         <Textarea
//                           value={subProject.description}
//                           onChange={(e) => {
//                             const updated = subProjects.map(sp => 
//                               sp.id === subProject.id ? {...sp, description: e.target.value} : sp
//                             );
//                             setSubProjects(updated);
//                           }}
//                           placeholder="Sub-project description"
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="location">Location *</Label>
//               <Input
//                 id="location"
//                 value={projectData.location}
//                 onChange={(e) => setProjectData({...projectData, location: e.target.value})}
//                 placeholder="Project location"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>Project Start Date *</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {startDate ? format(startDate, "PPP") : "Pick start date"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto" />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//               <div className="space-y-2">
//                 <Label>Project End Date *</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {endDate ? format(endDate, "PPP") : "Pick end date"}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="description">Project Description *</Label>
//               <Textarea
//                 id="description"
//                 value={projectData.description}
//                 onChange={(e) => setProjectData({...projectData, description: e.target.value})}
//                 placeholder="Detailed project description"
//                 className="min-h-[100px]"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="objectives">Project Objectives *</Label>
//               <Textarea
//                 id="objectives"
//                 value={projectData.objectives}
//                 onChange={(e) => setProjectData({...projectData, objectives: e.target.value})}
//                 placeholder="Key project objectives and goals"
//                 className="min-h-[100px]"
//               />
//             </div>
//           </div>
//         );

//       case 3:
//         return (
//           <div className="space-y-6">
//             <div className="text-center mb-6">
//               <h3 className="text-lg font-semibold mb-2">Budget Categorization</h3>
//               <p className="text-muted-foreground">Define budget allocation across different cost categories</p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-thematic-health">Human Resources Cost</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Label htmlFor="humanResources">Amount (₹)</Label>
//                     <Input
//                       id="humanResources"
//                       type="number"
//                       value={budgetCategories.humanResources}
//                       onChange={(e) => setBudgetCategories({
//                         ...budgetCategories,
//                         humanResources: Number(e.target.value)
//                       })}
//                       placeholder="0"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-thematic-education">Admin Cost</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Label htmlFor="adminCost">Amount (₹)</Label>
//                     <Input
//                       id="adminCost"
//                       type="number"
//                       value={budgetCategories.adminCost}
//                       onChange={(e) => setBudgetCategories({
//                         ...budgetCategories,
//                         adminCost: Number(e.target.value)
//                       })}
//                       placeholder="0"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-thematic-climate">Management & Coordination Cost</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Label htmlFor="managementCoordination">Amount (₹)</Label>
//                     <Input
//                       id="managementCoordination"
//                       type="number"
//                       value={budgetCategories.managementCoordination}
//                       onChange={(e) => setBudgetCategories({
//                         ...budgetCategories,
//                         managementCoordination: Number(e.target.value)
//                       })}
//                       placeholder="0"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-thematic-livelihood">Miscellaneous Cost</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Label htmlFor="miscellaneous">Amount (₹)</Label>
//                     <Input
//                       id="miscellaneous"
//                       type="number"
//                       value={budgetCategories.miscellaneous}
//                       onChange={(e) => setBudgetCategories({
//                         ...budgetCategories,
//                         miscellaneous: Number(e.target.value)
//                       })}
//                       placeholder="0"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-success">Government Convergence Cost</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Label htmlFor="governmentConvergence">Amount (₹)</Label>
//                     <Input
//                       id="governmentConvergence"
//                       type="number"
//                       value={budgetCategories.governmentConvergence}
//                       onChange={(e) => setBudgetCategories({
//                         ...budgetCategories,
//                         governmentConvergence: Number(e.target.value)
//                       })}
//                       placeholder="0"
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="bg-muted/50">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold">Total Budget:</span>
//                   <span className="text-2xl font-bold text-primary">₹{getTotalBudget().toLocaleString()}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       case 4:
//         return (
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-lg font-semibold">Budget Allocation Matrix</h3>
//                 <p className="text-muted-foreground">Detail breakdown with contribution tracking</p>
//               </div>
//               <div className="flex gap-2">
//                 <Button onClick={addCustomColumn} variant="outline" size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Column
//                 </Button>
//                 <Button onClick={addBudgetItem} size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Item
//                 </Button>
//               </div>
//             </div>

//             {/* Custom Columns Management */}
//             {customBudgetColumns.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Custom Budget Columns</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     {customBudgetColumns.map((column) => (
//                       <div key={column.id} className="flex items-center gap-4">
//                         <Input
//                           value={column.name}
//                           onChange={(e) => {
//                             const updated = customBudgetColumns.map(col =>
//                               col.id === column.id ? {...col, name: e.target.value} : col
//                             );
//                             setCustomBudgetColumns(updated);
//                           }}
//                           placeholder="Column name"
//                           className="flex-1"
//                         />
//                         <Select
//                           value={column.type}
//                           onValueChange={(value: 'string' | 'number' | 'date' | 'boolean') => {
//                             const updated = customBudgetColumns.map(col =>
//                               col.id === column.id ? {...col, type: value} : col
//                             );
//                             setCustomBudgetColumns(updated);
//                           }}
//                         >
//                           <SelectTrigger className="w-32">
//                             <SelectValue />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="string">String</SelectItem>
//                             <SelectItem value="number">Number</SelectItem>
//                             <SelectItem value="date">Date</SelectItem>
//                             <SelectItem value="boolean">Boolean</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => removeCustomColumn(column.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <div className="space-y-4">
//               {budgetItems.map((item, index) => (
//                 <Card key={item.id}>
//                   <CardContent className="p-4">
//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
//                       <div className="space-y-2">
//                         <Label>S.No</Label>
//                         <Input
//                           type="number"
//                           value={item.serialNo}
//                           onChange={(e) => updateBudgetItem(item.id, 'serialNo', Number(e.target.value))}
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2 md:col-span-2">
//                         <Label>Description</Label>
//                         <Input
//                           value={item.description}
//                           onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
//                           placeholder="Item description"
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Unit</Label>
//                         <Input
//                           value={item.unit}
//                           onChange={(e) => updateBudgetItem(item.id, 'unit', e.target.value)}
//                           placeholder="Unit"
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Unit Cost</Label>
//                         <Input
//                           type="number"
//                           value={item.unitCost}
//                           onChange={(e) => updateBudgetItem(item.id, 'unitCost', Number(e.target.value))}
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Qty</Label>
//                         <Input
//                           type="number"
//                           value={item.quantity}
//                           onChange={(e) => updateBudgetItem(item.id, 'quantity', Number(e.target.value))}
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>CMS</Label>
//                         <Input
//                           type="number"
//                           value={item.cmsContribution}
//                           onChange={(e) => updateBudgetItem(item.id, 'cmsContribution', Number(e.target.value))}
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>NGO</Label>
//                         <Input
//                           type="number"
//                           value={item.ngoContribution}
//                           onChange={(e) => updateBudgetItem(item.id, 'ngoContribution', Number(e.target.value))}
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Beneficiary</Label>
//                         <Input
//                           type="number"
//                           value={item.beneficiaryContribution}
//                           onChange={(e) => updateBudgetItem(item.id, 'beneficiaryContribution', Number(e.target.value))}
//                           className="text-sm"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Government</Label>
//                         <Input
//                           type="number"
//                           value={item.governmentContribution}
//                           onChange={(e) => updateBudgetItem(item.id, 'governmentContribution', Number(e.target.value))}
//                           className="text-sm"
//                         />
//                       </div>
                      
//                       {/* Custom Columns */}
//                       {customBudgetColumns.map((column) => (
//                         <div key={column.id} className="space-y-2">
//                           <Label className="text-xs truncate" title={column.name}>
//                             {column.name || "Custom"}
//                           </Label>
//                           {renderCustomColumnInput(item.id, column)}
//                         </div>
//                       ))}
                      
//                       <div className="flex items-end">
//                         <Button 
//                           variant="destructive" 
//                           size="sm"
//                           onClick={() => removeBudgetItem(item.id)}
//                           disabled={budgetItems.length === 1}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//                       <div className="space-y-2">
//                         <Label>NGO Contribution</Label>
//                         <Input
//                           type="number"
//                           value={item.ngoContribution}
//                           onChange={(e) => updateBudgetItem(item.id, 'ngoContribution', Number(e.target.value))}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Beneficiary Contribution</Label>
//                         <Input
//                           type="number"
//                           value={item.beneficiaryContribution}
//                           onChange={(e) => updateBudgetItem(item.id, 'beneficiaryContribution', Number(e.target.value))}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Total Cost</Label>
//                         <Input
//                           type="number"
//                           value={item.totalCost}
//                           disabled
//                           className="bg-muted"
//                         />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             <Card className="bg-muted/50">
//               <CardContent className="p-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-semibold">Total Allocation:</span>
//                   <span className="text-2xl font-bold text-primary">₹{getTotalAllocation().toLocaleString()}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       case 5:
//         return (
//           <div className="space-y-6">
//             <div className="text-center mb-6">
//               <h3 className="text-lg font-semibold mb-2">Work Plan & Timeline</h3>
//               <p className="text-muted-foreground">Define monthly targets and work descriptions</p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {monthlyTargets.map((target, index) => (
//                 <Card key={target.month}>
//                   <CardHeader className="pb-2">
//                     <CardTitle className="text-sm">{target.month}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div className="space-y-2">
//                       <Label>Monthly Target</Label>
//                       <Input
//                         type="number"
//                         value={target.target}
//                         onChange={(e) => {
//                           const updated = [...monthlyTargets];
//                           updated[index].target = Number(e.target.value);
//                           setMonthlyTargets(updated);
//                         }}
//                         placeholder="Target value"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Work Description</Label>
//                       <Textarea
//                         value={target.description}
//                         onChange={(e) => {
//                           const updated = [...monthlyTargets];
//                           updated[index].description = e.target.value;
//                           setMonthlyTargets(updated);
//                         }}
//                         placeholder="Work to be done this month"
//                         className="min-h-[80px]"
//                       />
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         );

//       case 6:
//         return (
//           <div className="space-y-6">
//             <div className="text-center mb-6">
//               <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
//               <p className="text-muted-foreground">Review all project details before submission</p>
//             </div>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Project Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label className="text-muted-foreground">Project Name</Label>
//                     <p className="font-medium">{projectData.name}</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">Theme</Label>
//                     <p className="font-medium">{projectData.theme}</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">NGO Partner</Label>
//                     <p className="font-medium">{projectData.ngoPartner}</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">Beneficiaries</Label>
//                     <p className="font-medium">{projectData.beneficiaries}</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">Location</Label>
//                     <p className="font-medium">{projectData.location}</p>
//                   </div>
//                   <div>
//                     <Label className="text-muted-foreground">Duration</Label>
//                     <p className="font-medium">
//                       {startDate && endDate ? 
//                         `${format(startDate, "PPP")} - ${format(endDate, "PPP")}` : 
//                         "Not specified"}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <Label className="text-muted-foreground">Total Budget</Label>
//                   <p className="text-2xl font-bold text-primary">₹{getTotalBudget().toLocaleString()}</p>
//                 </div>

//                 {projectData.projectType === 'integrated_village_development' && subProjects.length > 0 && (
//                   <div>
//                     <Label className="text-muted-foreground">Sub-Projects</Label>
//                     <div className="space-y-2 mt-2">
//                       {subProjects.map(sub => (
//                         <div key={sub.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
//                           <span>{sub.name}</span>
//                           <span className="font-medium">₹{sub.budget.toLocaleString()}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

// const handleSubmit = () => {
//     const monthMap: Record<string, string> = {
//     January: "jan",
//     February: "feb",
//     March: "mar",
//     April: "apr",
//     May: "may",
//     June: "june",
//     July: "july",
//     August: "aug",
//     September: "sep",
//     October: "oct",
//     November: "nov",
//     December: "dec",
//   };

//   // Use the first budget item (since it's a single object, not array)
//   const firstBudgetItem = budgetItems[0] || {
//     serialNo: 1,
//     description: "",
//     unit: "",
//     unitCost: 0,
//     quantity: 0,
//     cmsContribution: 0,
//     ngoContribution: 0,
//     beneficiaryContribution: 0,
//     governmentContribution: 0,
//     totalCost: 0,
//     customColumns: {}
//   };

//   // Create base budget allocation matrix object
//   const budgetAllocationMatrix: any = {
//     srNo: firstBudgetItem.serialNo.toString(),
//     description: firstBudgetItem.description,
//     unit: firstBudgetItem.unit,
//     unitCost: firstBudgetItem.unitCost,
//     quantity: firstBudgetItem.quantity,
//     cmsContri: firstBudgetItem.cmsContribution,
//     ngoContri: firstBudgetItem.ngoContribution,
//     beneficiaryContri: firstBudgetItem.beneficiaryContribution,
//     governmentContri: firstBudgetItem.governmentContribution,
//     totalCost: firstBudgetItem.totalCost
//   };

//   // Add custom columns as additional properties
//   customBudgetColumns.forEach(column => {
//     if (firstBudgetItem.customColumns && firstBudgetItem.customColumns[column.id] !== undefined) {
//       // Use column name as key, or generate a default name
//       const fieldName = column.name || `custom_${column.id}`;
//       budgetAllocationMatrix[fieldName] = firstBudgetItem.customColumns[column.id];
//     }
//   });

//   const payload = {
//     projectType: projectData.projectType === "thematic" ? "Thematic" : "IVDP",
//     projectHead: projectData.projectHead,
//     projectName: projectData.name,
//     projectTheme: projectData.theme,
//     projectNgoPartner: projectData.ngoPartner,
//     expectedBeneficiaries: projectData.beneficiaries,
//     projectLocation: projectData.location,
//     projectStartDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
//     projectEndDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
//     projectDescription: projectData.description,
//     projectObjectives: projectData.objectives,
//     budget: {
//       humanResourcesCost: budgetCategories.humanResources,
//       adminCost: budgetCategories.adminCost,
//       managementAndCoordinationCost: budgetCategories.managementCoordination,
//       miscellaneousCost: budgetCategories.miscellaneous,
//       governmentConvergenceCost: budgetCategories.governmentConvergence,
//       totalBudget: getTotalBudget()
//     },
//     budgetAllocationMatrix: budgetAllocationMatrix,
//     workPlan: {
//       workPlanDetails: monthlyTargets
//         .map((m) => `${m.month}: ${m.description}`)
//         .filter(desc => desc.trim() !== "") // Remove empty entries
//         .join(", ") || "Work plan details to be added"
//     },
//     monthlyTarget: monthlyTargets.reduce((acc, cur) => {
//       const shortKey = monthMap[cur.month as keyof typeof monthMap] || cur.month.toLowerCase();
//       acc[shortKey] = cur.target;
//       return acc;
//     }, {} as Record<string, number>),
//     projectStatus: "Planned", // ✅ changed from "Active" to match your API
//   };

//   console.log("Submitting payload:", payload); // Debug log
//   onSubmit(payload);
//   onOpenChange(false);
// };
// // const handleSubmit = () => {
//   // const monthMap: Record<string, string> = {
//   //   January: "jan",
//   //   February: "feb",
//   //   March: "mar",
//   //   April: "apr",
//   //   May: "may",
//   //   June: "june",
//   //   July: "july",
//   //   August: "aug",
//   //   September: "sep",
//   //   October: "oct",
//   //   November: "nov",
//   //   December: "dec",
//   // };

// //   const payload = {
// //     projectType: projectData.projectType === "thematic" ? "Thematic" : "IVDP",
// //     projectHead: projectData.projectHead,
// //     projectName: projectData.name,
// //     projectTheme: projectData.theme,
// //     projectNgoPartner: projectData.ngoPartner,
// //     expectedBeneficiaries: projectData.beneficiaries,
// //     projectLocation: projectData.location,
// //     projectStartDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
// //     projectEndDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
// //     projectDescription: projectData.description,
// //     projectObjectives: projectData.objectives,
// //     budget: {
// //       humanResourcesCost: budgetCategories.humanResources,
// //       adminCost: budgetCategories.adminCost,
// //       managementAndCoordinationCost: budgetCategories.managementCoordination,
// //       miscellaneousCost: budgetCategories.miscellaneous,
// //       governmentConvergenceCost: budgetCategories.governmentConvergence,
// //       totalBudget:
// //         budgetCategories.humanResources +
// //         budgetCategories.adminCost +
// //         budgetCategories.managementCoordination +
// //         budgetCategories.miscellaneous +
// //         budgetCategories.governmentConvergence,
// //     },
// //     budgetAllocationMatrix: budgetItems.map((item) => ({
// //       srNo: item.serialNo,
// //       description: item.description,
// //       unit: item.unit,
// //       unitCost: item.unitCost,
// //       quantity: item.quantity,
// //       cmsContri: item.cmsContribution,
// //       ngoContri: item.ngoContribution,
// //       beneficiaryContri: item.beneficiaryContribution,
// //       governmentContri: item.governmentContribution,
// //       totalCost: item.totalCost, // ✅ include totalCost too
// //     })),
// //     workPlan: {
// //       workPlanDetails: monthlyTargets
// //         .map((m) => `${m.month}: ${m.description}`)
// //         .join(", "),
// //     },
//   //   monthlyTarget: monthlyTargets.reduce((acc, cur) => {
//   //     const shortKey = monthMap[cur.month as keyof typeof monthMap] || cur.month.toLowerCase();
//   //     acc[shortKey] = cur.target;
//   //     return acc;
//   //   }, {} as Record<string, number>),
//   //   projectStatus: "Planned", // ✅ changed from "Active" to match your API
//   // };

// //   console.log("Final Payload =>", payload); // ✅ debug log
// //   onSubmit(payload);  
// //   onOpenChange(false); 
// // };

//   const nextStep = () => {
//     if (currentStep < steps.length) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Project Creation Wizard</DialogTitle>
//         </DialogHeader>

//         {/* Progress Steps */}
//         <div className="flex justify-between mb-8">
//           {steps.map((step) => (
//             <div
//               key={step.id}
//               className={cn(
//                 "flex flex-col items-center space-y-2",
//                 currentStep >= step.id ? "text-primary" : "text-muted-foreground"
//               )}
//             >
//               <div
//                 className={cn(
//                   "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
//                   currentStep >= step.id
//                     ? "bg-primary text-primary-foreground"
//                     : "bg-muted text-muted-foreground"
//                 )}
//               >
//                 {step.icon}
//               </div>
//               <span className="text-xs text-center">{step.title}</span>
//             </div>
//           ))}
//         </div>


//         {/* Step Content */}
//         <div className="py-4">
//           {renderStepContent()}
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-between pt-4">
//           <Button 
//             variant="outline" 
//             onClick={prevStep}
//             disabled={currentStep === 1}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Previous
//           </Button>
          
//           {currentStep === steps.length ? (
//             <Button onClick={handleSubmit}>
//               Submit Project
//               <CheckCircle className="h-4 w-4 ml-2" />
//             </Button>
//           ) : (
//             <Button onClick={nextStep}>
//               Next
//               <ArrowRight className="h-4 w-4 ml-2" />
//             </Button>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }