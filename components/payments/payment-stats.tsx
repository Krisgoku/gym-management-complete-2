"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayments } from "@/hooks/usePayments";
import { DollarSign, TrendingDown, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PaymentStats() {
  const { stats, isLoading, error, fetchPaymentStats } = usePayments();

  useEffect(() => {
    fetchPaymentStats();
  }, [fetchPaymentStats]);

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: "Total Due",
      value: `$${stats.totalDue.toLocaleString()}`,
      icon: DollarSign,
      trend: stats.dueTrend,
      trendUp: stats.dueTrend.startsWith("+"),
    },
    {
      title: "Overdue",
      value: `$${stats.overdue.toLocaleString()}`,
      count: stats.overdueCount,
      icon: AlertCircle,
      trend: stats.overdueTrend,
      trendUp: stats.overdueTrend.startsWith("+"),
      className: "text-red-500",
    },
    {
      title: "Paid",
      value: `$${stats.paid.toLocaleString()}`,
      count: stats.paidCount,
      icon: CheckCircle,
      trend: stats.paidTrend,
      trendUp: stats.paidTrend.startsWith("+"),
      className: "text-green-500",
    },
    {
      title: "Pending",
      value: `$${stats.pending.toLocaleString()}`,
      count: stats.pendingCount,
      icon: Clock,
      trend: stats.pendingTrend,
      trendUp: stats.pendingTrend.startsWith("+"),
      className: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className={`h-4 w-4 ${item.className}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {item.trendUp ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={item.trendUp ? "text-green-500" : "text-red-500"}>
                {item.trend}
              </span>
              {item.count !== undefined && (
                <span className="ml-2">({item.count} payments)</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}