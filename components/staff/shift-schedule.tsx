import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const scheduleData = [
  {
    id: 1,
    day: "Monday",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    type: "Regular Shift",
  },
  {
    id: 2,
    day: "Tuesday",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    type: "Regular Shift",
  },
  {
    id: 3,
    day: "Wednesday",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    type: "Regular Shift",
  },
  {
    id: 4,
    day: "Thursday",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    type: "Regular Shift",
  },
  {
    id: 5,
    day: "Friday",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    type: "Regular Shift",
  },
];

export function ShiftSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduleData.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">{shift.day}</TableCell>
                <TableCell>{shift.startTime}</TableCell>
                <TableCell>{shift.endTime}</TableCell>
                <TableCell>{shift.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}