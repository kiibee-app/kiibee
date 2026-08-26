import { HttpException, HttpStatus } from '@nestjs/common';
import { and, desc, eq, ilike, inArray, or, sql, type SQL } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  accountDetails,
  creatorBankAccounts,
  creatorPayoutRequests,
  creatorWallets,
  userCardInfo,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE, STATUS } from 'src/utils/constant';
import { success } from 'src/utils/sendResponse';
import {
  DEFAULT_LIMIT,
  getSafePositiveInteger,
  MAX_LIMIT,
} from 'src/utils/pagination';
import { CARD_PAYOUTS_ENABLED } from 'src/utils/fees';
import { SettlementHistoryQueryDto } from '../dto/payout.dto';

type PaymentMethodOption = {
  id: string;
  label: string;
  type: 'bank' | 'card';
  isDefault: boolean;
};

type AccountDetails = {
  methodType: 'bank' | 'card';
  accountNumber: string | null;
  accountHolderName: string | null;
  bankName: string | null;
  cardNumber: string | null;
  cardExpiry: string | null;
};

export const getCreatorWalletsService = async (
  query?: SettlementHistoryQueryDto,
) => {
  try {
    const requestedPage = getSafePositiveInteger(Number(query?.page), 1);
    const pageSize = getSafePositiveInteger(
      Number(query?.limit),
      DEFAULT_LIMIT,
      MAX_LIMIT,
    );

    const filters: SQL[] = [
      eq(users.role, ROLE.CREATOR),
      eq(users.isDeleted, false),
    ];

    if (query?.search?.trim()) {
      const searchPattern = `%${query.search.trim()}%`;
      const searchFilter = or(
        ilike(users.fullName, searchPattern),
        ilike(users.email, searchPattern),
        ilike(users.firstName, searchPattern),
        ilike(users.lastName, searchPattern),
      );

      if (searchFilter) {
        filters.push(searchFilter);
      }
    }

    const where = and(...filters);

    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(where);

    const totalItems = Number(totalResult?.count ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);
    const offset = (currentPage - 1) * pageSize;

    const rows = await db
      .select({
        creatorId: users.id,
        email: users.email,
        fullName: users.fullName,
        walletBalance: creatorWallets.amount,
        walletCurrency: creatorWallets.currency,
        pendingRequestId: creatorPayoutRequests.id,
      })
      .from(users)
      .leftJoin(creatorWallets, eq(creatorWallets.creatorId, users.id))
      .leftJoin(
        creatorPayoutRequests,
        and(
          eq(creatorPayoutRequests.creatorId, users.id),
          eq(creatorPayoutRequests.status, STATUS.PENDING),
        ),
      )
      .where(where)
      .orderBy(
        desc(sql`COALESCE(${creatorWallets.amount}::numeric, 0)`),
        desc(users.createdAt),
      )
      .limit(pageSize)
      .offset(offset);

    const creatorIds = rows.map((row) => row.creatorId);

    const [bankAccounts, cards, adminAccountDetails] = creatorIds.length
      ? await Promise.all([
          db
            .select({
              id: creatorBankAccounts.id,
              creatorId: creatorBankAccounts.creatorId,
              bankName: creatorBankAccounts.bankName,
              accountNumber: creatorBankAccounts.accountNumber,
              isDefault: creatorBankAccounts.isDefault,
            })
            .from(creatorBankAccounts)
            .where(inArray(creatorBankAccounts.creatorId, creatorIds)),
          CARD_PAYOUTS_ENABLED
            ? db
                .select({
                  id: userCardInfo.id,
                  userId: userCardInfo.userId,
                  paymentMethodId: userCardInfo.paymentMethodId,
                  cardNo: userCardInfo.cardNo,
                  cardType: userCardInfo.cardType,
                  isDefault: userCardInfo.isDefault,
                })
                .from(userCardInfo)
                .where(inArray(userCardInfo.userId, creatorIds))
            : Promise.resolve(
                [] as Array<{
                  id: string;
                  userId: string;
                  paymentMethodId: string;
                  cardNo: string;
                  cardType: string;
                  isDefault: boolean;
                }>,
              ),
          db
            .select({
              creatorId: accountDetails.creatorId,
              methodType: accountDetails.methodType,
              accountNumber: accountDetails.accountNumber,
              accountHolderName: accountDetails.accountHolderName,
              bankName: accountDetails.bankName,
              cardNumber: accountDetails.cardNumber,
              cardExpiry: accountDetails.cardExpiry,
            })
            .from(accountDetails)
            .where(inArray(accountDetails.creatorId, creatorIds)),
        ])
      : [[], [], []];

    const paymentMethodsByCreator = new Map<string, PaymentMethodOption[]>();
    const accountDetailsByCreator = new Map<string, AccountDetails>();

    for (const account of bankAccounts) {
      const methods = paymentMethodsByCreator.get(account.creatorId) ?? [];
      methods.push({
        id: account.id,
        label: `${account.bankName} •••• ${account.accountNumber.slice(-4)}`,
        type: 'bank',
        isDefault: account.isDefault,
      });
      paymentMethodsByCreator.set(account.creatorId, methods);
    }

    for (const card of cards) {
      if (!card.paymentMethodId) continue;
      const methods = paymentMethodsByCreator.get(card.userId) ?? [];
      methods.push({
        id: card.paymentMethodId,
        label: `${card.cardType} ${card.cardNo}`,
        type: 'card',
        isDefault: card.isDefault,
      });
      paymentMethodsByCreator.set(card.userId, methods);
    }

    for (const details of adminAccountDetails) {
      accountDetailsByCreator.set(details.creatorId, {
        methodType: details.methodType === 'card' ? 'card' : 'bank',
        accountNumber: details.accountNumber ?? null,
        accountHolderName: details.accountHolderName ?? null,
        bankName: details.bankName ?? null,
        cardNumber: details.cardNumber ?? null,
        cardExpiry: details.cardExpiry ?? null,
      });
    }

    const items = rows.map((row) => {
      const paymentMethods = paymentMethodsByCreator.get(row.creatorId) ?? [];
      const balance = Number(row.walletBalance ?? 0);

      return {
        creatorId: row.creatorId,
        email: row.email,
        fullName: row.fullName,
        walletBalance: Number.isFinite(balance) ? balance.toFixed(2) : '0.00',
        walletCurrency: row.walletCurrency ?? 'DKK',
        pendingRequestId: row.pendingRequestId ?? null,
        hasPendingRequest: Boolean(row.pendingRequestId),
        paymentMethods,
        hasPaymentMethod: paymentMethods.length > 0,
        accountDetails: accountDetailsByCreator.get(row.creatorId) ?? null,
      };
    });

    return success(
      {
        items,
        pagination: {
          page: currentPage,
          limit: pageSize,
          totalItems,
          totalPages,
        },
      },
      'Creator wallets fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    logger.error('Failed to fetch creator wallets', error);

    throw new HttpException(
      'Failed to fetch creator wallets',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
