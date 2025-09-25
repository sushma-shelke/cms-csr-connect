/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { CalendarIcon, ArrowLeft, ArrowRight, CheckCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import {createNgos} from "@/api/ngo";

interface NGOCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: any) => void;
}

const ngoSteps = [
  {
    label: "Basic Details",
    fields: [
      { name: "name", label: "Organization Name", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "founder", label: "Name of Founder", type: "text", required: true },
      { name: "registrationDetails", label: "Registration Details", type: "text", required: true },
      { name: "registrationDate", label: "Date of Registration", type: "date", required: true },
      { 
        name: "statutoryDocs", 
        label: "Statutory Documents (FCRA/80G/35AC/12A/CSR)", 
        type: "yesNoDocument", 
        required: true 
      }
    ]
  },
  {
    label: "Legal & Financial",
    fields: [
      { 
        name: "panCard", 
        label: "PAN Card Available", 
        type: "yesNoDocument", 
        required: true 
      },
      { 
        name: "certificateValidity", 
        label: "Certificate of Exemption Validity", 
        type: "yesNoDocument" 
      },
      { 
        name: "exemptionDetails", 
        label: "Exemption Details", 
        type: "text" 
      },
      { 
        name: "auditedStatements", 
        label: "Previous Three Years Audited Statements Available", 
        type: "yesNoDocument" 
      },
      { 
        name: "mou", 
        label: "MOU/MOA/Trust Deed Available", 
        type: "yesNoDocument" 
      },
      { name: "orgBudget", label: "Organization Budget (Last FY)", type: "number" },
      { name: "totalExpenses", label: "Total Expenses (Last FY)", type: "number" },
      { name: "incomeVsExpenditure", label: "Income vs Expenditure (Last 3 Years)", type: "text" },
      { name: "directProgrammeSpend", label: "Spend on Direct Programme Costs (Last FY)", type: "number" },
      { name: "fixedAssets", label: "Fixed Assets Owned", type: "text" }
    ]
  },
  {
    label: "Activities & Advocacy",
    fields: [
      { 
        name: "religiousAgenda", 
        label: "Promotes Religious/Spiritual Agenda?", 
        type: "yesNo",
        conditionalField: "agendaDetails"
      },
      { 
        name: "agendaDetails", 
        label: "If Yes, How?", 
        type: "text",
        conditional: true 
      },
      { 
        name: "beneficiaryCaste", 
        label: "Beneficiaries Specific to Any Religion/Caste/Culture?", 
        type: "yesNo" 
      },
      { 
        name: "politicalNature", 
        label: "Are Activities Political/Religious/Spiritual?", 
        type: "yesNo" 
      },
      { 
        name: "socialAdvocacy", 
        label: "Addresses Issues of Social Advocacy?", 
        type: "yesNo" 
      },
      { 
        name: "govtConflict", 
        label: "Activities in Conflict With Govt Rules?", 
        type: "yesNo" 
      },
      { 
        name: "humanRights", 
        label: "Aligned With Human Rights Principles?", 
        type: "yesNo" 
      },
      { 
        name: "environmental", 
        label: "Environment Consideration in Programmes?", 
        type: "yesNo" 
      }
    ]
  },
  {
    label: "Governance & Staffing",
    fields: [
      { 
        name: "governingBody", 
        label: "Governing Body/Trustee Involvement?", 
        type: "yesNo",
        conditionalField: "governingDetails"
      },
      { 
        name: "governingDetails", 
        label: "If Yes, How?", 
        type: "text",
        conditional: true 
      },
      { 
        name: "relatedMembers", 
        label: "Are any Members Related?", 
        type: "yesNo",
        conditionalField: "relationsSpecify"
      },
      { 
        name: "relationsSpecify", 
        label: "Specify Relations", 
        type: "text",
        conditional: true 
      },
      { name: "meetingFrequency", label: "Frequency of Governing Body Meetings", type: "text" },
      { name: "fullTimeEmployees", label: "Full-time Employees (How Many?)", type: "number" },
      { name: "partTimeEmployees", label: "Part-time Employees (How Many?)", type: "number" },
      { name: "skilledStaff", label: "Number of Skilled/Trained Staff", type: "number" },
      { name: "trainedPersonnel", label: "Trained/Experienced Progress Reporting Staff?", type: "yesNo" },
      { name: "definedRoles", label: "Defined Roles & Responsibilities?", type: "yesNo" },
      { name: "avgStaffExperience", label: "Average Staff Experience (Years)", type: "number" },
      { name: "staffTraining", label: "Staff Training Details & Frequency", type: "text" },
      { name: "volunteerOpportunities", label: "Structured Volunteer Opportunities?", type: "yesNo" }
    ]
  },
  {
    label: "Funding & Outreach",
    fields: [
      { name: "fundingSources", label: "Major Sources of Funding", type: "text" },
      { 
        name: "individualDonors", 
        label: "Individual Donors? If Yes, Mention", 
        type: "yesNoText" 
      },
      { 
        name: "corporateFunders", 
        label: "Corporate Funders? If Yes, Mention", 
        type: "yesNoText" 
      },
      { 
        name: "govtFunders", 
        label: "Government Funding? If Yes, Mention", 
        type: "yesNoText" 
      },
      { 
        name: "otherAgencies", 
        label: "Funding from Agencies/Trusts? If Yes, Mention", 
        type: "yesNoText" 
      },
      { 
        name: "otherSources", 
        label: "Other Funding Sources? If Yes, Mention", 
        type: "yesNoText" 
      },
      { name: "mainObjective", label: "Main Objective of Organisation/Trust", type: "text" },
      { name: "targetBeneficiaries", label: "Target Beneficiaries (Specify)", type: "text" },
      { name: "percentLowSEB", label: "Percent Beneficiaries from Low Socio-economic Background", type: "number" },
      { name: "totalOutreach", label: "Total Outreach (Last FY)", type: "number" },
      { name: "costPerBeneficiary", label: "Cost per Beneficiary (Flagship Project)", type: "number" },
      { name: "areasOfIntervention", label: "Areas of Intervention (Flagship Project)", type: "text" }
    ]
  },
  {
    label: "Monitoring & Evaluation",
    fields: [
      { 
        name: "monWithinScheduleVII", 
        label: "Within Schedule VII of Companies Act 2013?", 
        type: "yesNo" 
      },
      { 
        name: "monitoringMethods", 
        label: "Well Defined Monitoring Methods?", 
        type: "yesNo" 
      },
      { 
        name: "monitoringResponsibility", 
        label: "Any Individual for Monitoring & Mid-term Corrections?", 
        type: "yesNo" 
      },
      { 
        name: "externalEvaluation", 
        label: "Any External/Third Party Evaluation?", 
        type: "yesNo" 
      },
      { 
        name: "accreditation", 
        label: "Accreditation/Credibility Assurance?", 
        type: "yesNo" 
      },
      { 
        name: "networkMembership", 
        label: "Part of Local/Professional Network?", 
        type: "yesNo" 
      }
    ]
  }
];

