// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useEffect } from "react";
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
// import { Plus, Search, MapPin, Users, FileText, Trash2, Save } from "lucide-react";
// import { Link } from "react-router-dom";
// import { getNgos, getNgosById, updateNgos, deleteNgos } from "../api/ngo";
// import { useNavigate } from "react-router-dom";



// export default function NGOManagement() {
//   const [ngos, setNgos] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedNGO, setSelectedNGO] = useState<any | null>(null);
//   const [editingNGO, setEditingNGO] = useState<any | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch all NGOs
//   const fetchNgos = async () => {
//     try {
//       setLoading(true);
//       const data = await getNgos();
//       setNgos(data || []);
//     } catch (error) {
//       console.error("Error fetching NGOs:", error);
//       setNgos([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch NGO by ID
//   const fetchNgoById = async (id: number) => {
//     try {
//       const data = await getNgosById(id);
//       setSelectedNGO(data || null);
//       setEditingNGO(data || null);
//     } catch (error) {
//       console.error("Error fetching NGO by ID:", error);
//       setSelectedNGO(null);
//       setEditingNGO(null);
//     }
//   };

//   // Delete NGO
//   const handleDeleteNgo = async (id: number) => {
//     if (!confirm("Are you sure you want to delete this NGO?")) return;
//     try {
//       await deleteNgos(id);
//       setNgos(prev => prev.filter(ngo => ngo.id !== id));
//     } catch (error) {
//       console.error("Error deleting NGO:", error);
//     }
//   };

//   // Update NGO
// const navigate = useNavigate();

// const handleUpdateNgo = async () => {
//   if (!editingNGO || !editingNGO.id) return;
//   try {
//     const updatedNgo = await updateNgos(editingNGO.id, editingNGO);
//     setNgos(prev => prev.map(ngo => (ngo.id === updatedNgo.id ? updatedNgo : ngo)));
//     setSelectedNGO(updatedNgo);
//     alert("NGO updated successfully!");
    
//     navigate("/ngos"); 
//   } catch (error) {
//     console.error("Error updating NGO:", error);
//     alert("Failed to update NGO.");
//   }
// };

//   useEffect(() => {
//     fetchNgos();
//   }, []);

//   // Safe filtering
//   const filteredNGOs = ngos.filter(
//     (ngo) =>
//       ngo.ngoName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ngo.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ngo.areasOfIntervention?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">NGO Partners</h1>
//           <p className="text-muted-foreground">
//             Manage your CSR implementation partners and track their performance
//           </p>
//         </div>
//         <Link to="/add-ngo">
//           <Button className="bg-primary">
//             <Plus className="h-4 w-4 mr-2" />
//             Add NGO
//           </Button>
//         </Link>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card style={{ borderLeft: "5px solid #6F49F8" }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Total Partners</p>
//                 <p className="text-2xl font-bold">{ngos.length}</p>
//               </div>
//               <Users className="h-8 w-8 text-primary" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card style={{ borderLeft: "5px solid #8ECE33FF" }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
//                 <p className="text-2xl font-bold">
//                   {ngos.reduce((sum, ngo) => sum + (ngo.orgBudget || 0), 0)}
//                 </p>
//               </div>
//               <FileText className="h-8 w-8" color="#8ECE33FF" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card style={{ borderLeft: "5px solid #FFB800" }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
//                 <p className="text-2xl font-bold">
//                   {ngos.reduce((sum, ngo) => sum + (ngo.totalExpenses || 0), 0)}
//                 </p>
//               </div>
//               <FileText className="h-8 w-8" color="#FFB800" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card style={{ borderLeft: "5px solid #FF74DAFF" }}>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-muted-foreground">Volunteers</p>
//                 <p className="text-2xl font-bold">
//                   {ngos.filter(ngo => ngo.volunteerOpportunities).length}
//                 </p>
//               </div>
//               <Users className="h-8 w-8" color="#FF74DAFF" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search and Table */}
//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>Partner Organizations</CardTitle>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search NGOs..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 w-80"
//               />
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <p>Loading NGOs...</p>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Organization</TableHead>
//                   <TableHead>Location</TableHead>
//                   <TableHead>Interventions</TableHead>
//                   <TableHead>Budget</TableHead>
//                   <TableHead>Expenses</TableHead>
//                   <TableHead>Volunteers</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredNGOs.map((ngo) => (
//                   <TableRow key={ngo.id}>
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar>
//                           <AvatarImage src={`/api/placeholder/40/40?text=${ngo.ngoName?.charAt(0)}`} />
//                           <AvatarFallback>{ngo.ngoName?.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <p className="font-medium">{ngo.ngoName}</p>
//                           <p className="text-sm text-muted-foreground">{ngo.founder}</p>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>{ngo.location}</TableCell>
//                     <TableCell>{ngo.areasOfIntervention}</TableCell>
//                     <TableCell>{ngo.orgBudget}</TableCell>
//                     <TableCell>{ngo.totalExpenses}</TableCell>
//                     <TableCell>{ngo.volunteerOpportunities ? "Yes" : "No"}</TableCell>
//                     <TableCell className="flex gap-2">
//                       <Dialog>
//                         <DialogTrigger asChild>
//                           <Button variant="outline" size="sm" onClick={() => fetchNgoById(ngo.id)}>
//                             Edit
//                           </Button>
//                         </DialogTrigger>
//                         {selectedNGO?.id === ngo.id && editingNGO && (
//                           <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto hide-scrollbar">
//                             <DialogHeader>
//                               <DialogTitle className="flex items-center gap-3">
//                                 <Avatar>
//                                   <AvatarFallback>{ngo.ngoName?.charAt(0)}</AvatarFallback>
//                                 </Avatar>
//                                 {ngo.ngoName}
//                               </DialogTitle>
//                               <DialogDescription>
//                                 Detailed information and editing
//                               </DialogDescription>
//                             </DialogHeader>

