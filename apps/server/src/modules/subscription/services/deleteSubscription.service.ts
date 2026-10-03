import axios from 'axios';
import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorPlans, plans } from 'src/database/schema';
import { subscriptions } from 'src/database/schema/subscription/subscriptionInvoices.schema';
import { users } from 'src/database/schema/users/users.schema';
import { logger } from 'src/logger/logger';
import { fail } from 'src/utils/sendResponse';
import { externalApi } from 'src/utils/extranalApi';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { mailSubject, templateName } from 'src/utils/mailServiceConstant';
import { runInBackground } from 'src/utils/backgroundTask';

export const deleteSubscriptionService = async (userId: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return fail('User not found', HttpStatus.NOT_FOUND);
    }

    const [currentSubscription] = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.creatorId, userId)))
      .limit(1);

    if (!currentSubscription) {
      return fail(
        'No active paid subscription found for the user',
        HttpStatus.NOT_FOUND,
      );
    }

    const subscriptionId = currentSubscription.agreementId;

    const { data: agreements } = await axios.get(
      externalApi.getBillingAgreements,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
        },
      },
    );

    const agreement = agreements.items.find(
      (item: any) => item.billingAgreement.subscriptionId === subscriptionId,
    );

    if (!agreement) {
      return fail('Billing agreement not found', HttpStatus.NOT_FOUND);
    }

    const billingAgreementId = agreement.billingAgreement.id;

    const { data } = await axios.post(
      externalApi.stopAgreement(billingAgreementId),
      {},
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.EPAY_API_KEY}`,
        },
      },
    );

    logger.info('ePay subscription stopped', data);

    await db.transaction(async (trx) => {
      await trx
        .update(subscriptions)
        .set({
          isActive: false,
        })
        .where(eq(subscriptions.id, currentSubscription.id));

      await trx.delete(creatorPlans).where(eq(creatorPlans.creatorId, userId));
    });

    if (user.email) {
      // Find plan name
      let planName = 'Abonnement';
      if (currentSubscription.planId) {
        const [plan] = await db
          .select({ name: plans.name })
          .from(plans)
          .where(eq(plans.id, currentSubscription.planId))
          .limit(1);
        if (plan?.name) {
          planName = plan.name;
        }
      }

      runInBackground(
        sendTemplateEmail({
          to: user.email,
          subject: mailSubject.SUBSCRIPTION_CANCELLED,
          templateName: templateName.SUBSCRIPTION_CANCELLED,
          variables: {
            creator: user,
            planName: planName,
          },
        }),
      );
    }

    return {
      success: true,
      message: 'Subscription cancelled successfully',
      data,
    };
  } catch (error: any) {
    logger.error(
      'Error deleting subscription:',
      error?.response?.data || error,
    );

    if (error instanceof HttpException) {
      throw error;
    }

    return fail(
      error?.response?.data?.message || 'Failed to delete subscription',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
