
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast-utils";
import { getAppInfo, dbQuery, dbUpdate } from "@/utils/electron-utils";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [appInfo, setAppInfo] = useState<any>(null);
  const [loginPattern, setLoginPattern] = useState("VYC");

  useEffect(() => {
    // Check if this is the first run
    const checkFirstRun = async () => {
      try {
        setIsLoading(true);
        
        // Get app info
        const info = getAppInfo();
        setAppInfo(info);
        
        // Check if there are any users in the database
        const result = await dbQuery('SELECT COUNT(*) as count FROM users');
        
        if (result.success && result.data && result.data[0].count === 0) {
          setIsFirstTimeSetup(true);
        } else {
          // Load login pattern
          const patternResult = await dbQuery('SELECT value FROM settings WHERE key = ?', ['login_pattern']);
          
          if (patternResult.success && patternResult.data && patternResult.data.length > 0) {
            setLoginPattern(patternResult.data[0].value);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    // If username doesn't match the login pattern, show error
    if (username !== loginPattern) {
      toast.error("Invalid username or password");
      return;
    }
    
    try {
      const result = await dbQuery(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password]
      );
      
      if (result.success && result.data && result.data.length > 0) {
        toast.success("Login successful");
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/dashboard";
      } else {
        toast.error("Invalid username or password");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred during login");
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      // Create admin user
      const result = await dbUpdate(
        'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
        [newUsername, newPassword, 'Administrator', 'admin']
      );
      
      if (!result.success) {
        toast.error("Failed to create user: " + result.error);
        return;
      }
      
      // Save login pattern
      await dbUpdate(
        'INSERT INTO settings (key, value) VALUES (?, ?)',
        ['login_pattern', loginPattern]
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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Card className="w-[350px]">
          <CardHeader className="text-center">
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold mb-2">VYC Accounting</div>
          <CardDescription>Demo Trial Application</CardDescription>
          <CardDescription>
            Version: {appInfo?.version || '1.0.0'} ({appInfo?.platform || 'unknown'})
          </CardDescription>
        </CardHeader>
        
        {isFirstTimeSetup ? (
          // First-time setup form
          <form onSubmit={handleSetup}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="login-pattern">Login Pattern</Label>
                <Input
                  id="login-pattern"
                  placeholder="Enter login pattern"
                  value={loginPattern}
                  onChange={(e) => setLoginPattern(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This will be used as the username to log in
                </p>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="new-username">Admin Username</Label>
                <Input
                  id="new-username"
                  placeholder="Enter admin username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="new-password">Admin Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">Complete Setup</Button>
            </CardFooter>
          </form>
        ) : (
          // Regular login form
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">Log In</Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default LoginForm;
