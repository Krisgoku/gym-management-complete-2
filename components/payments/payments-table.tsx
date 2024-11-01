"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Send, Mail, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { usePayments } from "@/hooks/usePayments";
import { toast } from "sonner";

export function PaymentsTable({ memberId }: { memberId?: string }) {
  const {
    filteredPayments,
    isLoading,
    error,
    fetchPayments,
    updatePaymentStatus,
    sendReminder,
  } = usePayments();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "overdue":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleSendReminder = async (
    id: string,
    type: "email" | "whatsapp",
    contact: string
  ) => {
    try {
      await sendReminder(id, type);
      toast.success(`Reminder sent via ${type} to ${contact}`);
    } catch (error) {
      toast.error(`Failed to send ${type} reminder`);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updatePaymentStatus(id, newStatus);
      toast.success("Payment status updated successfully");
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading payments: {error}</p>
        <Button 
          variant="outline" 
          onClick={() => fetchPayments()}
          className="mt-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  const displayPayments = memberId
    ? filteredPayments.filter(payment => payment.memberId === memberId)
    : filteredPayments;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading payments...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : displayPayments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            displayPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.member.name}
                </TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>
                  {new Date(payment.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Send className="mr-2 h-4 w-4" />
                          Send Reminder
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            onClick={() =>
                              handleSendReminder(
                                payment.id,
                                "email",
                                payment.member.email
                              )
                            }
                            disabled={payment.status === "paid"}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleSendReminder(
                                payment.id,
                                "whatsapp",
                                payment.member.phone
                              )
                            }
                            disabled={payment.status === "paid"}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send WhatsApp
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup value={payment.status}>
                            {["pending", "paid", "overdue"].map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  handleStatusChange(payment.id, status)
                                }
                              >
                                <Badge
                                  variant={getStatusColor(status)}
                                  className="mr-2"
                                >
                                  {status}
                                </Badge>
                                Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}