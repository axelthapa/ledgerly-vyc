
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNepaliDate, formatNepaliDateNP } from "@/utils/nepali-date";
import NepalFlag from "./NepalFlag";

const DateTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-vyc-primary text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Today's Date</h3>
              <p className="text-sm text-gray-200">Fiscal Year 2081/82</p>
            </div>
            <NepalFlag />
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold">{formatTime(currentTime)}</div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">English Date</p>
              <p className="text-xl font-medium">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Nepali Date</p>
              <p className="text-xl font-medium">{formatNepaliDate(currentTime)}</p>
              <p className="text-lg font-medium">{formatNepaliDateNP(currentTime)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTimeDisplay;
