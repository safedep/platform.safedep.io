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
import { useState } from "react";

const formSchema = v.object({
  name: v.pipe(
    v.string("Name is required"),
    v.minLength(1, "Name must be at least 1 character"),
  ),
  description: v.optional(v.string()),
});

export type PolicyGroupFormValues = v.InferInput<typeof formSchema>;

interface FormValues {
  name: string;
  description?: string;
}

export interface PolicyGroupFormProps {
  defaultValues: FormValues;
  onSubmit(values: PolicyGroupFormValues): Promise<void>;
}

export default function UpdatePolicyGroupForm({
  onSubmit,
  defaultValues,
}: PolicyGroupFormProps) {
  const form = useForm<PolicyGroupFormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmitWrapper(values: PolicyGroupFormValues) {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
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
          <Button type="submit" disabled={isSubmitting} className="w-40">
            {isSubmitting ? "Creating..." : "Create Policy Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
