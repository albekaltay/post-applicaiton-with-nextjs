"use client";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
  useGetPostTagListQuery,
  useGetPostByIdQuery,
} from "@/store/services/postApi";
import { ApiError } from "@/types/types";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  body: Yup.string().required("Content is required"),
  tags: Yup.array().min(1, "At least one tag is required"),
});

const AddEditForm = () => {
  const params = useParams();
  const id: string = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const { data: tags } = useGetPostTagListQuery();
  const { data: post } = useGetPostByIdQuery(id, { skip: !id });
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const formik = useFormik({
    initialValues: {
      title: post?.title || "",
      body: post?.body || "",
      tags: post?.tags || [],
      userId: post?.userId || 1,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (id) {
          await updatePost({
            id: parseInt(id),
            ...values,
          }).unwrap();
          toast({ description: "Post updated successfully" });
        } else {
          await createPost(values).unwrap();
          toast({ description: "Post created successfully" });
        }
        router.push("/posts");
      } catch (error: unknown) {
        const apiError = error as ApiError;
        toast({
          variant: "destructive",
          description: `Error: ${
            apiError.data?.message || "Something went wrong"
          }`,
        });
      }
    },
  });

  return (
    <Card>
      <CardHeader></CardHeader>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          <CardContent className="flex flex-col gap-4 lg:gap-0">
            <div className="flex flex-col lg:flex-row lg:mb-4">
              <div className="lg:basis-2/6 basis-12">
                <div className="text-md font-semibold mb-1">Details</div>
                <p className="text-sm lg:block hidden">Title, body...</p>
              </div>

              <div className="lg:basis-4/6 basis-12 grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    className="w-full"
                    onChange={formik.handleChange}
                    value={formik.values.title}
                    // error={formik.touched.title && formik.errors.title}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="body">Body</Label>
                  <Textarea
                    id="body"
                    name="body"
                    className="min-h-32"
                    onChange={formik.handleChange}
                    value={formik.values.body}
                    // error={formik.touched.body && formik.errors.body}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row">
              <div className="lg:basis-2/6 basis-12">
                <div className="text-md font-semibold mb-1">Properties</div>
                <p className="text-sm lg:block hidden">
                  Additional functions and attributes...
                </p>
              </div>

              <div className="lg:basis-4/6 basis-12 grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="tags">Tags</Label>
                  <Select
                    onValueChange={(value: string) => {
                      const currentTags = formik.values.tags || [];
                      if (!currentTags.includes(value)) {
                        formik.setFieldValue("tags", [...currentTags, value]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select tags" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectGroup>
                        <SelectLabel>Available Tags</SelectLabel>
                        {tags?.map((tag: string, index: number) => (
                          <SelectItem key={`tag-${index}`} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 flex-wrap">
                    {formik.values.tags?.map((tag: string) => (
                      <div
                        key={`selected-${tag}`}
                        className="bg-primary/10 px-2 py-1 rounded-md flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            formik.setFieldValue(
                              "tags",
                              formik.values.tags.filter(
                                (t: string) => t !== tag
                              )
                            );
                          }}
                          className="text-sm hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t px-6 py-4">
            <Button type="submit">{id ? "Edit Post" : "Add Post"}</Button>
          </CardFooter>
        </Form>
      </FormikProvider>
    </Card>
  );
};

export default AddEditForm;
