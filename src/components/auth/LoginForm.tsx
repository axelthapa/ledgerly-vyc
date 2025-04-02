
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Eye, EyeOff, Lock, User } from "lucide-react";

// Mock admin users
const ADMIN_USERS = [
  { username: "vision", password: "vision@123" },
  { username: "admin", password: "admin123" },
];

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [validationKey, setValidationKey] = useState("");
  const [enteredKey, setEnteredKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stage, setStage] = useState<"username" | "password" | "key">("username");

  // Generate random validation key
  useEffect(() => {
    if (stage === "key") {
      const randomKey = Math.floor(1000 + Math.random() * 9000).toString();
      setValidationKey(randomKey);
      console.log("Generated key:", randomKey);
    }
  }, [stage]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if username exists
    const userExists = ADMIN_USERS.some(user => user.username.toLowerCase() === username.toLowerCase());
    
    if (userExists) {
      setStage("password");
      toast.success("Username verified! Please enter your password.");
    } else {
      toast.error("Username not found. Please try again.");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if password matches
    const user = ADMIN_USERS.find(user => user.username.toLowerCase() === username.toLowerCase());
    
    if (user && user.password === password) {
      setStage("key");
      toast.success("Password verified! Please enter the verification key.");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert number to corresponding letters (1=a, 2=b, etc.)
    const expectedKey = validationKey
      .split("")
      .map(digit => String.fromCharCode(96 + parseInt(digit)))
      .join("");
    
    if (enteredKey.toLowerCase() === expectedKey) {
      // Login successful
      toast.success("Login successful! Redirecting to dashboard...");
      
      // Save username in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
      
      // Redirect to dashboard (would use React Router in a real implementation)
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } else {
      toast.error("Incorrect verification key. Please try again.");
    }
  };

  // Load remembered username if available
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-vyc-primary to-vyc-primary-dark p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-20 w-20 rounded-full bg-vyc-accent flex items-center justify-center">
              <span className="text-4xl font-bold text-black">VYC</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Login to VYC</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stage === "username" && (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <User size={18} />
                  </div>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(!!checked)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Button type="submit" className="w-full bg-vyc-primary hover:bg-vyc-primary-dark">
                Continue
              </Button>
            </form>
          )}

          {stage === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStage("username")}
                >
                  Back
                </Button>
                <Button type="submit" className="bg-vyc-primary hover:bg-vyc-primary-dark">
                  Verify Password
                </Button>
              </div>
            </form>
          )}

          {stage === "key" && (
            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key">Verification Key</Label>
                <div className="mb-2 p-3 bg-gray-100 rounded text-center">
                  <p className="text-sm text-gray-600">Your verification number is:</p>
                  <p className="text-xl font-bold">{validationKey}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Convert each digit to its corresponding letter (1=a, 2=b, etc.)
                  </p>
                </div>
                <Input
                  id="key"
                  placeholder="Enter the verification key"
                  value={enteredKey}
                  onChange={(e) => setEnteredKey(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStage("password")}
                >
                  Back
                </Button>
                <Button type="submit" className="bg-vyc-primary hover:bg-vyc-primary-dark">
                  Login
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-gray-500 mt-2">
            VYC Accounting System © {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
