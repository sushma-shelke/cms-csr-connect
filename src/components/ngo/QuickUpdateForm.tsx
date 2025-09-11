import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";

interface QuickUpdateFormData {
  projectId: string;
  updateType: string;
  title: string;
  description: string;
  progress: number;
  challenges: string;
  nextSteps: string;
  mediaCount: number;
}

export function QuickUpdateForm() {
  const [formData, setFormData] = useState<QuickUpdateFormData>({
    projectId: "",
    updateType: "",
    title: "",
    description: "",
    progress: 0,
    challenges: "",
    nextSteps: "",
    mediaCount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateTypes = [
    "Weekly Progress",
    "Monthly Report",
    "Milestone Achievement",
    "Challenge Alert",
    "Budget Update",
    "Media Upload",
  ];

  const projects = [
    "Rural Health Initiative - Phase 1",
    "Education Access Program",
    "Clean Water Project",
    "Livelihood Skills Training",
    "Climate Resilience Project",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Update Submitted Successfully",
        description: "Your quick update has been recorded and sent to CMS Foundation.",
      });
      
      // Reset form
      setFormData({
        projectId: "",
        updateType: "",
        title: "",
        description: "",
        progress: 0,
        challenges: "",
        nextSteps: "",
        mediaCount: 0,
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: keyof QuickUpdateFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Quick Project Update
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Submit a quick status update for your ongoing projects
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={formData.projectId} onValueChange={(value) => handleInputChange("projectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project, index) => (
                    <SelectItem key={index} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="updateType">Update Type</Label>
              <Select value={formData.updateType} onValueChange={(value) => handleInputChange("updateType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select update type" />
                </SelectTrigger>
                <SelectContent>
                  {updateTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Update Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief title for this update"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Progress Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the progress made, activities completed, and key achievements"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Overall Progress (%)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange("progress", parseInt(e.target.value) || 0)}
                className="w-24"
              />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300"
                  style={{ width: `${formData.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium">{formData.progress}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Current Challenges</Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => handleInputChange("challenges", e.target.value)}
              placeholder="Describe any challenges or roadblocks faced"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextSteps">Next Steps</Label>
            <Textarea
              id="nextSteps"
              value={formData.nextSteps}
              onChange={(e) => handleInputChange("nextSteps", e.target.value)}
              placeholder="Outline planned activities for the next period"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mediaCount">Media Files Count</Label>
            <div className="flex items-center gap-2">
              <Input
                id="mediaCount"
                type="number"
                min="0"
                value={formData.mediaCount}
                onChange={(e) => handleInputChange("mediaCount", parseInt(e.target.value) || 0)}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">
                Number of photos/videos being uploaded separately
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Update"}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Save as Draft
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}