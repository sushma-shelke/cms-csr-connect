// import { Bell, Search, User, LogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useAuth } from "@/contexts/AuthContext";
// import { Badge } from "@/components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// export function Header() {
//   const { user, logout } = useAuth();

//   const getRoleBadgeVariant = (role: string) => {
//     switch (role) {
//       case 'admin': return 'default';
//       case 'project_officer': return 'secondary';
//       case 'csr_head': return 'outline';
//       case 'ngo_partner': return 'destructive';
//       default: return 'secondary';
//     }
//   };

//   const getRoleDisplayName = (role: string) => {
//     switch (role) {
//       case 'admin': return 'Admin';
//       case 'project_officer': return 'Project Officer';
//       case 'csr_head': return 'CSR Head';
//       case 'ngo_partner': return 'NGO Partner';
//       default: return role;
//     }
//   };

//   const getUserInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(word => word[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40">
//       <div className="flex h-16 items-center gap-4 px-6">
//         <SidebarTrigger />
        
//         <div className="flex-1 flex items-center gap-4 max-w-sm">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search projects, NGOs, reports..."
//               className="pl-10 bg-background"
//             />
//           </div>
//         </div>

//         {/* User info and controls */}
//         <div className="ml-auto flex items-center gap-4">
//           <div className="hidden md:flex items-center gap-2">
//             <span className="text-sm text-muted-foreground">Welcome,</span>
//             <span className="text-sm font-medium">{user?.name}</span>
//             <Badge variant={getRoleBadgeVariant(user?.role || '')}>
//               {getRoleDisplayName(user?.role || '')}
//             </Badge>
//           </div>
          
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell className="h-4 w-4" />
//             <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
//             <span className="sr-only">Notifications</span>
//           </Button>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="bg-primary text-primary-foreground font-medium">
//                     {getUserInitials(user?.name || 'User')}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{user?.name}</p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {user?.email}
//                   </p>
//                   <Badge 
//                     variant={getRoleBadgeVariant(user?.role || '')} 
//                     className="w-fit mt-1"
//                   >
//                     {getRoleDisplayName(user?.role || '')}
//                   </Badge>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem>Profile Settings</DropdownMenuItem>
//               <DropdownMenuItem>User Management</DropdownMenuItem>
//               <DropdownMenuItem>System Settings</DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem 
//                 className="text-destructive cursor-pointer"
//                 onClick={logout}
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Log out
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   );
// }

