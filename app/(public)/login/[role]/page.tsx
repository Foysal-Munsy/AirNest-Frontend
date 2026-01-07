"use client";
import AuthForm from "@/components/AuthForm";

import { useParams } from "next/navigation";

export default function Login() {
  const { role } = useParams();
  return (
    <>
      {role === "admin" ? (
        <AuthForm page="login" />
      ) : (
        <p className="flex items-center justify-center min-h-screen">
          Invalid Role
        </p>
      )}
    </>
  );
}
