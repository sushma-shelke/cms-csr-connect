// // import { useState } from "react";
// // const steps = [
// //   {
// //     label: "Basic Details",
// //     fields: [
// //       { name: "name", label: "Organization Name", type: "text", required: true },
// //       { name: "location", label: "Location", type: "text", required: true },
// //       { name: "founder", label: "Name of Founder", type: "text", required: true },
// //       { name: "registrationDetails", label: "Registration Details", type: "text", required: true },
// //       { name: "registrationDate", label: "Date of Registration", type: "date", required: true },
// //       { name: "statutoryDocs", label: "Statutory Documents (FCRA/80G/35AC/12A/CSR)", type: "text", required: true }
// //     ]
// //   },
// //   {
// //     label: "Legal & Financial",
// //     fields: [
// //       { name: "panCard", label: "PAN Card Available", type: "text", required: true },
// //       { name: "certificateValidity", label: "Certificate of Exemption Validity", type: "text" },
// //       { name: "exemptionDetails", label: "Exemption Details", type: "text" },
// //       { name: "auditedStatements", label: "Previous Three Years Audited Statements Available", type: "text" },
// //       { name: "mou", label: "MOU/MOA/Trust Deed Available", type: "text" },
// //       { name: "orgBudget", label: "Organization Budget (Last FY)", type: "number" },
// //       { name: "totalExpenses", label: "Total Expenses (Last FY)", type: "number" },
// //       { name: "incomeVsExpenditure", label: "Income vs Expenditure (Last 3 Years)", type: "text" },
// //       { name: "directProgrammeSpend", label: "Spend on Direct Programme Costs (Last FY)", type: "number" },
// //       { name: "fixedAssets", label: "Fixed Assets Owned", type: "text" }
// //     ]
// //   },
// //   {
// //     label: "Activities & Advocacy",
// //     fields: [
// //       { name: "religiousAgenda", label: "Promotes Religious/Spiritual Agenda?", type: "text" },
// //       { name: "agendaDetails", label: "If Yes, How?", type: "text" },
// //       { name: "beneficiaryCaste", label: "Beneficiaries Specific to Any Religion/Caste/Culture?", type: "text" },
// //       { name: "politicalNature", label: "Are Activities Political/Religious/Spiritual?", type: "text" },
// //       { name: "socialAdvocacy", label: "Addresses Issues of Social Advocacy?", type: "text" },
// //       { name: "govtConflict", label: "Activites in Conflict With Govt Rules?", type: "text" },
// //       { name: "humanRights", label: "Aligned With Human Rights Principles?", type: "text" },
// //       { name: "environmental", label: "Environment Consideration in Programmes?", type: "text" }
// //     ]
// //   },
// //   {
// //     label: "Governance & Staffing",
// //     fields: [
// //       { name: "governingBody", label: "Governing Body/Trustee Involvement?", type: "text" },
// //       { name: "governingDetails", label: "If Yes, How?", type: "text" },
// //       { name: "relatedMembers", label: "Are any Members Related?", type: "text" },
// //       { name: "relationsSpecify", label: "Specify Relations", type: "text" },
// //       { name: "meetingFrequency", label: "Frequency of Governing Body Meetings", type: "text" },
// //       { name: "fullTimeEmployees", label: "Full-time Employees (How Many?)", type: "number" },
// //       { name: "partTimeEmployees", label: "Part-time Employees (How Many?)", type: "number" },
// //       { name: "skilledStaff", label: "Number of Skilled/Trained Staff", type: "number" },
// //       { name: "trainedPersonnel", label: "Trained/Experienced Progress Reporting Staff?", type: "text" },
// //       { name: "definedRoles", label: "Defined Roles & Responsibilities?", type: "text" },
// //       { name: "avgStaffExperience", label: "Average Staff Experience (Years)", type: "number" },
// //       { name: "staffTraining", label: "Staff Training Details & Frequency", type: "text" },
// //       { name: "volunteerOpportunities", label: "Structured Volunteer Opportunities?", type: "text" }
// //     ]
// //   },
// //   {
// //     label: "Funding & Outreach",
// //     fields: [
// //       { name: "fundingSources", label: "Major Sources of Funding", type: "text" },
// //       { name: "individualDonors", label: "Individual Donors? If Yes, Mention", type: "text" },
// //       { name: "corporateFunders", label: "Corporate Funders? If Yes, Mention", type: "text" },
// //       { name: "govtFunders", label: "Government Funding? If Yes, Mention", type: "text" },
// //       { name: "otherAgencies", label: "Funding from Agencies/Trusts? If Yes, Mention", type: "text" },
// //       { name: "otherSources", label: "Other Funding Sources? If Yes, Mention", type: "text" },
// //       { name: "mainObjective", label: "Main Objective of Organisation/Trust", type: "text" },
// //       { name: "targetBeneficiaries", label: "Target Beneficiaries (Specify)", type: "text" },
// //       { name: "percentLowSEB", label: "Percent Beneficiaries from Low Socio-economic Background", type: "number" },
// //       { name: "totalOutreach", label: "Total Outreach (Last FY)", type: "number" },
// //       { name: "costPerBeneficiary", label: "Cost per Beneficiary (Flagship Project)", type: "number" },
// //       { name: "areasOfIntervention", label: "Areas of Intervention (Flagship Project)", type: "text" }
// //     ]
// //   },
// //   {
// //     label: "Monitoring & Evaluation",
// //     fields: [
// //       { name: "monWithinScheduleVII", label: "Within Schedule VII of Companies Act 2013?", type: "text" },
// //       { name: "monitoringMethods", label: "Well Defined Monitoring Methods?", type: "text" },
// //       { name: "monitoringResponsibility", label: "Any Individual for Monitoring & Mid-term Corrections?", type: "text" },
// //       { name: "externalEvaluation", label: "Any External/Third Party Evaluation?", type: "text" },
// //       { name: "accreditation", label: "Accreditation/Credibility Assurance?", type: "text" },
// //       { name: "networkMembership", label: "Part of Local/Professional Network?", type: "text" }
// //     ]
// //   }
// // ];

