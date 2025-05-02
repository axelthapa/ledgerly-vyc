
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart4,
  ChevronLeft,
  CreditCard,
  FilePieChart,
  Home,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  Wrench,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCompanyAbbreviation } from "@/utils/company-utils";

interface SidebarProps {
  open: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
  end?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const { t } = useLanguage();
  const [companyAbbr, setCompanyAbbr] = useState('VYC');
  
  useEffect(() => {
    const loadCompanyAbbr = async () => {
      try {
        const abbr = await getCompanyAbbreviation();
        setCompanyAbbr(abbr);
      } catch (error) {
        console.error('Failed to load company abbreviation:', error);
      }
    };
    
    loadCompanyAbbr();
  }, []);

  const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, end }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-vyc-primary text-white font-medium"
            : "hover:bg-vyc-primary/10"
        )
      }
    >
      <Icon className="h-5 w-5" />
      {open && <span>{t(label)}</span>}
    </NavLink>
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/";
  };

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] fixed top-16 bg-white border-r transition-all z-10",
        open ? "w-64" : "w-0 md:w-16"
      )}
    >
      <div className={cn("h-full flex flex-col", !open && "items-center")}>
        <div className="flex flex-col gap-1 p-4 flex-1">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" end />
          <NavItem to="/sales" icon={Receipt} label="Sales" />
          <NavItem to="/purchases" icon={ShoppingCart} label="Purchases" />
          <NavItem to="/customers" icon={Users} label="Customers" />
          <NavItem to="/suppliers" icon={Users} label="Suppliers" />
          <NavItem to="/services" icon={Wrench} label="Services" />
          <NavItem to="/payments" icon={Wallet} label="Payments" />
          <NavItem to="/reports" icon={FilePieChart} label="Reports" />
          <NavItem to="/analytics" icon={BarChart4} label="Analytics" />
          <NavItem to="/backup" icon={Database} label="Backup" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </div>

        <div className="p-4 border-t">
          {open ? (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">{companyAbbr}</div>
              <Button onClick={handleLogout}>{t('Logout')}</Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLogout}
              title={t('Logout')}
            >
              <ChevronLeft />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};
