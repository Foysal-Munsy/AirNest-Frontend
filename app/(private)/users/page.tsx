"use client";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import React, { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  fullname: string;
  role: string;
  isActive: boolean;
  created_at: string;
};

export default function Users() {
  const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getUser();
  }, []);

  return (
    <div className="flex-1 px-4 py-6">
      {data.length === 0 ? (
        <Spinner className="size-6" />
      ) : (
        <Table>
          <TableHeader className="bg-blue-50/50 text-lg border">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created at</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((user, index) => (
              <TableRow
                key={user.id}
                className={index % 2 !== 0 ? "bg-blue-50/50" : ""}
              >
                <TableCell className="font-medium">{user.fullname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{formatDate(user.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
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
