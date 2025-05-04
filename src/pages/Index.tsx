
import React, { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [accessCode, setAccessCode] = useState<number[]>([]);
  const [enteredKeys, setEnteredKeys] = useState<string>("");
  const [secretNumbers, setSecretNumbers] = useState<number[]>([]);

  // Generate 4 random numbers between 1-9
  useEffect(() => {
    const generateRandomNumbers = () => {
      const numbers: number[] = [];
      for (let i = 0; i < 4; i++) {
        numbers.push(Math.floor(Math.random() * 9) + 1);
      }
      setSecretNumbers(numbers);
      
      // Map numbers to letters (1=a, 2=b, etc.)
      const newAccessCode = numbers.map(num => num);
      setAccessCode(newAccessCode);
    };

    generateRandomNumbers();
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      window.location.href = "/dashboard";
    } else {
      setIsCheckingLogin(false);
    }
  }, []);
  
  // Listen for keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Map keys a-i to 1-9
      const keyToNumber: { [key: string]: number } = {
        'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 
        'f': 6, 'g': 7, 'h': 8, 'i': 9
      };

      const pressedNumber = keyToNumber[e.key.toLowerCase()];
      
      if (pressedNumber) {
        const newEnteredKeys = enteredKeys + pressedNumber;
        setEnteredKeys(newEnteredKeys);
        
        // Check if entered sequence matches access code
        if (newEnteredKeys.length === accessCode.length) {
          const enteredArray = newEnteredKeys.split('').map(Number);
          const isCorrect = enteredArray.every((num, index) => num === accessCode[index]);
          
          if (isCorrect) {
            setShowLogin(true);
          } else {
            setEnteredKeys("");
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enteredKeys, accessCode]);
  
  if (isCheckingLogin) {
    return <div className="h-screen flex items-center justify-center">Checking login status...</div>;
  }
  
  if (!showLogin) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 opacity-10">VYC</h1>
            <p className="text-xl opacity-10">Management System</p>
          </div>
          <div className="fixed bottom-6 left-0 w-full flex justify-center opacity-30 space-x-8">
            {secretNumbers.map((num, idx) => (
              <div key={idx} className="w-8 h-8 rounded-full flex items-center justify-center text-sm">
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return <LoginForm />;
};

export default Index;
