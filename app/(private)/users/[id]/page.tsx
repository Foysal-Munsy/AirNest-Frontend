"use client";
import Loading from "@/components/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
  fullname: string;
  role: string;
  isActive: boolean;
  created_at: string;
};

export default function Profile() {
  const params = useParams();

  const [data, setData] = useState<User>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function getUser() {
      try {
        setError(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/id/${params.id}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
        setError("Failed to load user");
      }
    }

    getUser();
  }, [params.id]);

  if (error)
    return (
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-lg rounded-lg border bg-background p-4 text-sm">
          {error}
        </div>
      </div>
    );

  if (!data) return <Loading />;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex-row items-center gap-4">
          <Image
            src="https://i.ibb.co/7dcBDbPP/male-avatar.avif"
            alt="User profile"
            width={56}
            height={56}
            className="size-14 rounded-full border object-cover"
          />
          <div className="min-w-0">
            <CardTitle className="truncate">{data.fullname}</CardTitle>
            <CardDescription className="truncate">{data.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <Row label="ID" value={data.id} />
            <Separator />
            <Row label="Username" value={data.username} />
            <Separator />
            <Row label="Email" value={data.email} />
            <Separator />
            <Row label="Role" value={data.role} />
            <Separator />
            <Row label="Full name" value={data.fullname} />
            <Separator />
            <Row label="Active" value={data.isActive ? "Yes" : "No"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
