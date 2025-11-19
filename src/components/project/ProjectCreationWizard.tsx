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
import { CalendarIcon, Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "../../api/axios";

interface MonthlyTargetItem {
  budgetAllocationItemSrNo: string;
  targetMonth: string;
  plannedTarget: number;
  targetDescription: string;
}

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

// Updated SubProject interface per request:
interface SubProject {
  id: string | number; // Allow both string and number for API compatibility
  name: string;
  description: string;
  budget: number;
  startDate?: Date;
  endDate?: Date;
  orderIndex: number;
  theme?: string;
  location?: string;
  // ui helper flag: whether subproject should use parent's dates/location (optional)
  useParentDates?: boolean;
  useParentLocation?: boolean;
}

interface NGO {
  id: number;
  ngoName: string;
  location: string;
  founder: string;
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
    ngoPartner: "",
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

  // Different steps for create vs edit
  const getSteps = () => {
    if (editProjectId) {
      // Edit mode - all 7 steps
      return [
        { id: 1, title: "Project Type & Head", icon: "🎯" },
        { id: 2, title: "Basic Information", icon: "📋" },
        { id: 3, title: "Budget Allocation", icon: "💰" },
        { id: 4, title: "Budget Review", icon: "📊" },
        { id: 5, title: "Work Plan", icon: "📅" },
        { id: 6, title: "Work Plan Review", icon: "🔍" },
        { id: 7, title: "Overall Review", icon: "✅" }
      ];
    } else {
      // Create mode - only 4 steps
      return [
        { id: 1, title: "Project Type & Head", icon: "🎯" },
        { id: 2, title: "Basic Information", icon: "📋" },
        { id: 3, title: "Budget Allocation", icon: "💰" },
        { id: 4, title: "Budget Review", icon: "📊" }
      ];
    }
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps;

  const resetForm = () => {
    setCurrentStep(1);
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedNgoId(null);
    setIsSubmitted(false);
    
    setProjectData({
      name: "",
      description: "",
      projectType: "thematic",
      theme: "",
      ngoPartner: "",
      projectHead: "",
      location: "",
      beneficiaries: "",
      objectives: "",
      reportFile: null
    });

    setBudgetItems([
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

    setSubProjects([]);
    setIsSubmitting(false);
  };

// Fetch NGOs when component opens
useEffect(() => {
  if (open) {
    fetchNgos().then(() => {
      // After NGOs are fetched, load edit data if needed
      if (editProjectId && editProjectData) {
        loadEditData(editProjectData);
      } else {
        // Reset form when opening in create mode
        resetForm();
      }
    });
  }
}, [open, editProjectId, editProjectData]);

const fetchNgos = async () => {
  try {
    const response = await api.get("/api/ngos");
    console.log(response, "NGO");
    
    setNgos(response.data);
    return response.data; // Return the data for chaining
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    return []; // Return empty array on error
  }
};

  const loadEditData = (projectData: any) => {
    console.log("🔍 Loading edit data - NGO Info:", {
      ngoId: projectData.ngoId,
      ngoPartner: projectData.projectNgoPartner,
      availableNgos: ngos
    });

    setProjectData({
      name: projectData.projectName || "",
      description: projectData.projectDescription || "",
      projectType: projectData.projectType === "IVDP" ? "integrated_village_development" : "thematic",
      theme: projectData.projectTheme || "",
      ngoPartner: projectData.projectNgoPartner || projectData.projectNgoPartnerName || "",
      projectHead: projectData.projectHead || "",
      location: projectData.projectLocation || "",
      beneficiaries: projectData.expectedBeneficiaries || "",
      objectives: projectData.projectObjectives || "",
      reportFile: null
    });

    // ✅ FIX: Set selectedNgoId from the project data
    if (projectData.ngoId) {
      console.log("✅ Setting selectedNgoId from project data:", projectData.ngoId);
      setSelectedNgoId(projectData.ngoId);
    } else {
      // If ngoId is not available, try to find it from ngoPartner name
      const ngoPartnerName = projectData.projectNgoPartner || projectData.projectNgoPartnerName;
      const foundNgo = ngos.find(ngo => ngo.ngoName === ngoPartnerName);
      if (foundNgo) {
        console.log("✅ Found NGO by name, setting ID:", foundNgo.id);
        setSelectedNgoId(foundNgo.id);
      } else {
        console.warn("⚠️ Could not find NGO ID for partner:", ngoPartnerName);
        setSelectedNgoId(null);
      }
    }

    // ✅ Ensure both start and end dates are loaded
    if (projectData.projectStartDate) {
      setStartDate(new Date(projectData.projectStartDate));
    }
    if (projectData.projectEndDate) {
      setEndDate(new Date(projectData.projectEndDate));
    }

    // ✅ Load budget items with monthly targets
    if (projectData.budgetAllocationItems && projectData.budgetAllocationItems.length > 0) {
      const loadedBudgetItems = projectData.budgetAllocationItems.map((item: any, index: number) => {
        // Process monthly targets for this budget item
        const monthlyTargets: { [month: string]: MonthlyTargetData } = {};
        
        if (item.monthlyTargets && Array.isArray(item.monthlyTargets)) {
          item.monthlyTargets.forEach((target: any) => {
            const monthKey = format(new Date(target.targetMonth), "MMMM yyyy");
            monthlyTargets[monthKey] = {
              target: target.plannedTarget || 0,
              description: target.targetDescription || ''
            };
          });
        }
        
        // Also check the root level monthlyTargets array
        if (projectData.monthlyTargets && Array.isArray(projectData.monthlyTargets)) {
          projectData.monthlyTargets.forEach((target: any) => {
            if (target.budgetAllocationItemSrNo === item.srNo.toString()) {
              const monthKey = format(new Date(target.targetMonth), "MMMM yyyy");
              monthlyTargets[monthKey] = {
                target: target.plannedTarget || 0,
                description: target.targetDescription || ''
              };
            }
          });
        }

        return {
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
          monthlyTargets: Object.keys(monthlyTargets).length > 0 ? monthlyTargets : undefined
        };
      });
      setBudgetItems(loadedBudgetItems);
    }

    // ✅ FIX: Properly map subProjects from API response when project is IVDP
    if ((projectData.projectType === "IVDP" || projectData.projectType === "IVDP" /* defensive */) && projectData.subProjects && Array.isArray(projectData.subProjects)) {
      const loadedSubProjects: SubProject[] = projectData.subProjects.map((sub: any, index: number) => {
        // API response uses fields like:
        // sub.id
        // sub.projectName
        // sub.projectDescription
        // sub.totalBudgetFromItems
        // sub.projectStartDate
        // sub.projectEndDate
        // sub.orderIndex
        // sub.projectTheme (maybe)
        // sub.projectLocation (maybe)
        return {
          id: sub.id || (Date.now().toString() + index),
          name: sub.projectName || sub.name || "",
          description: sub.projectDescription || sub.description || "",
          budget: (typeof sub.totalBudgetFromItems === "number" ? sub.totalBudgetFromItems : (sub.budget || 0)),
          startDate: sub.projectStartDate ? new Date(sub.projectStartDate) : (sub.startDate ? new Date(sub.startDate) : undefined),
          endDate: sub.projectEndDate ? new Date(sub.projectEndDate) : (sub.endDate ? new Date(sub.endDate) : undefined),
          orderIndex: (typeof sub.orderIndex === "number" ? sub.orderIndex : index),
          theme: sub.projectTheme || sub.theme || undefined,
          location: sub.projectLocation || sub.location || projectData.projectLocation || undefined,
          useParentDates: !(sub.projectStartDate || sub.startDate),
          useParentLocation: !(sub.projectLocation || sub.location)
        };
      });
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
    
    start.setDate(1);
    end.setDate(1);
    
    while (start <= end) {
      months.push(format(start, "MMMM yyyy"));
      start.setMonth(start.getMonth() + 1);
    }
    
    return months;
  };

  const getProjectDurationInfo = () => {
    if (!startDate || !endDate) return null;
    
    const months = getMonthsBetweenDates();
    return {
      months: months,
      monthCount: months.length,
      start: format(startDate, "MMM d, yyyy"),
      end: format(endDate, "MMM d, yyyy")
    };
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
      orderIndex: subProjects.length,
      theme: projectData.theme || undefined,
      location: projectData.location || undefined,
      useParentDates: true,
      useParentLocation: true
    };
    setSubProjects([...subProjects, newSubProject]);
  };

  const removeSubProject = (id: string | number) => {
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

  const getTotalTargetsSet = () => {
    return budgetItems.reduce((count, item) => {
      if (item.monthlyTargets) {
        return count + Object.values(item.monthlyTargets).filter(target => 
          target && (target.target > 0 || (target.description && target.description.trim() !== ''))
        ).length;
      }
      return count;
    }, 0);
  };

  const getBudgetSummary = () => {
    const summary: any = {
      humanResourcesCost: 0,
      adminCost: 0,
      managementAndCoordinationCost: 0,
      miscellaneousCost: 0,
      governmentConvergenceCost: 0,
      procurementCost: 0,
      civilConstructionCost: 0,
      trainingCost: 0,
      investmentCost: 0
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
        case "INVESTMENT_COST":
          summary.investmentCost += totalCost;
          break;
      }
    });

    return summary;
  };

  const handleNgoSelect = (ngoId: string) => {
    const ngoIdNum = parseInt(ngoId);
    setSelectedNgoId(ngoIdNum);
    
    const selectedNgo = ngos.find(ngo => ngo.id === ngoIdNum);
    if (selectedNgo) {
      setProjectData({
        ...projectData,
        ngoPartner: selectedNgo.ngoName
      });
    }
  };

  const EnhancedWorkPlanDisplay = () => {
    const durationInfo = getProjectDurationInfo();
    const months = getMonthsBetweenDates();
    
    if (!durationInfo || months.length === 0) {
      return (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="p-8 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Project Dates Required</h4>
            <p className="text-muted-foreground">Please set project start and end dates in Basic Information to create work plan</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Project Timeline Information</h4>
                <p className="text-sm text-blue-700 mb-2">
                  Your project runs from <strong>{durationInfo.start}</strong> to <strong>{durationInfo.end}</strong>, 
                  spanning <strong>{durationInfo.monthCount} months</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {budgetItems.map((item) => (
            <Card key={item.id} className="work-plan-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="item-icon bg-primary/10 text-primary rounded-lg p-2">
                      <span className="text-sm font-bold">{item.srNo}</span>
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.itemName || `Item ${item.srNo}`}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm font-medium text-primary">
                          ₹{(item.units * item.unitCost).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {item.budgetType.replace(/_/g, ' ').toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {months.map((month) => {
                    const monthlyTarget = item.monthlyTargets?.[month] || { target: 0, description: '' };
                    return (
                      <Card key={month} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm text-blue-800">{month}</h4>
                              {monthlyTarget.target > 0 && (
                                <span className="target-badge bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Target: {monthlyTarget.target}
                                </span>
                              )}
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Target Description</Label>
                              <p className="text-sm mt-1 min-h-[40px]">
                                {monthlyTarget.description || 'No specific activities planned'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Work Plan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <Label className="text-muted-foreground block">Total Months</Label>
                <p className="font-medium text-lg">{months.length}</p>
              </div>
              <div className="text-center">
                <Label className="text-muted-foreground block">Budget Items</Label>
                <p className="font-medium text-lg">{budgetItems.length}</p>
              </div>
              <div className="text-center">
                <Label className="text-muted-foreground block">Targets Set</Label>
                <p className="font-medium text-lg">{getTotalTargetsSet()}</p>
              </div>
              <div className="text-center">
                <Label className="text-muted-foreground block">Total Targets</Label>
                <p className="font-medium text-lg">{months.length * budgetItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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
                        <div className="flex items-end space-x-2">
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

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Sub-Project Theme</Label>
                          <Select
                            value={subProject.theme || ""}
                            onValueChange={(value) => {
                              const updated = subProjects.map(sp =>
                                sp.id === subProject.id ? {...sp, theme: value} : sp
                              );
                              setSubProjects(updated);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              {themes.map(theme => <SelectItem key={theme} value={theme}>{theme}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Location</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={subProject.useParentLocation ? (projectData.location || "") : (subProject.location || "")}
                              onChange={(e) => {
                                const updated = subProjects.map(sp => 
                                  sp.id === subProject.id ? {...sp, location: e.target.value, useParentLocation: false} : sp
                                );
                                setSubProjects(updated);
                              }}
                              placeholder="Sub-project location (defaults to parent)"
                              disabled={subProject.useParentLocation}
                            />
                            <Button size="sm" type="button" onClick={() => {
                              const updated = subProjects.map(sp => 
                                sp.id === subProject.id ? {...sp, useParentLocation: !sp.useParentLocation, location: sp.useParentLocation ? sp.location : undefined} : sp
                              );
                              setSubProjects(updated);
                            }}>
                              {subProject.useParentLocation ? "Use Parent" : "Custom"}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">If 'Use Parent' is active, parent location will be used for this sub-project.</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !subProject.startDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {subProject.useParentDates ? (startDate ? format(startDate, "PPP") : "Use parent start date") : (subProject.startDate ? format(subProject.startDate, "PPP") : "Pick start date")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={subProject.useParentDates ? startDate : subProject.startDate}
                                onSelect={(d) => {
                                  const updated = subProjects.map(sp => 
                                    sp.id === subProject.id ? {...sp, startDate: d, useParentDates: false} : sp
                                  );
                                  setSubProjects(updated);
                                }}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <div>
                            <Button size="sm" type="button" onClick={() => {
                              const updated = subProjects.map(sp => 
                                sp.id === subProject.id ? {...sp, useParentDates: !sp.useParentDates, startDate: sp.useParentDates ? sp.startDate : undefined} : sp
                              );
                              setSubProjects(updated);
                            }}>
                              {subProject.useParentDates ? "Use Parent Dates" : "Custom Dates"}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !subProject.endDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {subProject.useParentDates ? (endDate ? format(endDate, "PPP") : "Use parent end date") : (subProject.endDate ? format(subProject.endDate, "PPP") : "Pick end date")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={subProject.useParentDates ? endDate : subProject.endDate}
                                onSelect={(d) => {
                                  const updated = subProjects.map(sp => 
                                    sp.id === subProject.id ? {...sp, endDate: d, useParentDates: false} : sp
                                  );
                                  setSubProjects(updated);
                                }}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
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

      case 3:
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

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Budget Allocation Review</h3>
              <p className="text-muted-foreground">Review your budget allocation before {editProjectId ? 'updating' : 'creating'} the project</p>
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

            {!editProjectId && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Next Steps</h4>
                      <p className="text-sm text-blue-700">
                        After creating the project, you can add detailed work plans and monthly targets by editing the project.
                        This allows you to get the project started quickly and add detailed planning later.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

     case 5:
      // Only show work plan in edit mode
      if (!editProjectId) {
        return (
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Work Plan Not Available</h3>
            <p className="text-muted-foreground">
              Work plan features are only available when editing existing projects.
            </p>
          </div>
        );
      }

      const durationInfo = getProjectDurationInfo();
      
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
              {durationInfo && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Project Timeline Information</h4>
                        <p className="text-sm text-blue-700 mb-2">
                          Your project runs from <strong>{durationInfo.start}</strong> to <strong>{durationInfo.end}</strong>, 
                          spanning <strong>{durationInfo.monthCount} months</strong> ({durationInfo.months.join(', ')}).
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                                      placeholder={`Work description for ${month}...`}
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
                      <p className="font-medium text-lg">{getTotalTargetsSet()}</p>
                    </div>
                    <div className="text-center">
                      <Label className="text-muted-foreground block">Total Targets</Label>
                      <p className="font-medium text-lg">{getMonthsBetweenDates().length * budgetItems.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      );

    case 6:
      // Only show work plan review in edit mode
      if (!editProjectId) {
        return (
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Work Plan Review Not Available</h3>
            <p className="text-muted-foreground">
              Work plan review is only available when editing existing projects.
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Work Plan Review</h3>
            <p className="text-muted-foreground">Review your work plan and timeline</p>
          </div>
          <EnhancedWorkPlanDisplay />
        </div>
      );

    case 7:
      // Only show overall review in edit mode
      if (!editProjectId) {
        return (
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Overall Review Not Available</h3>
            <p className="text-muted-foreground">
              Overall review is only available when editing existing projects.
            </p>
          </div>
        );
      }

      const reviewDurationInfo = getProjectDurationInfo();
      
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
              {reviewDurationInfo && (
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">Project Timeline:</p>
                  <p className="text-sm text-blue-700">
                    {reviewDurationInfo.start} to {reviewDurationInfo.end} 
                    ({reviewDurationInfo.monthCount} months: {reviewDurationInfo.months.join(', ')})
                  </p>
                </div>
              )}
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
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

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

const handleSubmit = async (e?: React.FormEvent) => {
  // Prevent default form submission behavior
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (!selectedNgoId) {
    alert("Please select an NGO partner");
    return;
  }

  if (!startDate || !endDate) {
    alert("Please select both start and end dates");
    return;
  }

  // Prevent multiple submissions
  if (isSubmitting) {
    console.log("⚠️ Submission already in progress, skipping...");
    return;
  }

  setIsSubmitting(true);
  try {
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
    
    const workPlanDetails: string[] = [];

    const budgetAllocationItems = budgetItems.map(item => {
      // Process monthly targets for the budget item
      const monthlyTargets = [];
      
      if (startDate && endDate) {
        getMonthsBetweenDates().forEach(month => {
          const monthlyTarget = item.monthlyTargets?.[month] || { target: 0, description: '' };
          
          if (monthlyTarget.target > 0 || monthlyTarget.description.trim() !== '') {
            const targetMonth = new Date(month);
            
            // Add to work plan details
            if (monthlyTarget.description.trim() !== '') {
              workPlanDetails.push(`${month}: ${monthlyTarget.description}`);
            }
            
            // Add to monthly targets array for this budget item
            monthlyTargets.push({
              targetMonth: format(targetMonth, "yyyy-MM-dd"),
              plannedTarget: monthlyTarget.target || 0,
              targetDescription: monthlyTarget.description.trim() || `No specific target set for ${month.split(' ')[0].toUpperCase()} ${month.split(' ')[1]}`
            });
          }
        });
      }

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
        monthlyTargets: monthlyTargets // Include monthly targets directly in budget item
      };
    });

    const projectDprValue = uploadedDprUrl;

    // Build payload with correct IVDP subProjects formatting and ngoPartnerId
    const baseProjectType = projectData.projectType === 'integrated_village_development' ? 'IVDP' : projectData.theme || 'Thematic';

    const payload: any = {
      // For IVDP projects we send top-level projectType as 'IVDP' per your notes,
      // for thematic projects we keep the theme in projectTheme and set a readable type.
      projectType: baseProjectType,
      projectHead: projectData.projectHead,
      projectName: projectData.name,
      projectTheme: projectData.theme,
      ngoPartnerId: selectedNgoId, // send ID instead of name
      expectedBeneficiaries: projectData.beneficiaries,
      projectLocation: projectData.location,
      projectStartDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
      projectEndDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
      projectDescription: projectData.description,
      projectObjectives: projectData.objectives,
      projectDpr: projectDprValue,
      projectStatus: "PLANNED",
      
      // Budget section - simplified to match desired format
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

      // Work plan section - simplified format
      workPlan: {
        workPlanDetails: workPlanDetails.join("\n")
      },

      // Budget allocation items with embedded monthly targets
      budgetAllocationItems: budgetAllocationItems
    };

    // Only include subProjects for IVDP type, and format them exactly as required by API
    if (projectData.projectType === 'integrated_village_development') {
      payload.subProjects = subProjects.map((sub) => {
        const subStartDate = sub.useParentDates ? (startDate ? format(startDate, "yyyy-MM-dd") : null) : (sub.startDate ? format(sub.startDate, "yyyy-MM-dd") : null);
        const subEndDate = sub.useParentDates ? (endDate ? format(endDate, "yyyy-MM-dd") : null) : (sub.endDate ? format(sub.endDate, "yyyy-MM-dd") : null);
        const subLocation = sub.useParentLocation ? projectData.location : (sub.location || projectData.location);

        // Choose a sensible projectType for sub-projects: use sub.theme if present, otherwise fallback to parent's theme
        const subProjectTypeField = sub.theme || projectData.theme || 'General';

        return {
          projectType: subProjectTypeField,
          projectHead: projectData.projectHead,
          projectName: sub.name,
          projectTheme: sub.theme || subProjectTypeField,
          projectNgoPartnerName: projectData.ngoPartner, // use parent's NGO name
          projectLocation: subLocation,
          projectStartDate: subStartDate,
          projectEndDate: subEndDate,
          projectDescription: sub.description,
          projectStatus: "PLANNED"
        };
      });
    }

    console.log("📤 Submitting Project Payload:", JSON.stringify(payload, null, 2));

    let response;
    if (editProjectId) {
      console.log(`🔄 Updating existing project with ID: ${editProjectId}`);
      response = await api.put(`/api/projects/${editProjectId}/updateNestedDirect`, payload);
    } else {
      console.log("🆕 Creating new project");
      response = await api.post("/api/projects", payload);
    }

    console.log("✅ Project API Response:", JSON.stringify(response.data, null, 2));

    alert(`✅ ${editProjectId ? "Project updated" : "Project created"} successfully!`);
    setIsSubmitted(true);

    onSubmit(response.data);

  } catch (error: any) {
    console.error("❌ Error submitting project:", error);
    
    // Enhanced error handling with more detailed information
    if (error.response) {
      console.error("❌ Server Response Data:", error.response.data);
      console.error("❌ Server Response Status:", error.response.status);
      console.error("❌ Server Response Headers:", error.response.headers);
      
      const errorMessage = error.response.data.message || 
                          error.response.data.error || 
                          JSON.stringify(error.response.data);
      alert(`❌ Failed to ${editProjectId ? "update" : "create"} project: ${errorMessage}`);
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
      alert("❌ Network error. Please check your connection and try again.");
    } else {
      console.error("❌ Request setup error:", error.message);
      alert(`❌ Failed to ${editProjectId ? "update" : "create"} project: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editProjectId ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

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

        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {isLastStep ? (
            <Button 
              type="button" 
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

