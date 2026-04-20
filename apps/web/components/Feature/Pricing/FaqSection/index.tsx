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

export default function FaqSection() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = useCallback((id: number) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <Section>
      <Heading>{t("pricingFaq.title")}</Heading>
      <List>
        {pricingFaqData.map((item) => {
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
            <Item
              key={item.id}
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
          );
        })}
      </List>
    </Section>
  );
}
