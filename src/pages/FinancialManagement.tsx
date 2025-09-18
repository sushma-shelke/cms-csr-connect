import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  PieChart,
  BarChart3,
  DollarSign,
  Target,
  Wallet,
  Calculator,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Mock financial data
const mockFinancialData = {
  totalBudget: 50000000, // 5 Crores
  allocatedBudget: 45000000, // 4.5 Crores
  spentBudget: 32000000, // 3.2 Crores
  remainingBudget: 18000000, // 1.8 Crores
  thematicAllocations: [
    { theme: "Health", allocated: 15000000, spent: 12000000, projects: 5 },
    { theme: "Education", allocated: 12000000, spent: 8500000, projects: 4 },
    { theme: "Climate Resilience", allocated: 8000000, spent: 5500000, projects: 3 },
    { theme: "Livelihood", allocated: 7000000, spent: 4500000, projects: 4 },
    { theme: "Government Convergence", allocated: 3000000, spent: 1500000, projects: 2 },
  ],
  ivdpAllocations: [
    { program: "Village A Development", allocated: 8000000, spent: 6200000, progress: 78 },
    { program: "Village B Development", allocated: 6500000, spent: 4800000, progress: 74 },
    { program: "Village C Development", allocated: 5500000, spent: 3100000, progress: 56 },
  ]
};

