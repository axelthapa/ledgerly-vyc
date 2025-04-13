
import React from 'react';
import { isElectron, getAppInfo } from '@/utils/electron-utils';
import { MonitorSmartphone } from 'lucide-react';

export const ElectronInfo: React.FC = () => {
  if (!isElectron()) {
    return null;
  }

  const appInfo = getAppInfo();
  
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <MonitorSmartphone size={12} />
      <span>Desktop v{appInfo.version}</span>
    </div>
  );
};
