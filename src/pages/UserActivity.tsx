import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Users,
  FileText,
  FolderOpen,
  ClipboardList,
  MessageSquare,
} from "lucide-react";

export default function UserActivity() {
  const stats = [
    {
      label: "Projects Created",
      value: 12,
      color: "#6C63FF",
      icon: FolderOpen,
      bg: "rgba(108, 99, 255, 0.12)",
    },
    {
      label: "Reports Submitted",
      value: 8,
      color: "#28C76F",
      icon: FileText,
      bg: "rgba(40, 199, 111, 0.12)",
    },
    {
      label: "NGOs Created",
      value: 3,
      color: "#FFB74B",
      icon: Users,
      bg: "rgba(255, 183, 75, 0.15)",
    },
    {
      label: "Pending Tasks",
      value: 4,
      color: "#FF6B6B",
      icon: ClipboardList,
      bg: "rgba(255, 107, 107, 0.15)",
    },
    {
      label: "Messages Received",
      value: 5,
      color: "#4EA8DE",
      icon: MessageSquare,
      bg: "rgba(78, 168, 222, 0.15)",
    },
  ];

  const timeline = [
    "Created new project: Women Empowerment Campaign — 2 hours ago",
    "Submitted CSR Impact Report — 1 day ago",
    "Registered NGO: Hope Foundation — 3 days ago",
    "Updated project details — 5 days ago",
    "Logged in — 1 week ago",
  ];

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold tracking-wide">User Activity</h1>
{/* Logged-in User Info */}
<Card className="rounded-2xl shadow-md border-none p-6 mb-6">
  <div className="flex items-center gap-6">

    {/* Avatar */}
    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold shadow">
      CA
    </div>

    {/* User Details */}
    <div className="space-y-1">
      <h2 className="text-xl font-semibold text-gray-900">CMS Admin</h2>
      <p className="text-sm text-gray-500">Admin • CMS Foundation</p>
      <p className="text-sm text-gray-500">admin@cms.com</p>
    </div>

  </div>
</Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-none"
              style={{
                background: "#ffffff",
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: item.color }}>
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold mt-2" style={{ color: item.color }}>
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">Dummy data</p>
                  </div>

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      background: item.bg,
                      color: item.color,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Timeline Modern UI */}
     {/* Timeline Section */}
<Card className="rounded-2xl shadow-md border-none p-6">
  <CardHeader>
    <CardTitle className="text-xl font-semibold tracking-wide">
      Recent Activity Timeline
    </CardTitle>
  </CardHeader>

  <CardContent className="pt-4">
    <div className="relative pl-6 border-l border-gray-300">

      {timeline.map((activity, index) => {
        const [title, time] = activity.split(" — ");

        return (
          <div key={index} className="relative mb-10"> {/* Increased spacing */}
            
            {/* Small clean dot */}
            <span className="absolute -left-[8px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600"></span>

            {/* Text area */}
            <div className="ml-2">
              <p className="text-[16px] font-medium text-gray-900">
                {title}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {time}
              </p>
            </div>

          </div>
        );
      })}

    </div>
  </CardContent>
</Card>

    </div>
  );
}
