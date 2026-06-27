"use client";

import { useEffect, useState } from "react";
import {
  EditCardSchema,
  formatCardNumber,
  formatCVV,
  formatExpiryDate,
  getEditCardFormValues,
  isMaskedCardNumber,
  CARD_FIELDS,
} from "@/utils/addCard";
import {
  type CardFormErrors,
  type CardFormPayload,
  type ViewerPaymentMethod,
} from "@/types/cardTypes";

const initialErrors: CardFormErrors = {
  cardNumber: "",
  expiryDate: "",
  securityCode: "",
};

type UseCardFormOptions = {
  visible?: boolean;
  paymentMethod?: ViewerPaymentMethod;
  onClose: () => void;
  onSubmit: (payload: CardFormPayload) => Promise<void>;
};

export function useCardForm({
  visible = true,
  paymentMethod,
  onClose,
  onSubmit,
}: UseCardFormOptions) {
  const editValues = paymentMethod
    ? getEditCardFormValues(paymentMethod)
    : null;

  const [cardNumber, setCardNumber] = useState(editValues?.cardNumber ?? "");
  const [expiryDate, setExpiryDate] = useState(editValues?.expiryDate ?? "");
  const [securityCode, setSecurityCode] = useState("");
  const [errors, setErrors] = useState<CardFormErrors>(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible || !paymentMethod) return;

    const values = getEditCardFormValues(paymentMethod);
    setCardNumber(values.cardNumber);
    setExpiryDate(values.expiryDate);
    setSecurityCode(values.securityCode);
    setErrors(initialErrors);
  }, [visible, paymentMethod]);

  const normalizeInput = (v: string | string[]) =>
    Array.isArray(v) ? v[0] : v;

  const validateField = (field: keyof CardFormErrors, value: string) => {
    const result = EditCardSchema.safeParse({
      cardNumber,
      expiryDate,
      securityCode,
      [field]: value,
    });

    if (result.success) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
      return;
    }

    const flattened = result.error.flatten().fieldErrors as Partial<
      Record<keyof CardFormErrors, string[]>
    >;
    const fieldError = flattened[field]?.[0] || "";
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  };

  const validateAll = () => {
    const result = EditCardSchema.safeParse({
      cardNumber,
      expiryDate,
      securityCode,
    });

    if (result.success) {
      setErrors(initialErrors);
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors as Partial<
      Record<keyof CardFormErrors, string[]>
    >;
    setErrors({
      cardNumber: fieldErrors.cardNumber?.[0] || "",
      expiryDate: fieldErrors.expiryDate?.[0] || "",
      securityCode: fieldErrors.securityCode?.[0] || "",
    });

    return false;
  };

  const reset = () => {
    if (paymentMethod) {
      const values = getEditCardFormValues(paymentMethod);
      setCardNumber(values.cardNumber);
      setExpiryDate(values.expiryDate);
      setSecurityCode(values.securityCode);
    } else {
      setCardNumber("");
      setExpiryDate("");
      setSecurityCode("");
    }
    setErrors(initialErrors);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!validateAll() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: CardFormPayload = {
        expiryDate,
        securityCode,
      };

      const digits = cardNumber.replace(/\D/g, "");
      if (!isMaskedCardNumber(cardNumber)) {
        payload.cardNumber = digits;
      }

      await onSubmit(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardNumberChange = (v: string | string[]) => {
    const raw = normalizeInput(v);
    const input = isMaskedCardNumber(cardNumber) ? raw.replace(/\D/g, "") : raw;
    const val = formatCardNumber(input);
    setCardNumber(val);
    validateField(CARD_FIELDS.CARD_NUMBER, val);
  };

  const handleExpiryChange = (v: string | string[]) => {
    const val = formatExpiryDate(normalizeInput(v));
    setExpiryDate(val);
    validateField(CARD_FIELDS.EXPIRY_DATE, val);
  };

  const handleCVVChange = (v: string | string[]) => {
    const val = formatCVV(normalizeInput(v));
    setSecurityCode(val);
    validateField(CARD_FIELDS.SECURITY_CODE, val);
  };

  const isFormValid = EditCardSchema.safeParse({
    cardNumber,
    expiryDate,
    securityCode,
  }).success;

  return {
    cardNumber,
    expiryDate,
    securityCode,
    errors,
    isSubmitting,
    isFormValid,
    handleSubmit,
    handleClose,
    handleCardNumberChange,
    handleExpiryChange,
    handleCVVChange,
  };
}
