import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Leaf, Droplet } from "lucide-react";
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

type ClimateProject = {
  id: string;
  projectName: string;
  projectHead: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget: BudgetBreakdown;
  thematic: "Climate Resilience";
  kpis: KPI[];
  reportsPending?: number;
  createdAt: string;
};

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default function ClimateResilienceThematic() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ClimateProject[]>([
    {
      id: "clim-1",
      projectName: "Afforestation Drive",
      projectHead: "Amit Verma",
      description: "Tree plantation initiative across 50 villages.",
      startDate: "2025-03-01",
      endDate: "2026-03-31",
      budget: { total: 1800000, hr: 500000, admin: 200000, management: 400000, misc: 700000 },
      thematic: "Climate Resilience",
      kpis: [
        { id: "kpi-1", name: "Trees Planted", unit: "trees", target: 20000, achieved: 14500 },
        { id: "kpi-2", name: "Villages Covered", unit: "villages", target: 50, achieved: 35 },
      ],
      reportsPending: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: "clim-2",
      projectName: "Rainwater Harvesting",
      projectHead: "Seema Kulkarni",
      description: "Installation of rainwater harvesting systems in drought-prone areas.",
      startDate: "2025-05-01",
      endDate: "2026-02-28",
      budget: { total: 1200000, hr: 300000, admin: 150000, management: 250000, misc: 500000 },
      thematic: "Climate Resilience",
      kpis: [
        { id: "kpi-1", name: "Systems Installed", unit: "units", target: 100, achieved: 60 },
        { id: "kpi-2", name: "Households Benefited", unit: "households", target: 2000, achieved: 1200 },
      ],
      reportsPending: 0,
      createdAt: new Date().toISOString(),
    },
  ]);

  const deleteProject = (id: string) => {
    if (!confirm("Delete this project?")) return;
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  const projectUtilization = (proj: ClimateProject) => {
    const allocated = proj.budget.hr + proj.budget.admin + proj.budget.management + proj.budget.misc;
    const pct = proj.budget.total ? (allocated / proj.budget.total) * 100 : 0;
    return Math.min(100, Number(pct.toFixed(1)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Climate Resilience — Thematic Projects</h1>
          <p className="text-muted-foreground">Track afforestation, water conservation, and climate adaptation programs.</p>
        </div>
        <Button onClick={() => navigate("/projects")}>
          <Plus className="mr-2 h-4 w-4" /> New Climate Project
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
            <p className="text-sm text-muted-foreground">
              Lead: {p.projectHead}
            </p>
            <p className="text-xs text-gray-500">
              {dayjs(p.startDate).format("MMM YYYY")} – {dayjs(p.endDate).format("MMM YYYY")}
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              p.reportsPending && p.reportsPending > 0
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
            }
          >
            {p.reportsPending && p.reportsPending > 0
              ? `${p.reportsPending} Pending`
              : "On Track"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Description */}
        <p className="text-sm">{p.description}</p>

        {/* Budget Overview */}
        <div className="p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Total Budget</span>
            <span className="font-bold text-primary">₹{p.budget.total.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-green-100 text-green-700">
              HR: ₹{p.budget.hr.toLocaleString()}
            </span>
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
              Admin: ₹{p.budget.admin.toLocaleString()}
            </span>
            <span className="px-2 py-1 rounded bg-purple-100 text-purple-700">
              Mgmt: ₹{p.budget.management.toLocaleString()}
            </span>
            <span className="px-2 py-1 rounded bg-orange-100 text-orange-700">
              Misc: ₹{p.budget.misc.toLocaleString()}
            </span>
          </div>
          <div className="mt-3">
            <Progress value={projectUtilization(p)} className="h-2" />
            <p className="text-xs text-right mt-1 text-muted-foreground">
              {projectUtilization(p)}% Utilized
            </p>
          </div>
        </div>

        {/* KPIs */}
        {/* <div>
          <h4 className="text-sm font-medium mb-2">Impact Metrics</h4>
          <div className="grid gap-2">
            {p.kpis.map((k, i) => {
              const progress = Math.min(
                100,
                ((k.achieved ?? 0) / k.target) * 100
              );
              return (
                <div
                  key={k.id}
                  className="p-2 bg-gray-50 rounded-lg flex flex-col"
                >
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="flex items-center gap-2">
                      {i % 2 === 0 ? (
                        <Leaf className="h-4 w-4 text-green-600" />
                      ) : (
                        <Droplet className="h-4 w-4 text-blue-600" />
                      )}
                      {k.name}
                    </span>
                    <span>
                      {k.achieved ?? 0}/{k.target} {k.unit}
                    </span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </div> */}

        {/* Delete */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500"
            onClick={() => deleteProject(p.id)}
          >
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