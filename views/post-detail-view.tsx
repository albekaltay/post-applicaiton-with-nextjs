"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import DetailSkeleton from "@/components/skeletons/detail-skeleton";
import DetailSkeletonWithoutComments from "@/components/skeletons/detail-skeleton-without-comments";
import { useToast } from "@/components/ui/use-toast";
import AppContainer from "@/layout/app-container";
import { Form, FormikProvider, useFormik } from "formik";
import { useParams } from "next/navigation";
import {
  useGetPostByIdQuery,
  useGetPostCommentsByPostIdQuery,
  useAddNewCommentMutation,
  useGetUserByIdQuery,
} from "@/store/services/postApi";
import { useAuth } from "@/store/contexts/AuthContext";
 


type Comment = {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
};

type CommentsResponse = {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
};
// ----------------------------------------------------------------------------

const PostDetailView = () => {
   
  const params = useParams();
  const id: string = params?.id as string;
  const { accessToken } = useAuth();
  const { toast } = useToast();

  const { data: post, isLoading: postLoading } = useGetPostByIdQuery(id);
  const {
    data: comments,
    isLoading: commentsLoading,
    refetch: refetchComments,
  }: {
    data?: CommentsResponse;
    isLoading: boolean;
    refetch: () => void;
  } = useGetPostCommentsByPostIdQuery(parseInt(id));
  const { data: user, isLoading: userLoading } = useGetUserByIdQuery(
    post?.userId?.toString() ?? "",
    {
      skip: !post?.userId,
    }
  );

  const commentCount = comments?.total;

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    enableReinitialize: true,
    onSubmit: (values) => handleCreateComment(values),
  });

  const [addNewComment] = useAddNewCommentMutation();

  const handleCreateComment = async (values: { comment: string }) => {
    try {
      await addNewComment({
        postId: parseInt(id),
        body: values.comment,
        userId: post!?.userId,
      }).unwrap();

      formik.resetForm();
      toast({
        description: "Post comment successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Error: ${
          error.data?.message || "Something went wrong"
        }`,
      });
    }
  };
  const loading = postLoading || userLoading || commentsLoading;
  return (
    <>
      <AppContainer title="Post Detail">
        {loading ? (
          accessToken ? (
            <DetailSkeleton />
          ) : (
            <DetailSkeletonWithoutComments />
          )
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{post?.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">{post?.body}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-6">
              <Separator />
              <div className="flex flex-row gap-2">
                {post?.tags.map((tag: string, index: number) => (
                  <Badge key={tag + "-" + index} variant="secondary">
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </Badge>
                ))}
              </div>
              <div className="border-2 border-rose-100 dark:border-gray-700 rounded-lg border-dashed flex flex-col p-4 gap-1">
                <div className="flex flex-row gap-2 items-center">
                  <span className="font-semibold text-sm">
                    {`Created by ${user?.firstName} ${user?.lastName}`}
                  </span>
                  {user?.role && (
                    <Badge variant="secondary">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-400 mb-2">
                  {user?.email}
                </span>
                <span className="text-xs text-gray-400">{`From ${user?.address.country}`}</span>
              </div>
              {accessToken ? (
                <>
                  <Separator className="my-2" />
                  <div className="grid gap-3 w-full">
                    <FormikProvider value={formik}>
                      <Form
                        onSubmit={formik.handleSubmit}
                        className="flex flex-col gap-3"
                      >
                        <Label htmlFor="description">
                          Comments ({commentCount})
                        </Label>
                        <Textarea
                          id="comment"
                          placeholder="Type here..."
                          className="min-h-32"
                          value={formik.values.comment}
                          onChange={formik.handleChange}
                        />
                        <div className="flex justify-end">
                          <Button type="submit">
                            Add Comment
                          </Button>
                        </div>{" "}
                      </Form>
                    </FormikProvider>
                    <Separator className="my-2 border-rose-100 dark:border-gray-700" />
                    {commentCount === 0 ? (
                      <div>No comments found.</div>
                    ) : (
                      comments?.comments.map(
                        (comment: Comment, index: number) => (
                          <React.Fragment key={index}>
                            <div className="flex flex-col gap-2">
                              <span className="font-semibold text-sm">
                                {comment.user.fullName}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {comment.body}
                              </span>
                            </div>
                            {commentCount !== index + 1 && <Separator />}
                          </React.Fragment>
                        )
                      )
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Separator className="my-2" />
                  <div className="w-full text-center p-6 bg-rose-50 rounded-lg">
                    <p className="text-gray-600">
    
                        Please{" "}
                        <a
                          href="/auth/login"
                          className="text-primary dark:text-gray-600 hover:text-rose-700 font-medium underline underline-offset-4"
                        >
                          login
                        </a>{" "}
                        to view and post comments.

                    </p>
                  </div>
                </>
              )}
            </CardFooter>
          </Card>
        )}
      </AppContainer>
    </>
  );
};

export default PostDetailView;
