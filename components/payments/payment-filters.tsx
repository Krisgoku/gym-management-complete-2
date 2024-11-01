"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { usePayments } from "@/hooks/usePayments";
import { X } from "lucide-react";

export function PaymentFilters() {
  const { filters, setFilter, clearFilters } = usePayments();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Member Name</label>
          <Input
            placeholder="Search member..."
            value={filters.memberName || ''}
            onChange={(e) => setFilter('memberName', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => setFilter('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Due Date</label>
          <DatePicker
            date={filters.dueDate}
            onDateChange={(date) => setFilter('dueDate', date)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Payment Type</label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => setFilter('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Monthly Membership">Monthly Membership</SelectItem>
              <SelectItem value="Annual Membership">Annual Membership</SelectItem>
              <SelectItem value="Personal Training">Personal Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {Object.values(filters).some(Boolean) && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-8 px-2 lg:px-3"
          >
            Reset Filters
            <X className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}