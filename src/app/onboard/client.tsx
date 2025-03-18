"use client";

import Loading from "@/components/Loading";
import { LogoutLink } from "@/components/LogoutLink";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { TimerIcon, UserIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Badge from "../../components/Badge";
import { createOnboarding } from "./actions";
import { create } from "@bufbuild/protobuf";
import { OnboardUserRequestSchema } from "@buf/safedep_api.bufbuild_es/safedep/services/controltower/v1/onboarding_pb";
import * as v from "valibot";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@auth0/nextjs-auth0/types";

const onboardSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Name is required"),
    v.minLength(2, "Name must be at least 2 characters"),
  ),
  organizationName: v.pipe(
    v.string("Organization name is required"),
    v.trim(),
    v.minLength(1, "Organization name is required"),
  ),
  organizationDomain: v.pipe(
    v.string("Organization domain is required"),
    v.trim(),
    v.minLength(1, "Organization domain is required"),
  ),
});

type OnboardFormSchema = v.InferInput<typeof onboardSchema>;

export default function OnboardClient({ user }: { user: User }) {
  const router = useRouter();

  const form = useForm<OnboardFormSchema>({
    resolver: valibotResolver(onboardSchema),
    defaultValues: {
      name: user?.name || "",
      organizationName: "",
      organizationDomain: "",
    },
  });

  // react-hook-form does not update the `defaultValues` if it changes.
  // Learn more: https://stackoverflow.com/questions/62242657/how-to-change-react-hook-form-defaultvalue-with-useeffect
  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
      organizationDomain: "",
      organizationName: "",
    });
  }, [form, user]);

  const onboardMutation = useMutation({
    mutationKey: ["onboard"],
    mutationFn: async (data: OnboardFormSchema) => {
      const { name, organizationName, organizationDomain } = data;

      // This should never happen in best case since we wait until we have the
      // user object, but we raise to signify an impossible condition.
      if (!user?.email) {
        throw new Error("User email is required");
      }

      // For security reasons, Nextjs does not pass the exact thrown error to
      // the client. They recommend returning a custom object instead.
      // See: https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-expected-errors-from-server-actions
      const tenantOrError = await createOnboarding(
        create(OnboardUserRequestSchema, {
          name,
          email: user?.email,
          organizationName,
          organizationDomain,
        }),
      );
      if (tenantOrError.error) {
        toast.error("Error", {
          description: "You have already been onboarded",
        });
        router.replace("/");
      }
      return tenantOrError;
    },
    onSuccess: (tenant) => {
      if (tenant.tenant) {
        toast.success("Success", {
          description: "Your organization has been created.",
        });
        router.replace("/");
      }
    },
    onError: () => {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    },
  });

  async function onSubmit(data: OnboardFormSchema) {
    onboardMutation.mutateAsync(data);
  }

  if (onboardMutation.isPending) {
    return (
      <Loading message="Creating your organization..." badge={TimerIcon} />
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-center items-center">
            <Badge
              icon={UserIcon}
              text={`Welcome, ${user?.name || "User"}!`}
              bgColor="bg-blue-100"
              textColor="text-blue-700"
            />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            Create Your Organization
          </CardTitle>
          <CardDescription className="text-center">
            Please fill in the details to set up your organization
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                defaultValue={user?.name || ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Example Inc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organizationDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={onboardMutation.isPending}
              >
                Create Organization
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <LogoutLink>
            <Badge
              icon={UserIcon}
              text="Sign out"
              bgColor="bg-blue-100"
              textColor="text-blue-700"
            />
          </LogoutLink>
        </CardFooter>
      </Card>
    </div>
  );
}
