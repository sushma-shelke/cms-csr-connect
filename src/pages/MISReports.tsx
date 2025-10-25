import { MISReportManager } from "@/components/project/MISReportManager";

export default function MISReports() {
  return (
    <div className="space-y-8 animate-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold gradient-text mb-2">MIS Report Management</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive reporting system for monitoring project progress, tracking targets, 
          and managing deviations with automated workflows and approval processes.
        </p>
      </div>
      
      <MISReportManager />
    </div>
  );
}