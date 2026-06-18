import { HttpStatus } from '@nestjs/common';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  creatorBankAccounts,
  creatorPayouts,
  mediaFiles,
  collections,
  orders,
  payments,
} from 'src/database/schema';
import { ORDER_STATUS } from 'src/utils/constant';
import { logger } from 'src/logger/logger';
import { fail, success } from 'src/utils/sendResponse';
import { SettlementHistoryQueryDto } from '../dto/payout.dto';

export async function getSettlementHistoryService(
  creatorId: string,
  query?: SettlementHistoryQueryDto,
) {
  try {
    const paidSettlements = await db
      .select({
        id: creatorPayouts.id,
        amount: creatorPayouts.amount,
        status: creatorPayouts.status,
        creditNo: creatorPayouts.creditNo,
        bankName: creatorBankAccounts.bankName,
        accountNumber: creatorBankAccounts.accountNumber,
        payoutDate: creatorPayouts.payoutDate,
        createdAt: creatorPayouts.createdAt,
      })
      .from(creatorPayouts)
      .leftJoin(
        creatorBankAccounts,
        eq(creatorPayouts.creatorId, creatorBankAccounts.creatorId),
      )
      .where(eq(creatorPayouts.creatorId, creatorId))
      .orderBy(desc(creatorPayouts.payoutDate));

    const unpaidOrders = await db
      .select({
        id: orders.id,
        amount: payments.amount,
        paidAt: payments.paidAt,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(payments, eq(payments.orderId, orders.id))
      .leftJoin(mediaFiles, eq(orders.mediaFileId, mediaFiles.id))
      .leftJoin(collections, eq(orders.collectionId, collections.id))
      .where(
        and(
          eq(payments.status, ORDER_STATUS.COMPLETED as any),
          eq(orders.status, ORDER_STATUS.COMPLETED as any),
          sql`(${mediaFiles.creatorId} = ${creatorId} OR ${collections.creatorId} = ${creatorId})`,
          sql`NOT EXISTS (
            SELECT 1 FROM ${creatorPayouts}
            WHERE ${creatorPayouts.creatorId} = ${creatorId}
          )`,
        ),
      )
      .orderBy(desc(sql`coalesce(${payments.paidAt}, ${payments.createdAt})`));

    const paidRows = paidSettlements.map((row) => ({
      id: row.id,
      amount: `${row.amount} kr.`,
      status: row.status.charAt(0).toUpperCase() + row.status.slice(1),
      creditNo: row.creditNo ?? '-',
      bank: row.bankName
        ? `${row.bankName} ****${row.accountNumber?.slice(-4) ?? ''}`
        : '-',
      date: row.payoutDate?.toISOString() ?? row.createdAt?.toISOString() ?? '',
    }));

    const unpaidRows = unpaidOrders.map((row) => ({
      id: row.id,
      amount: `${row.amount} kr.`,
      status: 'Pending',
      creditNo: '-',
      bank: '-',
      date: row.paidAt?.toISOString() ?? row.createdAt?.toISOString() ?? '',
    }));

    let settlements = [...paidRows, ...unpaidRows];

    if (query?.status) {
      const filterStatus =
        query.status.charAt(0).toUpperCase() + query.status.slice(1);
      settlements = settlements.filter((s) => s.status === filterStatus);
    }

    if (query?.search) {
      const search = query.search.toLowerCase();
      settlements = settlements.filter(
        (s) =>
          s.creditNo.toLowerCase().includes(search) ||
          s.amount.toLowerCase().includes(search),
      );
    }

    return success(
      settlements,
      'Settlement history retrieved successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Failed to fetch settlement history:', error);
    return fail(
      'Failed to fetch settlement history',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
