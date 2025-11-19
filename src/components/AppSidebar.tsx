import {
  BarChart3,
  Building2,
  FileText,
  FolderOpen,
  Heart,
  Home,
  IndianRupee,
  Settings,
  Users,
  Camera,
  Clock,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import cmsLogo from "@/assets/cms-logo.webp";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "NGO Partners", url: "/ngos", icon: Building2 },
  { title: "Quick Updates", url: "/ngo-updates", icon: Clock },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "MIS Reports", url: "/mis-reports", icon: FileText },
  // { title: "Financial Tracking", url: "/finance", icon: IndianRupee },
  // { title: "Media Evidence", url: "/media", icon: Camera },
];

const thematicItems = [
  // { title: "Health", url: "/themes/health", icon: Heart },
  // { title: "Education", url: "/themes/education", icon: Users },
  // { title: "Climate Resilience", url: "/themes/climate", icon: BarChart3 },
  // { title: "Livelihood", url: "/themes/livelihood", icon: IndianRupee },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path)
      ? "bg-primary text-primary-foreground font-medium"
      : "hover:bg-muted/50";
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar-background shadow-lg">
      <SidebarContent className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">        
        {/* Modern Logo Header */}
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl  from-primary to-accent flex items-center justify-center shadow-lg">
              <img 
                src={cmsLogo} 
                alt="CMS Foundation" 
                className="w-12 h-12 object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <h2 className="font-bold text-lg text-sidebar-foreground tracking-tight">
                  CMS Foundation
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  CSR MIS Platform
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                        isActive 
                          ? "bg-sidebar-active text-sidebar-active-foreground shadow-sm font-semibold" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {/* <SidebarGroupLabel>Thematic Areas</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {thematicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName(item.url)}>
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  );
}