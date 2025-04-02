
import React, { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  // Check if user is already logged in (this would be replaced with a proper auth check)
  useEffect(() => {
    // This is just for demo purposes. In a real app, you'd check authentication state
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    }
  }, []);
  
  return <LoginForm />;
};

export default Index;
