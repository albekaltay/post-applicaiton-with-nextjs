import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Filter, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useGetPostTagListQuery } from "@/store/services/postApi";
import { useAuth } from "@/store/contexts/AuthContext";

// ----------------------------------------------------------------------------

interface HomeTopBarProps {
  onSelectedCategory: (categoryName: string) => void;
  onReset: () => void;
  onSort: (sortBy: string, order: "asc" | "desc") => void;
}

// ----------------------------------------------------------------------------

const HomeTopBar = ({
  onSelectedCategory,
  onReset,
  onSort,
}: HomeTopBarProps) => {
  const { data } = useGetPostTagListQuery();

  const { accessToken } = useAuth();

  return (
    <div className="flex items-center ">
      <span className="text-md font-bold"> Posts </span>
      <div className="ml-auto flex items-center gap-2">
        <Button onClick={onReset} variant={"outline"}>
          Reset
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="overflow-hidden rounded-lg px-16 gap-2"
            >
              <span>
                <Filter className="h-4 w-4" />
              </span>
              <span>By Category</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="max-h-[200px] overflow-y-auto"
          >
            {data?.map((category: string, index: number) => (
              <DropdownMenuItem
                key={index}
                onClick={() => onSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="overflow-hidden rounded-lg px-16 gap-2"
            >
              <span>Sort by</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onSort("title", "asc")}>
              Title (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("title", "desc")}>
              Title (Z-A)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {accessToken && (
          <Link href={"/posts/create"}>
            <Button className="gap-2">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Post
              </span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomeTopBar;