//                             <div className="grid gap-4 py-4">
//                               <label className="text-sm font-medium text-muted-foreground mb-1">NGO Name</label>
//                               <Input
//                                 value={editingNGO.ngoName || ""}
//                                 onChange={(e) =>
//                                   setEditingNGO({ ...editingNGO, ngoName: e.target.value })
//                                 }
//                               />
//                               <label className="text-sm font-medium text-muted-foreground mb-1">Founder</label>
//                               <Input
//                                 value={editingNGO.founder || ""}
//                                 onChange={(e) =>
//                                   setEditingNGO({ ...editingNGO, founder: e.target.value })
//                                 }
//                               />
//                               <label className="text-sm font-medium text-muted-foreground mb-1">Location</label>
//                               <Input
//                                 value={editingNGO.location || ""}
//                                 onChange={(e) =>
//                                   setEditingNGO({ ...editingNGO, location: e.target.value })
//                                 }
//                               />
//                               <label className="text-sm font-medium text-muted-foreground mb-1">Areas of Intervention</label>
//                               <Input
//                                 value={editingNGO.areasOfIntervention || ""}
//                                 onChange={(e) =>
//                                   setEditingNGO({ ...editingNGO, areasOfIntervention: e.target.value })
//                                 }
//                               />
//                               <label className="text-sm font-medium text-muted-foreground mb-1">Budget</label>
//                               <Input
//                                 type="number"
//                                 value={editingNGO.orgBudget || 0}
//                                 onChange={(e) =>
//                                   setEditingNGO({ ...editingNGO, orgBudget: Number(e.target.value) })
//                                 }
//                               />
//                               <label className="text-sm font-medium text-muted-foreground mb-1">Total Expenses</label>
//                               <Input
//                                 type="number"
//                                 value={editingNGO.totalExpenses || 0}
//                                 onChange={(e) =>
//                                   setEditingNGO({ ...editingNGO, totalExpenses: Number(e.target.value) })
//                                 }
//                               />
//                               <div style={{ display:'flex', justifyContent:'flex-end' }}>
//                               <Button
//                                 className="bg-primary hover:bg-primary/90"
//                                 onClick={handleUpdateNgo}
//                                 variant="outline"
//                                 style={{ color: 'white', width: 'fit-content'  }}
//                               >
//                                     Update NGO
//                               </Button></div>
//                             </div>
//                           </DialogContent>
//                         )}
//                       </Dialog>
//                       <Button variant="outline" size="sm" onClick={() => handleDeleteNgo(ngo.id)}>
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, Search, Users, FileText, Trash2, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { getNgos, getNgosById, deleteNgos } from "../api/ngo";
import NGOCreationWizard from "@/components/ngo/NGOCreationWizard";

