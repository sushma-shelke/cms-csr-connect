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
import { Plus, Trash2 } from "lucide-react";
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

type HealthProject = {
  id: string;
  projectName: string;
  projectHead: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget: BudgetBreakdown;
  thematic: "Health";
  kpis: KPI[];
  reportsPending?: number;
  createdAt: string;
};

function uid(prefix = "") {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}`;
}

export default function HealthThematic() {
  const [projects, setProjects] = useState<HealthProject[]>([
    {
      id: "proj-1",
      projectName: "Rural Health Initiative",
      projectHead: "Dr. Meera Nair",
      description: "Improving primary healthcare access in rural villages.",
      startDate: "2025-04-01",
      endDate: "2026-03-31",
      budget: { total: 2000000, hr: 800000, admin: 300000, management: 600000, misc: 300000 },
      thematic: "Health",
      kpis: [
        { id: "kpi-1", name: "Patients Served", unit: "people", target: 1200, achieved: 950 },
        { id: "kpi-2", name: "Health Camps", unit: "camps", target: 24, achieved: 18 },
      ],
      reportsPending: 2,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectHead, setProjectHead] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().add(6, "month").format("YYYY-MM-DD"));

  const [budget, setBudget] = useState<BudgetBreakdown>({
    total: 0,
    hr: 0,
    admin: 0,
    management: 0,
    misc: 0,
  });

  const [kpis, setKpis] = useState<KPI[]>([
    { id: uid("kpi-"), name: "Patients Served", unit: "people", target: 100 },
  ]);

  const [reportsPending, setReportsPending] = useState(0);

  const saveProject = () => {
    if (!projectName.trim()) {
      alert("Please enter project name");
      return;
    }
    const newProject: HealthProject = {
      id: uid("proj-"),
      projectName,
      projectHead,
      description,
      startDate,
      endDate,
      budget,
      thematic: "Health",
      kpis,
      reportsPending,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [newProject, ...prev]);
    setShowForm(false);

    // reset form
    setProjectName("");
    setProjectHead("");
    setDescription("");
    setStartDate(dayjs().format("YYYY-MM-DD"));
    setEndDate(dayjs().add(6, "month").format("YYYY-MM-DD"));
    setBudget({ total: 0, hr: 0, admin: 0, management: 0, misc: 0 });
    setKpis([{ id: uid("kpi-"), name: "Patients Served", unit: "people", target: 100 }]);
    setReportsPending(0);
  };

  const addKpi = () => {
    setKpis((prev) => [...prev, { id: uid("kpi-"), name: "", unit: "", target: 0 }]);
  };

  const updateKpi = (id: string, field: keyof KPI, value: string | number) => {
    setKpis((prev) =>
      prev.map((k) => (k.id === id ? { ...k, [field]: field === "target" ? Number(value) : value } : k))
    );
  };

  const deleteProject = (id: string) => {
    if (!confirm("Delete this project?")) return;
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  const projectUtilization = (proj: HealthProject) => {
    const allocated = proj.budget.hr + proj.budget.admin + proj.budget.management + proj.budget.misc;
    const pct = proj.budget.total ? (allocated / proj.budget.total) * 100 : 0;
    return Math.min(100, Number(pct.toFixed(1)));
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text">Health Projects</h1>
          <p className="text-muted-foreground mt-2">Detailed form for health projects with KPIs and budget breakdown.</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="shadow-md hover-lift">
              <Plus className="mr-2 h-4 w-4" /> New Health Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Health Project</DialogTitle>
              <DialogDescription>Fill project details, budget, and KPIs</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project Name</Label>
                  <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                </div>
                <div>
                  <Label>Project Head</Label>
                  <Input value={projectHead} onChange={(e) => setProjectHead(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              {/* Budget Breakdown */}
              <h3 className="font-medium mt-4">Budget Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Budget</Label>
                  <Input type="number" value={budget.total} onChange={(e) => setBudget({ ...budget, total: Number(e.target.value || 0) })} />
                </div>
                <div>
                  <Label>Human Resources Cost</Label>
                  <Input type="number" value={budget.hr} onChange={(e) => setBudget({ ...budget, hr: Number(e.target.value || 0) })} />
                </div>
                <div>
                  <Label>Admin Cost</Label>
                  <Input type="number" value={budget.admin} onChange={(e) => setBudget({ ...budget, admin: Number(e.target.value || 0) })} />
                </div>
                <div>
                  <Label>Management & Coordination</Label>
                  <Input type="number" value={budget.management} onChange={(e) => setBudget({ ...budget, management: Number(e.target.value || 0) })} />
                </div>
                <div>
                  <Label>Miscellaneous</Label>
                  <Input type="number" value={budget.misc} onChange={(e) => setBudget({ ...budget, misc: Number(e.target.value || 0) })} />
                </div>
              </div>

              {/* KPIs */}
              <h3 className="font-medium mt-4">Key Performance Indicators (KPIs)</h3>
              {kpis.map((k) => (
                <div key={k.id} className="grid grid-cols-3 gap-4 mb-2">
                  <Input placeholder="KPI Name" value={k.name} onChange={(e) => updateKpi(k.id, "name", e.target.value)} />
                  <Input placeholder="Unit" value={k.unit} onChange={(e) => updateKpi(k.id, "unit", e.target.value)} />
                  <Input type="number" placeholder="Target" value={k.target} onChange={(e) => updateKpi(k.id, "target", e.target.value)} />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addKpi}>
                + Add KPI
              </Button>

              {/* Reports */}
              <div>
                <Label>Reports Pending</Label>
                <Input type="number" value={reportsPending} onChange={(e) => setReportsPending(Number(e.target.value || 0))} />
              </div>

              <div className="flex justify-end">
                <Button onClick={saveProject}>Save Project</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              <Badge variant="outline" className="bg-red-50 text-red-600">
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
