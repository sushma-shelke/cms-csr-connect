/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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

interface ProjectCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: any) => void; // ✅ new
}


interface BudgetItem {
  id: string;
  serialNo: number;
  description: string;
  unit: string;
  unitCost: number;
  quantity: number;
  cmsContribution: number;
  ngoContribution: number;
  beneficiaryContribution: number;
  governmentContribution: number;
  totalCost: number;
  customColumns?: { [key: string]: number };
}

interface MonthlyTarget {
  month: string;
  target: number;
  description: string;
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

interface CustomBudgetColumn {
  id: string;
  name: string;
  type: 'decimal' | 'integer';
}

export function ProjectCreationWizard({ open, onOpenChange, onSubmit }: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
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
    objectives: ""
  });

  // Budget Categories
  const [budgetCategories, setBudgetCategories] = useState({
    humanResources: 0,
    adminCost: 0,
    managementCoordination: 0,
    miscellaneous: 0,
    governmentConvergence: 0
  });

  // Budget Allocation Matrix
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: "1",
      serialNo: 1,
      description: "",
      unit: "",
      unitCost: 0,
      quantity: 0,
      cmsContribution: 0,
      ngoContribution: 0,
      beneficiaryContribution: 0,
      governmentContribution: 0,
      totalCost: 0,
      customColumns: {}
    }
  ]);

  // Custom Budget Columns
  // const [customBudgetColumns, setCustomBudgetColumns] = useState<CustomBudgetColumn[]>([]);

  // Sub-projects (for Integrated Village Development Program)
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);

  // Work Plan & Timeline
  const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTarget[]>(
    Array.from({ length: 12 }, (_, i) => ({
      month: format(new Date(2024, i, 1), "MMMM"),
      target: 0,
      description: ""
    }))
  );

  const themes = [
    "Health",
    "Education",
    "Climate Resilience", 
    "Livelihood",
    "Government Convergence"
  ];

  const ngoPartners = [
    "Health Care Foundation",
    "Education First NGO",
    "Green Earth Society",
    "Rural Livelihood Trust"
  ];

  const projectHeads = [
    "Dr. Rajesh Kumar - Health Specialist",
    "Prof. Priya Sharma - Education Expert", 
    "Mr. Anil Verma - Climate Resilience Lead",
    "Ms. Sunita Devi - Livelihood Coordinator",
    "Mr. Vikash Singh - Government Liaison"
  ];

  const addBudgetItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      serialNo: budgetItems.length + 1,
      description: "",
      unit: "",
      unitCost: 0,
      quantity: 0,
      cmsContribution: 0,
      ngoContribution: 0,
      beneficiaryContribution: 0,
      governmentContribution: 0,
      totalCost: 0,
      customColumns: {}
    };
    setBudgetItems([...budgetItems, newItem]);
  };

  // const addCustomColumn = () => {
  //   const newColumn: CustomBudgetColumn = {
  //     id: Date.now().toString(),
  //     name: "",
  //     type: "decimal"
  //   };
  //   setCustomBudgetColumns([...customBudgetColumns, newColumn]);
  // };

  // const removeCustomColumn = (id: string) => {
  //   setCustomBudgetColumns(customBudgetColumns.filter(col => col.id !== id));
  //   // Remove custom column values from all budget items
  //   setBudgetItems(budgetItems.map(item => {
  //     const newCustomColumns = { ...item.customColumns };
  //     delete newCustomColumns[id];
  //     return { ...item, customColumns: newCustomColumns };
  //   }));
  // };

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
        const updated = { ...item, [field]: value };
        // Auto-calculate total cost
        if (['unitCost', 'quantity', 'cmsContribution', 'ngoContribution', 'beneficiaryContribution', 'governmentContribution'].includes(field)) {
          const customTotal = Object.values(updated.customColumns || {}).reduce((sum, val) => sum + (val || 0), 0);
          updated.totalCost = updated.cmsContribution + updated.ngoContribution + updated.beneficiaryContribution + updated.governmentContribution + customTotal;
        }
        return updated;
      }
      return item;
    }));
  };

  const updateCustomColumnValue = (itemId: string, columnId: string, value: number) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === itemId) {
        const customColumns = { ...item.customColumns, [columnId]: value };
        const customTotal = Object.values(customColumns).reduce((sum, val) => sum + (val || 0), 0);
        const totalCost = item.cmsContribution + item.ngoContribution + item.beneficiaryContribution + item.governmentContribution + customTotal;
        return { ...item, customColumns, totalCost };
      }
      return item;
    }));
  };

  const getTotalBudget = () => {
    return Object.values(budgetCategories).reduce((sum, value) => sum + value, 0);
  };

  const getTotalAllocation = () => {
    return budgetItems.reduce((sum, item) => sum + item.totalCost, 0);
  };

  const steps = [
    { id: 1, title: "Project Type & Head", icon: "🎯" },
    { id: 2, title: "Basic Information", icon: "📋" },
    { id: 3, title: "Budget Categories", icon: "💰" },
    { id: 4, title: "Budget Allocation", icon: "📊" },
    { id: 5, title: "Work Plan & Timeline", icon: "📅" },
    { id: 6, title: "Review & Submit", icon: "✅" }
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
                <Select value={projectData.ngoPartner} onValueChange={(value) => setProjectData({...projectData, ngoPartner: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select NGO partner" />
                  </SelectTrigger>
                  <SelectContent>
                    {ngoPartners.map(ngo => (
                      <SelectItem key={ngo} value={ngo}>{ngo}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Budget Categorization</h3>
              <p className="text-muted-foreground">Define budget allocation across different cost categories</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-thematic-health">Human Resources Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="humanResources">Amount (₹)</Label>
                    <Input
                      id="humanResources"
                      type="number"
                      value={budgetCategories.humanResources}
                      onChange={(e) => setBudgetCategories({
                        ...budgetCategories,
                        humanResources: Number(e.target.value)
                      })}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-thematic-education">Admin Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="adminCost">Amount (₹)</Label>
                    <Input
                      id="adminCost"
                      type="number"
                      value={budgetCategories.adminCost}
                      onChange={(e) => setBudgetCategories({
                        ...budgetCategories,
                        adminCost: Number(e.target.value)
                      })}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-thematic-climate">Management & Coordination Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="managementCoordination">Amount (₹)</Label>
                    <Input
                      id="managementCoordination"
                      type="number"
                      value={budgetCategories.managementCoordination}
                      onChange={(e) => setBudgetCategories({
                        ...budgetCategories,
                        managementCoordination: Number(e.target.value)
                      })}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-thematic-livelihood">Miscellaneous Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="miscellaneous">Amount (₹)</Label>
                    <Input
                      id="miscellaneous"
                      type="number"
                      value={budgetCategories.miscellaneous}
                      onChange={(e) => setBudgetCategories({
                        ...budgetCategories,
                        miscellaneous: Number(e.target.value)
                      })}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-success">Government Convergence Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="governmentConvergence">Amount (₹)</Label>
                    <Input
                      id="governmentConvergence"
                      type="number"
                      value={budgetCategories.governmentConvergence}
                      onChange={(e) => setBudgetCategories({
                        ...budgetCategories,
                        governmentConvergence: Number(e.target.value)
                      })}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Budget:</span>
                  <span className="text-2xl font-bold text-primary">₹{getTotalBudget().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Budget Allocation Matrix</h3>
                <p className="text-muted-foreground">Detail breakdown with contribution tracking</p>
              </div>
              <div className="flex gap-2">
                {/* <Button onClick={addCustomColumn} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Column
                </Button> */}
                <Button onClick={addBudgetItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            {/* Custom Columns Management */}
            {/* {customBudgetColumns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Custom Budget Columns</CardTitle>
                </CardHeader>
               
              </Card>
            )} */}

            <div className="space-y-4">
              {budgetItems.map((item, index) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                      <div className="space-y-2">
                        <Label>S.No</Label>
                        <Input
                          type="number"
                          value={item.serialNo}
                          onChange={(e) => updateBudgetItem(item.id, 'serialNo', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => updateBudgetItem(item.id, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Cost</Label>
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateBudgetItem(item.id, 'unitCost', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Qty</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateBudgetItem(item.id, 'quantity', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CMS</Label>
                        <Input
                          type="number"
                          value={item.cmsContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'cmsContribution', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>NGO</Label>
                        <Input
                          type="number"
                          value={item.ngoContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'ngoContribution', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Beneficiary</Label>
                        <Input
                          type="number"
                          value={item.beneficiaryContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'beneficiaryContribution', Number(e.target.value))}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Government</Label>
                        <Input
                          type="number"
                          value={item.governmentContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'governmentContribution', Number(e.target.value))}
                          className="text-sm"
                        />
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>NGO Contribution</Label>
                        <Input
                          type="number"
                          value={item.ngoContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'ngoContribution', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Beneficiary Contribution</Label>
                        <Input
                          type="number"
                          value={item.beneficiaryContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'beneficiaryContribution', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Cost</Label>
                        <Input
                          type="number"
                          value={item.totalCost}
                          disabled
                          className="bg-muted"
                        />
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

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Work Plan & Timeline</h3>
              <p className="text-muted-foreground">Define monthly targets and work descriptions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyTargets.map((target, index) => (
                <Card key={target.month}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{target.month}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Monthly Target</Label>
                      <Input
                        type="number"
                        value={target.target}
                        onChange={(e) => {
                          const updated = [...monthlyTargets];
                          updated[index].target = Number(e.target.value);
                          setMonthlyTargets(updated);
                        }}
                        placeholder="Target value"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Work Description</Label>
                      <Textarea
                        value={target.description}
                        onChange={(e) => {
                          const updated = [...monthlyTargets];
                          updated[index].description = e.target.value;
                          setMonthlyTargets(updated);
                        }}
                        placeholder="Work to be done this month"
                        className="min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
              <p className="text-muted-foreground">Review all project details before submission</p>
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
                    <Label className="text-muted-foreground">Total Budget Categories</Label>
                    <p className="font-medium text-xl">₹{getTotalBudget().toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Total Budget Allocation</Label>
                    <p className="font-medium text-xl">₹{getTotalAllocation().toLocaleString()}</p>
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
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleSubmit = () => {
  const payload = {
    projectType: projectData.projectType === "thematic" ? "Thematic" : "IVDP",
    projectHead: projectData.projectHead,
    projectName: projectData.name,
    projectTheme: projectData.theme,
    projectNgoPartner: projectData.ngoPartner,
    expectedBeneficiaries: projectData.beneficiaries,
    projectLocation: projectData.location,
    projectStartDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
    projectEndDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
    projectDescription: projectData.description,
    projectObjectives: projectData.objectives,
    budget: {
      humanResourcesCost: budgetCategories.humanResources,
      adminCost: budgetCategories.adminCost,
      managementAndCoordinationCost: budgetCategories.managementCoordination,
      miscellaneousCost: budgetCategories.miscellaneous,
      governmentConvergenceCost: budgetCategories.governmentConvergence,
      totalBudget:
        budgetCategories.humanResources +
        budgetCategories.adminCost +
        budgetCategories.managementCoordination +
        budgetCategories.miscellaneous +
        budgetCategories.governmentConvergence,
    },
    budgetAllocationMatrix: budgetItems.map((item) => ({
      srNo: item.serialNo,
      description: item.description,
      unit: item.unit,
      unitCost: item.unitCost,
      quantity: item.quantity,
      cmsContri: item.cmsContribution,
      ngoContri: item.ngoContribution,
      beneficiaryContri: item.beneficiaryContribution,
      governmentContri: item.governmentContribution,
    })),
    workPlan: {
      workPlanDetails: monthlyTargets
        .map((m) => `${m.month}: ${m.description}`)
        .join(", "),
    },
    monthlyTarget: monthlyTargets.reduce((acc, cur) => {
      acc[cur.month.toLowerCase()] = cur.target;
      return acc;
    }, {} as Record<string, number>),
    projectStatus: "Active",
  };

  onSubmit(payload);  // ✅ send payload back
  onOpenChange(false); // ✅ close wizard
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
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
          
          {currentStep === 5 ? (
            <Button onClick={handleSubmit} className="bg-success hover:bg-success/90">
              Submit Project
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