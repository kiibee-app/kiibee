"use client";

import { useState } from "react";
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

export default function FaqSection() {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (id: number) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Section>
      <Heading>{t("pricingFaq.title")}</Heading>
      <List>
        {pricingFaqData.map((item) => {
          const isOpen = !!openItems[item.id];

          return (
            <Item
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              aria-expanded={isOpen}
            >
              <Question>{t(`${item.translationKey}.question`)}</Question>
              <AnswerGrid $open={isOpen}>
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
