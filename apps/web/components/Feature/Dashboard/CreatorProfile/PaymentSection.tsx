"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import InputField from "@/components/UI/InputFields";
import { Card, Fields, Title, TwoColumnRow } from "./styles";
import { CREATOR_PROFILE } from "@/utils/translationKeys";
import { PaymentKeys } from "@/utils/creatorProfile";
import { INPUT_VARIANTS } from "@/utils/Constants";
import { MonoText } from "@/components/UI/Monotext";
import COLORS from "@repo/ui/colors";
import { getPaymentFields } from "@/utils/creatorProfilefields";
import { NUMERIC_INPUT_MODE, sanitizeDigits } from "@/utils/numericFields";
import {
  consumeCreatorPaymentInfoFocusRequest,
  CREATOR_PAYMENT_INFO_HIGHLIGHT_MS,
  CREATOR_PAYMENT_INFO_SECTION_ID,
  FOCUS_CREATOR_PAYMENT_INFO_EVENT,
  scrollToCreatorPaymentInfo,
} from "@/utils/creatorPaymentInfoFocus";

type PaymentProps = {
  form: Record<string, string>;
  onChange: (key: PaymentKeys) => (value: string | string[]) => void;
  t: (key: string) => string;
};

export default function PaymentSection({ form, onChange, t }: PaymentProps) {
  const fields = getPaymentFields(t);
  const [emphasized, setEmphasized] = useState(false);
  const highlightTimeoutRef = useRef<number | null>(null);

  const clearHighlightTimer = useCallback(() => {
    if (highlightTimeoutRef.current != null) {
      window.clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
  }, []);

  const focusPaymentSection = useCallback(() => {
    const scrolled = scrollToCreatorPaymentInfo();
    if (!scrolled) return;

    setEmphasized(true);
    clearHighlightTimer();
    highlightTimeoutRef.current = window.setTimeout(() => {
      setEmphasized(false);
      highlightTimeoutRef.current = null;
    }, CREATOR_PAYMENT_INFO_HIGHLIGHT_MS);
  }, [clearHighlightTimer]);

  useEffect(() => {
    const handleFocusEvent = () => {
      // Wait a tick so redirect/layout can settle when navigating to profile.
      window.requestAnimationFrame(() => {
        focusPaymentSection();
      });
    };

    let intervalId: number | null = null;

    if (consumeCreatorPaymentInfoFocusRequest()) {
      // Retry briefly if profile just mounted after redirect.
      let attempts = 0;
      intervalId = window.setInterval(() => {
        const element = document.getElementById(
          CREATOR_PAYMENT_INFO_SECTION_ID,
        );
        attempts += 1;
        if (element || attempts > 12) {
          if (intervalId != null) {
            window.clearInterval(intervalId);
            intervalId = null;
          }
          if (element) {
            focusPaymentSection();
          }
        }
      }, 50);
    }

    window.addEventListener(FOCUS_CREATOR_PAYMENT_INFO_EVENT, handleFocusEvent);
    return () => {
      window.removeEventListener(
        FOCUS_CREATOR_PAYMENT_INFO_EVENT,
        handleFocusEvent,
      );
      if (intervalId != null) {
        window.clearInterval(intervalId);
      }
      clearHighlightTimer();
    };
  }, [clearHighlightTimer, focusPaymentSection]);

  const handlePaymentChange =
    (key: PaymentKeys, digitsOnly: boolean) => (value: string | string[]) => {
      const text = Array.isArray(value) ? value.join("") : value;
      onChange(key)(digitsOnly ? sanitizeDigits(text) : text);
    };

  const rows = [fields.slice(0, 2), fields.slice(2, 4)];

  return (
    <Card id={CREATOR_PAYMENT_INFO_SECTION_ID} $emphasized={emphasized}>
      <Title>
        <MonoText $use="Body_SemiBold">
          {t(CREATOR_PROFILE.paymentTitle)}
        </MonoText>
      </Title>

      <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY}>
        {t(CREATOR_PROFILE.paymentText)}
      </MonoText>

      <Fields>
        {rows.map((row) => (
          <TwoColumnRow key={row.map((field) => field.key).join("-")}>
            {row.map((field) => (
              <InputField
                key={field.key}
                label={field.label}
                value={form[field.key]}
                onChange={handlePaymentChange(
                  field.key as PaymentKeys,
                  field.digitsOnly,
                )}
                inputMode={field.digitsOnly ? NUMERIC_INPUT_MODE : undefined}
                labelFontStyle="Body_Regular"
                variant={INPUT_VARIANTS.PRIMARY_GRAY}
              />
            ))}
          </TwoColumnRow>
        ))}
      </Fields>
    </Card>
  );
}
