// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import {  Clock,  Plus, X, Upload, FileText } from "lucide-react";
// import api from "../../api/axios";

// interface Project {
//   id: number;
//   projectName: string;
//   projectType: string;
//   projectHead: string;
//   projectTheme: string;
//   projectStatus: string;
// }

// interface QuickUpdateFormData {
//   projectId: string;
//   updateType: string;
//   title: string;
//   description: string;
//   progress: number;
//   challenges: string;
//   nextSteps: string;
//   mediaCount: number;
//   // testimonial: string;
//   // caseStudies: string[];
//   // eventReport: string;
// }

// // Updated interface to match expected format
// interface MediaFiles {
//   imageUrl?: string;
//   videoUrl?: string;
//   documentUrl?: string;
// }

// interface UploadedFile {
//   file: File;
//   previewUrl: string;
//   uploadProgress: number;
//   isUploading: boolean;
//   type: 'image' | 'video' | 'document';
// }

// export function QuickUpdateForm() {
//   const [formData, setFormData] = useState<QuickUpdateFormData>({
//     projectId: "",
//     updateType: "",
//     title: "",
//     description: "",
//     progress: 0,
//     challenges: "",
//     nextSteps: "",
//     mediaCount: 0,
//     // testimonial: "",
//     // caseStudies: [""],
//     // eventReport: "",
//   });
  
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [isLoadingProjects, setIsLoadingProjects] = useState(true);
//   const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const { toast } = useToast();

//   const updateTypes = [
//     "Challenge Alert",
//     "Budget Update",
//     "Media Upload",
//     "Event Report",
//     "Case Study",
//     "Testimonial",
//   ];

//   // Fetch projects from API
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setIsLoadingProjects(true);
//         const response = await api.get('/api/projects');
        
//         if (response.data && Array.isArray(response.data)) {
//           setProjects(response.data);
//         } else {
//           console.error('Unexpected API response format:', response.data);
//           toast({
//             title: "Error",
//             description: "Failed to load projects. Unexpected response format.",
//             variant: "destructive",
//           });
//         }
//       } catch (error: any) {
//         console.error('Error fetching projects:', error);
//         toast({
//           title: "Error Loading Projects",
//           description: error.response?.data?.message || "Failed to load projects. Please try again.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoadingProjects(false);
//       }
//     };

//     fetchProjects();
//   }, [toast]);

//   // Categorize files by type
//   const getFileType = (file: File): 'image' | 'video' | 'document' => {
//     const type = file.type.split('/')[0];
//     if (type === 'image') return 'image';
//     if (type === 'video') return 'video';
//     return 'document';
//   };

//   // Handle file selection
//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const newFiles: UploadedFile[] = [];
    
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const previewUrl = URL.createObjectURL(file);
//       const fileType = getFileType(file);
      
//       newFiles.push({
//         file,
//         previewUrl,
//         uploadProgress: 0,
//         isUploading: false,
//         type: fileType,
//       });
//     }

//     setUploadedFiles(prev => [...prev, ...newFiles]);
//   };

//   // Upload files to the server - UPDATED to return single URLs
//   const uploadFiles = async (): Promise<MediaFiles> => {
//     if (uploadedFiles.length === 0) {
//       return {};
//     }

//     setIsUploading(true);
//     const mediaFiles: MediaFiles = {};

//     try {
//       // We'll take only the first file of each type (as per expected format)
//       const imageFiles = uploadedFiles.filter(file => file.type === 'image');
//       const videoFiles = uploadedFiles.filter(file => file.type === 'video');
//       const documentFiles = uploadedFiles.filter(file => file.type === 'document');

//       // Upload first image if exists
//       if (imageFiles.length > 0) {
//         const imageFile = imageFiles[0];
//         setUploadedFiles(prev => 
//           prev.map(file => 
//             file === imageFile ? { ...file, isUploading: true, uploadProgress: 0 } : file
//           )
//         );

//         const formData = new FormData();
//         formData.append('files', imageFile.file);

//         const response = await api.post('/upload/documents', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           onUploadProgress: (progressEvent) => {
//             const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
//             setUploadedFiles(prev => 
//               prev.map(file => 
//                 file === imageFile ? { ...file, uploadProgress: progress } : file
//               )
//             );
//           },
//         });

