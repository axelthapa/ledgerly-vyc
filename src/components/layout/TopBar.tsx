
import React, { useState, useEffect } from "react";
import { Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatNepaliDate } from "@/utils/nepali-date";
import LanguageSwitch from "@/components/language/LanguageSwitch";

interface TopBarProps {
  onToggleSidebar: () => void;
  sidebarOpen?: boolean;
  onLogout?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, sidebarOpen, onLogout }) => {
  const { t, isNepali } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      window.location.href = "/";
    }
  };
  
  // Format current date and time
  const formattedDate = isNepali 
    ? formatNepaliDate(currentTime)
    : currentTime.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <div className="border-b bg-white dark:bg-gray-800 py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t('Toggle sidebar')}</span>
          </Button>
          
          <div className="hidden sm:block">
            <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              VYC
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Management System
            </div>
          </div>

          <div className="ml-4 text-sm border-l pl-4 hidden md:block">
            <div className="text-gray-500 dark:text-gray-300">{formattedDate}</div>
            <div className="font-medium">{formattedTime}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <LanguageSwitch />
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">{t('Notifications')}</span>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm font-medium">
                {currentUser?.full_name || t('User')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentUser?.role === 'admin' ? t('Administrator') : t('Standard User')}
              </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">{t('Logout')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
