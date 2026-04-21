import React, { useId } from "react";
import {
  Container,
  Label,
  StyledInput,
  IconWrapper,
  InputWrapper,
  StyledTextArea,
  RequiredIndicator,
  ErrorText,
  HelperText,
  FieldMessage,
} from "./styles";
import {
  INPUT_TYPE,
  INPUT_FIELD_CONTAINER_TAGS,
  INPUT_FIELD_LABEL_TAGS,
  INPUT_FIELD_ROLES,
  AriaInvalidValue,
  InputType,
  InputModeValue,
  AutoCompleteValue,
} from "@/utils/ui";
import { typography } from "@repo/ui/typography";
import { STRING } from "@/utils/Constants";

export type InputFieldProps = {
  label?: React.ReactNode;
  type?: InputType;
  value?: string | string[] | number;
  defaultValue?: string | number | readonly string[];
  placeholder?: string | string[];
  inputMode?: InputModeValue;
  autoComplete?: AutoCompleteValue;
  disabled?: boolean | undefined;
  width?: string;
  tabIndex?: number;
  onChange?: (value: string | string[]) => void;
  icon?: React.ReactNode;
  onIconClick?: (() => void) | undefined;
  onClick?: () => void;
  hasError?: boolean | boolean[];
  locked?: boolean | undefined;
  multi?: boolean;
  labelFontStyle?: keyof typeof typography;
  labelPaddingLeft?: string | undefined;
  labelMarginTop?: string | undefined;
  height?: string;
  required?: boolean;
  name?: string;
  id?: string;
  helperText?: React.ReactNode;
  errorMessage?: React.ReactNode;
  errorText?: React.ReactNode;
  "aria-invalid"?: AriaInvalidValue;
  "aria-describedby"?: string | undefined;
  "data-test-id"?: string;
  iconDataTestId?: string | undefined;
  max?: number;
  min?: number;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onChangeEvent?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
};

