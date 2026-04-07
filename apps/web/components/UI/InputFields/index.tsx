import React, { useId } from "react";
import {
  Container,
  Label,
  StyledInput,
  IconWrapper,
  InputWrapper,
  StyledTextArea,
  RequiredIndicator,
  LabelFontStyle,
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

export type InputFieldProps = {
  label?: string;
  type?: InputType;
  value?: string | string[] | number;
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
  labelFontStyle?: LabelFontStyle;
  labelPaddingLeft?: string | undefined;
  labelMarginTop?: string | undefined;
  height?: string;
  required?: boolean;
  id?: string;
  "aria-invalid"?: AriaInvalidValue;
  "aria-describedby"?: string | undefined;
  "data-test-id"?: string;
  iconDataTestId?: string | undefined;
  max?: number;
  min?: number;
  onKeyDown?: React.KeyboardEventHandler<
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
    id,
    "aria-invalid": ariaInvalid,
    "aria-describedby": ariaDescribedby,
    "data-test-id": dataTestId,
    iconDataTestId,
    onKeyDown,
    max,
    min,
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

  const handleChange = (index: number, val: string) => {
    if (!isMulti) return;
    const newValue = [...(value as string[])];
    newValue[index] = val;
    onChange?.(newValue);
  };

  const handleSingleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange?.(e.target.value);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onKeyDown?.(e);
  };

  const normalizeError = (err: boolean | undefined) => !!err;
  const isInvalid =
    ariaInvalid !== undefined
      ? ariaInvalid
      : normalizeError(hasError as boolean);
  const describedBy =
    ariaDescribedby || `${inputId}-error ${inputId}-help`.trim();

  return (
    <Container width={width || ""} as={containerElement} role={multiRole}>
      <Label
        $labelFontStyle={labelFontStyle || "Body_Title6"}
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
            const hasMultiError = normalizeError(
              Array.isArray(hasError) ? hasError[i] : hasError,
            );
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
                onChange={(e) => handleChange(i, e.target.value)}
                onClick={onClick}
                $hasError={hasMultiError}
                $locked={locked}
                aria-invalid={hasMultiError}
                required={required}
                aria-required={required}
                aria-describedby={`${multiInputId}-error ${multiInputId}-help`}
                data-test-id={dataTestId ? `${dataTestId}-${i}` : undefined}
                onKeyDown={onKeyDown}
                min={min}
              />
            );
          })
        ) : type === INPUT_TYPE.TEXTAREA ? (
          <StyledTextArea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            value={value as string}
            placeholder={(placeholder as string) || label}
            disabled={disabled}
            onChange={handleSingleChange}
            onClick={onClick}
            $hasError={normalizeError(hasError as boolean)}
            $locked={locked}
            required={required}
            aria-required={required}
            aria-invalid={isInvalid}
            autoComplete={autoComplete}
            aria-describedby={describedBy}
            data-test-id={dataTestId}
            maxLength={max}
            onKeyDown={handleKeyDown}
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
              placeholder={(placeholder as string) || label}
              disabled={disabled}
              onChange={handleSingleChange}
              onClick={onClick}
              $hasError={normalizeError(hasError as boolean)}
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
    </Container>
  );
});
