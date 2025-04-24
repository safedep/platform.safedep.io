"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createApiKey } from "./actions";
import { useRouter } from "next/navigation";

// Define the validation schema with Valibot
const formSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, "Name is required"),
    v.maxLength(100, "Name must be less than 100 characters"),
  ),
  description: v.pipe(
    v.string(),
    v.minLength(1, "Description is required"),
    v.maxLength(500, "Description must be less than 500 characters"),
  ),
  expiryDays: v.union(
    [v.literal("30"), v.literal("60"), v.literal("90"), v.literal("365")],
    "Please select a valid expiry period",
  ),
});

// Infer the type from the schema
type FormValues = v.InferOutput<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      expiryDays: "30",
    },
    resolver: valibotResolver(formSchema),
  });

  const createKeyMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      expiryDays: number;
    }) => {
      const response = await createApiKey(data);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    onSuccess: () => {
      toast.success("API key created successfully", {
        description:
          "You can now copy the key and use it in your API requests.",
      });
    },
    onError: (error: Error) => {
      toast.error("Error creating API key", {
        description: error.message,
      });
    },
  });

  function onSubmit(data: FormValues) {
    createKeyMutation.mutate({
      name: data.name,
      description: data.description,
      expiryDays: Number.parseInt(data.expiryDays),
    });
  }

  function handleCopyKey() {
    if (createKeyMutation.data?.key) {
      navigator.clipboard.writeText(createKeyMutation.data.key);
      toast.success("API key copied to clipboard");
    }
  }

  function handleCopyTenant() {
    if (createKeyMutation.data?.tenant) {
      navigator.clipboard.writeText(createKeyMutation.data.tenant);
      toast.success("Tenant copied to clipboard");
    }
  }

  // Show the key with a button to go back
  if (createKeyMutation.isSuccess) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>API Key Created</CardTitle>
            <CardDescription>
              Your API key has been created successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="key">Current Tenant</Label>
              <div className="flex items-center gap-2">
                <code className="bg-muted relative min-w-[30rem] rounded px-[0.8rem] py-[0.8rem] font-mono text-sm font-semibold">
                  {createKeyMutation.data.tenant}
                </code>
                <Button onClick={handleCopyTenant}>Copy</Button>
              </div>
            </div>
            <div className="mt-8 flex flex-col space-y-1.5">
              <Label htmlFor="key">API Key</Label>
              <div className="flex items-center gap-2">
                <code className="bg-muted relative min-w-[30rem] rounded px-[0.8rem] py-[0.8rem] font-mono text-sm font-semibold">
                  {createKeyMutation.data.key}
                </code>
                <Button onClick={handleCopyKey}>Copy</Button>
              </div>
              <div className="text-accent-foreground text-sm">
                Copy this key now. It will not be shown again.
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render the form to create API key
  return (
    <div className="mx-auto w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Create API Key</CardTitle>
              <CardDescription>
                Create an API key for use with tools or direct API access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Key name" {...field} />
                      </FormControl>
                      <FormDescription>
                        A name to identify your API key.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Key description" {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe what this API key will be used for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select expiry period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The period after which the API key will expire.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createKeyMutation.isPending}>
                {createKeyMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
