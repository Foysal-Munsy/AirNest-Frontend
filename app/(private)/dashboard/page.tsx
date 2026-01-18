"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Users, UserCheck, Shield, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      setError("Missing NEXT_PUBLIC_BASE_URL");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get<User[]>(`${baseUrl}/users/`);
        if (!isMounted) return;
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err: unknown) {
        if (!isMounted) return;
        if (axios.isAxiosError(err)) {
          const msg = err.message ?? "Failed to load dashboard data";
          setError(msg);
        } else {
          setError("Failed to load dashboard data");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive).length;
    const admins = users.filter(
      (u) => String(u.role).toLowerCase() === "admin"
    ).length;

    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const newThisWeek = users.filter((u) => {
      const created = new Date(u.created_at).getTime();
      return Number.isFinite(created) && now - created <= sevenDaysMs;
    }).length;

    return { total, active, admins, newThisWeek };
  }, [users]);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 6);
  }, [users]);

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

        {isLoading ? (
          <div className="flex items-center justify-center rounded-lg border bg-card px-6 py-14">
            <Spinner className="size-6" />
          </div>
        ) : error ? (
          <div className="rounded-lg border bg-card px-6 py-10 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total users" value={stats.total} Icon={Users} />
              <StatCard
                title="Active users"
                value={stats.active}
                Icon={UserCheck}
              />
              <StatCard title="Admins" value={stats.admins} Icon={Shield} />
              <StatCard
                title="New (7 days)"
                value={stats.newThisWeek}
                Icon={CalendarDays}
              />
            </div>

            <div className="rounded-lg border bg-card">
              <div className="flex items-center justify-between gap-4 border-b px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold">Recent users</h2>
                  <p className="text-sm text-muted-foreground">
                    Latest registrations.
                  </p>
                </div>
                <Button asChild variant="ghost">
                  <Link href="/users">See all</Link>
                </Button>
              </div>

              {recentUsers.length === 0 ? (
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
                      {recentUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">
                            {u.fullname || u.username}
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
            </div>
          </div>
        )}
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
    <div className="rounded-lg border bg-card px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-md border bg-background">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
