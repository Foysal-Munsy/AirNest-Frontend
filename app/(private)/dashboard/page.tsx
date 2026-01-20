"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  DashboardView,
  type DashboardData,
} from "@/components/admin/dashboard-view";
import { Spinner } from "@/components/ui/spinner";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function getDashboard() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
        );
        setData(response.data);
      } catch (error) {
        console.log(error);
        setData(null);
      }
    }

    getDashboard();
  }, []);

  if (!data) return <Loading />;

  return <DashboardView data={data} />;
}
