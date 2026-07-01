import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { creatorWallets } from 'src/database/schema/commerce/creatorWallets.schema';

export const addWallet = async (
  creatorId: string,
  amount: number,
  currency: string,
): Promise<string> => {
  const existingWallet = await db.query.creatorWallets.findFirst({
    where: and(
      eq(creatorWallets.creatorId, creatorId),
      eq(creatorWallets.currency, currency),
    ),
  });

  if (existingWallet) {
    const updatedAmount = Number(existingWallet.amount) + amount;

    await db
      .update(creatorWallets)
      .set({
        amount: updatedAmount.toString(),
      })
      .where(eq(creatorWallets.id, existingWallet.id));

    return updatedAmount.toString();
  }

  await db.insert(creatorWallets).values({
    id: randomUUID(),
    creatorId,
    amount: amount.toString(),
    currency,
  });

  return amount.toString();
};
