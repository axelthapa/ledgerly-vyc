
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Language } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (newLanguage: 'en' | 'ne') => {
    setLanguage(newLanguage);
    toast({
      title: t('Language Changed'),
      description: newLanguage === 'en' ? 'Switched to English' : 'नेपालीमा परिवर्तन गरियो',
      variant: 'default',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 px-0"
        >
          <Language className="h-4 w-4" />
          <span className="sr-only">{t('Switch Language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={language === 'en' ? 'bg-accent' : ''}
        >
          <span className="mr-2 text-base">🇬🇧</span>
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ne')}
          className={language === 'ne' ? 'bg-accent' : ''}
        >
          <span className="mr-2 text-base">🇳🇵</span>
          <span>नेपाली</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitch;
