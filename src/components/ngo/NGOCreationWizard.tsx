// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
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
// import {
//   CalendarIcon,
//   ArrowLeft,
//   ArrowRight,
//   CheckCircle,
//   Upload,
//   RefreshCw,
//   XCircle,
//   ExternalLink
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { createNgos, updateNgos } from "@/api/ngo";

// const DOCUMENT_UPLOAD_URL = "https://mumbailocal.org:8089/upload/documents";
// const UPLOAD_FIELD_CANDIDATES = ["documents", "file", "files", "document", "documents[]"];
// const UPLOAD_TIMEOUT_MS = 30000;

// const uploadDocumentTryKeys = async (file: File) => {
//   for (const key of UPLOAD_FIELD_CANDIDATES) {
//     const form = new FormData();
//     form.append(key, file);
//     try {
//       const controller = new AbortController();
//       const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
//       const resp = await fetch(DOCUMENT_UPLOAD_URL, { method: "POST", body: form, signal: controller.signal });
//       clearTimeout(timeout);

//       const text = await resp.text().catch(() => "");
//       let json: any = null;
//       try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }

//       if (resp.ok) {
//         if (json && json.status === 200 && Array.isArray(json.uploadedUrls) && json.uploadedUrls.length > 0) {
//           return { success: true, url: json.uploadedUrls[0], tried: key, responseRaw: json, status: resp.status };
//         }
//         return { success: false, tried: key, responseRaw: json ?? text, status: resp.status, message: "Upload response did not contain uploadedUrls" };
//       } else {
//         const message = json?.message || json?.error || text || `HTTP ${resp.status}`;
//         console.warn(`[upload] tried key='${key}' => HTTP ${resp.status}: ${message}`);
//       }
//     } catch (err: any) {
//       console.warn(`[upload] try key='${key}' network/other error:`, err?.message ?? err);
//     }
//   }

//   return {
//     success: false,
//     tried: UPLOAD_FIELD_CANDIDATES.join(","),
//     message: `All tried field names failed. Tried: ${UPLOAD_FIELD_CANDIDATES.join(", ")}`,
//   };
// };

// // Updated step configuration with proper data types and placeholders
// const ngoSteps = [
//   {
//     label: "Basic Details",
//     fields: [
//       { name: "ngoName", label: "Organization Name", type: "text", required: true, placeholder: "Enter organization name (text)" },
//       { name: "location", label: "Location", type: "text", required: true, placeholder: "Enter location (text)" },
//       { name: "founder", label: "Name of Founder", type: "text", required: true, placeholder: "Enter founder name (text)" },
//       { name: "registrationDetails", label: "Registration Details", type: "text", required: true, placeholder: "Enter registration details (text)" },
//       { name: "registrationDate", label: "Date of Registration", type: "date", required: true },
//       { name: "statutoryDocs", label: "Statutory Documents (FCRA/80G/35AC/12A/CSR)", type: "yesNoDocument", required: true }
//     ]
//   },
//   {
//     label: "Legal & Financial",
//     fields: [
//       { name: "pancard", label: "PAN Card Available", type: "yesNoDocument", required: true },
//       { name: "certificateValidity", label: "Certificate of Exemption Validity", type: "yesNoDocument" },
//       { name: "exemptionDetails", label: "Exemption Details", type: "text", placeholder: "Enter exemption details (text)" },
//       { name: "auditedStatements", label: "Previous Three Years Audited Statements Available", type: "yesNoDocument" },
//       { name: "mou", label: "MOU/MOA/Trust Deed Available", type: "yesNoDocument" },
//       { name: "orgBudget", label: "Organization Budget (Last FY)", type: "number", placeholder: "Enter amount (number)" },
//       { name: "totalExpenses", label: "Total Expenses (Last FY)", type: "number", placeholder: "Enter amount (number)" },
//       { name: "incomeVsExpenditure", label: "Income vs Expenditure (Last 3 Years)", type: "text", placeholder: "Describe income vs expenditure (text)" },
//       { name: "directProgrammeSpend", label: "Spend on Direct Programme Costs (Last FY)", type: "number", placeholder: "Enter amount (number)" },
//       { name: "fixedAssets", label: "Fixed Assets Owned", type: "text", placeholder: "List fixed assets (text)" }
//     ]
//   },
//   {
//     label: "Activities & Advocacy",
//     fields: [
//       { name: "religiousAgenda", label: "Promotes Religious/Spiritual Agenda?", type: "yesNo", conditionalField: "agendaDetails" },
//       { name: "agendaDetails", label: "If Yes, How?", type: "text", conditional: true, placeholder: "Describe religious agenda (text)" },
//       { name: "beneficiaryCaste", label: "Beneficiaries Specific to Any Religion/Caste/Culture?", type: "yesNo" },
//       { name: "politicalNature", label: "Are Activities Political/Religious/Spiritual?", type: "yesNo" },
//       { name: "socialAdvocacy", label: "Addresses Issues of Social Advocacy?", type: "yesNo" },
//       { name: "govtConflict", label: "Activities in Conflict With Govt Rules?", type: "yesNo" },
//       { name: "humanRights", label: "Aligned With Human Rights Principles?", type: "yesNo" },
//       { name: "environmental", label: "Environment Consideration in Programmes?", type: "yesNo" }
//     ]
//   },
//   {
//     label: "Governance & Staffing",
//     fields: [
//       { name: "governingBody", label: "Governing Body/Trustee Involvement?", type: "yesNo" },
//       { name: "governingDetails", label: "Governing Details Available?", type: "yesNo" }, // Boolean field
//       { name: "relatedMembers", label: "Are any Members Related?", type: "yesNo", conditionalField: "relationsSpecify" },
//       { name: "relationsSpecify", label: "Specify Relations", type: "text", conditional: true, placeholder: "Specify member relations (text)" },
//       { name: "meetingFrequency", label: "Frequency of Governing Body Meetings", type: "text", placeholder: "Enter meeting frequency (text)" },
//       { name: "fullTimeEmployees", label: "Full-time Employees (How Many?)", type: "number", placeholder: "Enter number of employees (number)" },
//       { name: "partTimeEmployees", label: "Part-time Employees (How Many?)", type: "number", placeholder: "Enter number of employees (number)" },
//       { name: "skilledStaff", label: "Number of Skilled/Trained Staff", type: "number", placeholder: "Enter number of staff (number)" },
//       { name: "trainedPersonnel", label: "Trained/Experienced Progress Reporting Staff?", type: "yesNo" },
//       { name: "definedRoles", label: "Defined Roles & Responsibilities?", type: "yesNo" },
//       { name: "avgStaffExperience", label: "Average Staff Experience (Years)", type: "number", placeholder: "Enter years (number)" },
//       { name: "staffTraining", label: "Staff Training Details & Frequency", type: "text", placeholder: "Describe staff training (text)" },
//       { name: "volunteerOpportunities", label: "Structured Volunteer Opportunities?", type: "yesNo" }
//     ]
//   },
//   {
//     label: "Funding & Outreach",
//     fields: [
//       { name: "fundingSources", label: "Major Sources of Funding", type: "text", placeholder: "Describe funding sources (text)" },
//       { name: "individualDonors", label: "Individual Donors?", type: "yesNoText" },
//       { name: "corporateFunders", label: "Corporate Funders?", type: "yesNoText" },
//       { name: "govtFunders", label: "Government Funding?", type: "yesNoText" },
//       { name: "otherAgencies", label: "Funding from Agencies/Trusts?", type: "yesNoText" },
//       { name: "otherSources", label: "Other Funding Sources?", type: "yesNoText" },
//       { name: "mainObjective", label: "Main Objective of Organisation/Trust", type: "text", placeholder: "Describe main objective (text)" },
//       { name: "targetedBeneficiaries", label: "Target Beneficiaries (Specify)", type: "text", placeholder: "Describe target beneficiaries (text)" },
//       { name: "percentLowSEB", label: "Percent Beneficiaries from Low Socio-economic Background", type: "number", placeholder: "Enter percentage (number)" },
//       { name: "totalOutReach", label: "Total Outreach (Last FY)", type: "number", placeholder: "Enter number of people (number)" },
//       { name: "costPerBeneficiary", label: "Cost per Beneficiary (Flagship Project)", type: "number", placeholder: "Enter amount (number)" },
//       { name: "areasOfIntervention", label: "Areas of Intervention (Flagship Project)", type: "text", placeholder: "Describe areas of intervention (text)" }
//     ]
//   },
//   {
//     label: "Monitoring & Evaluation",
//     fields: [
//       { name: "monWithinScheduleVII", label: "Within Schedule VII of Companies Act 2013?", type: "yesNo" },
//       { name: "monitoringMethods", label: "Well Defined Monitoring Methods?", type: "yesNo" },
//       { name: "monitoringResponsibility", label: "Any Individual for Monitoring & Mid-term Corrections?", type: "yesNo" },
//       { name: "externalEvaluation", label: "Any External/Third Party Evaluation?", type: "yesNo" },
//       { name: "accreditation", label: "Accreditation/Credibility Assurance?", type: "yesNo" },
//       { name: "networkMembership", label: "Part of Local/Professional Network?", type: "yesNo" }
//     ]
//   }
// ];

