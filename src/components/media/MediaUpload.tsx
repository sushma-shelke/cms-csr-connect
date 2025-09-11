import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Image, 
  Video, 
  MapPin, 
  Calendar, 
  Tag, 
  X,
  Camera,
  FileText
} from "lucide-react";

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'document';
  preview: string;
  geoLocation?: { lat: number; lng: number; address: string };
  uploadProgress: number;
  metadata: {
    title: string;
    description: string;
    category: string;
    tags: string[];
    projectId: string;
    capturedAt: Date;
  };
}

export function MediaUpload() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categories = [
    "Project Activities",
    "Beneficiary Stories", 
    "Infrastructure",
    "Training Sessions",
    "Community Events",
    "Before/After",
    "Documentation",
    "Compliance"
  ];

  const projects = [
    "Rural Health Initiative - Phase 1",
    "Education Access Program", 
    "Clean Water Project",
    "Livelihood Skills Training",
    "Climate Resilience Project"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    selectedFiles.forEach(file => {
      const fileType = file.type.startsWith('image/') ? 'image' : 
                      file.type.startsWith('video/') ? 'video' : 'document';
      
      const newFile: MediaFile = {
        id: crypto.randomUUID(),
        file,
        type: fileType,
        preview: fileType === 'image' ? URL.createObjectURL(file) : '',
        uploadProgress: 0,
        metadata: {
          title: file.name.split('.')[0],
          description: '',
          category: '',
          tags: [],
          projectId: '',
          capturedAt: new Date()
        }
      };

      // Try to get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            newFile.geoLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              address: 'Location captured'
            };
            setFiles(prev => [...prev, newFile]);
          },
          () => {
            setFiles(prev => [...prev, newFile]);
          }
        );
      } else {
        setFiles(prev => [...prev, newFile]);
      }
    });
  };

  const updateFileMetadata = (fileId: string, field: string, value: any) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, metadata: { ...file.metadata, [field]: value } }
        : file
    ));
  };

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return;
    
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            metadata: { 
              ...file.metadata, 
              tags: [...file.metadata.tags, tag.trim()] 
            }
          }
        : file
    ));
  };

  const removeTag = (fileId: string, tagIndex: number) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            metadata: { 
              ...file.metadata, 
              tags: file.metadata.tags.filter((_, index) => index !== tagIndex)
            }
          }
        : file
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    for (const file of files) {
      for (let progress = 0; progress <= 100; progress += 10) {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, uploadProgress: progress } : f
        ));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    toast({
      title: "Upload Successful",
      description: `${files.length} files uploaded successfully with metadata and geo-location.`,
    });
    
    setFiles([]);
    setIsUploading(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Media Upload & Evidence Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload photos, videos, and documents with automatic geo-tagging and metadata
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Upload Zone */}
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Media Files</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click to browse or drag and drop your files here
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPEG, PNG, MP4, MOV, PDF, DOC (Max 50MB per file)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Files to Upload ({files.length})</h3>
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading || files.some(f => !f.metadata.category || !f.metadata.projectId)}
                  >
                    {isUploading ? "Uploading..." : "Upload All Files"}
                  </Button>
                </div>

                {files.map((file) => (
                  <Card key={file.id} className="p-4">
                    <div className="space-y-4">
                      {/* File Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {file.type === 'image' && file.preview && (
                            <img 
                              src={file.preview} 
                              alt={file.metadata.title}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.type)}
                              <span className="font-medium">{file.file.name}</span>
                              <Badge variant="outline">{file.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {(file.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            {file.geoLocation && (
                              <div className="flex items-center gap-1 text-sm text-success">
                                <MapPin className="h-3 w-3" />
                                Location captured
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{file.uploadProgress}%</span>
                          </div>
                          <Progress value={file.uploadProgress} className="h-2" />
                        </div>
                      )}

                      {/* Metadata Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={file.metadata.title}
                            onChange={(e) => updateFileMetadata(file.id, 'title', e.target.value)}
                            placeholder="Enter title"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Project</Label>
                          <Select 
                            value={file.metadata.projectId} 
                            onValueChange={(value) => updateFileMetadata(file.id, 'projectId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project} value={project}>
                                  {project}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select 
                            value={file.metadata.category} 
                            onValueChange={(value) => updateFileMetadata(file.id, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Capture Date</Label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {file.metadata.capturedAt.toLocaleDateString()}
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={file.metadata.description}
                            onChange={(e) => updateFileMetadata(file.id, 'description', e.target.value)}
                            placeholder="Describe what this media shows..."
                            rows={2}
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label>Tags</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {file.metadata.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {tag}
                                <button
                                  onClick={() => removeTag(file.id, index)}
                                  className="ml-1 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder="Add tags (press Enter)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addTag(file.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}