// // // Initial state generation
// // const getInitialFormData = () => {
// //   const data = {};
// //   steps.forEach((step) =>
// //     step.fields.forEach((field) => {
// //       data[field.name] = field.type === "number" ? "" : "";
// //     })
// //   );
// //   return data;
// // };

// // export default function AddNGOStepForm() {
// //   const [step, setStep] = useState(0);
// //   const [formData, setFormData] = useState(getInitialFormData());
// //   const [preview, setPreview] = useState(false);
// //   const [editStep, setEditStep] = useState(null);

// //   // Field change handler
// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleNext = () => setStep(step + 1);
// //   const handleBack = () => setStep(step - 1);

// //   // Start preview on finishing last step
// //   const handlePreview = () => setPreview(true);

// //   // Edit a specific step from preview
// //   const handleEditStep = (idx) => {
// //     setPreview(false);
// //     setStep(idx);
// //     setEditStep(idx);
// //   };

// //   // Submit form (after preview)
// //   const handleSubmit = (e) => {
// //     e?.preventDefault();
// //     // Place API submission here.
// //     alert("Form submitted!");
// //     setPreview(false);
// //     setStep(0);
// //     setFormData(getInitialFormData());
// //   };

// //   // Render one step of the form
// //   const renderStep = (stepIndex) => {
// //     const { label, fields } = steps[stepIndex];
// //     return (
// //       <form
// //         onSubmit={(e) => {
// //           e.preventDefault();
// //           if (step === steps.length - 1) handlePreview();
// //           else handleNext();
// //         }}
// //         className="space-y-4"
// //       >
// //         <h2 className="text-xl font-semibold mb-4" >{label}</h2>
// //         {fields.map((field) => (
// //           <div key={field.name}>
// //             <label htmlFor={field.name} className="block mb-1">
// //               {field.label}
// //             </label>
// //             <input
// //               id={field.name}
// //               name={field.name}
// //               type={field.type}
// //               value={formData[field.name]}
// //               onChange={handleChange}
// //               required={field.required}
// //               className="w-full px-3 py-2 border rounded"
// //             />
// //           </div>
// //         ))}
// //         <div className="flex space-x-2 mt-4">
// //           {step > 0 && (
// //             <button type="button" onClick={handleBack} className="px-4 py-2 border rounded" >
// //               Back
// //             </button>
// //           )}
// //           <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded"   style={{ backgroundColor: "#e52464" }}>
// //             {step === steps.length - 1 ? "Preview" : "Next"}
// //           </button>
// //         </div>
// //       </form>
// //     );
// //   };

