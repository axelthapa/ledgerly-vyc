
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Activity {
  id: string;
  type: "sale" | "purchase" | "payment";
  description: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "failed";
  entityId?: string; // Added entityId for navigation
  entityType?: "customer" | "supplier";
}

const mockActivities: Activity[] = [
  {
    id: "T001",
    type: "sale",
    description: "Sale to Customer: John Doe",
    amount: "Rs 50,000.00",
    date: "Today, 10:30 AM",
    status: "completed",
    entityId: "CN001",
    entityType: "customer"
  },
  {
    id: "T002",
    type: "purchase",
    description: "Purchase from Supplier: Tech Solutions",
    amount: "Rs 35,000.00",
    date: "Today, 9:15 AM",
    status: "completed",
    entityId: "SP001",
    entityType: "supplier"
  },
  {
    id: "T003",
    type: "payment",
    description: "Payment received from: Sarah Smith",
    amount: "Rs 15,000.00",
    date: "Yesterday, 4:30 PM",
    status: "completed",
    entityId: "CN002",
    entityType: "customer"
  },
  {
    id: "T004",
    type: "sale",
    description: "Sale to Customer: Rajesh Kumar",
    amount: "Rs 22,500.00",
    date: "Yesterday, 2:45 PM",
    status: "pending",
    entityId: "CN003",
    entityType: "customer"
  },
  {
    id: "T005",
    type: "purchase",
    description: "Purchase from Supplier: Office Supplies Ltd",
    amount: "Rs 8,750.00",
    date: "2 days ago",
    status: "failed",
    entityId: "SP002",
    entityType: "supplier"
  },
];

const RecentActivity: React.FC = () => {
  const navigate = useNavigate();

  const handleActivityClick = (activity: Activity) => {
    // Navigate to transaction details
    navigate(`/transactions?id=${activity.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded cursor-pointer transition-colors"
              onClick={() => handleActivityClick(activity)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      activity.type === "sale"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : activity.type === "purchase"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-amber-100 text-amber-800 border-amber-200"
                    }
                  >
                    {activity.type}
                  </Badge>
                  <span className="font-medium">{activity.description}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {activity.date}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{activity.amount}</div>
                <div className="text-xs mt-1">
                  <Badge
                    variant="outline"
                    className={
                      activity.status === "completed"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : activity.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
