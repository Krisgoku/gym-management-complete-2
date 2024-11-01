"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Activity,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  User,
  Clock,
  Award,
  Edit,
  Trash,
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
import { MembershipHistory } from "@/components/members/membership-history";
import { AttendanceChart } from "@/components/members/attendance-chart";
import { PaymentHistory } from "@/components/members/payment-history";
import { useMembers } from "@/hooks/useMembers";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function MemberDetail() {
  const params = useParams();
  const { currentMember, isLoading, error, fetchMemberById } = useMembers();
  const memberId = params.id as string;

  useEffect(() => {
    if (memberId) {
      fetchMemberById(memberId);
    }
  }, [memberId, fetchMemberById]);

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => fetchMemberById(memberId)}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !currentMember) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/api/members/${memberId}`);
      toast.success("Member deleted successfully");
      // Add navigation logic here
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error(error.response?.data?.message || "Failed to delete member");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Member Details</h1>
          <p className="text-muted-foreground">
            View and manage member information
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Member
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete Member
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
                <AvatarImage src={currentMember.photo} alt={currentMember.name} />
                <AvatarFallback>
                  {currentMember.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{currentMember.name}</h3>
                <Badge variant={currentMember.status === "ACTIVE" ? "default" : "secondary"}>
                  {currentMember.status.toLowerCase()}
                </Badge>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{currentMember.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{currentMember.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(currentMember.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {currentMember.membershipType} Membership
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Expires {new Date(currentMember.membershipExpiry).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance History</TabsTrigger>
          <TabsTrigger value="membership">Membership History</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                Member&apos;s attendance over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <AttendanceChart memberId={memberId} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="membership">
          <MembershipHistory memberId={memberId} />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentHistory memberId={memberId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}