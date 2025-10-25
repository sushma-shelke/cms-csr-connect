import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type KPI = {
  id: string;
  name: string;
  unit: string;
  target: number;
  achieved?: number;
};

type BudgetBreakdown = {
  total: number;
  hr: number;
  admin: number;
  management: number;
  misc: number;
};

type EducationProject = {
  id: string;
  projectName: string;
  projectHead: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget: BudgetBreakdown;
  thematic: "Education";
  kpis: KPI[];
  reportsPending?: number;
  createdAt: string;
};

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default function EducationThematic() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<EducationProject[]>([
    {
      id: "edu-1",
      projectName: "Digital Literacy Program",
      projectHead: "Prof. Ramesh Iyer",
      description: "Providing digital education resources in rural schools.",
      startDate: "2025-06-01",
      endDate: "2026-05-31",
      budget: { total: 1500000, hr: 500000, admin: 200000, management: 400000, misc: 400000 },
      thematic: "Education",
      kpis: [
        { id: "kpi-1", name: "Students Trained", unit: "students", target: 5000, achieved: 3200 },
        { id: "kpi-2", name: "Schools Covered", unit: "schools", target: 50, achieved: 30 },
      ],
      reportsPending: 1,
      createdAt: new Date().toISOString(),
    },
  ]);

  const deleteProject = (id: string) => {
    if (!confirm("Delete this project?")) return;
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  const projectUtilization = (proj: EducationProject) => {
    const allocated = proj.budget.hr + proj.budget.admin + proj.budget.management + proj.budget.misc;
    const pct = proj.budget.total ? (allocated / proj.budget.total) * 100 : 0;
    return Math.min(100, Number(pct.toFixed(1)));
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Education Projects</h1>
          <p className="text-muted-foreground mt-2">Detailed form for education projects with KPIs and budget breakdown.</p>
        </div>
        <Button onClick={() => navigate("/projects")} className="shadow-md hover-lift">
          <Plus className="mr-2 h-4 w-4" /> New Education Project
        </Button>
      </div>

      {/* Project Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} variant="elevated" hover="lift">
            <CardHeader className="flex justify-between items-start pb-2">
              <div>
                <CardTitle className="text-lg">{p.projectName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {p.projectHead} • {dayjs(p.startDate).format("MMM YYYY")} - {dayjs(p.endDate).format("MMM YYYY")}
                </p>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-600">
                {p.reportsPending} Pending
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{p.description}</p>
              <div className="flex justify-between text-sm">
                <span>Budget</span>
                <span className="font-semibold">₹{p.budget.total.toLocaleString()}</span>
              </div>
              <Progress value={projectUtilization(p)} className="h-2" />
              <div>
                <h4 className="text-sm font-medium mb-2">KPIs</h4>
                {p.kpis.map((k) => (
                  <div key={k.id} className="flex justify-between text-sm">
                    <span>{k.name}</span>
                    <span>{k.achieved ?? 0}/{k.target} {k.unit}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteProject(p.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}