// const getInitialFormData = (data?: any) => {
//   const result: any = {};

//   ngoSteps.forEach(step => {
//     step.fields.forEach(field => {
//       const fname = field.name;

//       // Helper to map boolean to "yes"/"no" strings for selects
//       const mapBoolToYesNo = (val: any) => {
//         if (val === true) return "yes";
//         if (val === false) return "no";
//         // If val is already a string "yes"/"no", keep it
//         if (typeof val === "string" && (val === "yes" || val === "no")) return val;
//         // fallback to empty
//         return "";
//       };

//       if (field.type === "yesNoDocument") {
//         // For yesNoDocument: set main boolean as "yes"/"no" and set file URL if present
//         const booleanVal = data?.[fname];
//         result[fname] = mapBoolToYesNo(booleanVal);
//         // attempt to pick file url from either `${fname}File` or similar key
//         result[`${fname}File`] = data?.[`${fname}File`] ?? data?.[`${fname}file`] ?? null;
//       } else if (field.type === "yesNoText") {
//         // For yesNoText: set boolean as "yes"/"no", and set details field mapping
//         const booleanVal = data?.[fname];
//         result[fname] = mapBoolToYesNo(booleanVal);

//         const detailsFieldName = fname === "individualDonors" ? "individualDonorsDetails" :
//                                 fname === "corporateFunders" ? "corporateFunderDetails" :
//                                 fname === "govtFunders" ? "govtFundersDetails" :
//                                 fname === "otherAgencies" ? "otherAgenciesDetails" :
//                                 fname === "otherSources" ? "otherSourcesDetails" : `${fname}Text`;
//         result[detailsFieldName] = data?.[detailsFieldName] ?? "";
//       } else if (field.type === "date") {
//         // Convert date strings to Date objects when possible
//         const val = data?.[fname];
//         if (val) {
//           try {
//             result[fname] = new Date(val);
//           } catch (e) {
//             result[fname] = undefined;
//           }
//         } else {
//           result[fname] = undefined;
//         }
//       } else if (field.type === "number") {
//         const val = data?.[fname];
//         // Keep numbers as numbers; if undefined, set empty to avoid uncontrolled inputs
//         result[fname] = (val === null || val === undefined) ? "" : Number(val);
//       } else if (field.type === "yesNo") {
//         // Simple yesNo fields mapped from boolean to "yes"/"no"
//         const booleanVal = data?.[fname];
//         result[fname] = mapBoolToYesNo(booleanVal);
//       } else {
//         // default text / other fields
//         result[fname] = data?.[fname] ?? "";
//       }
//     });
//   });

//   return result;
// };

// export function NGOCreationWizard({ open, onOpenChange, onSubmit, initialData, ngoId }: any) {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState(() => getInitialFormData(initialData));
//   const [uploadStatuses, setUploadStatuses] = useState<Record<string, "idle" | "uploading" | "success" | "error">>({});
//   const [uploadDebug, setUploadDebug] = useState<Record<string, any>>({});
//   const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     setFormData(getInitialFormData(initialData));
//     setUploadStatuses({});
//     setUploadDebug({});
//     setSelectedFiles({});
//     setCurrentStep(1);
//   }, [initialData, open]);

//   const handleFieldChange = (name: string, value: any) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = async (fieldName: string, file: File | null) => {
//     const fileKey = `${fieldName}File`;
//     setSelectedFiles(prev => ({ ...prev, [fieldName]: file }));
//     setUploadStatuses(prev => ({ ...prev, [fieldName]: file ? "uploading" : "idle" }));
//     setUploadDebug(prev => ({ ...prev, [fieldName]: undefined }));

//     if (!file) {
//       handleFieldChange(fileKey, null);
//       return;
//     }

//     const res = await uploadDocumentTryKeys(file);

