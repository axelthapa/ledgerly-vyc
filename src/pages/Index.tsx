
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    }
  }, []);
  
  return <LoginForm />;
};

export default Index;
