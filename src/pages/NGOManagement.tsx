/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Plus, Search, MapPin, Star, Users, FileText } from "lucide-react";
// import { useLocation, Link } from "react-router-dom";

// const ngoData = [
//   {
//     id: 1,
//     name: "Health Care Foundation",
//     location: "Mumbai, Maharashtra",
//     theme: "Health",
//     rating: 4.8,
//     activeProjects: 5,
//     totalProjects: 12,
//     status: "Active",
//     email: "contact@healthcarefoundation.org",
//     phone: "+91 98765 43210"
//   },
//   {
//     id: 2,
//     name: "Education First NGO",
//     location: "Delhi, NCR",
//     theme: "Education",
//     rating: 4.5,
//     activeProjects: 3,
//     totalProjects: 8,
//     status: "Active",
//     email: "info@educationfirst.org",
//     phone: "+91 98765 43211"
//   },
//   {
//     id: 3,
//     name: "Green Earth Society",
//     location: "Bangalore, Karnataka",
//     theme: "Climate Resilience",
//     rating: 4.2,
//     activeProjects: 2,
//     totalProjects: 6,
//     status: "Under Review",
//     email: "hello@greenearthsociety.org",
//     phone: "+91 98765 43212"
//   },
//   {
//     id: 4,
//     name: "Rural Livelihood Trust",
//     location: "Pune, Maharashtra",
//     theme: "Livelihood",
//     rating: 4.6,
//     activeProjects: 4,
//     totalProjects: 10,
//     status: "Active",
//     email: "support@rurallivelihood.org",
//     phone: "+91 98765 43213"
//   }
// ];

// export default function NGOManagement() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedNGO, setSelectedNGO] = useState<typeof ngoData[0] | null>(null);

//   const filteredNGOs = ngoData.filter(ngo =>
//     ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ngo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ngo.theme.toLowerCase().includes(searchTerm.toLowerCase())
//   );


//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-impact-green text-white";
//       case "Under Review":
//         return "bg-impact-yellow text-white";
//       case "Inactive":
//         return "bg-impact-red text-white";
//       default:
//         return "bg-muted";
//     }
//   };

