
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  navigateTo?: string;  // Add navigation path
  isLoading?: boolean;  // Add loading state
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  navigateTo,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };
  
  return (
    <Card 
      className={cn("overflow-hidden", navigateTo && "cursor-pointer hover:shadow-md transition-all", className)}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && !isLoading && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-vyc-success" : "text-vyc-error"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">from last month</span>
              </div>
            )}
            {trend && isLoading && (
              <Skeleton className="h-4 w-24 mt-2" />
            )}
          </div>
          <div className="rounded-full p-2 bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
