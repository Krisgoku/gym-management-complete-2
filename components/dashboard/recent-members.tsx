"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentMembers = [
  {
    name: "John Doe",
    email: "john@example.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    joinDate: "2024-03-20",
  },
  {
    name: "Sarah Smith",
    email: "sarah@example.com",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    joinDate: "2024-03-19",
  },
  {
    name: "Michael Johnson",
    email: "michael@example.com",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    joinDate: "2024-03-18",
  },
  {
    name: "Emily Brown",
    email: "emily@example.com",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    joinDate: "2024-03-17",
  },
];

export function RecentMembers() {
  return (
    <div className="space-y-8">
      {recentMembers.map((member) => (
        <div key={member.email} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={member.image} alt={member.name} />
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
          <div className="ml-auto font-medium">
            {new Date(member.joinDate).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}