// //   // Render preview summary and edit/submit links
// //   if (preview) {
// //     return (
// //       <div className="max-w-4xl mx-auto p-4 space-y-6">
// //         <h2 className="text-2xl font-bold mb-4">Review NGO Details</h2>
// //         <div className="space-y-6">
// //           {steps.map((page, idx) => (
// //             <div key={idx} className="border rounded p-4 relative">
// //               <h3 className="text-lg font-semibold mb-2">{page.label}</h3>
// //               <ul className="list-disc ml-6 marker:text-blue-500">
// //                 {page.fields.map((field) => (
// //                   <li key={field.name}>
// //                     <strong>{field.label}:</strong> {formData[field.name] || <span className="text-gray-400">(empty)</span>}
// //                   </li>
// //                 ))}
// //               </ul>
// //               <button
// //                 className="absolute top-2 right-2 px-2 py-1 text-blue-500 underline"
// //                 onClick={() => handleEditStep(idx)}
// //               >
// //                 Edit
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //         <form onSubmit={handleSubmit} className="mt-6 flex space-x-2">
// //           <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded">
// //             Submit NGO
// //           </button>
// //           <button
// //             type="button"
// //             className="px-6 py-2 bg-gray-200 text-black rounded"
// //             onClick={() => setPreview(false)}
// //           >
// //             Back to Form
// //           </button>
// //         </form>
// //       </div>
// //     );
// //   }

// //   // Standard stepper mode
// //   return (
// //     <div className="max-w-4xl mx-auto p-4">
// //       <div className="flex mb-8">
// //         {steps.map((s, i) => (
// //           <div
// //             key={s.label}
// //             className={`flex-1 text-center border-b-2 pb-2 ${i === step ? "border-blue-500 text-blue-500" : "border-gray-200"}`}
// //           >
// //             <span>{s.label}</span>
// //           </div>
// //         ))}
// //       </div>
// //       {renderStep(step)}
// //     </div>
// //   );
// // }