//         if (response.data.status === 200 && response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
//           mediaFiles.imageUrl = response.data.uploadedUrls[0];
//           setUploadedFiles(prev => 
//             prev.map(file => 
//               file === imageFile ? { ...file, isUploading: false, uploadProgress: 100 } : file
//             )
//           );
//         }
//       }

//       // Upload first video if exists
//       if (videoFiles.length > 0) {
//         const videoFile = videoFiles[0];
//         setUploadedFiles(prev => 
//           prev.map(file => 
//             file === videoFile ? { ...file, isUploading: true, uploadProgress: 0 } : file
//           )
//         );

//         const formData = new FormData();
//         formData.append('files', videoFile.file);

//         const response = await api.post('/upload/documents', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           onUploadProgress: (progressEvent) => {
//             const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
//             setUploadedFiles(prev => 
//               prev.map(file => 
//                 file === videoFile ? { ...file, uploadProgress: progress } : file
//               )
//             );
//           },
//         });

//         if (response.data.status === 200 && response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
//           mediaFiles.videoUrl = response.data.uploadedUrls[0];
//           setUploadedFiles(prev => 
//             prev.map(file => 
//               file === videoFile ? { ...file, isUploading: false, uploadProgress: 100 } : file
//             )
//           );
//         }
//       }

//       // Upload first document if exists
//       if (documentFiles.length > 0) {
//         const documentFile = documentFiles[0];
//         setUploadedFiles(prev => 
//           prev.map(file => 
//             file === documentFile ? { ...file, isUploading: true, uploadProgress: 0 } : file
//           )
//         );

//         const formData = new FormData();
//         formData.append('files', documentFile.file);

//         const response = await api.post('/upload/documents', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           onUploadProgress: (progressEvent) => {
//             const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
//             setUploadedFiles(prev => 
//               prev.map(file => 
//                 file === documentFile ? { ...file, uploadProgress: progress } : file
//               )
//             );
//           },
//         });

//         if (response.data.status === 200 && response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
//           mediaFiles.documentUrl = response.data.uploadedUrls[0];
//           setUploadedFiles(prev => 
//             prev.map(file => 
//               file === documentFile ? { ...file, isUploading: false, uploadProgress: 100 } : file
//             )
//           );
//         }
//       }

//       return mediaFiles;
//     } catch (error) {
//       console.error('File upload error:', error);
//       toast({
//         title: "Upload Failed",
//         description: "Some files failed to upload. Please try again.",
//         variant: "destructive",
//       });
//       return {};
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // First upload all files and get categorized URLs
//       const mediaFiles = await uploadFiles();
      
//       // Calculate total media count based on which URLs we have
//       const totalMediaCount = Object.values(mediaFiles).filter(url => url !== undefined).length;
      
//       // Prepare payload according to expected API format
//       const payload = {
//         project: formData.projectId,
//         updateType: formData.updateType,
//         updateTitle: formData.title,
//         progressDescription: formData.description,
//         overallProgress: Number(formData.progress) || 0,
//         currentChallenges: formData.challenges || "",
//         nextSteps: formData.nextSteps || "",
//         mediaFilesCount: totalMediaCount,
//         mediaFiles: mediaFiles, // Now this matches the expected format
//         status: "Submitted", // Changed to match expected format
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         // testimonial: formData.testimonial || "",
//         // caseStudies: formData.caseStudies.filter(study => study.trim() !== ""),
//         // eventReport: formData.eventReport || "",
//       };

//       console.log("Final payload:", payload);

//       const response = await api.post('/api/quick-updates', payload, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
      
//       toast({
//         title: "Update Submitted Successfully",
//         description: "Your quick update has been recorded and sent to CMS Foundation.",
//       });
      
//       // Reset form
//       setFormData({
//         projectId: "",
//         updateType: "",
//         title: "",
//         description: "",
//         progress: 0,
//         challenges: "",
//         nextSteps: "",
//         mediaCount: 0,
//         // testimonial: "",
//         // caseStudies: [""],
//         // eventReport: "", 
//       });
//       setUploadedFiles([]);
      
