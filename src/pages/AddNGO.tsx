import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddNGO() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    theme: "",
    email: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New NGO:", formData);
    // TODO: call API to save NGO
  };

  return (
   <div className="max-w-4xl mx-auto space-y-6">
  <Card className="bg-white dark:bg-neutral-900 shadow-md rounded-xl">
    <CardHeader>
      <CardTitle className="text-gray-900 dark:text-white">Add New NGO</CardTitle>
    </CardHeader>
    <CardContent>
     <form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <Label htmlFor="name">Organization Name</Label>
    <Input 
      id="name" 
      name="name" 
      value={formData.name} 
      onChange={handleChange} 
      required 
      className="bg-gray-50 dark:bg-neutral-800"
    />
  </div>

  <div>
    <Label htmlFor="location">Location</Label>
    <Input 
      id="location" 
      name="location" 
      value={formData.location} 
      onChange={handleChange} 
      required 
      className="bg-gray-50 dark:bg-neutral-800"
    />
  </div>

  <div>
    <Label htmlFor="theme">Theme</Label>
    <Input 
      id="theme" 
      name="theme" 
      value={formData.theme} 
      onChange={handleChange} 
      required 
      className="bg-gray-50 dark:bg-neutral-800"
    />
  </div>

  {/* Email + Phone side by side */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="email">Email</Label>
      <Input 
        id="email" 
        name="email" 
        type="email" 
        value={formData.email} 
        onChange={handleChange} 
        required 
        className="bg-gray-50 dark:bg-neutral-800"
      />
    </div>
    <div>
      <Label htmlFor="phone">Phone</Label>
      <Input 
  id="phone" 
  name="phone" 
  type="tel" 
  pattern="[0-9]{10}" 
  title="Enter a valid 10-digit number"
  value={formData.phone} 
  onChange={handleChange} 
  required 
  className="bg-gray-50 dark:bg-neutral-800"
/>

    </div>
  </div>

  <Button type="submit" className="bg-primary">Save NGO</Button>
</form>

    </CardContent>
  </Card>
</div>

  );
}