// import { useState } from "react";
// const steps = [
//   {
//     label: "Basic Details",
//     fields: [
//       { name: "name", label: "Organization Name", type: "text", required: true },
//       { name: "location", label: "Location", type: "text", required: true },
//       { name: "founder", label: "Name of Founder", type: "text", required: true },
//       { name: "registrationDetails", label: "Registration Details", type: "text", required: true },
//       { name: "registrationDate", label: "Date of Registration", type: "date", required: true },
//       { name: "statutoryDocs", label: "Statutory Documents (FCRA/80G/35AC/12A/CSR)", type: "text", required: true }
//     ]
//   },
//   {
//     label: "Legal & Financial",
//     fields: [
//       { name: "panCard", label: "PAN Card Available", type: "text", required: true },
//       { name: "certificateValidity", label: "Certificate of Exemption Validity", type: "text" },
//       { name: "exemptionDetails", label: "Exemption Details", type: "text" },
//       { name: "auditedStatements", label: "Previous Three Years Audited Statements Available", type: "text" },
//       { name: "mou", label: "MOU/MOA/Trust Deed Available", type: "text" },
//       { name: "orgBudget", label: "Organization Budget (Last FY)", type: "number" },
//       { name: "totalExpenses", label: "Total Expenses (Last FY)", type: "number" },
//       { name: "incomeVsExpenditure", label: "Income vs Expenditure (Last 3 Years)", type: "text" },
//       { name: "directProgrammeSpend", label: "Spend on Direct Programme Costs (Last FY)", type: "number" },
//       { name: "fixedAssets", label: "Fixed Assets Owned", type: "text" }
//     ]
//   },
//   {
//     label: "Activities & Advocacy",
//     fields: [
//       { name: "religiousAgenda", label: "Promotes Religious/Spiritual Agenda?", type: "text" },
//       { name: "agendaDetails", label: "If Yes, How?", type: "text" },
//       { name: "beneficiaryCaste", label: "Beneficiaries Specific to Any Religion/Caste/Culture?", type: "text" },
//       { name: "politicalNature", label: "Are Activities Political/Religious/Spiritual?", type: "text" },
//       { name: "socialAdvocacy", label: "Addresses Issues of Social Advocacy?", type: "text" },
//       { name: "govtConflict", label: "Activites in Conflict With Govt Rules?", type: "text" },
//       { name: "humanRights", label: "Aligned With Human Rights Principles?", type: "text" },
//       { name: "environmental", label: "Environment Consideration in Programmes?", type: "text" }
//     ]
//   },
//   {
//     label: "Governance & Staffing",
//     fields: [
//       { name: "governingBody", label: "Governing Body/Trustee Involvement?", type: "text" },
//       { name: "governingDetails", label: "If Yes, How?", type: "text" },
//       { name: "relatedMembers", label: "Are any Members Related?", type: "text" },
//       { name: "relationsSpecify", label: "Specify Relations", type: "text" },
//       { name: "meetingFrequency", label: "Frequency of Governing Body Meetings", type: "text" },
//       { name: "fullTimeEmployees", label: "Full-time Employees (How Many?)", type: "number" },
//       { name: "partTimeEmployees", label: "Part-time Employees (How Many?)", type: "number" },
//       { name: "skilledStaff", label: "Number of Skilled/Trained Staff", type: "number" },
//       { name: "trainedPersonnel", label: "Trained/Experienced Progress Reporting Staff?", type: "text" },
//       { name: "definedRoles", label: "Defined Roles & Responsibilities?", type: "text" },
//       { name: "avgStaffExperience", label: "Average Staff Experience (Years)", type: "number" },
//       { name: "staffTraining", label: "Staff Training Details & Frequency", type: "text" },
//       { name: "volunteerOpportunities", label: "Structured Volunteer Opportunities?", type: "text" }
//     ]
//   },
//   {
//     label: "Funding & Outreach",
//     fields: [
//       { name: "fundingSources", label: "Major Sources of Funding", type: "text" },
//       { name: "individualDonors", label: "Individual Donors? If Yes, Mention", type: "text" },
//       { name: "corporateFunders", label: "Corporate Funders? If Yes, Mention", type: "text" },
//       { name: "govtFunders", label: "Government Funding? If Yes, Mention", type: "text" },
//       { name: "otherAgencies", label: "Funding from Agencies/Trusts? If Yes, Mention", type: "text" },
//       { name: "otherSources", label: "Other Funding Sources? If Yes, Mention", type: "text" },
//       { name: "mainObjective", label: "Main Objective of Organisation/Trust", type: "text" },
//       { name: "targetBeneficiaries", label: "Target Beneficiaries (Specify)", type: "text" },
//       { name: "percentLowSEB", label: "Percent Beneficiaries from Low Socio-economic Background", type: "number" },
//       { name: "totalOutreach", label: "Total Outreach (Last FY)", type: "number" },
//       { name: "costPerBeneficiary", label: "Cost per Beneficiary (Flagship Project)", type: "number" },
//       { name: "areasOfIntervention", label: "Areas of Intervention (Flagship Project)", type: "text" }
//     ]
//   },
//   {
//     label: "Monitoring & Evaluation",
//     fields: [
//       { name: "monWithinScheduleVII", label: "Within Schedule VII of Companies Act 2013?", type: "text" },
//       { name: "monitoringMethods", label: "Well Defined Monitoring Methods?", type: "text" },
//       { name: "monitoringResponsibility", label: "Any Individual for Monitoring & Mid-term Corrections?", type: "text" },
//       { name: "externalEvaluation", label: "Any External/Third Party Evaluation?", type: "text" },
//       { name: "accreditation", label: "Accreditation/Credibility Assurance?", type: "text" },
//       { name: "networkMembership", label: "Part of Local/Professional Network?", type: "text" }
//     ]
//   }
// ];

// // Initial state generation
// const getInitialFormData = () => {
//   const data = {};
//   steps.forEach((step) =>
//     step.fields.forEach((field) => {
//       data[field.name] = field.type === "number" ? "" : "";
//     })
//   );
//   return data;
// };

// export default function AddNGOStepForm() {
//   const [step, setStep] = useState(0);
//   const [formData, setFormData] = useState(getInitialFormData());
//   const [preview, setPreview] = useState(false);
//   const [editStep, setEditStep] = useState(null);

//   // Field change handler
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleNext = () => setStep(step + 1);
//   const handleBack = () => setStep(step - 1);

//   // Start preview on finishing last step
//   const handlePreview = () => setPreview(true);

//   // Edit a specific step from preview
//   const handleEditStep = (idx) => {
//     setPreview(false);
//     setStep(idx);
//     setEditStep(idx);
//   };

//   // Submit form (after preview)
//   const handleSubmit = (e) => {
//     e?.preventDefault();
//     // Place API submission here.
//     alert("Form submitted!");
//     setPreview(false);
//     setStep(0);
//     setFormData(getInitialFormData());
//   };