//     } catch (error: any) {
//       console.error('Submission error:', error);
//       console.error('Error response:', error.response?.data);
      
//       toast({
//         title: "Submission Failed",
//         description: error.response?.data?.message || "There was an error submitting your update. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleInputChange = (field: keyof QuickUpdateFormData, value: string | number | string[]) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const removeUploadedFile = (index: number) => {
//     const fileToRemove = uploadedFiles[index];
//     URL.revokeObjectURL(fileToRemove.previewUrl); // Clean up object URL
    
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const getFileIcon = (file: UploadedFile) => {
//     switch (file.type) {
//       case 'image':
//         return <FileText className="h-4 w-4 text-green-500" />;
//       case 'video':
//         return <FileText className="h-4 w-4 text-purple-500" />;
//       case 'document':
//         return <FileText className="h-4 w-4 text-blue-500" />;
//       default:
//         return <FileText className="h-4 w-4 text-gray-500" />;
//     }
//   };

//   const handleContainerClick = () => {
//     document.getElementById('file-upload')?.click();
//   };

//   return (
//     <Card className="max-w-6xl mx-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Clock className="h-5 w-5 text-primary" />
//           Quick Project Update
//         </CardTitle>
//         <p className="text-sm text-muted-foreground">
//           Submit a quick status update for your ongoing projects
//         </p>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Project Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="project">Project</Label>
//               <Select 
//                 value={formData.projectId} 
//                 onValueChange={(value) => handleInputChange("projectId", value)}
//                 disabled={isLoadingProjects}
//               >
//                 <SelectTrigger>
//                   <SelectValue 
//                     placeholder={
//                       isLoadingProjects 
//                         ? "Loading projects..." 
//                         : "Select project"
//                     } 
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {projects.map((project) => (
//                     <SelectItem key={project.id} value={project.projectName}>
//                       {project.projectName}
//                     </SelectItem>
//                   ))}
//                   {projects.length === 0 && !isLoadingProjects && (
//                     <SelectItem value="no-projects" disabled>
//                       No projects available
//                     </SelectItem>
//                   )}
//                 </SelectContent>
//               </Select>
//               {isLoadingProjects && (
//                 <p className="text-sm text-muted-foreground">Loading projects...</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="updateType">Update Type</Label>
//               <Select value={formData.updateType} onValueChange={(value) => handleInputChange("updateType", value)}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select update type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {updateTypes.map((type) => (
//                     <SelectItem key={type} value={type}>
//                       {type}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Rest of the form remains the same */}
//           <div className="space-y-2">
//             <Label htmlFor="title">Update Title</Label>
//             <Input
//               id="title"
//               value={formData.title}
//               onChange={(e) => handleInputChange("title", e.target.value)}
//               placeholder="Brief title for this update"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Progress Description</Label>
//             <Textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => handleInputChange("description", e.target.value)}
//               placeholder="Describe the progress made, activities completed, and key achievements"
//               rows={4}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="progress">Overall Progress (%)</Label>
//             <div className="flex items-center gap-4">
//               <Input
//                 id="progress"
//                 type="number"
//                 min="0"
//                 max="100"
//                 value={formData.progress}
//                 onChange={(e) => handleInputChange("progress", parseInt(e.target.value) || 0)}
//                 className="w-24"
//               />
//               <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-gradient-to-r from-primary to-success transition-all duration-300"
//                   style={{ width: `${formData.progress}%` }}
//                 />
//               </div>
//               <span className="text-sm font-medium">{formData.progress}%</span>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="challenges">Current Challenges</Label>
//             <Textarea
//               id="challenges"
//               value={formData.challenges}
//               onChange={(e) => handleInputChange("challenges", e.target.value)}
//               placeholder="Describe any challenges or roadblocks faced"
//               rows={3}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="nextSteps">Next Steps</Label>
//             <Textarea
//               id="nextSteps"
//               value={formData.nextSteps}
//               onChange={(e) => handleInputChange("nextSteps", e.target.value)}
//               placeholder="Outline planned activities for the next period"
//               rows={3}
//             />
//           </div>

//           {/* File Upload Field */}
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="file-upload">Supporting Documents</Label>
//               <div 
//                 className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
//                 onClick={handleContainerClick}
//               >
//                 <Input
//                   id="file-upload"
//                   type="file"
//                   multiple
//                   accept=".pdf,.doc,.docx,.xls,.xlsx,.mp4,.avi,.mov,.png,.jpg,.jpeg,.webp,.gif,.mkv,.webm"
//                   onChange={handleFileSelect}
//                   className="hidden"
//                 />
//                 <div className="flex flex-col items-center gap-2">
//                   <Upload className="h-8 w-8 text-muted-foreground" />
//                   <div>
//                     <p className="font-medium">Upload supporting documents</p>
//                     <p className="text-sm text-muted-foreground">
//                       Images, Videos and Docs supported
//                     </p>
//                   </div>
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     size="sm"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       document.getElementById('file-upload')?.click();
//                     }}
//                   >
//                     Choose Files
//                   </Button>
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   or click anywhere in this area to select files
//                 </p>
//               </div>
//             </div>

//             {/* Uploaded files list */}
//             {uploadedFiles.length > 0 && (
//               <div className="space-y-2">
//                 <Label>Selected Files ({uploadedFiles.length})</Label>
//                 <div className="space-y-2">
//                   {uploadedFiles.map((file, index) => (
//                     <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
//                       <div className="flex items-center gap-3 flex-1">
//                         {getFileIcon(file)}
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate">{file.file.name}</p>
//                           <p className="text-xs text-muted-foreground capitalize">
//                             {file.type} • {(file.file.size / (1024 * 1024)).toFixed(2)} MB
//                           </p>
//                           {file.isUploading && (
//                             <div className="w-full bg-muted rounded-full h-1.5 mt-1">
//                               <div 
//                                 className="bg-primary h-1.5 rounded-full transition-all duration-300"
//                                 style={{ width: `${file.uploadProgress}%` }}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeUploadedFile(index)}
//                         disabled={file.isUploading}
//                         className="h-8 w-8"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="flex gap-3 pt-4">
//             <Button 
//               type="submit" 
//               disabled={isSubmitting || isUploading || !formData.projectId} 
//               className="flex-1"
//             >
//               {isSubmitting || isUploading ? "Uploading and Submitting..." : "Submit Update"}
//             </Button>
//             <Button type="button" variant="outline" className="flex-1">
//               Save as Draft
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {  Clock,  Plus, X, Upload, FileText } from "lucide-react";
import api from "../../api/axios";

interface Project {
  id: number;
  projectName: string;
  projectType: string;
  projectHead: string;
  projectTheme: string;
  projectStatus: string;
}

interface QuickUpdateFormData {
  projectId: string;
  updateType: string;
  title: string;
  description: string;
  progress: number;
  challenges: string;
  nextSteps: string;
  mediaCount: number;
  // testimonial: string;
  // caseStudies: string[];
  // eventReport: string;
}

// Updated interface to match expected format
interface MediaFiles {
  imageUrl?: string;
  videoUrl?: string;
  documentUrl?: string;
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
    // testimonial: "",
    // caseStudies: [""],
    // eventReport: "",
  });
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
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

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoadingProjects(true);
        const response = await api.get('/api/projects');
        
        if (response.data && Array.isArray(response.data)) {
          setProjects(response.data);
        } else {
          console.error('Unexpected API response format:', response.data);
          toast({
            title: "Error",
            description: "Failed to load projects. Unexpected response format.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error Loading Projects",
          description: error.response?.data?.message || "Failed to load projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [toast]);

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

  // Upload files to the server - UPDATED to return single URLs
  const uploadFiles = async (): Promise<MediaFiles> => {
    if (uploadedFiles.length === 0) {
      return {};
    }

    setIsUploading(true);
    const mediaFiles: MediaFiles = {};

    try {
      // We'll take only the first file of each type (as per expected format)
      const imageFiles = uploadedFiles.filter(file => file.type === 'image');
      const videoFiles = uploadedFiles.filter(file => file.type === 'video');
      const documentFiles = uploadedFiles.filter(file => file.type === 'document');

      // Upload first image if exists
      if (imageFiles.length > 0) {
        const imageFile = imageFiles[0];
        setUploadedFiles(prev => 
          prev.map(file => 
            file === imageFile ? { ...file, isUploading: true, uploadProgress: 0 } : file
          )
        );

        const formData = new FormData();
        formData.append('files', imageFile.file);

        const response = await api.post('/upload/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
            setUploadedFiles(prev => 
              prev.map(file => 
                file === imageFile ? { ...file, uploadProgress: progress } : file
              )
            );
          },
        });

        if (response.data.status === 200 && response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
          mediaFiles.imageUrl = response.data.uploadedUrls[0];
          setUploadedFiles(prev => 
            prev.map(file => 
              file === imageFile ? { ...file, isUploading: false, uploadProgress: 100 } : file
            )
          );
        }
      }

      // Upload first video if exists
      if (videoFiles.length > 0) {
        const videoFile = videoFiles[0];
        setUploadedFiles(prev => 
          prev.map(file => 
            file === videoFile ? { ...file, isUploading: true, uploadProgress: 0 } : file
          )
        );

        const formData = new FormData();
        formData.append('files', videoFile.file);

        const response = await api.post('/upload/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
            setUploadedFiles(prev => 
              prev.map(file => 
                file === videoFile ? { ...file, uploadProgress: progress } : file
              )
            );
          },
        });

        if (response.data.status === 200 && response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
          mediaFiles.videoUrl = response.data.uploadedUrls[0];
          setUploadedFiles(prev => 
            prev.map(file => 
              file === videoFile ? { ...file, isUploading: false, uploadProgress: 100 } : file
            )
          );
        }
      }

      // Upload first document if exists
      if (documentFiles.length > 0) {
        const documentFile = documentFiles[0];
        setUploadedFiles(prev => 
          prev.map(file => 
            file === documentFile ? { ...file, isUploading: true, uploadProgress: 0 } : file
          )
        );

        const formData = new FormData();
        formData.append('files', documentFile.file);

        const response = await api.post('/upload/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
            setUploadedFiles(prev => 
              prev.map(file => 
                file === documentFile ? { ...file, uploadProgress: progress } : file
              )
            );
          },
        });

        if (response.data.status === 200 && response.data.uploadedUrls && response.data.uploadedUrls.length > 0) {
          mediaFiles.documentUrl = response.data.uploadedUrls[0];
          setUploadedFiles(prev => 
            prev.map(file => 
              file === documentFile ? { ...file, isUploading: false, uploadProgress: 100 } : file
            )
          );
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
      return {};
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
      
      // Calculate total media count based on which URLs we have
      const totalMediaCount = Object.values(mediaFiles).filter(url => url !== undefined).length;
      
      // Prepare payload according to expected API format
      const payload = {
        project: formData.projectId,
        updateType: formData.updateType,
        updateTitle: formData.title,
        progressDescription: formData.description,
        overallProgress: Number(formData.progress) || 0,
        currentChallenges: formData.challenges || "",
        nextSteps: formData.nextSteps || "",
        mediaFilesCount: totalMediaCount,
        mediaFiles: mediaFiles, // Now this matches the expected format
        status: "Submitted", // Changed to match expected format
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // testimonial: formData.testimonial || "",
        // caseStudies: formData.caseStudies.filter(study => study.trim() !== ""),
        // eventReport: formData.eventReport || "",
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
        // testimonial: "",
        // caseStudies: [""],
        // eventReport: "", 
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
          {/* Project Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select 
                value={formData.projectId} 
                onValueChange={(value) => handleInputChange("projectId", value)}
                disabled={isLoadingProjects}
              >
                <SelectTrigger>
                  <SelectValue 
                    placeholder={
                      isLoadingProjects 
                        ? "Loading projects..." 
                        : "Select project"
                    } 
                  />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.projectName}>
                      {project.projectName}
                    </SelectItem>
                  ))}
                  {projects.length === 0 && !isLoadingProjects && (
                    <SelectItem value="no-projects" disabled>
                      No projects available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {isLoadingProjects && (
                <p className="text-sm text-muted-foreground">Loading projects...</p>
              )}
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

          {/* Rest of the form remains the same */}
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
              disabled={isSubmitting || isUploading || !formData.projectId} 
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