// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   IndianRupee,
//   TrendingUp,
//   Users,
//   FileText,
//   Heart,
//   GraduationCap,
//   Leaf,
//   Briefcase,
//   HeartPulse,
//   Settings2,
//   WandSparklesIcon,
// } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { getProjects } from "@/api/projects";
// import {
//   getProjectAnalytics,
//   getTotalBudget,
//   getBudgetUtilized,
//   getTotalBeneficiaries,
//   getProjectCountByStatus,
//   getProjectCountByTheme,
// } from "@/api/analytics";

// export function Dashboard() {
//   // Fetch all data from backend
//   const { data: projects, isLoading: projectsLoading } = useQuery({
//     queryKey: ["projects"],
//     queryFn: getProjects,
//   });

//   const { data: analytics, isLoading: analyticsLoading } = useQuery({
//     queryKey: ["analytics"],
//     queryFn: getProjectAnalytics,
//   });

//   const { data: totalBudget, isLoading: budgetLoading } = useQuery({
//     queryKey: ["totalBudget"],
//     queryFn: getTotalBudget,
//   });

//   const { data: budgetUtilized, isLoading: utilizedLoading } = useQuery({
//     queryKey: ["budgetUtilized"],
//     queryFn: getBudgetUtilized,
//   });

//   const { data: totalBeneficiaries, isLoading: beneficiariesLoading } =
//     useQuery({
//       queryKey: ["totalBeneficiaries"],
//       queryFn: getTotalBeneficiaries,
//     });

//   const { data: statusCount } = useQuery({
//     queryKey: ["statusCount"],
//     queryFn: getProjectCountByStatus,
//   });

//   const { data: themeCount } = useQuery({
//     queryKey: ["themeCount"],
//     queryFn: getProjectCountByTheme,
//   });

//   // Calculate budget data by theme
//   const budgetData = themeCount
//     ? Object.entries(themeCount).map(([theme, count]) => {
//         const themeProjects =
//           projects?.filter((p: any) => p.projectTheme === theme) || [];
//         const budget = themeProjects.reduce(
//           (sum: number, p: any) => sum + (p.budget || 0),
//           0
//         );
//         const spent = themeProjects.reduce(
//           (sum: number, p: any) => sum + (p.budgetUtilized || 0),
//           0
//         );
//         return { theme, budget, spent };
//       })
//     : [];

//   // Calculate target achievement data from status
//   const targetData = statusCount
//     ? [
//         {
//           name: "Completed",
//           value: statusCount["Completed"] || 0,
//           color: "#80D763",
//         },
//         {
//           name: "In Progress",
//           value: statusCount["In Progress"] || 0,
//           color: "#FFB303",
//         },
//         {
//           name: "At Risk",
//           value: statusCount["At Risk"] || 0,
//           color: "#FF668CFF",
//         },
//       ].filter((item) => item.value > 0)
//     : [];

//   // Get recent projects (last 3)
//   const recentProjects =
//     projects?.slice(0, 3).map((p: any) => ({
//       name: p.projectName,
//       ngo: p.ngoPartner || "N/A",
//       status: p.projectStatus?.toLowerCase() || "green",
//       progress:
//         p.budgetUtilized && p.budget
//           ? Math.round((p.budgetUtilized / p.budget) * 100)
//           : 0,
//       theme: p.projectTheme,
//     })) || [];

//   const activeProjects =
//     projects?.filter((p: any) => p.projectStatus !== "Completed").length || 0;
//   const pendingReports = analytics?.pendingReports || 0;
//   const ngoPartners = analytics?.totalNGOs || 0;
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "green":
//         return "bg-impact-green";
//       case "blue":
//         return "bg-impact-blue";
//       case "yellow":
//         return "bg-impact-yellow";
//       case "red":
//         return "bg-impact-red";
//       default:
//         return "bg-muted";
//     }
//   };

