import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';

import { db } from 'src/database/db';
import { creatorWallets } from 'src/database/schema/commerce/creatorWallets.schema';

type WalletExecutor = Pick<typeof db, 'query' | 'insert' | 'update'>;

export const addWallet = async (
  creatorId: string,
  amount: number,
  currency: string,
  executor: WalletExecutor = db,
): Promise<string> => {
  const existingWallet = await executor.query.creatorWallets.findFirst({
    where: and(
      eq(creatorWallets.creatorId, creatorId),
      eq(creatorWallets.currency, currency),
    ),
  });

  if (existingWallet) {
    const updatedAmount = Number(existingWallet.amount) + amount;

    await executor
      .update(creatorWallets)
      .set({
        amount: updatedAmount.toString(),
      })
      .where(eq(creatorWallets.id, existingWallet.id));

    return updatedAmount.toString();
  }

  await executor.insert(creatorWallets).values({
    id: randomUUID(),
    creatorId,
    amount: amount.toString(),
    currency,
  });

  return amount.toString();
};
