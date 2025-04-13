
import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast-utils";
import { Download, Upload, Printer, Info } from "lucide-react";
import { isElectron, saveDataToFile, loadDataFromFile, printToPDF, getAppInfo } from '@/utils/electron-utils';

interface ElectronFeaturesProps {
  getData?: () => any;
  onDataLoaded?: (data: any) => void;
}

const ElectronFeatures: React.FC<ElectronFeaturesProps> = ({ 
  getData, 
  onDataLoaded 
}) => {
  if (!isElectron()) {
    return null; // Don't render anything in web browser
  }

  const appInfo = getAppInfo();

  const handleSaveData = async () => {
    if (!getData) {
      toast.error("No data provider configured");
      return;
    }

    try {
      const data = getData();
      const result = await saveDataToFile("vyc-accounting-data.json", data);
      
      if (result.success) {
        toast.success(`Data saved to ${result.filePath}`);
      } else {
        toast.error(`Failed to save: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleLoadData = async () => {
    if (!onDataLoaded) {
      toast.error("No data handler configured");
      return;
    }

    try {
      const result = await loadDataFromFile();
      
      if (result.success && result.data) {
        onDataLoaded(result.data);
        toast.success("Data loaded successfully");
      } else {
        toast.error(`Failed to load: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handlePrintToPDF = async () => {
    try {
      const result = await printToPDF({
        marginsType: 0,
        printBackground: true,
        printSelectionOnly: false,
        landscape: false
      });
      
      if (result.success) {
        toast.success(`PDF saved to ${result.filePath}`);
      } else {
        toast.error(`Failed to print: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-md font-medium">Desktop Features</h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={handleSaveData}
          disabled={!getData}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Save Data
        </Button>
        <Button 
          variant="outline" 
          onClick={handleLoadData}
          disabled={!onDataLoaded}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          Load Data
        </Button>
        <Button 
          variant="outline" 
          onClick={handlePrintToPDF}
          className="flex items-center gap-2"
        >
          <Printer size={16} />
          Export as PDF
        </Button>
      </div>
      <div className="text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Info size={12} />
          <span>Platform: {appInfo.platform || 'Unknown'}</span>
        </div>
        <div>Version: {appInfo.version || '1.0.0'}</div>
      </div>
    </div>
  );
};

export default ElectronFeatures;