export default function FinancialManagement() {
  const { user } = useAuth();
  const [overallBudget, setOverallBudget] = useState(mockFinancialData.totalBudget);
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  const isAdmin = user?.role === 'admin';
  const budgetUtilization = (mockFinancialData.spentBudget / mockFinancialData.allocatedBudget) * 100;

  const handleUpdateBudget = () => {
    if (newBudgetAmount && !isNaN(Number(newBudgetAmount))) {
      setOverallBudget(Number(newBudgetAmount));
      setShowBudgetDialog(false);
      setNewBudgetAmount("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Management</h1>
          <p className="text-muted-foreground">
            Budget allocation, tracking and expenditure management
          </p>
        </div>
        {isAdmin && (
          <Dialog>
  <DialogTrigger asChild>
    <Button className="bg-primary">
      <Plus className="h-4 w-4 mr-2" /> Add Financial Record
    </Button>
  </DialogTrigger>
<DialogContent className="max-w-3xl w-full max-h-[80vh] overflow-y-auto hide-scrollbar">
    <DialogHeader>
      <DialogTitle>New Financial Entry</DialogTitle>
      <DialogDescription>Record allocations and expenditures.</DialogDescription>
    </DialogHeader>

    <form className="space-y-4">
      {/* <div>
        <Label htmlFor="totalBudget">Total Budget (₹)</Label>
        <Input id="totalBudget" type="number" placeholder="Enter total budget" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="allocated">Allocated Budget (₹)</Label>
          <Input id="allocated" type="number" placeholder="Enter allocated" />
        </div>
        <div>
          <Label htmlFor="spent">Spent Budget (₹)</Label>
          <Input id="spent" type="number" placeholder="Enter spent" />
        </div>
      </div> */}

      <div>
        <Label htmlFor="theme">Thematic Area</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="climate">Climate Resilience</SelectItem>
            <SelectItem value="livelihood">Livelihood</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="themeAllocated">Fund Allocated (₹)</Label>
          <Input id="themeAllocated" type="number" />
        </div>
        {/* <div>
          <Label htmlFor="themeSpent">Theme Spent (₹)</Label>
          <Input id="themeSpent" type="number" />
        </div> */}
      </div>

      {/* <div>
        <Label htmlFor="projects">No. of Projects</Label>
        <Input id="projects" type="number" />
      </div>

      <div>
        <Label htmlFor="reports">Reports Pending</Label>
        <Input id="reports" type="number" />
      </div> */}

      <div>
        <Label htmlFor="period">Period</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">1 Year</SelectItem>
            <SelectItem value="quarterly">2 Years</SelectItem>
            <SelectItem value="quarterly">3 Years</SelectItem>
            <SelectItem value="quarterly">4 Years</SelectItem>
            <SelectItem value="quarterly">5 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="reset" variant="outline">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

        )}
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">₹{(overallBudget / 10000000).toFixed(1)}Cr</p>
              </div>
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Allocated Budget</p>
                <p className="text-2xl font-bold">₹{(mockFinancialData.allocatedBudget / 10000000).toFixed(1)}Cr</p>
              </div>
              <Target className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Spent Budget</p>
                <p className="text-2xl font-bold">₹{(mockFinancialData.spentBudget / 10000000).toFixed(1)}Cr</p>
              </div>
              <TrendingDown className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Utilization</p>
                <p className="text-2xl font-bold">{budgetUtilization.toFixed(1)}%</p>
              </div>
              <Calculator className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Overall Budget Utilization</h3>
              <Badge variant={budgetUtilization > 80 ? "destructive" : "secondary"}>
                {budgetUtilization.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={budgetUtilization} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{(mockFinancialData.spentBudget / 10000000).toFixed(1)}Cr spent</span>
              <span>₹{(mockFinancialData.remainingBudget / 10000000).toFixed(1)}Cr remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="thematic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="thematic">
            <PieChart className="h-4 w-4 mr-2" />
            Thematic Allocation
          </TabsTrigger>
          <TabsTrigger value="ivdp">
            <BarChart3 className="h-4 w-4 mr-2" />
            IVDP Allocation
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            Financial Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thematic">
          <Card>
            <CardHeader>
              <CardTitle>Thematic Wise Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFinancialData.thematicAllocations.map((allocation, index) => {
                  const utilization = (allocation.spent / allocation.allocated) * 100;
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold">{allocation.theme}</h4>
                          <p className="text-sm text-muted-foreground">{allocation.projects} projects</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(allocation.allocated / 10000000).toFixed(1)}Cr</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{(allocation.spent / 10000000).toFixed(1)}Cr spent
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Utilization</span>
                          <span>{utilization.toFixed(1)}%</span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ivdp">
          <Card>
            <CardHeader>
              <CardTitle>Integrated Village Development Program Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFinancialData.ivdpAllocations.map((program, index) => {
                  const utilization = (program.spent / program.allocated) * 100;
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold">{program.program}</h4>
                          <p className="text-sm text-muted-foreground">Progress: {program.progress}%</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{(program.allocated / 10000000).toFixed(1)}Cr</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{(program.spent / 10000000).toFixed(1)}Cr spent
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Budget Utilization</span>
                            <span>{utilization.toFixed(1)}%</span>
                          </div>
                          <Progress value={utilization} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Implementation Progress</span>
                            <span>{program.progress}%</span>
                          </div>
                          <Progress value={program.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Expenditure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <span>Total Allocated</span>
                    <span className="font-semibold">₹{(mockFinancialData.allocatedBudget / 10000000).toFixed(1)}Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-warning/10 rounded">
                    <span>Total Spent</span>
                    <span className="font-semibold">₹{(mockFinancialData.spentBudget / 10000000).toFixed(1)}Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded">
                    <span>Remaining</span>
                    <span className="font-semibold">₹{(mockFinancialData.remainingBudget / 10000000).toFixed(1)}Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-info/10 rounded">
                    <span>Efficiency Rate</span>
                    <span className="font-semibold">{budgetUtilization.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Project Budget</span>
                    <span className="font-semibold">₹{((mockFinancialData.allocatedBudget / 18) / 1000000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cost per Beneficiary</span>
                    <span className="font-semibold">₹{(mockFinancialData.spentBudget / 4100).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Burn Rate</span>
                    <span className="font-semibold">₹{((mockFinancialData.spentBudget / 8) / 1000000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fund Utilization Rate</span>
                    <span className="font-semibold">{((mockFinancialData.spentBudget / overallBudget) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}