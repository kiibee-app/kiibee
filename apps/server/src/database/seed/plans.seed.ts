import { db } from '../db';
import { plans } from '../schema/subscription/plans.schema';

export const seedPlans = async () => {
  await db
    .insert(plans)
    .values([
      {
        name: 'Launch',
        price: 0,
        currency: 'DKK',
        billingCycle: 'monthly',
        maxFiles: 2,
        isActive: true,
      },
      {
        name: 'Growth',
        price: 129,
        currency: 'DKK',
        billingCycle: 'monthly',
        maxFiles: 50,
        isActive: true,
      },
      {
        name: 'Pro',
        price: 399,
        currency: 'DKK',
        billingCycle: 'monthly',
        maxFiles: -1, // unlimited
        isActive: true,
      },
    ])
    .onConflictDoNothing();

  console.log('Plans seeded successfully');
};
