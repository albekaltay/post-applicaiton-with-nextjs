import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input, InputProps } from "../input";
import { cn } from "../../../lib/utils";

// ----------------------------------------------------------------------

type Props = InputProps & {
  name: string;
  label?: string;
  labelClassName?: string;
  description?: string;
  showError?: boolean;
};

export default function FormInput({
  name,
  label,
  labelClassName,
  description,
  className,
  showError,
  ...rest
}: Props) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="space-y-1">
          <FormItem>
            {label && (
              <FormLabel className={cn(labelClassName)}>{label}</FormLabel>
            )}
            <FormControl>
              <Input
                className={cn(className, error && "border-rose-500")}
                {...field}
                {...rest}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
          </FormItem>
          <div className="h-3">
            {showError && <FormMessage className="font-normal" />}
          </div>
        </div>
      )}
    />
  );
}
