import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Target, TrendingUp, Plus, X } from "lucide-react";
import { Star } from "lucide-react"; // add this import


interface QuickUpdateFormData {
  // rating: number;
  projectId: string;
  updateType: string;
  title: string;
  description: string;
  progress: number;
  challenges: string;
  nextSteps: string;
  mediaCount: number;
  testimonial: string;
  caseStudies: string[];
  eventReport: string;
}

export function QuickUpdateForm() {
  const [formData, setFormData] = useState<QuickUpdateFormData>({
    // rating: 0,
    projectId: "",
    updateType: "",
    title: "",
    description: "",
    progress: 0,
    challenges: "",
    nextSteps: "",
    mediaCount: 0,
    testimonial: "",
    caseStudies: [""],
    eventReport: "",
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
    "Event Report",
    "Case Study",
    "Testimonial",
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
        // rating: 0,
        projectId: "",
        updateType: "",
        title: "",
        description: "",
        progress: 0,
        challenges: "",
        nextSteps: "",
        mediaCount: 0,
        testimonial: "",
        caseStudies: [""],
        eventReport: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: keyof QuickUpdateFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCaseStudyChange = (index: number, value: string) => {
    const updatedCaseStudies = [...formData.caseStudies];
    updatedCaseStudies[index] = value;
    setFormData(prev => ({ ...prev, caseStudies: updatedCaseStudies }));
  };

  const addCaseStudy = () => {
    setFormData(prev => ({ 
      ...prev, 
      caseStudies: [...prev.caseStudies, ""] 
    }));
  };

  const removeCaseStudy = (index: number) => {
    if (formData.caseStudies.length > 1) {
      const updatedCaseStudies = formData.caseStudies.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, caseStudies: updatedCaseStudies }));
    }
  };
  // const handleRating = (value: number) => {
  //   setFormData(prev => ({ ...prev, rating: value }));
  //   console.log("Rating:", value); // log rating
  // };
  return (
    <Card className="max-w-6xl mx-auto">
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

          {/* Testimonial Field */}
          <div className="space-y-2">
            <Label htmlFor="testimonial">Testimonial</Label>
            <Textarea
              id="testimonial"
              value={formData.testimonial}
              onChange={(e) => handleInputChange("testimonial", e.target.value)}
              placeholder="Share a testimonial from beneficiaries or stakeholders"
              rows={3}
            />
          </div>

          {/* Case Studies Field */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Case Studies</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                onClick={addCaseStudy}
                className="h-8 w-8 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.caseStudies.map((caseStudy, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Textarea
                  value={caseStudy}
                  onChange={(e) => handleCaseStudyChange(index, e.target.value)}
                  placeholder={`Case study ${index + 1} - Describe a specific success story or impact example`}
                  rows={3}
                  className="flex-1"
                />
                {formData.caseStudies.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    onClick={() => removeCaseStudy(index)}
                    className="h-10 w-10 rounded-full mt-0.5"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

           {/* ⭐ Rating Field */}
          {/* <div className="space-y-2">
            <Label>Project Rating</Label>
            <div className="flex gap-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => handleRating(star)}
                />
              ))}
            </div>
          </div> */}

          {/* existing fields below */}

          {/* Event Report Field */}
          <div className="space-y-2">
            <Label htmlFor="eventReport">Event Report</Label>
            <Textarea
              id="eventReport"
              value={formData.eventReport}
              onChange={(e) => handleInputChange("eventReport", e.target.value)}
              placeholder="Provide details about any events, workshops, or community gatherings"
              rows={4}
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