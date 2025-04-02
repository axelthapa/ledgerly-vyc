
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  ShoppingCart,
  CreditCard,
  ClipboardList,
  Settings,
  FileText,
  HardDrive,
  DollarSign,
  Home,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  active = false,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-vyc-accent",
        active
          ? "bg-vyc-primary-light text-vyc-accent"
          : "text-gray-300 hover:bg-vyc-primary-light"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export function Sidebar({ open }: SidebarProps) {
  if (!open) return null;
  
  return (
    <div className="fixed left-0 z-20 h-full w-64 bg-vyc-primary text-white p-4 shadow-lg transition-all">
      <div className="flex flex-col h-full">
        <div className="mb-8 flex items-center justify-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-vyc-accent flex items-center justify-center">
              <span className="text-xl font-bold text-black">VYC</span>
            </div>
            <span className="text-xl font-bold">VYC Accounting</span>
          </Link>
        </div>
        
        <nav className="space-y-1">
          <SidebarItem icon={<Home size={20} />} label="Dashboard" href="/dashboard" active={true} />
          <SidebarItem icon={<Users size={20} />} label="Customers" href="/customers" />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Suppliers" href="/suppliers" />
          <SidebarItem icon={<CreditCard size={20} />} label="Sales" href="/sales" />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Purchases" href="/purchases" />
          <SidebarItem icon={<DollarSign size={20} />} label="Payments" href="/payments" />
          <SidebarItem icon={<ClipboardList size={20} />} label="Transactions" href="/transactions" />
          <SidebarItem icon={<FileText size={20} />} label="Reports" href="/reports" />
          <SidebarItem icon={<HardDrive size={20} />} label="Backup" href="/backup" />
          <SidebarItem icon={<BarChart3 size={20} />} label="Analytics" href="/analytics" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" href="/settings" />
        </nav>
        
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 text-center">
            <p>VYC Accounting System</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
