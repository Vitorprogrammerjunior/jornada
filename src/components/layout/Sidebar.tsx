
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  UserPlus,
  BookOpen,
  Award,
  PaintBucket,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type SidebarItem = {
  title: string;
  icon: React.FC<{ className?: string }>;
  href: string;
  roles: string[];
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      title: "Início",
      icon: Home,
      href: "/",
      roles: ["coordinator", "leader", "student", "pending"],
    },
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      roles: ["coordinator", "leader", "student"],
    },
    {
      title: "Usuários",
      icon: Users,
      href: "/users",
      roles: ["coordinator"],
    },
    {
      title: "Grupos",
      icon: UserPlus,
      href: "/groups",
      roles: ["coordinator", "leader", "student"],
    },
    {
      title: "Cronograma",
      icon: Calendar,
      href: "/schedule",
      roles: ["coordinator", "leader", "student", "pending"],
    },
    {
      title: "Entregas",
      icon: FileText,
      href: "/submissions",
      roles: ["coordinator", "leader", "student"],
    },
    {
      title: "Resultados",
      icon: Award,
      href: "/results",
      roles: ["coordinator", "leader", "student", "pending"],
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/settings",
      roles: ["coordinator"],
    },
    {
      title: "Configurar Site",
      icon: PaintBucket,
      href: "/configure-site",
      roles: ["coordinator"],
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredItems = user
    ? sidebarItems.filter((item) => item.roles.includes(user.role))
    : sidebarItems.filter((item) => item.roles.includes("pending"));

  return (
    <div
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-green-600">Jornada Digital</h2>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="py-4">
        <div className="space-y-1 px-3">
          {filteredItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === item.href
                  ? "bg-green-50 text-green-700"
                  : "text-slate-700 hover:bg-green-50 hover:text-green-700",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isCollapsed ? "mx-0" : "mr-2")}
              />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </div>
      </div>

      {user && (
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-start rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50",
              isCollapsed && "justify-center px-0"
            )}
            onClick={logout}
          >
            <LogOut className={cn("h-5 w-5", isCollapsed ? "mx-0" : "mr-2")} />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
