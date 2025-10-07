import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Target, TrendingUp, Plus, X, Upload, FileText } from "lucide-react";
import { Star } from "lucide-react";
import api from "../../api/axios";

interface QuickUpdateFormData {
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

interface MediaFiles {
  images: string[];
  videos: string[];
  documents: string[];
}

interface UploadedFile {
  file: File;
  previewUrl: string;
  uploadProgress: number;
  isUploading: boolean;
  type: 'image' | 'video' | 'document';
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
    testimonial: "",
    caseStudies: [""],
    eventReport: "",
  });
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const updateTypes = [
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

  // Categorize files by type
  const getFileType = (file: File): 'image' | 'video' | 'document' => {
    const type = file.type.split('/')[0];
    if (type === 'image') return 'image';
    if (type === 'video') return 'video';
    return 'document';
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      const fileType = getFileType(file);
      
      newFiles.push({
        file,
        previewUrl,
        uploadProgress: 0,
        isUploading: false,
        type: fileType,
      });
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Upload files to the server
  const uploadFiles = async (): Promise<MediaFiles> => {
    if (uploadedFiles.length === 0) {
      return { images: [], videos: [], documents: [] };
    }

    setIsUploading(true);
    const mediaFiles: MediaFiles = {
      images: [],
      videos: [],
      documents: []
    };

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const uploadedFile = uploadedFiles[i];
        
        // Update file status to uploading
        setUploadedFiles(prev => 
          prev.map((file, index) => 
            index === i ? { ...file, isUploading: true, uploadProgress: 0 } : file
          )
        );

        const formData = new FormData();
        formData.append('files', uploadedFile.file);

        const response = await api.post('/upload/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
            setUploadedFiles(prev => 
              prev.map((file, index) => 
                index === i ? { ...file, uploadProgress: progress } : file
              )
            );
          },
        });

        if (response.data.status === 200 && response.data.uploadedUrls) {
          // Categorize the uploaded URLs
          response.data.uploadedUrls.forEach((url: string) => {
            switch (uploadedFile.type) {
              case 'image':
                mediaFiles.images.push(url);
                break;
              case 'video':
                mediaFiles.videos.push(url);
                break;
              case 'document':
                mediaFiles.documents.push(url);
                break;
            }
          });
          
          // Update file status to completed
          setUploadedFiles(prev => 
            prev.map((file, index) => 
              index === i ? { ...file, isUploading: false, uploadProgress: 100 } : file
            )
          );
        } else {
          throw new Error('Upload failed');
        }
      }

      return mediaFiles;
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Some files failed to upload. Please try again.",
        variant: "destructive",
      });
      return { images: [], videos: [], documents: [] };
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First upload all files and get categorized URLs
      const mediaFiles = await uploadFiles();
      
      // Calculate total media count
      const totalMediaCount = mediaFiles.images.length + mediaFiles.videos.length + mediaFiles.documents.length;
      
      // Prepare payload according to API format
      const payload = {
        project: formData.projectId,
        updateType: formData.updateType,
        updateTitle: formData.title,
        progressDescription: formData.description,
        overallProgress: Number(formData.progress) || 0,
        currentChallenges: formData.challenges || "",
        nextSteps: formData.nextSteps || "",
        mediaFilesCount: totalMediaCount,
        mediaFiles: mediaFiles,
        // Add other required fields
        status: "In Progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Include additional fields from your form if needed
        testimonial: formData.testimonial || "",
        caseStudies: formData.caseStudies.filter(study => study.trim() !== ""),
        eventReport: formData.eventReport || "",
      };

      console.log("Final payload:", payload);

      const response = await api.post('/api/quick-updates', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
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
        testimonial: "",
        caseStudies: [""],
        eventReport: "",
      });
      setUploadedFiles([]);
      
    } catch (error: any) {
      console.error('Submission error:', error);
      console.error('Error response:', error.response?.data);
      
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "There was an error submitting your update. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const removeUploadedFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    URL.revokeObjectURL(fileToRemove.previewUrl); // Clean up object URL
    
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: UploadedFile) => {
    switch (file.type) {
      case 'image':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'video':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'document':
        return <FileText className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleContainerClick = () => {
    document.getElementById('file-upload')?.click();
  };

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
          {/* Existing form fields remain the same */}
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

          {/* File Upload Field */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Supporting Documents</Label>
              <div 
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onClick={handleContainerClick}
              >
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.mp4,.avi,.mov,.png,.jpg,.jpeg,.webp,.gif,.mkv,.webm"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Upload supporting documents</p>
                    <p className="text-sm text-muted-foreground">
                      Images, Videos and Docs supported
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('file-upload')?.click();
                    }}
                  >
                    Choose Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  or click anywhere in this area to select files
                </p>
              </div>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({uploadedFiles.length})</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        {getFileIcon(file)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.file.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {file.type} • {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                          {file.isUploading && (
                            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${file.uploadProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUploadedFile(index)}
                        disabled={file.isUploading}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading} 
              className="flex-1"
            >
              {isSubmitting || isUploading ? "Uploading and Submitting..." : "Submit Update"}
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