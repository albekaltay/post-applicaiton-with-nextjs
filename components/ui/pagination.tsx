import * as React from "react";
import { cn } from "@/lib/utils";

const Pagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex w-full items-center justify-center py-4 gap-2",
      className
    )}
    {...props}
  />
));
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-row items-center gap-0.5 md:gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isActive?: boolean;
  }
>(({ className, isActive, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "hidden md:block h-9 min-w-9 rounded-md border border-input px-3 hover:bg-accent hover:text-accent-foreground",
      isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
      className
    )}
    {...props}
  />
));
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "h-9 min-w-9 rounded-md border border-input px-3 hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      Previous
    </button>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "h-9 min-w-9 rounded-md border border-input px-3 hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      Next
    </button>
  );
});
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "hidden md:flex h-9 w-9 items-center justify-center",
      className
    )}
    {...props}
  >
    ...
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
