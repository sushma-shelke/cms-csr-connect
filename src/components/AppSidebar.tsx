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
import cmsLogo from "@/assets/cms-logo-1.png";

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
  { title: "Financial Tracking", url: "/finance", icon: IndianRupee },
  { title: "Media Evidence", url: "/media", icon: Camera },
];

const thematicItems = [
  { title: "Health", url: "/themes/health", icon: Heart },
  { title: "Education", url: "/themes/education", icon: Users },
  { title: "Climate Resilience", url: "/themes/climate", icon: BarChart3 },
  { title: "Livelihood", url: "/themes/livelihood", icon: IndianRupee },
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
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src={cmsLogo} 
                alt="CMS Foundation" 
                className="w-10 h-10 object-contain"
              />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-foreground">CMS Foundation</h2>
                <p className="text-xs text-muted-foreground">CSR MIS Platform</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
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

        <SidebarGroup>
          <SidebarGroupLabel>Thematic Areas</SidebarGroupLabel>
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

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavClassName("/settings")}>
                    <Settings className="w-4 h-4" />
                    {!isCollapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}