//   // Render one step of the form
//   const renderStep = (stepIndex) => {
//     const { label, fields } = steps[stepIndex];
//     return (
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           if (step === steps.length - 1) handlePreview();
//           else handleNext();
//         }}
//         className="space-y-4"
//       >
//         <h2 className="text-xl font-semibold mb-4 text-[#e52464]">{label}</h2>
//         {fields.map((field) => (
//           <div key={field.name}>
//             <label htmlFor={field.name} className="block mb-1 font-medium">
//               {field.label}
//             </label>
//             <input
//               id={field.name}
//               name={field.name}
//               type={field.type}
//               value={formData[field.name]}
//               onChange={handleChange}
//               required={field.required}
//               className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#e52464] focus:border-transparent"
//             />
//           </div>
//         ))}
//         <div className="flex space-x-2 mt-4">
//           {step > 0 && (
//             <button type="button" onClick={handleBack} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100">
//               Back
//             </button>
//           )}
//           <button type="submit" className="px-4 py-2 text-white rounded bg-[#e52464] hover:bg-[#c41c53]">
//             {step === steps.length - 1 ? "Preview" : "Next"}
//           </button>
//         </div>
//       </form>
//     );
//   };

//   // Render preview summary and edit/submit links
//   if (preview) {
//     return (
//       <div className="max-w-4xl mx-auto p-4 space-y-6">
//         <h2 className="text-2xl font-bold mb-4 text-[#e52464]">Review NGO Details</h2>
//         <div className="space-y-6">
//           {steps.map((page, idx) => (
//             <div key={idx} className="border rounded p-4 relative">
//               <h3 className="text-lg font-semibold mb-2 text-[#e52464]">{page.label}</h3>
//               <ul className="list-disc ml-6 marker:text-[#e52464]">
//                 {page.fields.map((field) => (
//                   <li key={field.name}>
//                     <strong>{field.label}:</strong> {formData[field.name] || <span className="text-gray-400">(empty)</span>}
//                   </li>
//                 ))}
//               </ul>
//               <button
//                 className="absolute top-2 right-2 px-2 py-1 text-[#e52464] underline hover:text-[#c41c53]"
//                 onClick={() => handleEditStep(idx)}
//               >
//                 Edit
//               </button>
//             </div>
//           ))}
//         </div>
//         <form onSubmit={handleSubmit} className="mt-6 flex space-x-2">
//           <button type="submit" className="px-6 py-2 bg-[#e52464] text-white rounded hover:bg-[#c41c53]">
//             Submit NGO
//           </button>
//           <button
//             type="button"
//             className="px-6 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
//             onClick={() => setPreview(false)}
//           >
//             Back to Form
//           </button>
//         </form>
//       </div>
//     );
//   }

//   // Standard stepper mode
//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="flex mb-8">
//         {steps.map((s, i) => (
//           <div
//             key={s.label}
//             className={`flex-1 text-center border-b-2 pb-2 ${i === step ? "border-[#e52464] text-[#e52464] font-semibold" : "border-gray-200 text-gray-500"}`}
//           >
//             <span>{s.label}</span>
//           </div>
//         ))}
//       </div>
//       {renderStep(step)}
//     </div>
//   );
// }
import { useState } from "react";

const steps = [
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
  const data = {};
  steps.forEach((step) =>
    step.fields.forEach((field) => {
      if (field.type === "yesNo" || field.type === "yesNoDocument" || field.type === "yesNoText") {
        data[field.name] = "";
      } else if (field.type === "number") {
        data[field.name] = "";
      } else {
        data[field.name] = "";
      }
      
      // Initialize document fields
      if (field.type === "yesNoDocument") {
        data[`${field.name}File`] = null;
      }
    })
  );
  return data;
};

