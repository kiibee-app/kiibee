'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PlanCard from './PlanCard';
import { CardsWrapper, Section, SectionTitle } from './styles';
import { planOrder, pricingPlanToPlanName } from '@/utils/pricingPlanKeys';
import ScrollReveal from '@/components/UI/ScrollReveal';
import { LANDING_REVEAL } from '@/utils/landingUtils';
import { useGetAPI } from '@/lib/http/api/getApi';
import { API } from '@/lib/http/api/endpoints';

type ApiPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  maxFiles: number;
  isActive: boolean;
};

type PlansResponse = {
  success: boolean;
  data?: ApiPlan[];
};

type PricingPlansSectionProps = {
  titleKey?: string;
};

export default function PricingPlansSection({
  titleKey = 'pricingPlans.title',
}: PricingPlansSectionProps) {
  const { t } = useTranslation();

  const { data: plansData } = useGetAPI<PlansResponse>(API.subscription.plans);

  const apiPlans = useMemo(() => plansData?.data ?? [], [plansData]);

  const matchedPlans = useMemo(() => {
    return planOrder.map((planKey) => {
      const planName = pricingPlanToPlanName[planKey];
      const apiPlan = apiPlans.find(
        (p) => p.name.toLowerCase() === planName.toLowerCase(),
      );
      return { planKey, apiPlan };
    });
  }, [apiPlans]);

  return (
    <Section>
      <ScrollReveal delay={LANDING_REVEAL.shortDelay}>
        <SectionTitle>{t(titleKey)}</SectionTitle>
      </ScrollReveal>
      <CardsWrapper>
        {matchedPlans.map(({ planKey, apiPlan }, index) => {
          const baseKey = `pricingPlans.plans.${planKey}`;

          return (
            <ScrollReveal
              key={planKey}
              delay={(index + 1) * LANDING_REVEAL.ctaCardStaggerDelay}
            >
              <PlanCard
                title={apiPlan?.name || t(`${baseKey}.title`)}
                price={
                  apiPlan ? `${apiPlan.price} kr/md` : t(`${baseKey}.price`)
                }
                descriptions={[t(`${baseKey}.desc1`), t(`${baseKey}.desc2`)]}
                features={
                  t(`${baseKey}.features`, { returnObjects: true }) as string[]
                }
                cta={t('pricingPlans.cta')}
                highlight={planKey === 'growth'}
                planKey={planKey}
                planId={apiPlan?.id}
              />
            </ScrollReveal>
          );
        })}
      </CardsWrapper>
    </Section>
  );
}
