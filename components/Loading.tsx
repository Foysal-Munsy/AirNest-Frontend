import React from "react";
import { Spinner } from "./ui/spinner";

export default function Loading() {
  return (
    <div className="flex-1 px-4 py-6">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-center justify-center rounded-lg border bg-card px-6 py-14">
          <Spinner className="size-6" />
        </div>
      </div>
    </div>
  );
}
