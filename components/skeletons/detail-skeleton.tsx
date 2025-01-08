import React from "react";
import { Skeleton } from "../ui/skeleton";

const DetailSkeleton = () => {
  return (
    <div className="flex flex-col space-x-4 py-6 gap-2">
      <Skeleton className="h-6 w-[140px] ms-4 mb-2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full mb-6" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
};

export default DetailSkeleton;