// Initial state generation
const getInitialFormData = () => {
  const data: any = {};
  ngoSteps.forEach((step) =>
    step.fields.forEach((field) => {
      if (field.type === "yesNo" || field.type === "yesNoDocument" || field.type === "yesNoText") {
        data[field.name] = "";
      } else if (field.type === "number") {
        data[field.name] = "";
      } else if (field.type === "date") {
        data[field.name] = undefined;
      } else {
        data[field.name] = "";
      }
      
      // Initialize document fields
      if (field.type === "yesNoDocument") {
        data[`${field.name}File`] = null;
      }
      
      // Initialize text fields for yesNoText
      if (field.type === "yesNoText") {
        data[`${field.name}Text`] = "";
      }
    })
  );
  return data;
};

export function NGOCreationWizard({ open, onOpenChange, onSubmit }: NGOCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData());
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Basic Details", icon: "🏢" },
    { id: 2, title: "Legal & Financial", icon: "📋" },
    { id: 3, title: "Activities & Advocacy", icon: "🎯" },
    { id: 4, title: "Governance & Staffing", icon: "👥" },
    { id: 5, title: "Funding & Outreach", icon: "💰" },
    { id: 6, title: "Monitoring & Evaluation", icon: "📊" },
    { id: 7, title: "Review & Submit", icon: "✅" }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (name: string, file: File | null) => {
    setFormData({ ...formData, [`${name}File`]: file });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Navigate to /ngos when modal is closed
    navigate("/ngos");
  };

  const renderField = (field: any) => {
    // Skip conditional fields if their parent field is not "yes"
    if (field.conditional) {
      const parentField = ngoSteps[currentStep - 1]?.fields.find((f: any) => f.name === field.conditionalField);
      if (parentField && formData[parentField.name] !== "yes") {
        return null;
      }
    }

    switch (field.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input
              id={field.name}
              type="number"
              value={formData[field.name] || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder="0"
              required={field.required}
            />
          </div>
        );

      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData[field.name] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData[field.name] ? format(formData[field.name], "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData[field.name]}
                  onSelect={(date) => handleFieldChange(field.name, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "yesNo":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label} {field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={formData[field.name] || ""} onValueChange={(value) => handleFieldChange(field.name, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "yesNoDocument":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
              <Select value={formData[field.name] || ""} onValueChange={(value) => handleFieldChange(field.name, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData[field.name] === "yes" && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${field.name}File`} className="text-sm">
                      Upload Document
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`${field.name}File`}
                        type="file"
                        onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)}
                        className="text-sm"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {formData[`${field.name}File`] && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {formData[`${field.name}File`].name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "yesNoText":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label} {field.required && <span className="text-destructive">*</span>}
              </Label>
              <Select value={formData[field.name] || ""} onValueChange={(value) => handleFieldChange(field.name, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData[field.name] === "yes" && (
              <div className="space-y-2">
                <Label htmlFor={`${field.name}Text`} className="text-sm">
                  Please specify details
                </Label>
                <Textarea
                  id={`${field.name}Text`}
                  value={formData[`${field.name}Text`] || ""}
                  onChange={(e) => handleFieldChange(`${field.name}Text`, e.target.value)}
                  placeholder="Enter details..."
                  className="min-h-[80px]"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepContent = () => {
    if (currentStep === 7) {
      // Review & Submit step
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Review NGO Details</h3>
            <p className="text-muted-foreground">Review all information before submission</p>
          </div>

          <div className="space-y-4">
            {ngoSteps.map((step, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-lg">{step.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step.fields.map((field) => {
                      // Skip conditional fields if their parent field is not "yes"
                      if (field.conditional) {
                        const parentField = step.fields.find((f: any) => f.name === field.conditionalField);
                        if (parentField && formData[parentField.name] !== "yes") {
                          return null;
                        }
                      }

                      let displayValue = formData[field.name] || "Not provided";
                      
                      if (field.type === "date" && formData[field.name]) {
                        displayValue = format(formData[field.name], "PPP");
                      }
                      
                      if (field.type === "yesNoDocument" && formData[field.name] === "yes") {
                        const file = formData[`${field.name}File`];
                        displayValue = file ? `Yes (File: ${file.name})` : "Yes (no file uploaded)";
                      }
                      
                      if (field.type === "yesNoText" && formData[field.name] === "yes") {
                        const text = formData[`${field.name}Text`];
                        displayValue = text ? `Yes (${text})` : "Yes (no details provided)";
                      }

                      return (
                        <div key={field.name} className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">
                            {field.label}
                          </Label>
                          <p className="text-sm">{displayValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Regular step content
    const stepData = ngoSteps[currentStep - 1];
    if (!stepData) return null;

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">{stepData.label}</h3>
          <p className="text-muted-foreground">
            Step {currentStep} of {ngoSteps.length} - Fill in the required information
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stepData.fields.map((field) => (
            <div key={field.name} className={
              field.type === "yesNoDocument" || field.type === "yesNoText" || field.name === "incomeVsExpenditure" || field.name === "mainObjective" || field.name === "areasOfIntervention" 
                ? "md:col-span-2" : ""
            }>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: "pending_review"
    };
    
    onSubmit(payload);
    
    // Reset form and navigate to /ngos
    setCurrentStep(1);
    setFormData(getInitialFormData());
    navigate("/ngos");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New NGO</DialogTitle>
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
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
              Submit
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