// Header.tsx
import { Bell, Search, User, LogOut, Download, FileText, TrendingUp, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Types for notifications
interface QuickUpdate {
  id: number;
  project: string;
  updateType: string;
  updateTitle: string;
  progressDescription: string;
  overallProgress: number;
  currentChallenges?: string;
  nextSteps?: string;
  mediaFilesCount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: number;
  type: 'progress_update' | 'media_upload' | 'case_study' | 'testimonial';
  title: string;
  description: string;
  project: string;
  progress?: number;
  timestamp: string;
  read: boolean;
  updateId: number;
}

export function Header() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [allUpdates, setAllUpdates] = useState<QuickUpdate[]>([]);

  // Constants for pagination
  const UPDATES_PER_PAGE = 5;
  const INITIAL_DISPLAY_COUNT = 10;

  // Fetch all updates from API
  const fetchAllUpdates = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://mumbailocal.org:8089/api/quick-updates');
      const updates: QuickUpdate[] = await response.json();
      
      // Sort by creation date, newest first
      const sortedUpdates = updates.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setAllUpdates(sortedUpdates);
      // Load initial notifications
      loadMoreNotifications(sortedUpdates, 1, true);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more notifications with pagination
  const loadMoreNotifications = (updates: QuickUpdate[] = allUpdates, currentPage: number = page, isInitial: boolean = false) => {
    if (updates.length === 0) return;

    const startIndex = isInitial ? 0 : (currentPage - 1) * UPDATES_PER_PAGE;
    const endIndex = isInitial ? INITIAL_DISPLAY_COUNT : currentPage * UPDATES_PER_PAGE;
    
    const updatesToAdd = updates.slice(startIndex, endIndex);
    
    if (updatesToAdd.length === 0) {
      setHasMore(false);
      return;
    }

    const newNotifications = updatesToAdd.map(mapUpdateToNotification);

    if (isInitial) {
      setNotifications(newNotifications);
    } else {
      setNotifications(prev => [...prev, ...newNotifications]);
    }

    // Check if there are more updates to load
    const totalDisplayed = isInitial ? INITIAL_DISPLAY_COUNT : (currentPage * UPDATES_PER_PAGE);
    setHasMore(totalDisplayed < updates.length);
    setPage(currentPage + 1);
  };

  // Calculate remaining updates safely
  const getRemainingUpdatesCount = () => {
    const totalDisplayed = notifications.length;
    const totalAvailable = allUpdates.length;
    const remaining = totalAvailable - totalDisplayed;
    return Math.max(0, remaining); // Ensure no negative numbers
  };

  // Handle load more button click
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      // Simulate API call delay - remove this in production
      await new Promise(resolve => setTimeout(resolve, 500));
      loadMoreNotifications();
    } finally {
      setLoadingMore(false);
    }
  };

  // Refresh all notifications
  const refreshNotifications = async () => {
    setPage(1);
    setHasMore(true);
    setNotifications([]);
    await fetchAllUpdates();
  };

  // Map API update to notification format
  const mapUpdateToNotification = (update: QuickUpdate): Notification => {
    const getNotificationType = (updateType: string): Notification['type'] => {
      const typeMap: { [key: string]: Notification['type'] } = {
        'Monthly Progress': 'progress_update',
        'Progress Update': 'progress_update',
        'Media Upload': 'media_upload',
        'Case Study': 'case_study',
        'Testimonial': 'testimonial',
        'MONTHLY': 'progress_update',
        'Monthly': 'progress_update'
      };
      return typeMap[updateType] || 'progress_update';
    };

    return {
      id: update.id,
      type: getNotificationType(update.updateType),
      title: update.updateTitle,
      description: update.progressDescription,
      project: update.project,
      progress: update.overallProgress,
      timestamp: update.createdAt,
      read: false,
      updateId: update.id
    };
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    fetchAllUpdates();
  }, []);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'project_officer': return 'secondary';
      case 'csr_head': return 'outline';
      case 'ngo_partner': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'project_officer': return 'Project Officer';
      case 'csr_head': return 'CSR Head';
      case 'ngo_partner': return 'NGO Partner';
      default: return role;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'progress_update':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'media_upload':
        return <Download className="h-4 w-4 text-green-500" />;
      case 'case_study':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'testimonial':
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const remainingUpdates = getRemainingUpdatesCount();
  const shouldShowLoadMore = hasMore && remainingUpdates > 0 && notifications.length > 0;

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-40">
      <div className="flex h-16 items-center gap-4 px-6">
        <SidebarTrigger />
        
        <div className="flex-1 flex items-center gap-4 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects, NGOs, reports..."
              className="pl-10 bg-background"
            />
          </div>
        </div>

        {/* User info and controls */}
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Welcome,</span>
            <span className="text-sm font-medium">{user?.name}</span>
            <Badge variant={getRoleBadgeVariant(user?.role || '')}>
              {getRoleDisplayName(user?.role || '')}
            </Badge>
          </div>
          
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Project Updates</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                    onClick={refreshNotifications}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-80">
                {notifications.length === 0 && !loading ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={refreshNotifications}
                    >
                      Refresh
                    </Button>
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={cn(
                          "p-4 flex flex-col items-start gap-2 cursor-pointer border-b border-border",
                          !notification.read && "bg-muted/50"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium truncate">
                                {notification.title}
                              </p>
                              {notification.progress !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.progress}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {notification.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {notification.project}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    
                    {/* Loading indicator for more items */}
                    {loadingMore && (
                      <div className="flex justify-center p-4">
                        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </>
                )}
              </ScrollArea>
              
              {/* Load More Button - Only show if there are updates to load */}
              {shouldShowLoadMore && (
                <>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <Button 
                      variant="outline" 
                      className="w-full text-sm" 
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        `Load More Updates (${remainingUpdates} remaining)`
                      )}
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {getUserInitials(user?.name || 'User')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <Badge 
                    variant={getRoleBadgeVariant(user?.role || '')} 
                    className="w-fit mt-1"
                  >
                    {getRoleDisplayName(user?.role || '')}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>User Management</DropdownMenuItem>
              <DropdownMenuItem>System Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}