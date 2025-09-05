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
  totalCost: number;
}

interface MonthlyTarget {
  month: string;
  target: number;
  description: string;
}

export function ProjectCreationWizard({ open, onOpenChange }: ProjectCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  // Basic Project Information
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    theme: "",
    ngoPartner: "",
    location: "",
    beneficiaries: "",
    objectives: ""
  });

  // Budget Categories
  const [budgetCategories, setBudgetCategories] = useState({
    humanResources: 0,
    adminCost: 0,
    managementCoordination: 0,
    miscellaneous: 0
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
      totalCost: 0
    }
  ]);

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
    "Livelihood"
  ];

  const ngoPartners = [
    "Health Care Foundation",
    "Education First NGO",
    "Green Earth Society",
    "Rural Livelihood Trust"
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
      totalCost: 0
    };
    setBudgetItems([...budgetItems, newItem]);
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
  };

  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: any) => {
    setBudgetItems(budgetItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Auto-calculate total cost
        if (['unitCost', 'quantity', 'cmsContribution', 'ngoContribution', 'beneficiaryContribution'].includes(field)) {
          updated.totalCost = updated.cmsContribution + updated.ngoContribution + updated.beneficiaryContribution;
        }
        return updated;
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
    { id: 1, title: "Basic Information", icon: "📋" },
    { id: 2, title: "Budget Categories", icon: "💰" },
    { id: 3, title: "Budget Allocation", icon: "📊" },
    { id: 4, title: "Work Plan & Timeline", icon: "📅" },
    { id: 5, title: "Review & Submit", icon: "✅" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
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

      case 2:
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
              {budgetItems.map((item, index) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
                      <div className="space-y-2">
                        <Label>Serial No.</Label>
                        <Input
                          type="number"
                          value={item.serialNo}
                          onChange={(e) => updateBudgetItem(item.id, 'serialNo', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateBudgetItem(item.id, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={item.unit}
                          onChange={(e) => updateBudgetItem(item.id, 'unit', e.target.value)}
                          placeholder="Unit"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Cost</Label>
                        <Input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateBudgetItem(item.id, 'unitCost', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateBudgetItem(item.id, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CMS Contribution</Label>
                        <Input
                          type="number"
                          value={item.cmsContribution}
                          onChange={(e) => updateBudgetItem(item.id, 'cmsContribution', Number(e.target.value))}
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

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Work Plan & Timeline</h3>
              <p className="text-muted-foreground">Define monthly targets and work descriptions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyTargets.map((target, index) => (
                <Card key={index}>
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

      case 5:
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
    // Here you would typically submit the project data
    console.log('Project Data:', {
      projectData,
      budgetCategories,
      budgetItems,
      monthlyTargets,
      startDate,
      endDate
    });
    onOpenChange(false);
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