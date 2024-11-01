import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const historyData = [
  {
    id: 1,
    type: "Premium",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Active",
    amount: "$599",
  },
  {
    id: 2,
    type: "Basic",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "Expired",
    amount: "$299",
  },
];

export function MembershipHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}