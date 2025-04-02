
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-vyc-error text-5xl font-bold mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for doesn't exist or is still under development.
          <br />
          <span className="text-sm text-gray-500">
            Path: {location.pathname}
          </span>
        </p>
        <div className="space-y-2">
          <Button className="w-full" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Button variant="outline" className="w-full" onClick={goHome}>
            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
