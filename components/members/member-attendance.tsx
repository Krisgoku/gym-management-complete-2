"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MemberAttendanceProps {
  memberId: string;
}

// Mock attendance data
const mockAttendance = [
  {
    id: "1",
    date: "2024-03-20",
    checkIn: "09:00 AM",
    checkOut: "10:30 AM",
    duration: "1h 30m",
  },
  {
    id: "2",
    date: "2024-03-19",
    checkIn: "08:45 AM",
    checkOut: "10:15 AM",
    duration: "1h 30m",
  },
];

export function MemberAttendance({ memberId }: MemberAttendanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  {new Date(record.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{record.checkIn}</TableCell>
                <TableCell>{record.checkOut}</TableCell>
                <TableCell>{record.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}