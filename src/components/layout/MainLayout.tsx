import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import TopBar from "./TopBar";
import { toast } from "@/components/ui/toast-utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    toast("Logging out...");
    // In a real app, this would clear session/auth state
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar open={sidebarOpen} />
        
        <main className={`flex-1 overflow-auto transition-all p-6 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