//     if (res.success) {
//       handleFieldChange(fileKey, res.url);
//       setUploadStatuses(prev => ({ ...prev, [fieldName]: "success" }));
//       setUploadDebug(prev => ({ ...prev, [fieldName]: res }));
//     } else {
//       handleFieldChange(fileKey, null);
//       setUploadStatuses(prev => ({ ...prev, [fieldName]: "error" }));
//       setUploadDebug(prev => ({ ...prev, [fieldName]: res }));
//     }
//   };

//   const handleRetry = async (fieldName: string) => {
//     const file = selectedFiles[fieldName];
//     if (!file) return alert("No file to retry — reselect the file then click retry.");
//     await handleFileChange(fieldName, file);
//   };

//   const renderField = (field: any) => {
//     if (field.conditional) {
//       const parent: any = ngoSteps.flatMap((s: any) => s.fields).find((f: any) => f.name === field.conditionalField);
//       if (parent && formData[parent.name] !== "yes") return null;
//     }

//     switch (field.type) {
//       case "text":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={field.name}>
//               {field.label}{field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Input 
//               id={field.name} 
//               value={formData[field.name] ?? ""} 
//               onChange={(e) => handleFieldChange(field.name, e.target.value)} 
//               placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
//             />
//           </div>
//         );

//       case "number":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={field.name}>{field.label}</Label>
//             <Input 
//               id={field.name} 
//               type="number" 
//               value={formData[field.name] === null || formData[field.name] === undefined ? "" : formData[field.name]} 
//               onChange={(e) => handleFieldChange(field.name, e.target.value === "" ? "" : Number(e.target.value))} 
//               placeholder={field.placeholder || "Enter number"}
//               step="any"
//             />
//             <p className="text-xs text-muted-foreground">Enter numeric value</p>
//           </div>
//         );

