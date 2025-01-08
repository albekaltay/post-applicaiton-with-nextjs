import React from "react";
import { Separator } from "./ui/separator";
import { Ellipsis, ThumbsUp, ThumbsDown, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useDeletePostMutation } from "@/store/services/postApi";
import { useAuth } from "@/store/contexts/AuthContext";
import { ApiError } from "@/types/types";
// ----------------------------------------------------------------------------

interface PostProps {
  id: number;
  title: string;
  body: string;
  likes: number;
  dislikes: number;
  views: number;
}

// ----------------------------------------------------------------------------

const Post = ({ id, title, body, likes, dislikes, views }: PostProps) => {
  const [deletePost] = useDeletePostMutation();
  const { accessToken } = useAuth();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deletePost(id).unwrap();
      toast({
        description: "Post deleted successfully",
      });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast({
        variant: "destructive",
        title: "Error deleting post",
        description: apiError.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="gap-2 relative">
      <div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all w-full">
        <div className="flex flex-row justify-between items-center w-full">
          <div>
            <div className="flex w-full flex-col gap-1">
              <Link href={`posts/${id}`}>
                <div className="text-base font-medium cursor-pointer mb-4">
                  {title}
                </div>
              </Link>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {body}
            </div>
          </div>
          <div className="absolute top-2 right-4 hover:bg-rose-100 dark:hover:bg-gray-800 rounded-lg p-2">
            <div className="ml-auto text-xs">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer">
                    <Ellipsis className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`posts/${id}`}>
                    <DropdownMenuItem>Detail</DropdownMenuItem>
                  </Link>
                  {accessToken && (
                    <>
                      <Link href={`/posts/${id}/edit`}>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                      </Link>

                      <DropdownMenuItem onClick={handleDelete}>
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="flex flex-row justify-between items-center w-full ">
          <div className="flex flex-row  gap-4">
            <Link href={`posts/${id}`}>
              <div className="flex items-center gap-6">
                <div className="flex flex-row items-center gap-1">
                  <span>
                    <Eye className="h-4 w-4" />{" "}
                  </span>
                  <span className="text-xs font-normal">{views}</span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span>
                    <ThumbsUp className="h-4 w-4" />{" "}
                  </span>
                  <span className="text-xs font-normal">{likes}</span>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <span>
                    <ThumbsDown className="h-4 w-4" />{" "}
                  </span>
                  <span className="text-xs font-normal">{dislikes}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
