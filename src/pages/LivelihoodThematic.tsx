// LivelihoodThematic.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import dayjs from "dayjs";

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

type LivelihoodProject = {
  id: string;
  projectName: string;
  projectHead: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget: BudgetBreakdown;
  thematic: "Livelihood";
  kpis: KPI[];
  reportsPending?: number;
  createdAt: string;
};

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default function LivelihoodThematic() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<LivelihoodProject[]>([
    {
      id: "liv-1",
      projectName: "Women SHG Skill Training",
      projectHead: "Sunita Patil",
      description: "Skill development training for women SHG members.",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      budget: { total: 500000, hr: 150000, admin: 50000, management: 100000, misc: 200000 },
      thematic: "Livelihood",
      kpis: [
        { id: "kpi-1", name: "Women Trained", unit: "persons", target: 50, achieved: 35 },
        { id: "kpi-2", name: "Entrepreneurs Started", unit: "persons", target: 10, achieved: 7 },
      ],
      reportsPending: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: "liv-2",
      projectName: "Rural Handicraft Promotion",
      projectHead: "Ramesh Kumar",
      description: "Promoting local handicrafts and providing market linkages.",
      startDate: "2025-03-01",
      endDate: "2025-12-31",
      budget: { total: 750000, hr: 200000, admin: 100000, management: 150000, misc: 300000 },
      thematic: "Livelihood",
      kpis: [
        { id: "kpi-1", name: "Handicraft Units Sold", unit: "units", target: 2000, achieved: 1200 },
        { id: "kpi-2", name: "Artisans Benefited", unit: "persons", target: 30, achieved: 25 },
      ],
      reportsPending: 1,
      createdAt: new Date().toISOString(),
    },
  ]);

  const deleteProject = (id: string) => {
    if (!confirm("Delete this project?")) return;
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  const projectUtilization = (proj: LivelihoodProject) => {
    const allocated = proj.budget.hr + proj.budget.admin + proj.budget.management + proj.budget.misc;
    const pct = proj.budget.total ? (allocated / proj.budget.total) * 100 : 0;
    return Math.min(100, Number(pct.toFixed(1)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Livelihood — Thematic Projects</h1>
          <p className="text-muted-foreground">
            Track skill development, SHG support, and rural entrepreneurship programs.
          </p>
        </div>
        <Button onClick={() => navigate("/projects")}>
          + Add Project
        </Button>
      </div>

      {/* Project Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className="hover:shadow-xl transition border rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold">{p.projectName}</CardTitle>
                  <p className="text-sm text-muted-foreground">Lead: {p.projectHead}</p>
                  <p className="text-xs text-gray-500">
                    {dayjs(p.startDate).format("MMM YYYY")} – {dayjs(p.endDate).format("MMM YYYY")}
                  </p>
                </div>
                {/* <Badge
                  variant="outline"
                  className={
                    p.reportsPending && p.reportsPending > 0
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }
                >
                  {p.reportsPending && p.reportsPending > 0 ? `${p.reportsPending} Pending` : "On Track"}
                </Badge> */}
              </div>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
              <p className="text-sm">{p.description}</p>

              <div className="p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Budget</span>
                  <span className="font-bold text-primary">₹{p.budget.total.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700">HR: ₹{p.budget.hr.toLocaleString()}</span>
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">Admin: ₹{p.budget.admin.toLocaleString()}</span>
                  <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">Mgmt: ₹{p.budget.management.toLocaleString()}</span>
                  <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">Misc: ₹{p.budget.misc.toLocaleString()}</span>
                </div>
                <div className="mt-3">
                  <Progress value={projectUtilization(p)} className="h-2" />
                  <p className="text-xs text-right mt-1 text-muted-foreground">
                    {projectUtilization(p)}% Utilized
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteProject(p.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
                <Button size="sm" onClick={() => navigate("/projects")}>View / Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
