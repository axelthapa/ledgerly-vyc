
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useLanguage();
  
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  const handleFirst = () => {
    onPageChange(1);
  };
  
  const handleLast = () => {
    onPageChange(totalPages);
  };
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handleFirst}
        disabled={currentPage === 1}
        title={t('First Page')}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        title={t('Previous Page')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="text-sm">
        {t('Page')} {currentPage} {t('of')} {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        title={t('Next Page')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLast}
        disabled={currentPage === totalPages}
        title={t('Last Page')}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
