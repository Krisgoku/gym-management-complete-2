"use client";

import { useState } from "react";
import { Plus, FileUp, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentsTable } from "@/components/payments/payments-table";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
import { ImportPaymentsDialog } from "@/components/payments/import-payments-dialog";
import { ExportPaymentsDialog } from "@/components/payments/export-payments-dialog";
import { PaymentStats } from "@/components/payments/payment-stats";
import { PaymentFilters } from "@/components/payments/payment-filters";

export default function PaymentsPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Manage your fitness centre payments and invoices
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
        </div>
      </div>

      <PaymentStats />
      <PaymentFilters />
      <PaymentsTable />

      <AddPaymentDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
      />
      <ImportPaymentsDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen} 
      />
      <ExportPaymentsDialog 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen} 
      />
    </div>
  );
}