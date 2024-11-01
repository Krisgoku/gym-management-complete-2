"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  Award,
  Edit,
  Trash,
  Briefcase,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShiftSchedule } from "@/components/staff/shift-schedule";
import { PerformanceChart } from "@/components/staff/performance-chart";
import { PayrollHistory } from "@/components/staff/payroll-history";
import { toast } from "sonner";

// Mock data for demonstration
const staffData = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.j@fithub.com",
  phone: "+1 (555) 000-0000",
  role: "Trainer",
  status: "active",
  joinDate: "2024-01-15",
  photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  department: "Training",
  schedule: "Full-time",
  lastShift: "2024-03-21",
};

export default function StaffDetail() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Staff member deleted successfully");
      // Add navigation logic here
    } catch (error) {
      toast.error("Failed to delete staff member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Staff Details</h1>
          <p className="text-muted-foreground">
            View and manage staff information
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Staff
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            <Trash className="mr-2 h-4 w-4" />
            {isLoading ? "Deleting..." : "Delete Staff"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={staffData.photo} alt={staffData.name} />
                <AvatarFallback>
                  {staffData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{staffData.name}</h3>
                <Badge variant={staffData.status === "active" ? "default" : "secondary"}>
                  {staffData.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{staffData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{staffData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(staffData.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Last shift {new Date(staffData.lastShift).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{staffData.role}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{staffData.department}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{staffData.schedule}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule">
          <ShiftSchedule />
        </TabsContent>
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Staff member&apos;s performance metrics over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <PerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payroll">
          <PayrollHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}