export default React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps
>(function InputField(
  {
    label,
    type = INPUT_TYPE.TEXT,
    value,
    placeholder,
    inputMode,
    autoComplete,
    disabled = false,
    width,
    onChange,
    icon,
    onIconClick,
    onClick,
    hasError = false,
    locked = false,
    multi = false,
    labelFontStyle,
    labelPaddingLeft = "",
    labelMarginTop = "",
    height = "",
    required = false,
    name,
    id,
    defaultValue,
    helperText,
    errorMessage,
    errorText,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedby,
    "data-test-id": dataTestId,
    iconDataTestId,
    onKeyDown,
    onBlur,
    max,
    min,
    onChangeEvent,
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isMulti = multi && Array.isArray(value);
  const containerElement = isMulti
    ? INPUT_FIELD_CONTAINER_TAGS.FIELDSET
    : INPUT_FIELD_CONTAINER_TAGS.DIV;
  const labelElement = isMulti
    ? INPUT_FIELD_LABEL_TAGS.LEGEND
    : INPUT_FIELD_LABEL_TAGS.LABEL;
  const multiRole = isMulti ? INPUT_FIELD_ROLES.GROUP : undefined;
  const resolvedErrorMessage = errorMessage ?? errorText;
  const hasMessage = Boolean(helperText || resolvedErrorMessage);
  const helperId = helperText ? `${inputId}-help` : undefined;
  const errorId = resolvedErrorMessage ? `${inputId}-error` : undefined;
  const fallbackPlaceholder: string =
    typeof label === STRING ? (label as string) : "";
  const resolvedPlaceholder: string | undefined = Array.isArray(placeholder)
    ? placeholder[0]
    : placeholder
      ? placeholder
      : fallbackPlaceholder || undefined;

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!isMulti) return;
    const newValue = [...(value as string[])];
    newValue[index] = e.target.value;
    onChange?.(newValue);
    onChangeEvent?.(e);
  };

  const handleSingleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange?.(e.target.value);
    onChangeEvent?.(e);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onKeyDown?.(e);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onBlur?.(e);
  };

  const normalizeError = (err: boolean | undefined) => !!err;
  const hasErrorValue = Array.isArray(hasError)
    ? hasError.some(Boolean)
    : Boolean(hasError);
  const hasErrorState = hasErrorValue || Boolean(resolvedErrorMessage);
  const isInvalid = ariaInvalid !== undefined ? ariaInvalid : hasErrorState;
  const describedBy =
    [ariaDescribedby, errorId, helperId].filter(Boolean).join(" ") || undefined;
  const singleFieldValueProps =
    value !== undefined
      ? { value: value as string }
      : { defaultValue: defaultValue as string | number | readonly string[] };

  const placeholderText = (() => {
    if (Array.isArray(placeholder)) return undefined;
    if (typeof placeholder === "string") return placeholder;
    if (typeof label === "string") return label;
    return undefined;
  })();

  return (
    <Container width={width || ""} as={containerElement} role={multiRole}>
      <Label
        $use={labelFontStyle || "Body_Medium"}
        $paddingLeft={labelPaddingLeft || ""}
        $marginTop={labelMarginTop || ""}
        as={labelElement}
        htmlFor={isMulti ? undefined : inputId}
      >
        {label}
        {required && <RequiredIndicator>*</RequiredIndicator>}
      </Label>
      <InputWrapper $multi={isMulti}>
        {isMulti ? (
          (value as string[]).map((v, i) => {
            const multiInputId = `${inputId}-${i}`;
            const hasMultiError = Array.isArray(hasError)
              ? Boolean(hasError[i])
              : Boolean(hasError);
            return (
              <StyledInput
                key={i}
                id={multiInputId}
                type={type}
                inputMode={inputMode}
                autoComplete={autoComplete}
                value={v}
                placeholder={(placeholder as string[])[i] || ""}
                disabled={disabled}
                name={name}
                onChange={(e) => handleChange(i, e)}
                onClick={onClick}
                $hasError={hasMultiError}
                $locked={locked}
                aria-invalid={hasMultiError}
                required={required}
                aria-required={required}
                aria-describedby={[
                  ariaDescribedby,
                  `${multiInputId}-error`,
                  `${multiInputId}-help`,
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-test-id={dataTestId ? `${dataTestId}-${i}` : undefined}
                onKeyDown={onKeyDown}
                onBlur={handleBlur}
                min={min}
              />
            );
          })
        ) : type === INPUT_TYPE.TEXTAREA ? (
          <StyledTextArea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            value={value as string}
            {...singleFieldValueProps}
            placeholder={resolvedPlaceholder}
            disabled={disabled}
            onChange={handleSingleChange}
            onClick={onClick}
            $hasError={normalizeError(hasErrorValue)}
            $locked={locked}
            required={required}
            aria-required={required}
            aria-invalid={isInvalid}
            autoComplete={autoComplete}
            aria-describedby={describedBy}
            data-test-id={dataTestId}
            maxLength={max}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            name={name}
          />
        ) : (
          <>
            <StyledInput
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              type={type}
              inputMode={inputMode}
              autoComplete={autoComplete}
              value={value as string}
              {...singleFieldValueProps}
              placeholder={resolvedPlaceholder}
              disabled={disabled}
              onChange={handleSingleChange}
              onClick={onClick}
              $hasError={normalizeError(hasErrorValue)}
              $locked={locked}
              $height={height}
              $hasIcon={!!icon}
              required={required}
              aria-required={required}
              aria-invalid={isInvalid}
              aria-describedby={describedBy}
              data-test-id={dataTestId}
              maxLength={max}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              name={name}
              min={min}
            />
            {icon && (
              <IconWrapper onClick={onIconClick} data-test-id={iconDataTestId}>
                {icon}
              </IconWrapper>
            )}
          </>
        )}
      </InputWrapper>
      {hasMessage && (
        <FieldMessage>
          {resolvedErrorMessage ? (
            <ErrorText id={errorId} role="alert">
              {resolvedErrorMessage}
            </ErrorText>
          ) : null}
          {helperText ? (
            <HelperText id={helperId}>{helperText}</HelperText>
          ) : null}
        </FieldMessage>
      )}
    </Container>
  );
});