//       case "date":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={field.name}>
//               {field.label}{field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData[field.name] && "text-muted-foreground")}>
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {formData[field.name] ? format(formData[field.name], "PPP") : "Select date"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar mode="single" selected={formData[field.name]} onSelect={(d) => handleFieldChange(field.name, d)} initialFocus />
//               </PopoverContent>
//             </Popover>
//           </div>
//         );

//       case "yesNo":
//         return (
//           <div className="space-y-2">
//             <Label htmlFor={field.name}>
//               {field.label}{field.required && <span className="text-destructive">*</span>}
//             </Label>
//             <Select value={formData[field.name] || ""} onValueChange={(v) => handleFieldChange(field.name, v)}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Yes or No" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="yes">Yes</SelectItem>
//                 <SelectItem value="no">No</SelectItem>
//               </SelectContent>
//             </Select>
//             <p className="text-xs text-muted-foreground">Select Yes or No (will be converted to true/false)</p>
//           </div>
//         );

//       case "yesNoText": {
//         // Map to correct field names from Java entity
//         const detailsFieldName = field.name === "individualDonors" ? "individualDonorsDetails" :
//                                 field.name === "corporateFunders" ? "corporateFunderDetails" :
//                                 field.name === "govtFunders" ? "govtFundersDetails" :
//                                 field.name === "otherAgencies" ? "otherAgenciesDetails" :
//                                 field.name === "otherSources" ? "otherSourcesDetails" : `${field.name}Text`;
        
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor={field.name}>{field.label}</Label>
//               <Select value={formData[field.name] || ""} onValueChange={(v) => handleFieldChange(field.name, v)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Yes or No" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="yes">Yes</SelectItem>
//                   <SelectItem value="no">No</SelectItem>
//                 </SelectContent>
//               </Select>
//               <p className="text-xs text-muted-foreground">Select Yes or No (will be converted to true/false)</p>
//             </div>
//             {formData[field.name] === "yes" && (
//               <div>
//                 <Label htmlFor={detailsFieldName} className="text-sm">Please specify details</Label>
//                 <Textarea 
//                   id={detailsFieldName} 
//                   value={formData[detailsFieldName] || ""} 
//                   onChange={(e) => handleFieldChange(detailsFieldName, e.target.value)} 
//                   className="min-h-[80px]" 
//                   placeholder="Enter details (text)"
//                 />
//               </div>
//             )}
//           </div>
//         );
//       }

//       case "yesNoDocument": {
//         const fileKey = `${field.name}File`;
//         const status = uploadStatuses[field.name] || "idle";
//         const debug = uploadDebug[field.name];
//         const uploadedUrl = formData[fileKey] ?? null;

//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor={field.name}>
//                 {field.label}{field.required && <span className="text-destructive">*</span>}
//               </Label>
//               <Select value={formData[field.name] || ""} onValueChange={(v) => handleFieldChange(field.name, v)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Yes or No" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="yes">Yes</SelectItem>
//                   <SelectItem value="no">No</SelectItem>
//                 </SelectContent>
//               </Select>
//               <p className="text-xs text-muted-foreground">Select Yes or No (will be converted to true/false)</p>
//             </div>

//             {formData[field.name] === "yes" && (
//               <Card className="bg-muted/50">
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <Label htmlFor={fileKey} className="text-sm">Upload Document</Label>
//                     <div className="flex items-center gap-2">
//                       <Input 
//                         id={fileKey} 
//                         type="file" 
//                         onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)} 
//                         disabled={status === "uploading"} 
//                         className="text-sm" 
//                       />
//                       <Upload className="h-4 w-4 text-muted-foreground" />
//                     </div>

//                     {status === "uploading" && (
//                       <p className="text-sm text-primary flex items-center gap-1">
//                         <RefreshCw className="h-3 w-3 animate-spin" /> Uploading...
//                       </p>
//                     )}

//                     {status === "success" && uploadedUrl && (
//                       <p className="text-sm text-green-600 flex items-center gap-2">
//                         <CheckCircle className="h-3 w-3" /> Uploaded:
//                         <a href={uploadedUrl} target="_blank" rel="noreferrer" className="underline ml-1 flex items-center gap-1">
//                           {uploadedUrl.split("/").pop() || uploadedUrl}<ExternalLink className="h-3 w-3" />
//                         </a>
//                       </p>
//                     )}

//                     {status === "error" && (
//                       <div className="space-y-2">
//                         <p className="text-sm text-red-600 flex items-center gap-1">
//                           <XCircle className="h-3 w-3" /> Upload failed: {debug?.message ?? "Bad Request"}
//                         </p>
//                         <div className="flex gap-2">
//                           <Button size="sm" onClick={() => handleRetry(field.name)} disabled={!selectedFiles[field.name]}>Retry</Button>
//                           <Button size="sm" variant="outline" onClick={() => {
//                             setSelectedFiles(prev => ({ ...prev, [field.name]: null }));
//                             setUploadStatuses(prev => ({ ...prev, [field.name]: "idle" }));
//                             setUploadDebug(prev => ({ ...prev, [field.name]: undefined }));
//                             handleFieldChange(fileKey, null);
//                           }}>Remove</Button>
//                         </div>

//                         {debug?.responseRaw && (
//                           <pre className="text-xs bg-black/5 p-2 rounded max-h-36 overflow-auto">
//                             {typeof debug.responseRaw === "string" ? debug.responseRaw.slice(0, 2000) : JSON.stringify(debug.responseRaw, null, 2)}
//                           </pre>
//                         )}
//                       </div>
//                     )}

//                     {uploadDebug[field.name] && uploadDebug[field.name].tried && (
//                       <p className="text-xs text-muted-foreground">Tried field name(s): {uploadDebug[field.name].tried}</p>
//                     )}

//                     {status !== "uploading" && !uploadedUrl && formData[fileKey] && (
//                       <p className="text-sm text-muted-foreground">
//                         Existing file: <a href={formData[fileKey]} target="_blank" rel="noreferrer" className="underline">{formData[fileKey].split("/").pop()}</a>
//                       </p>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         );
//       }

//       default:
//         return null;
//     }
//   };

//   // Build final payload with correct data type conversion
//   const buildFinalNgoPayload = () => {
//     const finalPayload: any = {};
    
//     ngoSteps.flatMap((s: any) => s.fields).forEach((f: any) => {
//       let val = formData[f.name];
      
//       // Convert yes/no strings to boolean for Java entity
//       if (f.type === "yesNo" || f.type === "yesNoDocument") {
//         val = val === "yes" ? true : val === "no" ? false : val;
//       }
      
//       // Convert yesNoText fields to boolean
//       if (f.type === "yesNoText") {
//         val = val === "yes" ? true : val === "no" ? false : val;
//       }
      
//       // Convert number fields from string to number
//       if (f.type === "number" && val !== "" && val !== null && val !== undefined) {
//         val = Number(val);
//       }
      
//       finalPayload[f.name] = val;
      
//       // Handle file fields
//       if (f.type === "yesNoDocument") {
//         finalPayload[`${f.name}File`] = formData[`${f.name}File`];
//       }
      
//       // Handle details fields for yesNoText types
//       if (f.type === "yesNoText") {
//         const detailsFieldName = f.name === "individualDonors" ? "individualDonorsDetails" :
//                                 f.name === "corporateFunders" ? "corporateFunderDetails" :
//                                 f.name === "govtFunders" ? "govtFundersDetails" :
//                                 f.name === "otherAgencies" ? "otherAgenciesDetails" :
//                                 f.name === "otherSources" ? "otherSourcesDetails" : `${f.name}Text`;
//         finalPayload[detailsFieldName] = formData[detailsFieldName];
//       }
//     });
    
//     return finalPayload;
//   };

//   const handleSubmit = async () => {
//     if (Object.values(uploadStatuses).includes("uploading")) {
//       alert("Please wait for all uploads to finish before submitting.");
//       return;
//     }

//     const payload = buildFinalNgoPayload();
//     console.log("[NGO Submit] Final payload:", payload);

//     // Validate required fields
//     const requiredFields = ngoSteps.flatMap(step => 
//       step.fields.filter((field: any) => field.required).map((field: any) => field.name)
//     );
    
//     const missingFields = requiredFields.filter(field => 
//       !payload[field] || payload[field] === ""
//     );

//     if (missingFields.length > 0) {
//       alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       if (ngoId) {
//         await updateNgos(ngoId, payload);
//       } else {
//         await createNgos(payload);
//       }
//       onSubmit?.(payload);
//       setFormData(getInitialFormData({}));
//       setUploadStatuses({});
//       setUploadDebug({});
//       setSelectedFiles({});
//       navigate("/ngos");
//       onOpenChange(false);
//     } catch (err: any) {
//       console.error("[NGO Submit] Error:", err);
//       alert(`Submission failed: ${err?.message ?? "unknown error"}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const totalSteps = ngoSteps.length + 1;
//   const steps = ngoSteps.map((s, i) => ({
//     id: i + 1,
//     title: s.label,
//     icon: ["🏢", "📋", "🎯", "👥", "💰", "📊"][i] ?? (i + 1).toString(),
//   }));
//   steps.push({ id: totalSteps, title: "Review & Submit", icon: "✅" });

//   const renderStepContent = () => {
//     if (currentStep === totalSteps) {
//       return (
//         <div className="space-y-6">
//           <div className="text-center mb-6">
//             <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">Review NGO Details</h3>
//             <p className="text-muted-foreground">Review all information before submission</p>
//           </div>

//           <div className="space-y-4">
//             {ngoSteps.map((step, idx) => (
//               <Card key={idx}>
//                 <CardHeader>
//                   <CardTitle className="text-lg">{step.label}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {step.fields.map((field: any) => {
//                       const parentField = step.fields.find((f: any) => f.name === field.conditionalField);
//                       if (field.conditional && parentField && formData[parentField.name] !== "yes") {
//                         return null;
//                       }

//                       let displayValue: any = formData[field.name] ?? "Not provided";

//                       if (field.type === "date" && formData[field.name]) {
//                         displayValue = format(formData[field.name], "PPP");
//                       }

//                       if (field.type === "yesNoDocument" && formData[field.name] === "yes") {
//                         const file = formData[`${field.name}File`];
//                         if (file) {
//                           if (typeof file === "string") {
//                             displayValue = `Yes (File: ${file.split("/").pop()})`;
//                           } else if ((file as any).name) {
//                             displayValue = `Yes (File: ${(file as any).name})`;
//                           } else {
//                             displayValue = `Yes (File present)`;
//                           }
//                         } else {
//                           displayValue = "Yes (no file uploaded)";
//                         }
//                       }

//                       if (field.type === "yesNoText" && formData[field.name] === "yes") {
//                         const detailsFieldName = field.name === "individualDonors" ? "individualDonorsDetails" :
//                                                 field.name === "corporateFunders" ? "corporateFunderDetails" :
//                                                 field.name === "govtFunders" ? "govtFundersDetails" :
//                                                 field.name === "otherAgencies" ? "otherAgenciesDetails" :
//                                                 field.name === "otherSources" ? "otherSourcesDetails" : `${field.name}Text`;
//                         const text = formData[detailsFieldName];
//                         displayValue = text ? `Yes (${text})` : "Yes (no details provided)";
//                       }

//                       if ((field.type === "yesNo" || field.type === "yesNoDocument" || field.type === "yesNoText") && (formData[field.name] === "yes" || formData[field.name] === "no")) {
//                         if (!(field.type === "yesNoDocument" && formData[field.name] === "yes")) {
//                           displayValue = formData[field.name] === "yes" ? "Yes" : "No";
//                         }
//                       }

//                       if (displayValue === "" || displayValue === undefined || displayValue === null) {
//                         displayValue = "Not provided";
//                       }

//                       return (
//                         <div key={field.name} className="space-y-1">
//                           <Label className="text-sm font-medium text-muted-foreground">
//                             {field.label}
//                           </Label>
//                           <p className="text-sm">{displayValue}</p>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     const stepData = ngoSteps[currentStep - 1];
//     if (!stepData) return null;

//     return (
//       <div className="space-y-6">
//         <div className="text-center mb-6">
//           <h3 className="text-lg font-semibold mb-2">{stepData.label}</h3>
//           <p className="text-muted-foreground">
//             Step {currentStep} of {totalSteps} - Fill in the required information
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {stepData.fields.map((field) => (
//             <div key={field.name} className={
//               field.type === "yesNoDocument" || field.type === "yesNoText" || field.name === "incomeVsExpenditure" || field.name === "mainObjective" || field.name === "areasOfIntervention" 
//                 ? "md:col-span-2" : ""
//             }>
//               {renderField(field)}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <Dialog open={open} onOpenChange={() => { onOpenChange(false); navigate("/ngos"); }}>
//       <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{ngoId ? "Edit NGO Details" : "Register New NGO"}</DialogTitle>
//         </DialogHeader>

//         <div className="flex justify-between mb-8">
//           {steps.map((s) => (
//             <div key={s.id} className={cn("flex flex-col items-center space-y-2", currentStep >= s.id ? "text-primary" : "text-muted-foreground")}>
//               <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium", currentStep >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
//                 <span className="text-lg leading-none">{s.icon}</span>
//               </div>
//               <span className="text-xs text-center">{s.title}</span>
//             </div>
//           ))}
//         </div>

//         <div className="min-h-[400px]">
//           {renderStepContent()}
//         </div>

//         <div className="flex justify-between pt-6 border-t">
//           <Button
//             variant="outline"
//             onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
//             disabled={currentStep === 1 || isSubmitting}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" /> Previous
//           </Button>

//           {currentStep === totalSteps ? (
//             <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
//               {isSubmitting ? (ngoId ? "Updating..." : "Submitting...") : (ngoId ? "Update" : "Submit")}
//             </Button>
//           ) : (
//             <Button onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))} disabled={isSubmitting}>
//               Next
//               <ArrowRight className="h-4 w-4 ml-2" />
//             </Button>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default NGOCreationWizard;


/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
import {
  CalendarIcon,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Upload,
  RefreshCw,
  XCircle,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createNgos, updateNgos } from "@/api/ngo";

const DOCUMENT_UPLOAD_URL = "https://mumbailocal.org:8089/upload/documents";
const UPLOAD_FIELD_CANDIDATES = ["documents", "file", "files", "document", "documents[]"];
const UPLOAD_TIMEOUT_MS = 30000;

const uploadDocumentTryKeys = async (file: File) => {
  for (const key of UPLOAD_FIELD_CANDIDATES) {
    const form = new FormData();
    form.append(key, file);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
      const resp = await fetch(DOCUMENT_UPLOAD_URL, { method: "POST", body: form, signal: controller.signal });
      clearTimeout(timeout);

      const text = await resp.text().catch(() => "");
      let json: any = null;
      try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }

      if (resp.ok) {
        if (json && json.status === 200 && Array.isArray(json.uploadedUrls) && json.uploadedUrls.length > 0) {
          return { success: true, url: json.uploadedUrls[0], tried: key, responseRaw: json, status: resp.status };
        }
        return { success: false, tried: key, responseRaw: json ?? text, status: resp.status, message: "Upload response did not contain uploadedUrls" };
      } else {
        const message = json?.message || json?.error || text || `HTTP ${resp.status}`;
        console.warn(`[upload] tried key='${key}' => HTTP ${resp.status}: ${message}`);
      }
    } catch (err: any) {
      console.warn(`[upload] try key='${key}' network/other error:`, err?.message ?? err);
    }
  }

  return {
    success: false,
    tried: UPLOAD_FIELD_CANDIDATES.join(","),
    message: `All tried field names failed. Tried: ${UPLOAD_FIELD_CANDIDATES.join(", ")}`,
  };
};

// Updated step configuration with proper data types and placeholders
const ngoSteps = [
  {
    label: "Basic Details",
    fields: [
      { name: "ngoName", label: "Organization Name", type: "text", required: true, placeholder: "Enter organization name (text)" },
      { name: "location", label: "Location", type: "text", required: true, placeholder: "Enter location (text)" },
      { name: "founder", label: "Name of Founder", type: "text", required: true, placeholder: "Enter founder name (text)" },
      { name: "registrationDetails", label: "Registration Details", type: "text", required: true, placeholder: "Enter registration details (text)" },
      { name: "registrationDate", label: "Date of Registration", type: "date", required: true },
      { name: "statutoryDocs", label: "Statutory Documents (FCRA/80G/35AC/12A/CSR)", type: "yesNoDocument", required: true }
    ]
  },
  {
    label: "Legal & Financial",
    fields: [
      { name: "pancard", label: "PAN Card Available", type: "yesNoDocument", required: true },
      { name: "certificateValidity", label: "Certificate of Exemption Validity", type: "yesNoDocument" },
      { name: "exemptionDetails", label: "Exemption Details", type: "text", placeholder: "Enter exemption details (text)" },
      { name: "auditedStatements", label: "Previous Three Years Audited Statements Available", type: "yesNoDocument" },
      { name: "mou", label: "MOU/MOA/Trust Deed Available", type: "yesNoDocument" },
      { name: "orgBudget", label: "Organization Budget (Last FY)", type: "number", placeholder: "Enter amount (number)" },
      { name: "totalExpenses", label: "Total Expenses (Last FY)", type: "number", placeholder: "Enter amount (number)" },
      { name: "incomeVsExpenditure", label: "Income vs Expenditure (Last 3 Years)", type: "text", placeholder: "Describe income vs expenditure (text)" },
      { name: "directProgrammeSpend", label: "Spend on Direct Programme Costs (Last FY)", type: "number", placeholder: "Enter amount (number)" },
      { name: "fixedAssets", label: "Fixed Assets Owned", type: "text", placeholder: "List fixed assets (text)" }
    ]
  },
  {
    label: "Activities & Advocacy",
    fields: [
      { name: "religiousAgenda", label: "Promotes Religious/Spiritual Agenda?", type: "yesNo", conditionalField: "agendaDetails" },
      { name: "agendaDetails", label: "If Yes, How?", type: "text", conditional: true, placeholder: "Describe religious agenda (text)" },
      { name: "beneficiaryCaste", label: "Beneficiaries Specific to Any Religion/Caste/Culture?", type: "yesNo" },
      { name: "politicalNature", label: "Are Activities Political/Religious/Spiritual?", type: "yesNo" },
      { name: "socialAdvocacy", label: "Addresses Issues of Social Advocacy?", type: "yesNo" },
      { name: "govtConflict", label: "Activities in Conflict With Govt Rules?", type: "yesNo" },
      { name: "humanRights", label: "Aligned With Human Rights Principles?", type: "yesNo" },
      { name: "environmental", label: "Environment Consideration in Programmes?", type: "yesNo" }
    ]
  },
  {
    label: "Governance & Staffing",
    fields: [
      { name: "governingBody", label: "Governing Body/Trustee Involvement?", type: "yesNo" },
      { name: "governingDetails", label: "Governing Details Available?", type: "yesNo" }, // Boolean field
      { name: "relatedMembers", label: "Are any Members Related?", type: "yesNo", conditionalField: "relationsSpecify" },
      { name: "relationsSpecify", label: "Specify Relations", type: "text", conditional: true, placeholder: "Specify member relations (text)" },
      { name: "meetingFrequency", label: "Frequency of Governing Body Meetings", type: "text", placeholder: "Enter meeting frequency (text)" },
      { name: "fullTimeEmployees", label: "Full-time Employees (How Many?)", type: "number", placeholder: "Enter number of employees (number)" },
      { name: "partTimeEmployees", label: "Part-time Employees (How Many?)", type: "number", placeholder: "Enter number of employees (number)" },
      { name: "skilledStaff", label: "Number of Skilled/Trained Staff", type: "number", placeholder: "Enter number of staff (number)" },
      { name: "trainedPersonnel", label: "Trained/Experienced Progress Reporting Staff?", type: "yesNo" },
      { name: "definedRoles", label: "Defined Roles & Responsibilities?", type: "yesNo" },
      { name: "avgStaffExperience", label: "Average Staff Experience (Years)", type: "number", placeholder: "Enter years (number)" },
      { name: "staffTraining", label: "Staff Training Details & Frequency", type: "text", placeholder: "Describe staff training (text)" },
      { name: "volunteerOpportunities", label: "Structured Volunteer Opportunities?", type: "yesNo" }
    ]
  },
  {
    label: "Funding & Outreach",
    fields: [
      { name: "fundingSources", label: "Major Sources of Funding", type: "text", placeholder: "Describe funding sources (text)" },
      { name: "individualDonors", label: "Individual Donors?", type: "yesNoText" },
      { name: "corporateFunders", label: "Corporate Funders?", type: "yesNoText" },
      { name: "govtFunders", label: "Government Funding?", type: "yesNoText" },
      { name: "otherAgencies", label: "Funding from Agencies/Trusts?", type: "yesNoText" },
      { name: "otherSources", label: "Other Funding Sources?", type: "yesNoText" },
      { name: "mainObjective", label: "Main Objective of Organisation/Trust", type: "text", placeholder: "Describe main objective (text)" },
      { name: "targetedBeneficiaries", label: "Target Beneficiaries (Specify)", type: "text", placeholder: "Describe target beneficiaries (text)" },
      { name: "percentLowSEB", label: "Percent Beneficiaries from Low Socio-economic Background", type: "number", placeholder: "Enter percentage (number)" },
      { name: "totalOutReach", label: "Total Outreach (Last FY)", type: "number", placeholder: "Enter number of people (number)" },
      { name: "costPerBeneficiary", label: "Cost per Beneficiary (Flagship Project)", type: "number", placeholder: "Enter amount (number)" },
      { name: "areasOfIntervention", label: "Areas of Intervention (Flagship Project)", type: "text", placeholder: "Describe areas of intervention (text)" }
    ]
  },
  {
    label: "Monitoring & Evaluation",
    fields: [
      // { name: "monWithinScheduleVII", label: "Within Schedule VII of Companies Act 2013?", type: "yesNo" },
      // { name: "monitoringMethods", label: "Well Defined Monitoring Methods?", type: "yesNo" },
      // { name: "monitoringResponsibility", label: "Any Individual for Monitoring & Mid-term Corrections?", type: "yesNo" },
      { name: "externalEvaluation", label: "Any External/Third Party Evaluation?", type: "yesNoDocument" },
      // { name: "accreditation", label: "Accreditation/Credibility Assurance?", type: "yesNo" },
      // { name: "networkMembership", label: "Part of Local/Professional Network?", type: "yesNo" }
    ]
  }
];

const getInitialFormData = (data?: any) => {
  const result: any = {};

  ngoSteps.forEach(step => {
    step.fields.forEach(field => {
      const fname = field.name;

      // Helper to map boolean to "yes"/"no" strings for selects
      const mapBoolToYesNo = (val: any) => {
        if (val === true) return "yes";
        if (val === false) return "no";
        // If val is already a string "yes"/"no", keep it
        if (typeof val === "string" && (val === "yes" || val === "no")) return val;
        // fallback to empty
        return "";
      };

      if (field.type === "yesNoDocument") {
        // For yesNoDocument: set main boolean as "yes"/"no" and set file URL if present
        const booleanVal = data?.[fname];
        result[fname] = mapBoolToYesNo(booleanVal);
        // attempt to pick file url from either `${fname}File` or similar key
        result[`${fname}File`] = data?.[`${fname}File`] ?? data?.[`${fname}file`] ?? null;
      } else if (field.type === "yesNoText") {
        // For yesNoText: set boolean as "yes"/"no", and set details field mapping
        const booleanVal = data?.[fname];
        result[fname] = mapBoolToYesNo(booleanVal);

        const detailsFieldName = fname === "individualDonors" ? "individualDonorsDetails" :
                                fname === "corporateFunders" ? "corporateFunderDetails" :
                                fname === "govtFunders" ? "govtFundersDetails" :
                                fname === "otherAgencies" ? "otherAgenciesDetails" :
                                fname === "otherSources" ? "otherSourcesDetails" : `${fname}Text`;
        result[detailsFieldName] = data?.[detailsFieldName] ?? "";
      } else if (field.type === "date") {
        // Convert date strings to Date objects when possible
        const val = data?.[fname];
        if (val) {
          try {
            result[fname] = new Date(val);
          } catch (e) {
            result[fname] = undefined;
          }
        } else {
          result[fname] = undefined;
        }
      } else if (field.type === "number") {
        const val = data?.[fname];
        // Keep numbers as numbers; if undefined, set empty to avoid uncontrolled inputs
        result[fname] = (val === null || val === undefined) ? "" : Number(val);
      } else if (field.type === "yesNo") {
        // Simple yesNo fields mapped from boolean to "yes"/"no"
        const booleanVal = data?.[fname];
        result[fname] = mapBoolToYesNo(booleanVal);
      } else {
        // default text / other fields
        result[fname] = data?.[fname] ?? "";
      }
    });
  });

  return result;
};

export function NGOCreationWizard({ open, onOpenChange, onSubmit, initialData, ngoId }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => getInitialFormData(initialData));
  const [uploadStatuses, setUploadStatuses] = useState<Record<string, "idle" | "uploading" | "success" | "error">>({});
  const [uploadDebug, setUploadDebug] = useState<Record<string, any>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setFormData(getInitialFormData(initialData));
    setUploadStatuses({});
    setUploadDebug({});
    setSelectedFiles({});
    setCurrentStep(1);
  }, [initialData, open]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (fieldName: string, file: File | null) => {
    const fileKey = `${fieldName}File`;
    setSelectedFiles(prev => ({ ...prev, [fieldName]: file }));
    setUploadStatuses(prev => ({ ...prev, [fieldName]: file ? "uploading" : "idle" }));
    setUploadDebug(prev => ({ ...prev, [fieldName]: undefined }));

    if (!file) {
      handleFieldChange(fileKey, null);
      return;
    }

    const res = await uploadDocumentTryKeys(file);

    if (res.success) {
      handleFieldChange(fileKey, res.url);
      setUploadStatuses(prev => ({ ...prev, [fieldName]: "success" }));
      setUploadDebug(prev => ({ ...prev, [fieldName]: res }));
    } else {
      handleFieldChange(fileKey, null);
      setUploadStatuses(prev => ({ ...prev, [fieldName]: "error" }));
      setUploadDebug(prev => ({ ...prev, [fieldName]: res }));
    }
  };

  const handleRetry = async (fieldName: string) => {
    const file = selectedFiles[fieldName];
    if (!file) return alert("No file to retry — reselect the file then click retry.");
    await handleFileChange(fieldName, file);
  };

  const renderField = (field: any) => {
    if (field.conditional) {
      const parent: any = ngoSteps.flatMap((s: any) => s.fields).find((f: any) => f.name === field.conditionalField);
      if (parent && formData[parent.name] !== "yes") return null;
    }

    switch (field.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}{field.required && <span className="text-destructive">*</span>}
            </Label>
            <Input 
              id={field.name} 
              value={formData[field.name] ?? ""} 
              onChange={(e) => handleFieldChange(field.name, e.target.value)} 
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input 
              id={field.name} 
              type="number" 
              value={formData[field.name] === null || formData[field.name] === undefined ? "" : formData[field.name]} 
              onChange={(e) => handleFieldChange(field.name, e.target.value === "" ? "" : Number(e.target.value))} 
              placeholder={field.placeholder || "Enter number"}
              step="any"
            />
            <p className="text-xs text-muted-foreground">Enter numeric value</p>
          </div>
        );

      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}{field.required && <span className="text-destructive">*</span>}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData[field.name] && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData[field.name] ? format(formData[field.name], "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={formData[field.name]} onSelect={(d) => handleFieldChange(field.name, d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "yesNo":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}{field.required && <span className="text-destructive">*</span>}
            </Label>
            <Select value={formData[field.name] || ""} onValueChange={(v) => handleFieldChange(field.name, v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Select Yes or No (will be converted to true/false)</p>
          </div>
        );

      case "yesNoText": {
        // Map to correct field names from Java entity
        const detailsFieldName = field.name === "individualDonors" ? "individualDonorsDetails" :
                                field.name === "corporateFunders" ? "corporateFunderDetails" :
                                field.name === "govtFunders" ? "govtFundersDetails" :
                                field.name === "otherAgencies" ? "otherAgenciesDetails" :
                                field.name === "otherSources" ? "otherSourcesDetails" : `${field.name}Text`;
        
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Select value={formData[field.name] || ""} onValueChange={(v) => handleFieldChange(field.name, v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes or No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select Yes or No (will be converted to true/false)</p>
            </div>
            {formData[field.name] === "yes" && (
              <div>
                <Label htmlFor={detailsFieldName} className="text-sm">Please specify details</Label>
                <Textarea 
                  id={detailsFieldName} 
                  value={formData[detailsFieldName] || ""} 
                  onChange={(e) => handleFieldChange(detailsFieldName, e.target.value)} 
                  className="min-h-[80px]" 
                  placeholder="Enter details (text)"
                />
              </div>
            )}
          </div>
        );
      }

      case "yesNoDocument": {
        const fileKey = `${field.name}File`;
        const status = uploadStatuses[field.name] || "idle";
        const debug = uploadDebug[field.name];
        const uploadedUrl = formData[fileKey] ?? null;

        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}{field.required && <span className="text-destructive">*</span>}
              </Label>
              <Select value={formData[field.name] || ""} onValueChange={(v) => handleFieldChange(field.name, v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Yes or No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Select Yes or No (will be converted to true/false)</p>
            </div>

            {formData[field.name] === "yes" && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor={fileKey} className="text-sm">Upload Document</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id={fileKey} 
                        type="file" 
                        onChange={(e) => handleFileChange(field.name, e.target.files?.[0] || null)} 
                        disabled={status === "uploading"} 
                        className="text-sm" 
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {status === "uploading" && (
                      <p className="text-sm text-primary flex items-center gap-1">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Uploading...
                      </p>
                    )}

                    {status === "success" && uploadedUrl && (
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle className="h-3 w-3" /> Uploaded:
                        <a href={uploadedUrl} target="_blank" rel="noreferrer" className="underline ml-1 flex items-center gap-1">
                          {uploadedUrl.split("/").pop() || uploadedUrl}<ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    )}

                    {status === "error" && (
                      <div className="space-y-2">
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Upload failed: {debug?.message ?? "Bad Request"}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRetry(field.name)} disabled={!selectedFiles[field.name]}>Retry</Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setSelectedFiles(prev => ({ ...prev, [field.name]: null }));
                            setUploadStatuses(prev => ({ ...prev, [field.name]: "idle" }));
                            setUploadDebug(prev => ({ ...prev, [field.name]: undefined }));
                            handleFieldChange(fileKey, null);
                          }}>Remove</Button>
                        </div>

                        {debug?.responseRaw && (
                          <pre className="text-xs bg-black/5 p-2 rounded max-h-36 overflow-auto">
                            {typeof debug.responseRaw === "string" ? debug.responseRaw.slice(0, 2000) : JSON.stringify(debug.responseRaw, null, 2)}
                          </pre>
                        )}
                      </div>
                    )}

                    {uploadDebug[field.name] && uploadDebug[field.name].tried && (
                      <p className="text-xs text-muted-foreground">Tried field name(s): {uploadDebug[field.name].tried}</p>
                    )}

                    {formData[fileKey] && (
                      <p className="text-sm text-muted-foreground">
                        Existing file: <a href={formData[fileKey]} target="_blank" rel="noreferrer" className="underline flex items-center gap-1">
                          {String(formData[fileKey]).split("/").pop()} <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      }

      default:
        return null;
    }
  };

  // Build final payload with correct data type conversion
  const buildFinalNgoPayload = () => {
    const finalPayload: any = {};
    
    ngoSteps.flatMap((s: any) => s.fields).forEach((f: any) => {
      let val = formData[f.name];
      
      // Convert yes/no strings to boolean for Java entity
      if (f.type === "yesNo" || f.type === "yesNoDocument") {
        val = val === "yes" ? true : val === "no" ? false : val;
      }
      
      // Convert yesNoText fields to boolean
      if (f.type === "yesNoText") {
        val = val === "yes" ? true : val === "no" ? false : val;
      }
      
      // Convert number fields from string to number
      if (f.type === "number" && val !== "" && val !== null && val !== undefined) {
        val = Number(val);
      }
      
      finalPayload[f.name] = val;
      
      // Handle file fields
      if (f.type === "yesNoDocument") {
        finalPayload[`${f.name}File`] = formData[`${f.name}File`];
      }
      
      // Handle details fields for yesNoText types
      if (f.type === "yesNoText") {
        const detailsFieldName = f.name === "individualDonors" ? "individualDonorsDetails" :
                                f.name === "corporateFunders" ? "corporateFunderDetails" :
                                f.name === "govtFunders" ? "govtFundersDetails" :
                                f.name === "otherAgencies" ? "otherAgenciesDetails" :
                                f.name === "otherSources" ? "otherSourcesDetails" : `${f.name}Text`;
        finalPayload[detailsFieldName] = formData[detailsFieldName];
      }
    });
    
    return finalPayload;
  };

  const handleSubmit = async () => {
    if (Object.values(uploadStatuses).includes("uploading")) {
      alert("Please wait for all uploads to finish before submitting.");
      return;
    }

    const payload = buildFinalNgoPayload();
    console.log("[NGO Submit] Final payload:", payload);

    // Validate required fields
    const requiredFields = ngoSteps.flatMap(step => 
      step.fields.filter((field: any) => field.required).map((field: any) => field.name)
    );
    
    const missingFields = requiredFields.filter(field => 
      !payload[field] || payload[field] === ""
    );

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (ngoId) {
        await updateNgos(ngoId, payload);
      } else {
        await createNgos(payload);
      }
      onSubmit?.(payload);
      setFormData(getInitialFormData({}));
      setUploadStatuses({});
      setUploadDebug({});
      setSelectedFiles({});
      navigate("/ngos");
      onOpenChange(false);
    } catch (err: any) {
      console.error("[NGO Submit] Error:", err);
      alert(`Submission failed: ${err?.message ?? "unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = ngoSteps.length + 1;
  const steps = ngoSteps.map((s, i) => ({
    id: i + 1,
    title: s.label,
    icon: ["🏢", "📋", "🎯", "👥", "💰", "📊"][i] ?? (i + 1).toString(),
  }));
  steps.push({ id: totalSteps, title: "Review & Submit", icon: "✅" });

  const renderStepContent = () => {
    if (currentStep === totalSteps) {
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
                    {step.fields.map((field: any) => {
                      const parentField = step.fields.find((f: any) => f.name === field.conditionalField);
                      if (field.conditional && parentField && formData[parentField.name] !== "yes") {
                        return null;
                      }

                      let displayValue: any = formData[field.name] ?? "Not provided";

                      if (field.type === "date" && formData[field.name]) {
                        displayValue = format(formData[field.name], "PPP");
                      }

                      if (field.type === "yesNoDocument" && formData[field.name] === "yes") {
                        const file = formData[`${field.name}File`];
                        if (file) {
                          if (typeof file === "string") {
                            displayValue = `Yes (File: ${file.split("/").pop()})`;
                          } else if ((file as any).name) {
                            displayValue = `Yes (File: ${(file as any).name})`;
                          } else {
                            displayValue = `Yes (File present)`;
                          }
                        } else {
                          displayValue = "Yes (no file uploaded)";
                        }
                      }

                      if (field.type === "yesNoText" && formData[field.name] === "yes") {
                        const detailsFieldName = field.name === "individualDonors" ? "individualDonorsDetails" :
                                                field.name === "corporateFunders" ? "corporateFunderDetails" :
                                                field.name === "govtFunders" ? "govtFundersDetails" :
                                                field.name === "otherAgencies" ? "otherAgenciesDetails" :
                                                field.name === "otherSources" ? "otherSourcesDetails" : `${field.name}Text`;
                        const text = formData[detailsFieldName];
                        displayValue = text ? `Yes (${text})` : "Yes (no details provided)";
                      }

                      if ((field.type === "yesNo" || field.type === "yesNoDocument" || field.type === "yesNoText") && (formData[field.name] === "yes" || formData[field.name] === "no")) {
                        if (!(field.type === "yesNoDocument" && formData[field.name] === "yes")) {
                          displayValue = formData[field.name] === "yes" ? "Yes" : "No";
                        }
                      }

                      if (displayValue === "" || displayValue === undefined || displayValue === null) {
                        displayValue = "Not provided";
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

    const stepData = ngoSteps[currentStep - 1];
    if (!stepData) return null;

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">{stepData.label}</h3>
          <p className="text-muted-foreground">
            Step {currentStep} of {totalSteps} - Fill in the required information
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

  return (
    <Dialog open={open} onOpenChange={() => { onOpenChange(false); navigate("/ngos"); }}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ngoId ? "Edit NGO Details" : "Register New NGO"}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between mb-8">
          {steps.map((s) => (
            <div key={s.id} className={cn("flex flex-col items-center space-y-2", currentStep >= s.id ? "text-primary" : "text-muted-foreground")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium", currentStep >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                <span className="text-lg leading-none">{s.icon}</span>
              </div>
              <span className="text-xs text-center">{s.title}</span>
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? (ngoId ? "Updating..." : "Submitting...") : (ngoId ? "Update" : "Submit")}
            </Button>
          ) : (
            <Button onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))} disabled={isSubmitting}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NGOCreationWizard;
