"use client";

import {
  AddCardErrors,
  AddCardSchema,
  formatCardNumber,
  formatCVV,
  formatExpiryDate,
  CARD_FIELDS,
} from "@/utils/addCard";
import { useState } from "react";

const initialErrors: AddCardErrors = {
  cardNumber: "",
  expiryDate: "",
  securityCode: "",
};

export function useAddCard(onClose: () => void) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [errors, setErrors] = useState<AddCardErrors>(initialErrors);
  const normalizeInput = (v: string | string[]) =>
    Array.isArray(v) ? v[0] : v;
  const [successOpen, setSuccessOpen] = useState(false);

  const validateField = (field: keyof AddCardErrors, value: string) => {
    const result = AddCardSchema.safeParse({
      cardNumber,
      expiryDate,
      securityCode,
      [field]: value,
    });

    if (result.success) {
      setErrors((p) => ({ ...p, [field]: "" }));
      return;
    }
    const fieldError = result.error.flatten().fieldErrors[field]?.[0] || "";
    setErrors((p) => ({ ...p, [field]: fieldError }));
  };

  const validateAll = () => {
    const result = AddCardSchema.safeParse({
      cardNumber,
      expiryDate,
      securityCode,
    });

    if (result.success) {
      setErrors(initialErrors);
      return true;
    }
    const f = result.error.flatten().fieldErrors;
    setErrors({
      cardNumber: f.cardNumber?.[0] || "",
      expiryDate: f.expiryDate?.[0] || "",
      securityCode: f.securityCode?.[0] || "",
    });

    return false;
  };

  const reset = () => {
    setCardNumber("");
    setExpiryDate("");
    setSecurityCode("");
    setErrors(initialErrors);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const isValid = validateAll();
    if (!isValid) return;

    setSuccessOpen(true);
    handleClose();
  };

  const handleCardNumberChange = (v: string | string[]) => {
    const val = formatCardNumber(normalizeInput(v));
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

  return {
    cardNumber,
    expiryDate,
    securityCode,
    errors,
    setCardNumber,
    setExpiryDate,
    setSecurityCode,
    validateField,
    handleSubmit,
    successOpen,
    setSuccessOpen,
    handleClose,
    handleCardNumberChange,
    handleExpiryChange,
    handleCVVChange,
  };
}
