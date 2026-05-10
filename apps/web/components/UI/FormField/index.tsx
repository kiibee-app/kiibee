import {
  Controller,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form";
import InputField, { InputFieldProps } from "@/components/UI/InputFields";

type FormFieldProps<TValues extends FieldValues> = Omit<
  InputFieldProps,
  "name" | "value" | "hasError" | "errorText"
> & {
  name: FieldPath<TValues>;
};

export default function FormField<TValues extends FieldValues>({
  name,
  onChange: externalOnChange,
  onBlur: externalOnBlur,
  ...inputProps
}: FormFieldProps<TValues>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TValues>();
  const fieldError = errors[name];

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputField
          {...inputProps}
          name={field.name}
          value={typeof field.value === "string" ? field.value : ""}
          onChange={(value) => {
            field.onChange(value);
            externalOnChange?.(value);
          }}
          onBlur={(event) => {
            field.onBlur();
            externalOnBlur?.(event);
          }}
          hasError={Boolean(fieldError)}
          errorText={
            fieldError?.message ? String(fieldError.message) : undefined
          }
        />
      )}
    />
  );
}
