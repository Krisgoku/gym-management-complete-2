"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/staff/data-table";
import { columns } from "@/components/staff/columns";
import { AddStaffDialog } from "@/components/staff/add-staff-dialog";

export default function StaffPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-full p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-sm text-muted-foreground">
            Manage your fitness centre staff members
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>
      <DataTable columns={columns} />
      <AddStaffDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}