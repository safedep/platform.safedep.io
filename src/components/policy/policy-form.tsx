"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as v from "valibot";
import { valibotResolver } from "@hookform/resolvers/valibot";
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
import { RuleCheck } from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/rule_pb";
import {
  PolicyTarget,
  PolicyType,
  PolicyVersion,
} from "@buf/safedep_api.bufbuild_es/safedep/messages/policy/v1/policy_pb";

// Display names for the rule types
export const ruleTypeDisplayNames = {
  License: RuleCheck.LICENSE,
  Maintenance: RuleCheck.MAINTENANCE,
  Provenance: RuleCheck.PROVENANCE,
  Vulnerability: RuleCheck.VULNERABILITY,
  Malware: RuleCheck.MALWARE,
  Popularity: RuleCheck.POPULARITY,
};

const policyTargetDisplayNames = {
  Vet: PolicyTarget.VET,
};

const policyVersionDisplayNames = {
  v1: PolicyVersion.V1,
  v2: PolicyVersion.V2,
};

const policyTypeDisplayNames = {
  Allow: PolicyType.ALLOW,
  Deny: PolicyType.DENY,
};

const referenceSchema = v.object({
  url: v.pipe(
    v.string(),
    v.url("Invalid URL"),
    v.minLength(1, "URL must be at least 1 character"),
    v.maxLength(2048, "URL must be at most 2048 characters"),
  ),
});

const ruleSchema = v.object({
  name: v.pipe(
    v.string("Invalid name"),
    v.minLength(1, "Name must be at least 1 character"),
    v.maxLength(250, "Name must be at most 250 characters"),
  ),
  description: v.optional(v.string("Invalid description")),
  check: v.enum(ruleTypeDisplayNames),
  value: v.pipe(
    v.string("Invalid rule value"),
    v.minLength(1, "Rule value must be at least 1 character"),
    v.maxLength(1000, "Rule value must be at most 1000 characters"),
  ),
  references: v.array(referenceSchema),
  labels: v.pipe(
    v.array(
      v.pipe(
        v.string("Invalid label"),
        v.minLength(1, "Label must be at least 1 character"),
        v.maxLength(50, "Label must be at most 50 characters"),
      ),
    ),
    v.maxLength(10, "Maximum 10 labels allowed"),
  ),
});

export type PolicyFormRule = v.InferInput<typeof ruleSchema>;

const formSchema = v.object({
  name: v.pipe(
    v.string("Invalid name"),
    v.minLength(1, "Name must be at least 1 character"),
  ),
  version: v.enum(policyVersionDisplayNames),
  target: v.enum(policyTargetDisplayNames),
  type: v.enum(policyTypeDisplayNames),
  labels: v.pipe(v.array(v.string("Invalid label"))),
  rules: v.pipe(
    v.array(ruleSchema),
    v.minLength(1, "At least one rule is required"),
  ),
});

export type PolicyFormValues = v.InferInput<typeof formSchema>;

interface PolicyFormProps {
  defaultValues?: PolicyFormValues;
  mode?: "create" | "update";
  onSubmit(values: PolicyFormValues): Promise<void>;
}

export default function PolicyForm({
  defaultValues,
  mode = "create",
  onSubmit,
}: PolicyFormProps) {
  const form = useForm<PolicyFormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
      labels: [],
      version: PolicyVersion.V2,
      target: PolicyTarget.VET,
      type: PolicyType.DENY,
      rules: [
        {
          name: "",
          value: "",
          check: RuleCheck.LICENSE,
          description: "",
          references: [],
          labels: [],
        },
      ],
    },
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: PolicyFormValues) {
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
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit(handleSubmit)(e);
        }}
        className="flex max-w-2xl flex-col gap-8"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
          }
        }}
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
                    onValueChange={(value) => {
                      field.onChange(Number.parseInt(value));
                    }}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(policyVersionDisplayNames).map(
                        ([displayName, value]) => (
                          <SelectItem
                            key={displayName}
                            value={value.toString()}
                          >
                            {displayName}
                          </SelectItem>
                        ),
                      )}
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
                    onValueChange={(value) => {
                      field.onChange(Number.parseInt(value));
                    }}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(policyTargetDisplayNames).map(
                        ([key, value]) => (
                          <SelectItem key={key} value={value.toString()}>
                            {key}
                          </SelectItem>
                        ),
                      )}
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
                  checked={field.value === PolicyType.ALLOW}
                  onCheckedChange={() => {
                    form.setValue(
                      "type",
                      field.value === PolicyType.ALLOW
                        ? PolicyType.DENY
                        : PolicyType.ALLOW,
                    );
                  }}
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
            <div>
              <h3 className="text-lg font-medium">Rules</h3>
              {/* FIXME: find out how to do nested validation using react-hook-form instead of manually checking the length of the rules array */}
              {form.getValues("rules").length === 0 && (
                <FormMessage>At least one rule is required.</FormMessage>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                appendRule({
                  name: "",
                  value: "",
                  check: RuleCheck.LICENSE,
                  description: "",
                  references: [],
                  labels: [],
                });
              }}
            >
              Add Rule
            </Button>
          </div>

          {ruleFields.map((field, index) => (
            <div key={field.id}>
              <RuleForm
                control={form.control}
                index={index}
                onRemove={() => removeRule(index)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-40">
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
                ? "Create Policy"
                : "Update Policy"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
