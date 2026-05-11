import { db } from '../db';
import { plans } from '../schema/subscription/plans.schema';

export const seedPlans = async () => {
  await db.insert(plans).values([
    {
      name: 'Try Kiibee',
      price: 0,
      billingCycle: 'monthly',
      maxFiles: 2,
      isActive: true,
    },
    {
      name: 'Start-up',
      price: 99,
      billingCycle: 'monthly',
      maxFiles: 10,
      isActive: true,
    },
    {
      name: 'Pro',
      price: 299,
      billingCycle: 'monthly',
      maxFiles: 70,
      isActive: true,
    },
  ]);
};