//   const getThemeColor = (theme: string) => {
//     switch (theme) {
//       case "Health":
//         return "text-thematic-health";
//       case "Education":
//         return "text-thematic-education";
//       case "Climate Resilience":
//         return "text-thematic-climate";
//       case "Livelihood":
//         return "text-thematic-livelihood";
//       default:
//         return "text-muted-foreground";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">NGO Partners</h1>
//           <p className="text-muted-foreground">
//             Manage your CSR implementation partners and track their performance
//           </p>
//         </div>
//         <Link to="/add-ngo" >
//         <Button className="bg-primary">
//           <Plus className="h-4 w-4 mr-2" />
//           Add NGO
//         </Button>
//         </Link>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card style={{ borderLeft:'5px solid #6F49F8' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
//                 <p className="text-2xl font-bold">{ngoData.length}</p>
//               </div>
//               <Users className="h-8 w-8 text-primary" />
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card style={{ borderLeft:'5px solid #8ECE33FF' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
//                 <p className="text-2xl font-bold">
//                   {ngoData.reduce((sum, ngo) => sum + ngo.activeProjects, 0)}
//                 </p>
//               </div>
//               <FileText className="h-8 w-8 " color="#8ECE33FF" />
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card style={{ borderLeft:'5px solid #FFB800' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
//                 <p className="text-2xl font-bold">
//                   {(ngoData.reduce((sum, ngo) => sum + ngo.rating, 0) / ngoData.length).toFixed(1)}
//                 </p>
//               </div>
//               <Star className="h-8 w-8 " color="#FFB800" />
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card style={{ borderLeft:'5px solid #FF74DAFF' }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Under Review</p>
//                 <p className="text-2xl font-bold">
//                   {ngoData.filter(ngo => ngo.status === "Under Review").length}
//                 </p>
//               </div>
//               <MapPin className="h-8 w-8 " color="#FF74DAFF" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search and Filter */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Partner Organizations</CardTitle>
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//                 <Input
//                   placeholder="Search NGOs..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 w-80"
//                 />
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Organization</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Theme</TableHead>
//                 <TableHead>Rating</TableHead>
//                 <TableHead>Projects</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredNGOs.map((ngo) => (
//                 <TableRow key={ngo.id}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar>
//                         <AvatarImage src={`/api/placeholder/40/40?text=${ngo.name.charAt(0)}`} />
//                         <AvatarFallback className="bg-primary text-primary-foreground">
//                           {ngo.name.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium">{ngo.name}</p>
//                         <p className="text-sm text-muted-foreground">{ngo.email}</p>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-1">
//                       <MapPin className="h-4 w-4 text-muted-foreground" />
//                       {ngo.location}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span className={`font-medium ${getThemeColor(ngo.theme)}`}>
//                       {ngo.theme}
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-1">
//                       <Star className="h-4 w-4 text-warning fill-current" />
//                       {ngo.rating}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="text-sm">
//                       <span className="font-medium">{ngo.activeProjects}</span>
//                       <span className="text-muted-foreground"> / {ngo.totalProjects}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={getStatusColor(ngo.status)}>
//                       {ngo.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Dialog>
//                       <DialogTrigger asChild>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelectedNGO(ngo)}
//                         >
//                           View Details
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="max-w-2xl">
//                         <DialogHeader>
//                           <DialogTitle className="flex items-center gap-3">
//                             <Avatar>
//                               <AvatarFallback className="bg-primary text-primary-foreground">
//                                 {ngo.name.charAt(0)}
//                               </AvatarFallback>
//                             </Avatar>
//                             {ngo.name}
//                           </DialogTitle>
//                           <DialogDescription>
//                             Detailed information about this NGO partner
//                           </DialogDescription>
//                         </DialogHeader>
//                         <div className="grid gap-4 py-4">
//                           <div className="grid grid-cols-2 gap-4">
//                             <div>
//                               <label className="text-sm font-medium text-muted-foreground">
//                                 Location
//                               </label>
//                               <p className="flex items-center gap-1 mt-1">
//                                 <MapPin className="h-4 w-4" />
//                                 {ngo.location}
//                               </p>
//                             </div>
//                             <div>
//                               <label className="text-sm font-medium text-muted-foreground">
//                                 Primary Theme
//                               </label>
//                               <p className={`mt-1 font-medium ${getThemeColor(ngo.theme)}`}>
//                                 {ngo.theme}
//                               </p>
//                             </div>
//                             <div>
//                               <label className="text-sm font-medium text-muted-foreground">
//                                 Performance Rating
//                               </label>
//                               <div className="flex items-center gap-1 mt-1">
//                                 <Star className="h-4 w-4 text-warning fill-current" />
//                                 <span className="font-medium">{ngo.rating}/5.0</span>
//                               </div>
//                             </div>
//                             <div>
//                               <label className="text-sm font-medium text-muted-foreground">
//                                 Project Portfolio
//                               </label>
//                               <p className="mt-1">
//                                 <span className="font-medium">{ngo.activeProjects} active</span>
//                                 <span className="text-muted-foreground"> / {ngo.totalProjects} total</span>
//                               </p>
//                             </div>
//                             <div>
//                               <label className="text-sm font-medium text-muted-foreground">
//                                 Email
//                               </label>
//                               <p className="mt-1">{ngo.email}</p>
//                             </div>
//                             <div>
//                               <label className="text-sm font-medium text-muted-foreground">
//                                 Phone
//                               </label>
//                               <p className="mt-1">{ngo.phone}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </DialogContent>
//                     </Dialog>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }.

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, MapPin, Users, FileText, Trash2, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { getNgos, getNgosById, updateNgos, deleteNgos } from "../api/ngo";
import { useNavigate } from "react-router-dom";



export default function NGOManagement() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNGO, setSelectedNGO] = useState<any | null>(null);
  const [editingNGO, setEditingNGO] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch all NGOs
  const fetchNgos = async () => {
    try {
      setLoading(true);
      const data = await getNgos();
      setNgos(data || []);
    } catch (error) {
      console.error("Error fetching NGOs:", error);
      setNgos([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch NGO by ID
  const fetchNgoById = async (id: number) => {
    try {
      const data = await getNgosById(id);
      setSelectedNGO(data || null);
      setEditingNGO(data || null);
    } catch (error) {
      console.error("Error fetching NGO by ID:", error);
      setSelectedNGO(null);
      setEditingNGO(null);
    }
  };

  // Delete NGO
  const handleDeleteNgo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this NGO?")) return;
    try {
      await deleteNgos(id);
      setNgos(prev => prev.filter(ngo => ngo.id !== id));
    } catch (error) {
      console.error("Error deleting NGO:", error);
    }
  };

  // Update NGO
const navigate = useNavigate();

const handleUpdateNgo = async () => {
  if (!editingNGO || !editingNGO.id) return;
  try {
    const updatedNgo = await updateNgos(editingNGO.id, editingNGO);
    setNgos(prev => prev.map(ngo => (ngo.id === updatedNgo.id ? updatedNgo : ngo)));
    setSelectedNGO(updatedNgo);
    alert("NGO updated successfully!");
    
    navigate("/ngos"); 
  } catch (error) {
    console.error("Error updating NGO:", error);
    alert("Failed to update NGO.");
  }
};

  useEffect(() => {
    fetchNgos();
  }, []);

  // Safe filtering
  const filteredNGOs = ngos.filter(
    (ngo) =>
      ngo.ngoName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.areasOfIntervention?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">NGO Partners</h1>
          <p className="text-muted-foreground">
            Manage your CSR implementation partners and track their performance
          </p>
        </div>
        <Link to="/add-ngo">
          <Button className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add NGO
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card style={{ borderLeft: "5px solid #6F49F8" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
                <p className="text-2xl font-bold">{ngos.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft: "5px solid #8ECE33FF" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {ngos.reduce((sum, ngo) => sum + (ngo.orgBudget || 0), 0)}
                </p>
              </div>
              <FileText className="h-8 w-8" color="#8ECE33FF" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft: "5px solid #FFB800" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">
                  {ngos.reduce((sum, ngo) => sum + (ngo.totalExpenses || 0), 0)}
                </p>
              </div>
              <FileText className="h-8 w-8" color="#FFB800" />
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderLeft: "5px solid #FF74DAFF" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volunteers</p>
                <p className="text-2xl font-bold">
                  {ngos.filter(ngo => ngo.volunteerOpportunities).length}
                </p>
              </div>
              <Users className="h-8 w-8" color="#FF74DAFF" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Partner Organizations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search NGOs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading NGOs...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Interventions</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Volunteers</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNGOs.map((ngo) => (
                  <TableRow key={ngo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/api/placeholder/40/40?text=${ngo.ngoName?.charAt(0)}`} />
                          <AvatarFallback>{ngo.ngoName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{ngo.ngoName}</p>
                          <p className="text-sm text-muted-foreground">{ngo.founder}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{ngo.location}</TableCell>
                    <TableCell>{ngo.areasOfIntervention}</TableCell>
                    <TableCell>{ngo.orgBudget}</TableCell>
                    <TableCell>{ngo.totalExpenses}</TableCell>
                    <TableCell>{ngo.volunteerOpportunities ? "Yes" : "No"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => fetchNgoById(ngo.id)}>
                            Edit
                          </Button>
                        </DialogTrigger>
                        {selectedNGO?.id === ngo.id && editingNGO && (
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto hide-scrollbar">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{ngo.ngoName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {ngo.ngoName}
                              </DialogTitle>
                              <DialogDescription>
                                Detailed information and editing
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                              <label className="text-sm font-medium text-muted-foreground mb-1">NGO Name</label>
                              <Input
                                value={editingNGO.ngoName || ""}
                                onChange={(e) =>
                                  setEditingNGO({ ...editingNGO, ngoName: e.target.value })
                                }
                              />
                              <label className="text-sm font-medium text-muted-foreground mb-1">Founder</label>
                              <Input
                                value={editingNGO.founder || ""}
                                onChange={(e) =>
                                  setEditingNGO({ ...editingNGO, founder: e.target.value })
                                }
                              />
                              <label className="text-sm font-medium text-muted-foreground mb-1">Location</label>
                              <Input
                                value={editingNGO.location || ""}
                                onChange={(e) =>
                                  setEditingNGO({ ...editingNGO, location: e.target.value })
                                }
                              />
                              <label className="text-sm font-medium text-muted-foreground mb-1">Areas of Intervention</label>
                              <Input
                                value={editingNGO.areasOfIntervention || ""}
                                onChange={(e) =>
                                  setEditingNGO({ ...editingNGO, areasOfIntervention: e.target.value })
                                }
                              />
                              <label className="text-sm font-medium text-muted-foreground mb-1">Budget</label>
                              <Input
                                type="number"
                                value={editingNGO.orgBudget || 0}
                                onChange={(e) =>
                                  setEditingNGO({ ...editingNGO, orgBudget: Number(e.target.value) })
                                }
                              />
                              <label className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</label>
                              <Input
                                type="number"
                                value={editingNGO.totalExpenses || 0}
                                onChange={(e) =>
                                  setEditingNGO({ ...editingNGO, totalExpenses: Number(e.target.value) })
                                }
                              />
                              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                              <Button
                                className="bg-primary hover:bg-primary/90"
                                onClick={handleUpdateNgo}
                                variant="outline"
                                style={{ color: 'white', width: 'fit-content'  }}
                              >
                                    Update NGO
                              </Button></div>
                            </div>
                          </DialogContent>
                        )}
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteNgo(ngo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