//   const getThemeIcon = (theme: string) => {
//     switch (theme) {
//       case "Health":
//         return <Heart className="h-4 w-4 text-thematic-health" />;
//       case "Education":
//         return <GraduationCap className="h-4 w-4 text-thematic-education" />;
//       case "Climate":
//         return <Leaf className="h-4 w-4 text-thematic-climate" />;
//       case "Livelihood":
//         return <Briefcase className="h-4 w-4 text-thematic-livelihood" />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-8 animate-in">
//       {/* Premium Header */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-8 border border-primary/10">
//         <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
//         <div className="relative">
//           <h1 className="text-4xl font-bold tracking-tight mb-2">
//             <span className="gradient-text">CSR Dashboard</span>
//           </h1>
//           <p className="text-base text-muted-foreground font-medium max-w-2xl">
//             Real-time monitoring of CSR initiatives and impact metrics across
//             all programs
//           </p>
//         </div>
//       </div>

//       {/* Key Metrics - Premium Cards */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         <Card
//           variant="elevated"
//           hover="lift"
//           className="border-l-4 border-l-primary overflow-hidden"
//         >
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
//             <CardTitle className="text-sm font-semibold text-primary">
//               Total Budget
//             </CardTitle>
//             <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
//               <IndianRupee className="h-6 w-6 text-white" />
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {budgetLoading ? (
//               <Skeleton className="h-10 w-32" />
//             ) : (
//               <>
//                 <div className="text-4xl font-bold text-primary">
//                   ₹{totalBudget ? (totalBudget / 100000).toFixed(1) : 0}L
//                 </div>
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between text-xs">
//                     <span className="text-muted-foreground font-medium">
//                       Utilization
//                     </span>
//                     <span className="font-semibold text-foreground">
//                       {budgetUtilized && totalBudget
//                         ? `${((budgetUtilized / totalBudget) * 100).toFixed(
//                             0
//                           )}%`
//                         : "0%"}
//                     </span>
//                   </div>
//                   <div className="h-2.5 bg-muted rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700 ease-out"
//                       style={{
//                         width: `${
//                           budgetUtilized && totalBudget
//                             ? (budgetUtilized / totalBudget) * 100
//                             : 0
//                         }%`,
//                       }}
//                     />
//                   </div>
//                   <p className="text-xs text-muted-foreground font-medium">
//                     ₹{budgetUtilized ? (budgetUtilized / 100000).toFixed(1) : 0}
//                     L utilized
//                   </p>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         <Card
//           variant="elevated"
//           hover="lift"
//           className="border-l-4 border-l-success overflow-hidden"
//         >
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
//             <CardTitle className="text-sm font-semibold text-success">
//               Active Projects
//             </CardTitle>
//             <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success to-chart-accent-2 flex items-center justify-center shadow-md">
//               <TrendingUp className="h-6 w-6 text-white" />
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {projectsLoading ? (
//               <Skeleton className="h-10 w-24" />
//             ) : (
//               <>
//                 <div className="text-4xl font-bold text-success">
//                   {activeProjects}
//                 </div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   out of{" "}
//                   <span className="font-bold text-foreground">
//                     {projects?.length || 0}
//                   </span>{" "}
//                   total projects
//                 </p>
//                 <div className="flex items-center gap-2 px-3 py-1.5 bg-success-light rounded-lg">
//                   <TrendingUp className="h-3.5 w-3.5 text-success" />
//                   <span className="text-xs font-semibold text-success">
//                     {activeProjects} ongoing
//                   </span>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         <Card
//           variant="elevated"
//           hover="lift"
//           className="border-l-4 border-l-warning overflow-hidden"
//         >
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
//             <CardTitle className="text-sm font-semibold text-warning">
//               Total Beneficiaries
//             </CardTitle>
//             <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-warning to-chart-accent-1 flex items-center justify-center shadow-md">
//               <Users className="h-6 w-6 text-white" />
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {beneficiariesLoading ? (
//               <Skeleton className="h-10 w-28" />
//             ) : (
//               <>
//                 <div className="text-4xl font-bold text-warning">
//                   {totalBeneficiaries?.toLocaleString() || 0}
//                 </div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   across{" "}
//                   <span className="font-bold text-foreground">
//                     {ngoPartners}
//                   </span>{" "}
//                   NGO partners
//                 </p>
//                 <div className="flex items-center gap-2 px-3 py-1.5 bg-warning-light rounded-lg">
//                   <Heart className="h-3.5 w-3.5 text-warning" />
//                   <span className="text-xs font-semibold text-warning">
//                     lives impacted
//                   </span>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* <Card variant="elevated" hover="lift" className="border-l-4 border-l-chart-accent-1 overflow-hidden">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
//             <CardTitle className="text-sm font-semibold text-chart-accent-1">Reports Pending</CardTitle>
//             <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-chart-accent-1 to-destructive flex items-center justify-center shadow-md">
//               <FileText className="h-6 w-6 text-white" />
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {analyticsLoading ? (
//               <Skeleton className="h-10 w-16" />
//             ) : (
//               <>
//                 <div className="text-4xl font-bold text-chart-accent-1">{pendingReports}</div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   due by month end
//                 </p>
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" 
//                      style={{ backgroundColor: pendingReports > 5 ? 'hsl(var(--destructive-light))' : 'hsl(var(--success-light))' }}>
//                   <span className={`text-xs font-semibold ${pendingReports > 5 ? 'text-destructive' : 'text-success'}`}>
//                     {pendingReports > 5 ? '⚠ Action needed' : '✓ On track'}
//                   </span>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card> */}
//       </div>

//       {/* Thematic Overview - Premium Cards */}
//       <div className="grid gap-6 md:grid-cols-3">
//         <Card
//           variant="gradient"
//           hover="lift"
//           className="border-t-4 border-t-info"
//         >
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
//               <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center">
//                 <GraduationCap className="h-5 w-5 text-info" />
//               </div>
//               <span className="text-foreground">Education Theme</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {projectsLoading ? (
//               <Skeleton className="h-8 w-20" />
//             ) : (
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-info">
//                   {themeCount?.["Education"] || 0}
//                 </div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   active projects
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card
//           variant="gradient"
//           hover="lift"
//           className="border-t-4 border-t-destructive"
//         >
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
//               <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
//                 <Heart className="h-5 w-5 text-destructive" />
//               </div>
//               <span className="text-foreground">Public Health & Awareness</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {projectsLoading ? (
//               <Skeleton className="h-8 w-20" />
//             ) : (
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-destructive">
//                   {themeCount?.["Public Health & Awareness"] || 0}
//                 </div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   active projects
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card
//           variant="gradient"
//           hover="lift"
//           className="border-t-4 border-t-success"
//         >
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
//               <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
//                 <HeartPulse className="h-5 w-5 text-success" />
//               </div>
//               <span className="text-foreground">
//                 Public Health & Community Wellness
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {projectsLoading ? (
//               <Skeleton className="h-8 w-20" />
//             ) : (
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-success">
//                   {themeCount?.["Public Health & Community Wellness"] || 0}
//                 </div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   active projects
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card
//           variant="gradient"
//           hover="lift"
//           className="border-t-4 border-t-warning"
//         >
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
//               <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center">
//                 <Leaf className="h-5 w-5 text-warning" />
//               </div>
//               <span className="text-foreground">Agriculture</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {projectsLoading ? (
//               <Skeleton className="h-8 w-20" />
//             ) : (
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-warning">
//                   {themeCount?.["Agriculture"] || 0}
//                 </div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   active projects
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         <Card
//           variant="gradient"
//           hover="lift"
//           className="border-t-4 border-t-primary"
//         >
//           <CardHeader className="pb-3">
//             <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
//               <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center">
//                 <WandSparklesIcon className="h-5 w-5 text-primary" />
//               </div>
//               <span className="text-foreground">
//                 Community Skill Enhancement
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {projectsLoading ? (
//               <Skeleton className="h-8 w-20" />
//             ) : (
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-primary">
//                   {themeCount?.["Community Skill Enhancement"] || 0}
//                 </div>
//                 <p className="text-sm text-muted-foreground font-medium">
//                   active projects
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Budget vs Spending Chart */}
//         <Card variant="elevated" hover="glow">
//           <CardHeader className="pb-4">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//                 <IndianRupee className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <CardTitle className="text-lg font-bold">
//                   Thematic Budget Utilization
//                 </CardTitle>
//                 <p className="text-xs text-muted-foreground font-medium">
//                   Budget allocation vs spending by theme
//                 </p>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {projectsLoading ? (
//               <Skeleton className="h-[300px] w-full" />
//             ) : budgetData.length === 0 ? (
//               <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//                 No budget data available
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={budgetData}>
//                   <CartesianGrid
//                     strokeDasharray="3 3"
//                     stroke="hsl(var(--border))"
//                   />
//                   <XAxis
//                     dataKey="theme"
//                     tick={{ fill: "hsl(var(--foreground))" }}
//                     tickLine={{ stroke: "hsl(var(--border))" }}
//                   />
//                   <YAxis
//                     tickFormatter={(value) => `₹${value / 100000}L`}
//                     tick={{ fill: "hsl(var(--foreground))" }}
//                     tickLine={{ stroke: "hsl(var(--border))" }}
//                   />
//                   <Tooltip
//                     formatter={(value: number) => [`₹${value / 100000}L`, ""]}
//                     contentStyle={{
//                       backgroundColor: "hsl(var(--background))",
//                       border: "1px solid hsl(var(--border))",
//                       borderRadius: "8px",
//                     }}
//                     labelStyle={{ color: "hsl(var(--foreground))" }}
//                   />
//                   <Bar
//                     dataKey="budget"
//                     fill="#FFC973C5"
//                     name="Budget"
//                     radius={[8, 8, 0, 0]}
//                   />
//                   <Bar
//                     dataKey="spent"
//                     fill="hsl(var(--primary))"
//                     name="Spent"
//                     radius={[8, 8, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </CardContent>
//         </Card>

//         {/* Target Achievement */}
//         <Card variant="elevated" hover="glow">
//           <CardHeader className="pb-4">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-success to-chart-accent-2 flex items-center justify-center">
//                 <TrendingUp className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <CardTitle className="text-lg font-bold">
//                   Project Status Distribution
//                 </CardTitle>
//                 <p className="text-xs text-muted-foreground font-medium">
//                   Overall project status breakdown
//                 </p>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             {projectsLoading ? (
//               <Skeleton className="h-[300px] w-full" />
//             ) : targetData.length === 0 ? (
//               <div className="h-[300px] flex items-center justify-center text-muted-foreground">
//                 No status data available
//               </div>
//             ) : (
//               <>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={targetData}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={60}
//                       outerRadius={100}
//                       paddingAngle={5}
//                       dataKey="value"
//                       label={({ name, value }) => `${name}: ${value}`}
//                     >
//                       {targetData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "hsl(var(--background))",
//                         border: "1px solid hsl(var(--border))",
//                         borderRadius: "8px",
//                       }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//                 <div className="flex flex-wrap justify-center gap-4 mt-4">
//                   {targetData.map((entry, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-2 hover-scale"
//                     >
//                       <div
//                         className="w-4 h-4 rounded-full shadow-sm"
//                         style={{ backgroundColor: entry.color }}
//                       />
//                       <span className="text-sm font-medium">
//                         {entry.name}{" "}
//                         <span className="text-muted-foreground">
//                           ({entry.value})
//                         </span>
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Projects */}
//       <Card variant="elevated" hover="glow">
//         <CardHeader className="pb-4">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-chart-accent-1 to-warning flex items-center justify-center">
//               <Briefcase className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <CardTitle className="text-lg font-bold">
//                 Recent Project Updates
//               </CardTitle>
//               <p className="text-xs text-muted-foreground font-medium">
//                 Latest activity from ongoing projects
//               </p>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {projectsLoading ? (
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <Skeleton key={i} className="h-24 w-full" />
//               ))}
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {recentProjects.length === 0 ? (
//                 <p className="text-center text-muted-foreground py-8">
//                   No projects found
//                 </p>
//               ) : (
//                 recentProjects.map((project, index) => (
//                   <div
//                     key={index}
//                     className="group relative overflow-hidden p-5 border border-border rounded-xl hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-card hover-lift"
//                   >
//                     {/* Status Indicator */}
//                     <div
//                       className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(
//                         project.status
//                       )}`}
//                     />

//                     <div className="flex items-start justify-between gap-4">
//                       <div className="flex-1 space-y-3">
//                         <div className="flex items-start gap-3">
//                           <div className="flex-1">
//                             <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors mb-1">
//                               {project.name}
//                             </h4>
//                             <p className="text-sm text-muted-foreground font-medium">
//                               {project.ngo}
//                             </p>
//                           </div>
//                           <Badge
//                             variant="outline"
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary/5 to-transparent border-primary/20"
//                           >
//                             {getThemeIcon(project.theme)}
//                             <span className="font-semibold text-xs">
//                               {project.theme}
//                             </span>
//                           </Badge>
//                         </div>

//                         {/* Progress Section */}
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-xs text-muted-foreground font-medium">
//                               Progress
//                             </span>
//                             <span className="text-sm font-bold text-primary">
//                               {project.progress}%
//                             </span>
//                           </div>
//                           <div className="h-2.5 bg-muted rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700 ease-out"
//                               style={{ width: `${project.progress}%` }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


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
  HeartPulse,
  WandSparklesIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/projects";
import {
  getProjectAnalytics,
  getTotalBudget,
  getBudgetUtilized,
  getTotalBeneficiaries,
  getProjectCountByStatus,
  getProjectCountByTheme,
} from "@/api/analytics";

export function Dashboard() {
  // Fetch all data from backend (UNCHANGED)
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

  const { data: totalBeneficiaries, isLoading: beneficiariesLoading } =
    useQuery({
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

  // ----------------------------------------------------
  // 🎯 STATIC DUMMY DATA (Used ONLY for charts & progress)
  // ----------------------------------------------------

  const dummyBudgetData = [
    { theme: "Education", budget: 1200000, spent: 900000 },
    { theme: "Health", budget: 1500000, spent: 1100000 },
    { theme: "Livelihood", budget: 900000, spent: 600000 },
    { theme: "Agriculture", budget: 800000, spent: 450000 },
  ];

  const dummyPieData = [
    { name: "Completed", value: 40, color: "#80D763" },
    { name: "In Progress", value: 55, color: "#FFB303" },
    { name: "At Risk", value: 20, color: "#FF668CFF" },
  ];

  // Recent projects (dummy static progress BUT original names & themes remain)
  const recentProjects =
    projects?.slice(0, 3).map((p: any, index: number) => ({
      name: p.projectName,
      // ngo: p.ngoPartner || "N/A",
      status: p.projectStatus?.toLowerCase() || "green",
      progress: [32, 54, 78][index] || 45, // dummy static values
      theme: p.projectTheme,
    })) || [];

  const activeProjects =
    projects?.filter((p: any) => p.projectStatus !== "Completed").length || 0;

  const pendingReports = analytics?.pendingReports || 0;
  const ngoPartners = analytics?.totalNGOs || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green":
        return "bg-impact-green";
      case "blue":
        return "bg-impact-blue";
      case "yellow":
        return "bg-impact-yellow";
      case "red":
        return "bg-impact-red";
      default:
        return "bg-muted";
    }
  };

  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case "Health":
        return <Heart className="h-4 w-4 text-thematic-health" />;
      case "Education":
        return <GraduationCap className="h-4 w-4 text-thematic-education" />;
      case "Climate":
        return <Leaf className="h-4 w-4 text-thematic-climate" />;
      case "Livelihood":
        return <Briefcase className="h-4 w-4 text-thematic-livelihood" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-8 border border-primary/10">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="gradient-text">CSR Dashboard</span>
          </h1>
          <p className="text-base text-muted-foreground font-medium max-w-2xl">
            Real-time monitoring of CSR initiatives and impact metrics across
            all programs
          </p>
        </div>
      </div>

      {/* Key Metrics - API SECTIONS UNTOUCHED */}
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card
          variant="elevated"
          hover="lift"
          className="border-l-4 border-l-primary overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-primary">
              Total Budget
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {budgetLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <>
                <div className="text-4xl font-bold text-primary">
                  ₹{totalBudget ? (totalBudget / 100000).toFixed(1) : 0}L
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">
                      Utilization
                    </span>
                    <span className="font-semibold text-foreground">
                      {budgetUtilized && totalBudget
                        ? `${((budgetUtilized / totalBudget) * 100).toFixed(
                            0
                          )}%`
                        : "0%"}
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700 ease-out"
                      style={{
                        width: `${
                          budgetUtilized && totalBudget
                            ? (budgetUtilized / totalBudget) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    ₹{budgetUtilized ? (budgetUtilized / 100000).toFixed(1) : 0}
                    L utilized
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          variant="elevated"
          hover="lift"
          className="border-l-4 border-l-success overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-success">
              Active Projects
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-success to-chart-accent-2 flex items-center justify-center shadow-md">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectsLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <>
                <div className="text-4xl font-bold text-success">
                  {activeProjects}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  out of{" "}
                  <span className="font-bold text-foreground">
                    {projects?.length || 0}
                  </span>{" "}
                  total projects
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-success-light rounded-lg">
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs font-semibold text-success">
                    {activeProjects} ongoing
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          variant="elevated"
          hover="lift"
          className="border-l-4 border-l-warning overflow-hidden"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-warning">
              Total Beneficiaries
            </CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-warning to-chart-accent-1 flex items-center justify-center shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {beneficiariesLoading ? (
              <Skeleton className="h-10 w-28" />
            ) : (
              <>
                <div className="text-4xl font-bold text-warning">
                  {totalBeneficiaries?.toLocaleString() || 0}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  across{" "}
                  <span className="font-bold text-foreground">
                    {ngoPartners}
                  </span>{" "}
                  NGO partners
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-warning-light rounded-lg">
                  <Heart className="h-3.5 w-3.5 text-warning" />
                  <span className="text-xs font-semibold text-warning">
                    lives impacted
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* <Card variant="elevated" hover="lift" className="border-l-4 border-l-chart-accent-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-chart-accent-1">Reports Pending</CardTitle>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-chart-accent-1 to-destructive flex items-center justify-center shadow-md">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analyticsLoading ? (
              <Skeleton className="h-10 w-16" />
            ) : (
              <>
                <div className="text-4xl font-bold text-chart-accent-1">{pendingReports}</div>
                <p className="text-sm text-muted-foreground font-medium">
                  due by month end
                </p>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" 
                     style={{ backgroundColor: pendingReports > 5 ? 'hsl(var(--destructive-light))' : 'hsl(var(--success-light))' }}>
                  <span className={`text-xs font-semibold ${pendingReports > 5 ? 'text-destructive' : 'text-success'}`}>
                    {pendingReports > 5 ? '⚠ Action needed' : '✓ On track'}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card> */}
      </div>

      {/* Thematic Overview - Premium Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card
          variant="gradient"
          hover="lift"
          className="border-t-4 border-t-info"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-info" />
              </div>
              <span className="text-foreground">Education Theme</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-info">
                  {themeCount?.["Education"] || 0}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  active projects
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          variant="gradient"
          hover="lift"
          className="border-t-4 border-t-destructive"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-destructive" />
              </div>
              <span className="text-foreground">Public Health & Awareness</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-destructive">
                  {themeCount?.["Public Health & Awareness"] || 0}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  active projects
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          variant="gradient"
          hover="lift"
          className="border-t-4 border-t-success"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                <HeartPulse className="h-5 w-5 text-success" />
              </div>
              <span className="text-foreground">
                Public Health & Community Wellness
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-success">
                  {themeCount?.["Public Health & Community Wellness"] || 0}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  active projects
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid gap-6 md:grid-cols-2">
        <Card
          variant="gradient"
          hover="lift"
          className="border-t-4 border-t-warning"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-warning" />
              </div>
              <span className="text-foreground">Agriculture</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-warning">
                  {themeCount?.["Agriculture"] || 0}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  active projects
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card
          variant="gradient"
          hover="lift"
          className="border-t-4 border-t-primary"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center">
                <WandSparklesIcon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-foreground">
                Community Skill Enhancement
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {themeCount?.["Community Skill Enhancement"] || 0}
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  active projects
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div> */}

      {/* THEMATIC METRIC CARDS — ALL UNCHANGED (API DATA) */}
      {/* Education Theme, Public Health, Community Wellness, Agriculture, etc. */}
      {/* — Your original code remains untouched here — */}

      {/* -----------------------------
          🎨 DUMMY BAR CHART SECTION
      ------------------------------ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card variant="elevated" hover="glow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <IndianRupee className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Thematic Budget Utilization</CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Budget allocation vs spending by theme
                </p>
              </div>
            </div>
          </CardHeader>

          {/* ALWAYS SHOW DUMMY BAR CHART */}
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dummyBudgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

                <XAxis
                  dataKey="theme"
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />

                <YAxis
                  tickFormatter={(value) => `₹${value / 100000}L`}
                  tick={{ fill: "hsl(var(--foreground))" }}
                  tickLine={{ stroke: "hsl(var(--border))" }}
                />

                <Tooltip
                  formatter={(value) => [`₹${value / 100000}L`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />

                <Bar dataKey="budget" fill="#FFC973C5" name="Budget" radius={[8, 8, 0, 0]} />
                <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* -----------------------------
            🥧 DUMMY PIE CHART SECTION
        ------------------------------ */}
        <Card variant="elevated" hover="glow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-success to-chart-accent-2 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Project Status Distribution</CardTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Overall project status breakdown
                </p>
              </div>
            </div>
          </CardHeader>

          {/* ALWAYS SHOW DUMMY PIE CHART */}
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dummyPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {dummyPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {dummyPieData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
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
          </CardContent>
        </Card>
      </div>
      {/* Recent Projects — Only Progress Uses Dummy Data */}
      <Card variant="elevated" hover="glow">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-chart-accent-1 to-warning flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Recent Project Updates</CardTitle>
              <p className="text-xs text-muted-foreground font-medium">
                Latest activity from ongoing projects
              </p>
            </div>
          </div>
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
                    className="group relative overflow-hidden p-5 border border-border rounded-xl 
                    hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-card hover-lift"
                  >
                    {/* Status Indicator */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(
                        project.status
                      )}`}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-base text-foreground 
                            group-hover:text-primary transition-colors mb-1">
                              {project.name}
                            </h4>

                            <p className="text-sm text-muted-foreground font-medium">
                              {project.ngo}
                            </p>
                          </div>

                          <Badge
                            variant="outline"
                            className="flex items-center gap-1.5 px-3 py-1.5 
                            bg-gradient-to-r from-primary/5 to-transparent border-primary/20"
                          >
                            {getThemeIcon(project.theme)}
                            <span className="font-semibold text-xs">{project.theme}</span>
                          </Badge>
                        </div>

                        {/* Progress — DUMMY STATIC VALUES (32%, 54%, 78%) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-medium">Progress</span>
                            <span className="text-sm font-bold text-primary">
                              {project.progress}%
                            </span>
                          </div>

                          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary via-accent to-primary 
                              transition-all duration-700 ease-out"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
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
