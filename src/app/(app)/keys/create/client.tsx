"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// Define the validation schema with Valibot
const formSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(3, "Name must be at least 3 characters"),
    v.maxLength(100, "Name must be less than 100 characters"),
  ),
  description: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Description is required"),
    v.maxLength(500, "Description must be less than 500 characters"),
  ),
  expiryDays: v.picklist(
    ["30", "60", "90", "365"],
    "Please select a valid expiry period",
  ),
});

// Infer the type from the schema
type FormValues = v.InferOutput<typeof formSchema>;

export default function CreateKeyClient() {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      expiryDays: "30",
    },
    resolver: valibotResolver(formSchema),
  });

  const queryClient = useQueryClient();

  const createKeyMutation = useMutation({
    mutationFn: (data: {
      name: string;
      description: string;
      expiryDays: number;
    }) => {
      const response = createApiKey(data).then((res) => {
        if (res.error) {
          throw new Error(res.error);
        }
        return res;
      });

      toast.promise(response, {
        loading: "Creating API key...",
        success: {
          message: "API key created successfully",
          description:
            "You can now copy the key and use it in your API requests.",
        },
        error: (error) => {
          if (error instanceof Error) {
            return {
              message: "Error creating API key",
              description: error.message,
            };
          }
          return {
            message: "Error creating API key",
            description: "An unknown error occurred",
          };
        },
      });

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["api-keys"],
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

  // Show the key with a button to go back
  if (createKeyMutation.isSuccess) {
    return (
      <KeyCreated
        tenant={createKeyMutation.data.tenant}
        apiKey={createKeyMutation.data.key}
      />
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

function KeyCreated({ tenant, apiKey }: { tenant: string; apiKey: string }) {
  const router = useRouter();
  const [isApiKeyVisible, setIsApiKeyVisible] = React.useState(false);

  function handleCopyTenant() {
    navigator.clipboard.writeText(tenant);
    toast.success("Tenant copied to clipboard");
  }

  function handleCopyKey() {
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard");
  }

  function toggleApiKeyVisibility() {
    setIsApiKeyVisible((prev) => !prev);
  }

  // Create masked characters for API key
  const maskedKey = "•".repeat(Math.min(30, apiKey.length));

  // Create array of individual characters for ripple effect
  const apiKeyChars = React.useMemo(() => apiKey.split(""), [apiKey]);
  const maskedKeyChars = React.useMemo(() => maskedKey.split(""), [maskedKey]);

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 5,
      filter: "blur(3px)",
      transition: { duration: 0.1 },
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.1 },
    },
  };

  // Create staggered exit/entry overlap effect
  const visibleKeyVariants = {
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.008,
        staggerDirection: -1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.008,
      },
    },
  };

  const hiddenKeyVariants = {
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.008,
        staggerDirection: 1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.008,
      },
    },
  };

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>API Key Created</CardTitle>
        <CardDescription>
          Your API key has been created successfully.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="tenant" className="text-sm font-medium">
            Current Tenant
          </Label>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <div className="w-full overflow-x-auto">
              <code className="bg-muted block w-full overflow-x-auto rounded px-3 py-2 font-mono text-sm font-semibold whitespace-nowrap">
                {tenant}
              </code>
            </div>
            <Button onClick={handleCopyTenant} size="sm" className="shrink-0">
              Copy
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="key" className="text-sm font-medium">
            API Key
          </Label>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
            <div className="bg-muted relative h-10 w-full overflow-hidden rounded">
              <div className="relative flex h-10 items-center overflow-hidden px-3">
                <AnimatePresence initial={false} mode="popLayout">
                  {isApiKeyVisible ? (
                    <motion.div
                      key="visible-key"
                      className="absolute top-0 left-3 flex h-full items-center overflow-hidden font-mono text-sm font-semibold"
                      variants={visibleKeyVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {apiKeyChars.map((char, index) => (
                        <motion.span key={index} variants={itemVariants}>
                          {char}
                        </motion.span>
                      ))}
                    </motion.div>
                  ) : null}

                  {!isApiKeyVisible ? (
                    <motion.div
                      key="hidden-key"
                      className="absolute top-0 left-3 flex h-full items-center font-mono text-sm font-semibold tracking-wider text-gray-500 dark:text-gray-400"
                      variants={hiddenKeyVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {maskedKeyChars.map((char, index) => (
                        <motion.span key={index} variants={itemVariants}>
                          {char}
                        </motion.span>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                onClick={toggleApiKeyVisibility}
                size="sm"
                variant="outline"
                className="w-9 shrink-0 p-0"
                aria-label={isApiKeyVisible ? "Hide API key" : "Show API key"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isApiKeyVisible ? (
                    <motion.div
                      key="eye-off"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <EyeOff className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="eye-on"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Eye className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
              <Button
                onClick={handleCopyKey}
                size="sm"
                variant="default"
                className="shrink-0"
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="rounded-sm border-l-4 border-amber-500 bg-amber-50 p-4 dark:border-amber-500/50 dark:bg-amber-950/20">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Important: Copy this key now. It will not be shown again.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
