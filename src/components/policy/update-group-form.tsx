import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as v from "valibot";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

const formSchema = v.object({
  name: v.pipe(
    v.string("Name is required"),
    v.minLength(1, "Name must be at least 1 character"),
  ),
  description: v.optional(
    v.pipe(
      v.string(),
      v.minLength(1, "Description must be at least 1 character"),
    ),
  ),
});

export type PolicyGroupFormValues = v.InferInput<typeof formSchema>;

interface FormValues {
  name?: string;
  description?: string;
}

export interface PolicyGroupFormProps {
  defaultValues: FormValues;
  onSubmit(values: PolicyGroupFormValues): Promise<void>;
  isLoading: boolean;
}

export default function UpdatePolicyGroupForm({
  onSubmit,
  defaultValues,
  isLoading,
}: PolicyGroupFormProps) {
  const form = useForm<PolicyGroupFormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  async function onSubmitWrapper(values: PolicyGroupFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      );
    } catch {
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitWrapper)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="my-policy-group" type="text" {...field} />
              </FormControl>
              <FormDescription>
                This is the name of your policy group.
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
                <Textarea
                  placeholder="This policy group is used by admins..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Description of the policy group.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-40"
          >
            {isSubmitting ? "Updating..." : "Update Policy Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
