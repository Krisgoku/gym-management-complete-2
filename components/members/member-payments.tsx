"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsTable } from "@/components/payments/payments-table";

interface MemberPaymentsProps {
  memberId: string;
}

export function MemberPayments({ memberId }: MemberPaymentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentsTable memberId={memberId} />
      </CardContent>
    </Card>
  );
}