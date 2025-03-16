"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Form, FormikProvider, useFormik } from "formik";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/store/contexts/AuthContext";

const LoginView = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await login(values.username, values.password);
        toast({
          description: "Successfully logged in!",
        });
        router.push("/");
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Invalid username or password!",
        });
      }
    },
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username and password below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : "Login"}
              </Button>
            </div>
          </Form>
        </FormikProvider>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginView;
