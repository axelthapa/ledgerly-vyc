
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNepaliDate, formatNepaliDateNP } from "@/utils/nepali-date";
import NepalFlag from "./NepalFlag";
import { CalendarDays, Clock } from "lucide-react";

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
  
  const formatEnglishDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
          <div className="grid grid-cols-1 gap-4">
            <div className="text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-vyc-primary" />
                <div className="text-3xl font-bold">{formatTime(currentTime)}</div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-1">
                <CalendarDays className="h-5 w-5 text-vyc-primary" />
                <p className="text-md text-gray-600">
                  {formatEnglishDate(currentTime)}
                </p>
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">नेपाली मिति</p>
              <p className="text-2xl font-medium">{formatNepaliDateNP(currentTime)}</p>
              <p className="text-md text-gray-600">{formatNepaliDate(currentTime)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTimeDisplay;
