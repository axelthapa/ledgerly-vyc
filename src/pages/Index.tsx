
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    } else {
      setIsCheckingLogin(false);
    }
  }, []);
  
  if (isCheckingLogin) {
    return <div className="h-screen flex items-center justify-center">Checking login status...</div>;
  }
  
  return <LoginForm />;
};

export default Index;
