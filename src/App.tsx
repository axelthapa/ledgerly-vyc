
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Sales from "@/pages/Sales";
import Purchases from "@/pages/Purchases";
import Customers from "@/pages/Customers";
import Suppliers from "@/pages/Suppliers";
import CustomerDetail from "@/pages/CustomerDetail";
import SupplierDetail from "@/pages/SupplierDetail";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import Analytics from "@/pages/Analytics";
import Transactions from "@/pages/Transactions";
import Payments from "@/pages/Payments";
import Backup from "@/pages/Backup";
import Services from "@/pages/Services";
import { LanguageProvider } from "./contexts/LanguageContext";
import BackupReminder from "./components/backup/BackupReminder";

// Create the query client
const queryClient = new QueryClient();

// Create the router
const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/sales", element: <Sales /> },
  { path: "/purchases", element: <Purchases /> },
  { path: "/customers", element: <Customers /> },
  { path: "/suppliers", element: <Suppliers /> },
  { path: "/customers/:id", element: <CustomerDetail /> },
  { path: "/suppliers/:id", element: <SupplierDetail /> },
  { path: "/settings", element: <Settings /> },
  { path: "/reports", element: <Reports /> },
  { path: "/analytics", element: <Analytics /> },
  { path: "/transactions", element: <Transactions /> },
  { path: "/payments", element: <Payments /> },
  { path: "/backup", element: <Backup /> },
  { path: "/services", element: <Services /> },
  
  // Not found route
  { path: "*", element: <NotFound /> },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster />
        <BackupReminder />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
