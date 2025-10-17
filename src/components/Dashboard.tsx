import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/projects";
import { 
  getProjectAnalytics, 
  getTotalBudget, 
  getBudgetUtilized, 
  getTotalBeneficiaries,
  getProjectCountByStatus,
  getProjectCountByTheme
} from "@/api/analytics";

export function Dashboard() {
  // Fetch all data from backend
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: getProjectAnalytics,
  });

  const { data: totalBudget, isLoading: budgetLoading } = useQuery({
    queryKey: ["totalBudget"],
    queryFn: getTotalBudget,
  });

  const { data: budgetUtilized, isLoading: utilizedLoading } = useQuery({
    queryKey: ["budgetUtilized"],
    queryFn: getBudgetUtilized,
  });

  const { data: totalBeneficiaries, isLoading: beneficiariesLoading } = useQuery({
    queryKey: ["totalBeneficiaries"],
    queryFn: getTotalBeneficiaries,
  });

  const { data: statusCount } = useQuery({
    queryKey: ["statusCount"],
    queryFn: getProjectCountByStatus,
  });

  const { data: themeCount } = useQuery({
    queryKey: ["themeCount"],
    queryFn: getProjectCountByTheme,
  });

  // Calculate budget data by theme
  const budgetData = themeCount ? Object.entries(themeCount).map(([theme, count]) => {
    const themeProjects = projects?.filter((p: any) => p.projectTheme === theme) || [];
    const budget = themeProjects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0);
    const spent = themeProjects.reduce((sum: number, p: any) => sum + (p.budgetUtilized || 0), 0);
    return { theme, budget, spent };
  }) : [];

  // Calculate target achievement data from status
  const targetData = statusCount ? [
    { name: "Completed", value: statusCount["Completed"] || 0, color: "#80D763" },
    { name: "In Progress", value: statusCount["In Progress"] || 0, color: "#FFB303" },
    { name: "At Risk", value: statusCount["At Risk"] || 0, color: "#FF668CFF" },
  ].filter(item => item.value > 0) : [];

  // Get recent projects (last 3)
  const recentProjects = projects?.slice(0, 3).map((p: any) => ({
    name: p.projectName,
    ngo: p.ngoPartner || "N/A",
    status: p.projectStatus?.toLowerCase() || "green",
    progress: p.budgetUtilized && p.budget ? Math.round((p.budgetUtilized / p.budget) * 100) : 0,
    theme: p.projectTheme
  })) || [];

  const activeProjects = projects?.filter((p: any) => p.projectStatus !== "Completed").length || 0;
  const pendingReports = analytics?.pendingReports || 0;
  const ngoPartners = analytics?.totalNGOs || 0;
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
          Monitor your CSR initiatives and track impact across all programs
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card style={{ borderLeft: '5px solid #6F49F8' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{color:'#6F49F8'}}>Total Budget</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" color="#6F49F8" />
          </CardHeader>
          <CardContent>
            {budgetLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold" style={{color:'#6F49F8'}}>
                  ₹{totalBudget ? (totalBudget / 100000).toFixed(1) : 0}L
                </div>
                <p className="text-xs text-muted-foreground">
                  {budgetUtilized && totalBudget ? `${((budgetUtilized / totalBudget) * 100).toFixed(1)}% utilized` : 'N/A'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card style={{ borderLeft: '5px solid #8ECE33FF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{color:'#8ECE33FF'}}>Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" color="#8ECE33FF"/>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold" style={{color:'#8ECE33FF'}}>{activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {projects?.length || 0} total projects
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card style={{ borderLeft: '5px solid #FFB74BFF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{color:'#FFB74BFF'}}>Total Beneficiaries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" color="#FFB74BFF" />
          </CardHeader>
          <CardContent>
            {beneficiariesLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold" style={{color:'#FFB74BFF'}}>
                  {totalBeneficiaries?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {ngoPartners} NGO partners
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card style={{ borderLeft: '5px solid #FF74DAFF' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{color:'#FF74DAFF'}}>Reports Pending</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" color="#FF74DAFF" />
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold" style={{color:'#FF74DAFF'}}>{pendingReports}</div>
                <p className="text-xs text-muted-foreground">
                  Due by month end
                </p>
              </>
            )}
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
            {projectsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="theme" />
                  <YAxis tickFormatter={(value) => `₹${value / 100000}L`} />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value / 100000}L`, ""]}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="budget" fill="#FFC973C5" name="Budget" />
                  <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Target Achievement */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Target Achievement</CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <>
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
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Project Updates</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No projects found</p>
              ) : (
                recentProjects.map((project, index) => (
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
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}