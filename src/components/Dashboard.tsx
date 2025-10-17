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
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-lg border">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          CSR Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time monitoring of CSR initiatives and impact metrics across all programs
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale border-l-4 border-l-[#6F49F8] hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6F49F8]">Total Budget</CardTitle>
            <div className="h-10 w-10 rounded-full bg-[#6F49F8]/10 flex items-center justify-center">
              <IndianRupee className="h-5 w-5 text-[#6F49F8]" />
            </div>
          </CardHeader>
          <CardContent>
            {budgetLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-3xl font-bold text-[#6F49F8] mb-1">
                  ₹{totalBudget ? (totalBudget / 100000).toFixed(1) : 0}L
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6F49F8] to-[#9F7AFA] transition-all duration-500"
                      style={{ width: `${budgetUtilized && totalBudget ? (budgetUtilized / totalBudget) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {budgetUtilized && totalBudget ? `${((budgetUtilized / totalBudget) * 100).toFixed(0)}%` : '0%'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ₹{budgetUtilized ? (budgetUtilized / 100000).toFixed(1) : 0}L utilized
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover-scale border-l-4 border-l-[#8ECE33FF] hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#8ECE33FF]">Active Projects</CardTitle>
            <div className="h-10 w-10 rounded-full bg-[#8ECE33FF]/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#8ECE33FF]"/>
            </div>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-3xl font-bold text-[#8ECE33FF] mb-1">{activeProjects}</div>
                <p className="text-xs text-muted-foreground">
                  out of <span className="font-semibold text-foreground">{projects?.length || 0}</span> total projects
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className="text-[#8ECE33FF] font-medium">↑ {activeProjects}</span>
                  <span className="text-muted-foreground">ongoing initiatives</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover-scale border-l-4 border-l-[#FFB74BFF] hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#FFB74BFF]">Total Beneficiaries</CardTitle>
            <div className="h-10 w-10 rounded-full bg-[#FFB74BFF]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#FFB74BFF]" />
            </div>
          </CardHeader>
          <CardContent>
            {beneficiariesLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-3xl font-bold text-[#FFB74BFF] mb-1">
                  {totalBeneficiaries?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  across <span className="font-semibold text-foreground">{ngoPartners}</span> NGO partners
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <Heart className="h-3 w-3 text-[#FFB74BFF]" />
                  <span className="text-muted-foreground">lives impacted</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="hover-scale border-l-4 border-l-[#FF74DAFF] hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#FF74DAFF]">Reports Pending</CardTitle>
            <div className="h-10 w-10 rounded-full bg-[#FF74DAFF]/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-[#FF74DAFF]" />
            </div>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-3xl font-bold text-[#FF74DAFF] mb-1">{pendingReports}</div>
                <p className="text-xs text-muted-foreground">
                  due by month end
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <span className={pendingReports > 5 ? "text-destructive font-medium" : "text-[#FF74DAFF] font-medium"}>
                    {pendingReports > 5 ? "⚠ Action needed" : "✓ On track"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-scale hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-thematic-education" />
              Education Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {themeCount?.["Education"] || 0}
                </div>
                <p className="text-xs text-muted-foreground">active projects</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover-scale hover:shadow-lg transition-all duration-300 border-t-4 border-t-thematic-health">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4 text-thematic-health" />
              Health Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {themeCount?.["Health"] || 0}
                </div>
                <p className="text-xs text-muted-foreground">active projects</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="hover-scale hover:shadow-lg transition-all duration-300 border-t-4 border-t-thematic-climate">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Leaf className="h-4 w-4 text-thematic-climate" />
              Climate Theme
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {themeCount?.["Climate Resilience"] || 0}
                </div>
                <p className="text-xs text-muted-foreground">active projects</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Budget vs Spending Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Thematic Budget Utilization
            </CardTitle>
            <p className="text-sm text-muted-foreground">Budget allocation vs spending by theme</p>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : budgetData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No budget data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="theme" 
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value / 100000}L`}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value / 100000}L`, ""]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="budget" fill="#FFC973C5" name="Budget" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Target Achievement */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Project Status Distribution
            </CardTitle>
            <p className="text-sm text-muted-foreground">Overall project status breakdown</p>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : targetData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No status data available
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={targetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {targetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {targetData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 hover-scale">
                      <div 
                        className="w-4 h-4 rounded-full shadow-sm" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-medium">
                        {entry.name} <span className="text-muted-foreground">({entry.value})</span>
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
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Recent Project Updates
          </CardTitle>
          <p className="text-sm text-muted-foreground">Latest activity from ongoing projects</p>
        </CardHeader>
        <CardContent>
          {projectsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No projects found</p>
              ) : (
                recentProjects.map((project, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center justify-between p-4 border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-300 bg-gradient-to-r hover:from-primary/5 hover:to-transparent"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-2 h-14 rounded-full ${getStatusColor(project.status)} shadow-sm`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{project.ngo}</p>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
                        {getThemeIcon(project.theme)}
                        <span className="font-medium">{project.theme}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right min-w-[80px]">
                        <div className="text-sm font-bold text-primary mb-1">{project.progress}%</div>
                        <div className="w-20 bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
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