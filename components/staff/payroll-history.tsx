import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const payrollData = [
  {
    id: 1,
    period: "March 2024",
    salary: "$3,500",
    bonus: "$200",
    deductions: "$450",
    netPay: "$3,250",
    status: "paid",
  },
  {
    id: 2,
    period: "February 2024",
    salary: "$3,500",
    bonus: "$150",
    deductions: "$450",
    netPay: "$3,200",
    status: "paid",
  },
];

export function PayrollHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Pay</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.period}</TableCell>
                <TableCell>{payment.salary}</TableCell>
                <TableCell>{payment.bonus}</TableCell>
                <TableCell>{payment.deductions}</TableCell>
                <TableCell>{payment.netPay}</TableCell>
                <TableCell>
                  <Badge variant="outline">{payment.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}