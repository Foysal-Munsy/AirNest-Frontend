import Link from "next/link";
import { CalendarDays, Shield, UserCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type User = {
  id: number;
  username: string;
  email: string;
  fullname: string;
  role: string;
  isActive: boolean;
  created_at: string;
};

export type DashboardData = {
  stats: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    newUsersLast7Days: number;
  };
  recentUsers: User[];
};

export function DashboardView({ data }: { data: DashboardData }) {
  return (
    <div className="flex-1 px-4 py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your application activity.
            </p>
          </div>

          <div className="mt-3 flex gap-2 sm:mt-0">
            <Button asChild variant="outline">
              <Link href="/users">View users</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total users"
              value={data.stats.totalUsers}
              Icon={Users}
            />
            <StatCard
              title="Active users"
              value={data.stats.activeUsers}
              Icon={UserCheck}
            />
            <StatCard
              title="Admins"
              value={data.stats.adminUsers}
              Icon={Shield}
            />
            <StatCard
              title="New (7 days)"
              value={data.stats.newUsersLast7Days}
              Icon={CalendarDays}
            />
          </div>

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4 border-b">
              <div>
                <CardTitle className="text-base">Recent users</CardTitle>
                <CardDescription>Latest registrations.</CardDescription>
              </div>
              <Button asChild variant="ghost">
                <Link href="/users">See all</Link>
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {data.recentUsers.length === 0 ? (
                <div className="px-6 py-10 text-sm text-muted-foreground">
                  No users found.
                </div>
              ) : (
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            {u.fullname}
                          </TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell className="capitalize">{u.role}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatDate(u.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: number;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-md border bg-background">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
