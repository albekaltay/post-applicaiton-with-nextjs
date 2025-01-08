import React from "react";
import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <div className="flex flex-col space-x-4 py-4 relative">
      <div className="flex justify-end absolute top-2 right-4">
        <Skeleton className="h-4 w-6 rounded-md mb-4" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-[100px] mb-4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[80%]" />
      </div>
    </div>
  );
};
export default PostSkeleton;
