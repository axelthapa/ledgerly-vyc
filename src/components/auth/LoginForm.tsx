import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/toast-utils";
import { Eye, EyeOff, Lock, User, KeyRound, Calendar, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatNepaliDate, formatNepaliDateNP } from "@/utils/nepali-date";

// Mock admin users
const ADMIN_USERS = [
  { username: "vision", password: "vision@123" },
  { username: "admin", password: "admin123" },
];

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verificationKey, setVerificationKey] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [validationKey, setValidationKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempt, setLoginAttempt] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isValidationKeyGenerated, setIsValidationKeyGenerated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [keySequence, setKeySequence] = useState("");
  
  // Generate random validation key without 0
  const generateValidationKey = () => {
    const digits = "123456789"; // Exclude 0
    let key = "";
    for (let i = 0; i < 4; i++) {
      key += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    setValidationKey(key);
    setIsValidationKeyGenerated(true);
    return key;
  };
  
  // Convert number to corresponding letters (1=a, 2=b, etc.)
  const convertToLetters = (key: string) => {
    return key
      .split("")
      .map(digit => String.fromCharCode(96 + parseInt(digit)))
      .join("");
  };
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Add keyboard listener to detect "VYC" sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = keySequence + e.key.toUpperCase();
      setKeySequence(newSequence.slice(-3)); // Keep only the last 3 characters
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keySequence]);
  
  // Check for "VYC" sequence
  useEffect(() => {
    if (keySequence === "VYC") {
      setShowLoginForm(true);
    }
  }, [keySequence]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username and password first
    const user = ADMIN_USERS.find(user => user.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      toast.error("Invalid username. Please try again.");
      return;
    }
    
    if (user.password !== password) {
      toast.error("Invalid password. Please try again.");
      return;
    }
    
    if (!isValidationKeyGenerated) {
      // First login attempt - generate key and wait for verification
      const key = generateValidationKey();
      console.log("Generated verification key:", key);
      console.log("Expected input:", convertToLetters(key));
      setLoginAttempt(true);
      toast.success("Username and password verified. Please enter the verification key.");
      return;
    }
    
    // Verify the validation key
    const expectedKey = convertToLetters(validationKey);
    
    if (verificationKey.toLowerCase() !== expectedKey) {
      toast.error("Incorrect verification key. Please try again.");
      return;
    }
    
    // Login successful
    toast.success("Login successful! Redirecting to dashboard...");
    
    // Save username in localStorage if "Remember Me" is checked
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }
    
    // Set login state
    localStorage.setItem("isLoggedIn", "true");
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };
  
  // Load remembered username if available
  useEffect(() => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
    
    // Check if user is already logged in (redirect should happen in Index.tsx)
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      setShowLoginForm(false);
    } else {
      // For better UX, we'll show the login form on page load in development
      // In production, keep this commented out to enforce the VYC key sequence
      // setShowLoginForm(true);
    }
  }, []);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleExit = () => {
    setIsExitDialogOpen(true);
  };
  
  const confirmExit = () => {
    // In a real app, you might want to clear any sensitive data
    window.close();
    // Fallback if window.close() doesn't work (some browsers block it)
    window.location.href = "about:blank";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  
  const formatEnglishDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  if (!showLoginForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-vyc-primary to-vyc-primary-dark p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-bold mb-4">VYC Accounting System</h2>
            <p className="text-muted-foreground mb-6">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded border">V</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded border">Y</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded border">C</kbd> keys to access the login screen.
            </p>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-vyc-accent flex items-center justify-center">
                <span className="text-4xl font-bold text-black">VYC</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
          
          {/* Date and Time Display */}
          <div className="mt-2 text-sm border rounded-lg p-2 bg-gray-50">
            <div className="flex items-center justify-center gap-2 font-bold">
              <Clock className="h-4 w-4" /> 
              {formatTime(currentTime)}
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              <span>{formatEnglishDate(currentTime)}</span>
            </div>
            <div className="mt-1 font-medium">
              {formatNepaliDateNP(currentTime)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            
            {isValidationKeyGenerated && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="verificationKey">Verification Key</Label>
                  <span className="text-xs bg-vyc-accent text-black px-2 py-1 rounded font-mono">
                    Key: {validationKey}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-gray-400">
                    <KeyRound size={18} />
                  </div>
                  <Input
                    id="verificationKey"
                    placeholder="Enter verification key"
                    value={verificationKey}
                    onChange={(e) => setVerificationKey(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
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
            
            <div className="flex space-x-2">
              <Button type="submit" className="w-full bg-vyc-primary hover:bg-vyc-primary-dark">
                {loginAttempt ? "Verify & Login" : "Login"}
              </Button>
              <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="outline" onClick={handleExit}>
                    Exit
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to exit?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be logged out of the application.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmExit} className="bg-red-600 hover:bg-red-700">
                      Yes, Exit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
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
