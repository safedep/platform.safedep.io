"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { RuleCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TagsInput } from "@/components/ui/tags-input";
import { RuleForm } from "./rule-form";

const ruleCheckNames = {
  // [RuleCheck.UNSPECIFIED]: "unspecified" as const,
  [RuleCheck.LICENSE]: "license" as const,
  [RuleCheck.MAINTENANCE]: "maintenance" as const,
  [RuleCheck.PROVENANCE]: "provenance" as const,
  [RuleCheck.VULNERABILITY]: "vulnerability" as const,
  [RuleCheck.MALWARE]: "malware" as const,
  [RuleCheck.POPULARITY]: "popularity" as const,
};

const referenceSchema = v.object({
  url: v.pipe(
    v.string(),
    v.url("Invalid URL"),
    v.minLength(1, "URL must be at least 1 character"),
    v.maxLength(2048, "URL must be at most 2048 characters"),
  ),
});

export type CreatePolicyFormReference = v.InferOutput<typeof referenceSchema>;

const ruleSchema = v.object({
  name: v.pipe(
    v.string("Invalid name"),
    v.minLength(1, "Name must be at least 1 character"),
    v.maxLength(250, "Name must be at most 250 characters"),
  ),
  description: v.optional(v.string("Invalid description")),
  check: v.enum(ruleCheckNames),
  value: v.pipe(
    v.string("Invalid rule value"),
    v.minLength(1, "Rule value must be at least 1 character"),
    v.maxLength(1000, "Rule value must be at most 1000 characters"),
  ),
  references: v.optional(v.array(referenceSchema)),
  labels: v.optional(
    v.pipe(
      v.array(
        v.pipe(
          v.string("Invalid label"),
          v.minLength(1, "Label must be at least 1 character"),
          v.maxLength(50, "Label must be at most 50 characters"),
        ),
      ),
      v.maxLength(10, "Maximum 10 labels allowed"),
    ),
  ),
});

export type CreatePolicyFormRule = v.InferInput<typeof ruleSchema>;

const formSchema = v.object({
  name: v.pipe(
    v.string("Invalid name"),
    v.minLength(1, "Name must be at least 1 character"),
  ),
  version: v.string("Invalid version. Please select a version from the list"),
  target: v.string("Invalid target. Please select a target from the list"),
  type: v.optional(v.boolean()),
  labels: v.optional(v.pipe(v.array(v.string("Invalid label")))),
  rules: v.array(ruleSchema),
});

export type CreatePolicyFormValues = v.InferInput<typeof formSchema>;

export default function CreatePolicyForm() {
  const [targets] = useState(["vet"]);
  const [versions] = useState(["v1", "v2"]);

  const form = useForm<CreatePolicyFormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      name: "",
      labels: [],
      version: versions.at(-1),
      target: targets.at(-1),
      type: false,
      rules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(values: CreatePolicyFormValues) {
    setIsSubmitting(true);
    try {
      console.log(values);
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
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)(e);
        }}
        className="flex max-w-2xl flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="my-rule" type="text" {...field} />
              </FormControl>
              <FormDescription>Name of the policy rule.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {versions.map((version) => (
                        <SelectItem key={version} value={version}>
                          {version}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Version of the policy.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {targets.map((target) => (
                        <SelectItem key={target} value={target}>
                          {target}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    What to target using the rule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Allow</FormLabel>
                <FormDescription>
                  Enable or disable the policy rule. TODO NEED REVIEW
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labels</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value ?? []}
                  onValueChange={field.onChange}
                  placeholder="Enter your tags"
                />
              </FormControl>
              <FormDescription>Add tags.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Rules</h3>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "", value: "", check: "license" })}
            >
              Add Rule
            </Button>
          </div>

          {fields.map((field, index) => (
            <RuleForm
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-40">
            {isSubmitting ? "Creating..." : "Create Policy Group"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
