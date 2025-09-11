import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Download, 
  Share2, 
  MapPin, 
  Calendar, 
  Tag,
  Image,
  Video,
  FileText,
  Eye,
  Grid3X3,
  List
} from "lucide-react";
import { format } from "date-fns";

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  projectId: string;
  projectName: string;
  uploadedBy: string;
  uploadedAt: Date;
  geoLocation?: { lat: number; lng: number; address: string };
  fileSize: number;
  views: number;
}

const mockMediaItems: MediaItem[] = [
  {
    id: "1",
    type: "image",
    title: "Mobile Health Camp Setup",
    description: "Setting up the mobile health camp in Village A with medical equipment and registration desk",
    url: "/api/placeholder/800/600",
    thumbnailUrl: "/api/placeholder/300/200",
    category: "Project Activities",
    tags: ["health", "camp", "setup", "village"],
    projectId: "rural-health-1",
    projectName: "Rural Health Initiative - Phase 1",
    uploadedBy: "Dr. Priya Sharma",
    uploadedAt: new Date(2024, 8, 10),
    geoLocation: { lat: 19.0760, lng: 72.8777, address: "Village A, Maharashtra" },
    fileSize: 2.4,
    views: 23
  },
  {
    id: "2",
    type: "video",
    title: "Student Digital Literacy Training",
    description: "Recording of students learning basic computer operations in the new digital literacy lab",
    url: "/api/placeholder/video/training.mp4",
    thumbnailUrl: "/api/placeholder/300/200",
    category: "Training Sessions",
    tags: ["education", "digital", "training", "students"],
    projectId: "education-access",
    projectName: "Education Access Program",
    uploadedBy: "Rajesh Kumar",
    uploadedAt: new Date(2024, 8, 9),
    fileSize: 45.6,
    views: 67
  },
  {
    id: "3",
    type: "image",
    title: "Water Well Construction Progress",
    description: "Current progress of borewell construction showing the drilling equipment and site preparation",
    url: "/api/placeholder/800/600",
    thumbnailUrl: "/api/placeholder/300/200",
    category: "Infrastructure",
    tags: ["water", "construction", "borewell", "progress"],
    projectId: "clean-water",
    projectName: "Clean Water Project",
    uploadedBy: "Anita Desai",
    uploadedAt: new Date(2024, 8, 8),
    geoLocation: { lat: 18.5204, lng: 73.8567, address: "Village B, Maharashtra" },
    fileSize: 3.1,
    views: 89
  },
  {
    id: "4",
    type: "document",
    title: "Beneficiary Impact Assessment Report",
    description: "Quarterly assessment report documenting the impact on 450+ beneficiaries served",
    url: "/api/placeholder/document/report.pdf",
    category: "Documentation",
    tags: ["report", "assessment", "impact", "beneficiaries"],
    projectId: "rural-health-1",
    projectName: "Rural Health Initiative - Phase 1",
    uploadedBy: "Dr. Priya Sharma",
    uploadedAt: new Date(2024, 8, 7),
    fileSize: 1.8,
    views: 156
  }
];

export function MediaGallery() {
  const [items] = useState<MediaItem[]>(mockMediaItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  const categories = ["all", "Project Activities", "Training Sessions", "Infrastructure", "Documentation", "Beneficiary Stories"];
  const projects = ["all", "Rural Health Initiative - Phase 1", "Education Access Program", "Clean Water Project"];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesProject = selectedProject === "all" || item.projectName === selectedProject;
    
    return matchesSearch && matchesCategory && matchesProject;
  });

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'video':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Media Gallery</h2>
          <p className="text-muted-foreground">Browse and manage project media files</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search media files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project} value={project}>
                    {project === "all" ? "All Projects" : project}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {items.length} files
        </p>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                {item.type === 'image' && (
                  <img 
                    src={item.thumbnailUrl || item.url} 
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                {item.type === 'video' && (
                  <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {item.type === 'document' && (
                  <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge className={`absolute top-2 right-2 ${getTypeColor(item.type)}`}>
                  {getFileIcon(item.type)}
                  <span className="ml-1 capitalize">{item.type}</span>
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(item.uploadedAt, "MMM dd, yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.views}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{item.title}</DialogTitle>
                          <DialogDescription>{item.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {item.type === 'image' && (
                            <img src={item.url} alt={item.title} className="w-full rounded-lg" />
                          )}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Project:</strong> {item.projectName}
                            </div>
                            <div>
                              <strong>Category:</strong> {item.category}
                            </div>
                            <div>
                              <strong>Uploaded by:</strong> {item.uploadedBy}
                            </div>
                            <div>
                              <strong>File size:</strong> {item.fileSize} MB
                            </div>
                            {item.geoLocation && (
                              <div className="col-span-2">
                                <strong>Location:</strong> {item.geoLocation.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{item.projectName}</span>
                            <span>{item.category}</span>
                            <span>{format(item.uploadedAt, "MMM dd, yyyy")}</span>
                            <span>{item.fileSize} MB</span>
                            {item.geoLocation && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Geo-tagged
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}