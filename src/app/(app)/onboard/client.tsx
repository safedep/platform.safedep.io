"use client";

import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { User } from "@auth0/nextjs-auth0/types";
import { createOnboarding } from "./actions";
import { useRouter } from "next/navigation";

// Define the form schema with Valibot
const formSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must be at least 2 characters"),
    v.maxLength(50, "Name must be less than 50 characters"),
  ),
  organizationName: v.pipe(
    v.string(),
    v.minLength(2, "Organization name must be at least 2 characters"),
    v.maxLength(100, "Organization name must be less than 100 characters"),
  ),
  organizationDomain: v.pipe(
    v.string(),
    v.minLength(3, "Domain must be at least 3 characters"),
  ),
});

type FormValues = v.InferInput<typeof formSchema>;

export default function OnboardingForm({ user }: { user: User }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      name: "",
      organizationName: "",
      organizationDomain: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await createOnboarding({
        name: data.name,
        email: user.email,
        organizationName: data.organizationName,
        organizationDomain: data.organizationDomain,
      });
      if (response.error) {
        throw new Error(response.error);
      }

      return response.tenant;
    },
    onSuccess: (tenant) => {
      toast.success("Your organization has been created", {
        description: `You can now access ${tenant}`,
      });
      router.push(`/`);
    },
    onError: (error) => {
      toast.error("Failed to create organization", {
        description: error.message,
      });
    },
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  return (
    <div className="flex h-full grow flex-col items-center justify-center gap-2">
      <Badge variant="outline" className="bg-gray-50">
        Welcome {user?.name}
      </Badge>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create Your Organization
          </CardTitle>
          <CardDescription>
            Set up your organization to get started with SafeDep and secure your
            software supply chain.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
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
                      <Input placeholder="Acme Inc." {...field} />
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
                      <Input placeholder="acme.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used to identify your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create Organization"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
