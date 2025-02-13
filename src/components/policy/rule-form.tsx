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
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { CreatePolicyFormValues } from "./create-policy-form";

interface RuleFormProps {
  index: number;
  onRemove: () => void;
}

const ruleCheckNames = {
  LICENSE: "license" as const,
  MAINTENANCE: "maintenance" as const,
  PROVENANCE: "provenance" as const,
  VULNERABILITY: "vulnerability" as const,
  MALWARE: "malware" as const,
  POPULARITY: "popularity" as const,
};

export function RuleForm({ index, onRemove }: RuleFormProps) {
  const { control } = useFormContext<CreatePolicyFormValues>();

  return (
    <div className="relative space-y-6 rounded-lg border p-6">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      <FormField
        control={control}
        name={`rules.${index}.name`}
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
        name={`rules.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="This rule checks for..."
                {...field}
                value={field.value || ""}
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
        name={`rules.${index}.check`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rule Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a rule type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(ruleCheckNames).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Type of check to perform.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`rules.${index}.value`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rule Value</FormLabel>
            <FormControl>
              <Input placeholder="Rule value" {...field} />
            </FormControl>
            <FormDescription>The value to check against.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`rules.${index}.labels`}
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
            <FormDescription>Labels for this rule.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
