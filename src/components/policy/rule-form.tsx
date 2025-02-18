import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "@/components/ui/tags-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import type { PolicyFormValues } from "./policy-form";
import { cn } from "@/lib/utils";
import { ruleTypeDisplayNames } from "./policy-form";
import { useState } from "react";

interface RuleFormProps {
  control: Control<PolicyFormValues>;
  index: number;
  onRemove: () => void;
}

export function RuleForm({ control, index, onRemove }: RuleFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    fields: references,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({
    control,
    name: `rules.${index}.references` as const,
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className="text-gray-500">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </span>
          <div>
            <FormField
              control={control}
              name={`rules.${index}.name` as const}
              render={({ field }) => (
                <span className="font-medium">{field.value || "New Rule"}</span>
              )}
            />
            <FormField
              control={control}
              name={`rules.${index}.check` as const}
              render={({ field }) => (
                <span className="ml-2 text-sm text-gray-500">
                  (
                  {Object.entries(ruleTypeDisplayNames).find(
                    ([, value]) => value === field.value,
                  )?.[0] ?? "Not selected"}
                  )
                </span>
              )}
            />
          </div>
        </button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-gray-500 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remove rule</span>
        </Button>
      </div>

      <div className={cn("border-t", !isExpanded && "hidden")}>
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name={`rules.${index}.name` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="my-rule" {...field} />
                  </FormControl>
                  <FormDescription>Name of the rule.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`rules.${index}.check` as const}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(Number.parseInt(value));
                    }}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rule type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(ruleTypeDisplayNames).map(
                        ([enumKey, value]) => (
                          <SelectItem key={enumKey} value={value.toString()}>
                            {enumKey}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>Type of check to perform.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name={`rules.${index}.description` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="This rule checks for..."
                    {...field}
                    value={field.value || ""}
                    className="resize-y"
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Description of what this rule does.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`rules.${index}.value` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rule Value</FormLabel>
                <FormControl>
                  <Input
                    placeholder="license.id == 'MIT' || license.id == 'Apache-2.0'"
                    {...field}
                    className="font-mono"
                  />
                </FormControl>
                <FormDescription>The value to check against.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel className="text-sm font-medium">References</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => appendReference({ url: "" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Reference
              </Button>
            </div>

            <div
              className={cn("space-y-3", references?.length === 0 && "hidden")}
            >
              {references?.map((reference, referenceIndex) => (
                <div key={reference.id} className="flex items-start gap-2">
                  <FormField
                    control={control}
                    name={
                      `rules.${index}.references.${referenceIndex}.url` as const
                    }
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="https://example.com/reference"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 h-8 w-8"
                    onClick={() => removeReference(referenceIndex)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove reference</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <FormField
            control={control}
            name={`rules.${index}.labels` as const}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Labels</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value ?? []}
                    onValueChange={field.onChange}
                    placeholder="Enter labels"
                  />
                </FormControl>
                <FormDescription>
                  Labels for this rule (maximum 10).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
