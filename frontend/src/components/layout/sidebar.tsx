"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, TrendingUp, Sparkles, Activity, CheckSquare, Database, User, Menu } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory Data", href: "/data", icon: Database },
  { name: "Products", href: "/products", icon: Package },
  { name: "Predictions", href: "/predictions", icon: TrendingUp },
  { name: "Retail Price", href: "/retail", icon: TrendingUp },
  { name: "Decision Engine", href: "/recommendations", icon: CheckSquare },
  { name: "Market Insights", href: "/insights", icon: Activity },
  { name: "AI Assistant", href: "/assistant", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`flex flex-col bg-slate-900 border-r border-slate-800 h-full text-slate-300 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Activity className="h-6 w-6 text-blue-500 shrink-0" />
            MarketMind AI
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-2 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors mx-auto shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              } ${isCollapsed ? "justify-center text-xl" : "text-sm"}`}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className={`shrink-0 ${isCollapsed ? "h-6 w-6" : "h-5 w-5"}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="mb-4">
          <div className={`flex items-center gap-3 mb-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="bg-slate-800 p-1.5 rounded-full shrink-0">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Admin</p>
                <p className="text-xs text-slate-500 truncate">MarketMind AI</p>
              </div>
            )}
          </div>
        </div>
        <div className={`space-y-3 ${isCollapsed ? 'hidden' : ''}`}>
          <h4 className="text-xs font-semibold text-slate-500 uppercase">System Status</h4>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500 shrink-0"></div>
            ML Model Online
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-green-500 shrink-0"></div>
            AI Assistant Online
          </div>
        </div>
      </div>
    </div>
  );
}
