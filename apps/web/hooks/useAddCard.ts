"use client";

import { AddCardErrors, AddCardSchema } from "@/utils/addCard";
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

    if (!validateAll()) return false;

    console.log({ cardNumber, expiryDate, securityCode });

    handleClose();
    return true;
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
    handleClose,
  };
}
