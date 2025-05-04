
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast-utils";
import { getAppInfo, dbQuery, dbUpdate, isElectron } from "@/utils/electron-utils";
import { Eye, EyeOff, Lock, User } from "lucide-react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [appInfo, setAppInfo] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check if this is the first run
    const checkFirstRun = async () => {
      try {
        setIsLoading(true);
        
        // Get app info
        const info = getAppInfo();
        setAppInfo(info);
        
        // In Electron mode, check database
        if (isElectron()) {
          // Check if there are any users in the database
          const result = await dbQuery('SELECT COUNT(*) as count FROM users');
          
          if (result.success && result.data && result.data[0].count === 0) {
            setIsFirstTimeSetup(true);
          }
        }
      } catch (error) {
        console.error('Error checking first run:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkFirstRun();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }

    // Handle VYC special login code
    if (username === "VYC") {
      // Special login code - check if password matches any admin credentials
      if (password === "admin@123") {
        loginSuccess("admin");
        return;
      }
    }
    
    // Regular login checking
    const validCredentials = [
      { username: "vision", password: "vision@123", role: "user" },
      { username: "admin", password: "admin@123", role: "admin" }
    ];
    
    const user = validCredentials.find(
      user => user.username === username && user.password === password
    );
    
    if (user) {
      loginSuccess(user.role);
    } else {
      toast.error("Invalid username or password");
    }
  };

  const loginSuccess = (role: string) => {
    toast.success("Login successful");
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify({ 
      username, 
      role,
      full_name: role === "admin" ? "Administrator" : "User"
    }));
    window.location.href = "/dashboard";
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isElectron()) {
      // For web version, just set default users
      setIsFirstTimeSetup(false);
      return;
    }
    
    try {
      // Create default users
      await dbUpdate(
        'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
        ["vision", "vision@123", 'Vision User', 'user']
      );
      
      await dbUpdate(
        'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
        ["admin", "admin@123", 'Administrator', 'admin']
      );
      
      toast.success("Setup completed successfully");
      setIsFirstTimeSetup(false);
    } catch (error) {
      console.error('Setup error:', error);
      toast.error("An error occurred during setup");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="w-[350px] border-none bg-white/10 backdrop-blur-md">
          <CardHeader className="text-center text-white">
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <Card className="w-[380px] border-none bg-white/10 backdrop-blur-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">VYC</div>
          <CardDescription className="text-gray-300">
            Management System
          </CardDescription>
          <CardDescription className="text-gray-300 text-xs mt-1">
            Version: {appInfo?.version || '1.0.0'} ({appInfo?.platform || 'web'})
          </CardDescription>
        </CardHeader>
        
        {isFirstTimeSetup ? (
          // First-time setup form
          <form onSubmit={handleSetup}>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-900/20 border border-yellow-700/20 rounded-md">
                <p className="text-sm text-yellow-200">
                  First time setup: This will create default users:
                  <br />- vision / vision@123 (User)
                  <br />- admin / admin@123 (Admin)
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                Complete Setup
              </Button>
            </CardFooter>
          </form>
        ) : (
          // Regular login form
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 pt-3">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <User size={16} />
                  </span>
                  <Input
                    id="username"
                    className="pl-9 bg-white/5 border-gray-700 text-white"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">
                    <Lock size={16} />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-9 pr-9 bg-white/5 border-gray-700 text-white"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-2 pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                Log In
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default LoginForm;
