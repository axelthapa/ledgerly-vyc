
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNepaliDate, formatNepaliDateNP } from "@/utils/nepali-date";
import { CalendarDays, Clock, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/toast-utils";

const DateTimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [showUploadButton, setShowUploadButton] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Try to load saved image from localStorage
    const savedImage = localStorage.getItem('dashboardBackgroundImage');
    if (savedImage) {
      setBackgroundImage(savedImage);
    }
    
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
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBackgroundImage(result);
        localStorage.setItem('dashboardBackgroundImage', result);
        toast.success("Background image updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeBackgroundImage = () => {
    setBackgroundImage(null);
    localStorage.removeItem('dashboardBackgroundImage');
    toast.success("Background image removed");
  };
  
  return (
    <Card 
      className="overflow-hidden relative" 
      onMouseEnter={() => setShowUploadButton(true)}
      onMouseLeave={() => setShowUploadButton(false)}
    >
      <CardContent className="p-0">
        <div className="bg-vyc-primary text-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Today's Date</h3>
              <p className="text-sm text-gray-200">Fiscal Year 2081/82</p>
            </div>
            
            {showUploadButton && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/30"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3">
                  <div className="space-y-3">
                    <p className="text-sm">Upload a custom image</p>
                    <input 
                      type="file" 
                      className="text-sm w-full" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                    {backgroundImage && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs flex items-center" 
                        onClick={removeBackgroundImage}
                      >
                        <X className="h-3 w-3 mr-1" /> Remove Image
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}
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
            
            <div 
              className="text-center p-3 rounded-lg bg-no-repeat bg-center bg-cover relative"
              style={backgroundImage ? {
                backgroundImage: `url('${backgroundImage}')`,
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                backgroundBlendMode: 'overlay'
              } : {
                backgroundColor: 'rgb(249, 250, 251)'
              }}
            >
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
