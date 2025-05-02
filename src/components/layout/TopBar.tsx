
import React, { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitch from "../language/LanguageSwitch";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCompanyAbbreviation } from "@/utils/company-utils";

interface TopBarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ sidebarOpen, toggleSidebar, onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const goToSettings = () => {
    navigate('/settings');
  };

  const handleNotificationsClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications",
    });
  };

  return (
    <header className="h-16 bg-vyc-primary text-white shadow-md fixed top-0 w-full z-10">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-vyc-primary/70 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold">{companyAbbr} - {t('Demo Trial Application')}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language switch */}
          <LanguageSwitch />

          {/* Notifications */}
          <button
            onClick={handleNotificationsClick}
            className="p-2 rounded-md hover:bg-vyc-primary/70 transition-colors"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* User menu */}
          <button
            onClick={goToSettings}
            className="p-2 rounded-md hover:bg-vyc-primary/70 transition-colors"
          >
            <User className="h-5 w-5" />
          </button>

          {/* Logout button for small screens */}
          <button
            onClick={onLogout}
            className="md:hidden p-2 bg-vyc-primary/80 rounded-md hover:bg-vyc-primary/60 transition-colors"
          >
            {t('Logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
