"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberPayments } from "@/components/members/member-payments";
import { MemberAttendance } from "@/components/members/member-attendance";
import { MemberInfo } from "@/components/members/member-info";
import { NotFound } from "@/components/not-found";

// Mock data - In a real app, this would come from an API
const mockMember = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 000-0000",
  membershipType: "Premium",
  status: "active",
  joinDate: "2024-01-15",
  photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
};

export default function MemberDetailPage() {
  const params = useParams();
  const memberId = params.id as string;

  // In a real app, you would fetch member data based on the ID
  const member = mockMember.id === memberId ? mockMember : null;

  if (!member) {
    return <NotFound message="Member not found" />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={member.photo} alt={member.name} />
          <AvatarFallback>
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{member.name}</h1>
          <p className="text-muted-foreground">{member.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.membershipType}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Join Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(member.joinDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{member.status}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4">
          <MemberInfo member={member} />
        </TabsContent>
        <TabsContent value="payments" className="space-y-4">
          <MemberPayments memberId={member.id} />
        </TabsContent>
        <TabsContent value="attendance" className="space-y-4">
          <MemberAttendance memberId={member.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}