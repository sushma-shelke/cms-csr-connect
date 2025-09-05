import { MISReportManager } from "@/components/project/MISReportManager";

export default function MISReports() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">MIS Report Management</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive reporting system for monitoring project progress, tracking targets, 
          and managing deviations with automated workflows and approval processes.
        </p>
      </div>
      
      <MISReportManager />
    </div>
  );
}