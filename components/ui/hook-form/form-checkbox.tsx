import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../form";
import { Checkbox } from "../checkbox";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label: React.ReactNode;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
};

export default function FormCheckbox({
  name,
  label,
  labelClassName,
  className,
  disabled,
}: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row items-center">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={className}
              />
            </FormControl>
            <FormLabel className={cn("font-normal", labelClassName)}>
              {label}
            </FormLabel>
          </FormItem>
        );
      }}
    />
  );
}
