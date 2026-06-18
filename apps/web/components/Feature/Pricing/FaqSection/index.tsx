"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { pricingFaqData } from "@/utils/pricingFaq";
import {
  Answer,
  AnswerGrid,
  AnswerInner,
  Heading,
  Item,
  List,
  Question,
  Section,
} from "./styles";
import { FAQ_TOGGLE_KEYS } from "@/utils/Constants";
import ScrollReveal from "@/components/UI/ScrollReveal";
import { LANDING_REVEAL } from "@/utils/landingUtils";

export default function FaqSection() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = useCallback((id: number) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <Section>
      <ScrollReveal once sequence={false}>
        <Heading>{t("pricingFaq.title")}</Heading>
      </ScrollReveal>
      <List>
        {pricingFaqData.map((item, index) => {
          const isOpen = !!openItems[item.id];
          const questionId = `faq-question-${item.id}`;
          const answerId = `faq-answer-${item.id}`;

          const onKeyDown = (e: React.KeyboardEvent) => {
            if (FAQ_TOGGLE_KEYS.includes(e.key)) {
              e.preventDefault();
              toggleItem(item.id);
            }
          };

          return (
            <ScrollReveal
              key={item.id}
              delay={index * LANDING_REVEAL.ctaCardStaggerDelay}
              once
              sequence={false}
            >
              <Item
                type="button"
                onClick={() => toggleItem(item.id)}
                onKeyDown={onKeyDown}
                aria-expanded={isOpen}
                aria-controls={answerId}
              >
                <Question id={questionId}>
                  {t(`${item.translationKey}.question`)}
                </Question>
                <AnswerGrid
                  $open={isOpen}
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                >
                  <AnswerInner>
                    <Answer $open={isOpen}>
                      {t(`${item.translationKey}.answer`)}
                    </Answer>
                  </AnswerInner>
                </AnswerGrid>
              </Item>
            </ScrollReveal>
          );
        })}
      </List>
    </Section>
  );
}
