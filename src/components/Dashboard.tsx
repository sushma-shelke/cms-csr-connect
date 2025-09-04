import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  IndianRupee,
  TrendingUp,
  Users,
  FileText,
  Heart,
  GraduationCap,
  Leaf,
  Briefcase,
} from "lucide-react";

const budgetData = [
  { theme: "Health", budget: 2500000, spent: 1800000 },
  { theme: "Education", budget: 3000000, spent: 2200000 },
  { theme: "Climate", budget: 1500000, spent: 1100000 },
  { theme: "Livelihood", budget: 2000000, spent: 1500000 },
];

const targetData = [
  { name: "Target Achieved", value: 75, color: "hsl(var(--impact-green))" },
  { name: "In Progress", value: 20, color: "hsl(var(--impact-blue))" },
  { name: "At Risk", value: 5, color: "hsl(var(--impact-red))" },
];

const recentProjects = [
  {
    name: "Rural Health Initiative",
    ngo: "Health Care Foundation",
    status: "green",
    progress: 85,
    theme: "Health"
  },
  {
    name: "Digital Education Program",
    ngo: "Education First NGO",
    status: "blue",
    progress: 70,
    theme: "Education"
  },
  {
    name: "Climate Awareness Campaign",
    ngo: "Green Earth Society",
    status: "yellow",
    progress: 45,
    theme: "Climate"
  },
];

export function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "green": return "bg-impact-green";
      case "blue": return "bg-impact-blue";
      case "yellow": return "bg-impact-yellow";
      case "red": return "bg-impact-red";
      default: return "bg-muted";
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "Health": return <Heart className="h-4 w-4 text-thematic-health" />;
      case "Education": return <GraduationCap className="h-4 w-4 text-thematic-education" />;
      case "Climate": return <Leaf className="h-4 w-4 text-thematic-climate" />;
      case "Livelihood": return <Briefcase className="h-4 w-4 text-thematic-livelihood" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">CSR Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your CSR initiatives and track impact across all programs • Dark Theme Active
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹90L</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 new this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NGO Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 onboarded this quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Due by month end
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Budget vs Spending Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Thematic Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="theme" />
                <YAxis tickFormatter={(value) => `₹${value / 100000}L`} />
                <Tooltip 
                  formatter={(value: number) => [`₹${value / 100000}L`, ""]}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="budget" fill="hsl(var(--muted))" name="Budget" />
                <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Target Achievement */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Target Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={targetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {targetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {targetData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Project Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-muted-foreground">{project.ngo}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getThemeIcon(project.theme)}
                    {project.theme}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{project.progress}%</div>
                    <Progress value={project.progress} className="w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}