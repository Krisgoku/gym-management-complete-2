"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/members/data-table";
import { columns } from "@/components/members/columns";
import { AddMemberDialog } from "@/components/members/add-member-dialog";
import { useMembers } from "@/hooks/useMembers";
import { useState } from "react";

export default function MembersPage() {
  const [open, setOpen] = useState(false);
  const { members, isLoading, error, fetchMembers } = useMembers();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return (
    <div className="h-full p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-sm text-muted-foreground">
            Manage your fitness centre members here
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      <DataTable columns={columns} data={members} isLoading={isLoading} error={error} />
      <AddMemberDialog open={open} onOpenChange={setOpen} onSuccess={fetchMembers} />
    </div>
  );
}