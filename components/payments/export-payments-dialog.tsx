"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

const formSchema = z.object({
  format: z.string(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }),
  status: z.string().optional(),
  includeFields: z.array(z.string()).default([]),
});

export function ExportPaymentsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: "csv",
      includeFields: [
        "member",
        "amount",
        "status",
        "dueDate",
        "type",
      ],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real app, this would trigger a file download
      const fileName = `payments-export-${new Date().toISOString().split('T')[0]}.${values.format}`;
      toast.success(`Payments exported successfully as ${fileName}`);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to export payments");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Payments</DialogTitle>
          <DialogDescription>
            Export payment records in your preferred format
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>
                  <div className="flex gap-2">
                    <DatePicker
                      date={field.value?.from}
                      onDateChange={(date) => 
                        field.onChange({ ...field.value, from: date })
                      }
                      placeholder="From"
                    />
                    <DatePicker
                      date={field.value?.to}
                      onDateChange={(date) => 
                        field.onChange({ ...field.value, to: date })
                      }
                      placeholder="To"
                    />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid Only</SelectItem>
                      <SelectItem value="pending">Pending Only</SelectItem>
                      <SelectItem value="overdue">Overdue Only</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="includeFields"
              render={() => (
                <FormItem>
                  <FormLabel>Include Fields</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { id: "member", label: "Member Name" },
                      { id: "amount", label: "Amount" },
                      { id: "status", label: "Status" },
                      { id: "dueDate", label: "Due Date" },
                      { id: "type", label: "Payment Type" },
                      { id: "email", label: "Email" },
                      { id: "phone", label: "Phone" },
                    ].map((field) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name="includeFields"
                        render={({ field: { value, onChange } }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={value?.includes(field.id)}
                                onCheckedChange={(checked) => {
                                  const current = value || [];
                                  const updated = checked
                                    ? [...current, field.id]
                                    : current.filter((val) => val !== field.id);
                                  onChange(updated);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {field.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                <FileDown className="mr-2 h-4 w-4" />
                {isLoading ? "Exporting..." : "Export Payments"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}