export default function AddNGOStepForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(getInitialFormData());
  const [preview, setPreview] = useState(false);
  const [editStep, setEditStep] = useState(null);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  // Start preview on finishing last step
  const handlePreview = () => setPreview(true);

  // Edit a specific step from preview
  const handleEditStep = (idx) => {
    setPreview(false);
    setStep(idx);
    setEditStep(idx);
  };

  // Submit form (after preview)
  const handleSubmit = (e) => {
    e?.preventDefault();
    // Place API submission here.
    alert("Form submitted!");
    setPreview(false);
    setStep(0);
    setFormData(getInitialFormData());
  };

  // Render different field types
  const renderField = (field) => {
    switch (field.type) {
      case "yesNo":
        return (
          <div className="mb-4">
            <label htmlFor={field.name} className="block mb-1 font-medium">
              {field.label}
            </label>
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#e52464] focus:border-transparent"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        );
      
      case "yesNoDocument":
        return (
          <div className="mb-4">
            <label htmlFor={field.name} className="block mb-1 font-medium">
              {field.label}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                className="px-3 py-2 border rounded focus:ring-2 focus:ring-[#e52464] focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              
              {formData[field.name] === "yes" && (
                <div>
                  <label htmlFor={`${field.name}File`} className="block mb-1 text-sm">
                    Upload Document
                  </label>
                  <input
                    id={`${field.name}File`}
                    name={`${field.name}File`}
                    type="file"
                    onChange={handleChange}
                    className="w-full text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        );
      
      case "yesNoText":
        return (
          <div className="mb-4">
            <label htmlFor={field.name} className="block mb-1 font-medium">
              {field.label}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="px-3 py-2 border rounded focus:ring-2 focus:ring-[#e52464] focus:border-transparent"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              
              {formData[field.name] === "yes" && (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={formData[field.name] === "yes" ? formData[field.name] : ""}
                  onChange={handleChange}
                  className="px-3 py-2 border rounded focus:ring-2 focus:ring-[#e52464] focus:border-transparent"
                />
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="mb-4">
            <label htmlFor={field.name} className="block mb-1 font-medium">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#e52464] focus:border-transparent"
            />
          </div>
        );
    }
  };

  // Render one step of the form
  const renderStep = (stepIndex) => {
    const { label, fields } = steps[stepIndex];
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (step === steps.length - 1) handlePreview();
          else handleNext();
        }}
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4 text-[#e52464]">{label}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => {
            // Skip conditional fields if their parent field is not "yes"
            if (field.conditional) {
              const parentField = fields.find(f => f.name === field.conditionalField);
              if (parentField && formData[parentField.name] !== "yes") {
                return null;
              }
            }
            
            return (
              <div key={field.name} className={field.type === "yesNo" ? "md:col-span-2" : ""}>
                {renderField(field)}
              </div>
            );
          })}
        </div>
        
        {/* Navigation buttons with Next aligned to the right */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <div>
            {step > 0 && (
              <button 
                type="button" 
                onClick={handleBack} 
                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              >
                Back
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 text-white rounded bg-[#e52464] hover:bg-[#c41c53]"
          >
            {step === steps.length - 1 ? "Preview" : "Next"}
          </button>
        </div>
      </form>
    );
  };

  // Render preview summary and edit/submit links
  if (preview) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-[#e52464]">Review NGO Details</h2>
        <div className="space-y-6">
          {steps.map((page, idx) => (
            <div key={idx} className="border rounded p-4 relative">
              <h3 className="text-lg font-semibold mb-2 text-[#e52464]">{page.label}</h3>
              <ul className="list-disc ml-6 marker:text-[#e52464]">
                {page.fields.map((field) => {
                  // Skip conditional fields if their parent field is not "yes"
                  if (field.conditional) {
                    const parentField = page.fields.find(f => f.name === field.conditionalField);
                    if (parentField && formData[parentField.name] !== "yes") {
                      return null;
                    }
                  }
                  
                  let displayValue = formData[field.name] || "(empty)";
                  
                  if (field.type === "yesNoDocument" && formData[field.name] === "yes") {
                    const file = formData[`${field.name}File`];
                    displayValue = file ? `File: ${file.name}` : "Yes (no file uploaded)";
                  }
                  
                  return (
                    <li key={field.name} className="mb-2">
                      <strong>{field.label}:</strong> {displayValue}
                    </li>
                  );
                })}
              </ul>
              <button
                className="absolute top-2 right-2 px-2 py-1 text-[#e52464] underline hover:text-[#c41c53]"
                onClick={() => handleEditStep(idx)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-6 flex space-x-2">
          <button type="submit" className="px-6 py-2 bg-[#e52464] text-white rounded hover:bg-[#c41c53]">
            Submit NGO
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
            onClick={() => setPreview(false)}
          >
            Back to Form
          </button>
        </form>
      </div>
    );
  }

  // Standard stepper mode with improved navigation
  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Improved stepper navigation that won't cause horizontal scroll */}
      <div className="mb-8 overflow-hidden">
        <div className="flex space-x-1 pb-2 overflow-x-auto scrollbar-hide">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={`flex-shrink-0 text-center border-b-2 pb-2 px-3 ${i === step ? "border-[#e52464] text-[#e52464] font-semibold" : "border-gray-200 text-gray-500"}`}
            >
              <span className="whitespace-nowrap text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {renderStep(step)}
    </div>
  );
}