export default function NGOManagement() {
  const [ngos, setNgos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingNgoId, setEditingNgoId] = useState<number | null>(null);
  const [editingNgoData, setEditingNgoData] = useState<any>(null);

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

  // Fetch NGO by ID for editing
  const handleEditNgo = async (id: number) => {
    try {
      const data = await getNgosById(id);
      setEditingNgoData(data);
      setEditingNgoId(id);
      setIsWizardOpen(true);
    } catch (error) {
      console.error("Error fetching NGO by ID:", error);
      alert("Failed to load NGO data for editing.");
    }
  };

  // Delete NGO
  const handleDeleteNgo = async (id: number) => {
    if (!confirm("Are you sure you want to delete this NGO?")) return;
    try {
      await deleteNgos(id);
      setNgos(prev => prev.filter(ngo => ngo.id !== id));
      alert("NGO deleted successfully!");
    } catch (error) {
      console.error("Error deleting NGO:", error);
      alert("Failed to delete NGO.");
    }
  };

  // Handle wizard close
  const handleWizardClose = (open: boolean) => {
    if (!open) {
      setIsWizardOpen(false);
      setEditingNgoId(null);
      setEditingNgoData(null);
    }
  };

  // Handle successful submission
  const handleSubmitSuccess = () => {
    fetchNgos();
    setIsWizardOpen(false);
    setEditingNgoId(null);
    setEditingNgoData(null);
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
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold gradient-text">NGO Partners</h1>
          <p className="text-muted-foreground mt-2">
            Manage your CSR implementation partners and track their performance
          </p>
        </div>
        <Link to="/add-ngo">
          <Button className="shadow-md hover-lift">
            <Plus className="h-4 w-4 mr-2" />
            Add NGO
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card variant="elevated" hover="lift">
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

        <Card variant="elevated" hover="lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  ₹{ngos.reduce((sum, ngo) => sum + (ngo.orgBudget || 0), 0).toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8" color="#8ECE33FF" />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover="lift">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">
                  ₹{ngos.reduce((sum, ngo) => sum + (ngo.totalExpenses || 0), 0).toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8" color="#FFB800" />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" hover="lift">
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
      <Card variant="elevated" hover="glow">
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
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading NGOs...</p>
            </div>
          ) : filteredNGOs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No NGOs found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Location</TableHead>
                  {/* <TableHead>Interventions</TableHead> */}
                  <TableHead>Budget</TableHead>
                  <TableHead>Expenses</TableHead>
                  <TableHead>Volunteers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNGOs.map((ngo) => (
                  <TableRow key={ngo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/api/placeholder/40/40?text=${ngo.ngoName?.charAt(0)}`} />
                          <AvatarFallback>{ngo.ngoName?.charAt(0) || "N"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{ngo.ngoName || "Unnamed NGO"}</p>
                          <p className="text-sm text-muted-foreground">{ngo.founder || "N/A"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{ngo.location || "N/A"}</TableCell>
                    {/* <TableCell className="max-w-xs truncate">
                      {ngo.areasOfIntervention || "N/A"}
                    </TableCell> */}
                    <TableCell>₹{(ngo.orgBudget || 0).toLocaleString()}</TableCell>
                    <TableCell>₹{(ngo.totalExpenses || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={ngo.volunteerOpportunities ? "text-green-600" : "text-gray-400"}>
                        {ngo.volunteerOpportunities ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditNgo(ngo.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNgo(ngo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* NGO Creation/Edit Wizard */}
      <NGOCreationWizard
        open={isWizardOpen}
        onOpenChange={handleWizardClose}
        onSubmit={handleSubmitSuccess}
        initialData={editingNgoData}
        ngoId={editingNgoId}
      />
    </div>
  );
}