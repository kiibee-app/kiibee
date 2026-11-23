import { HttpException, HttpStatus } from '@nestjs/common';
import { db } from 'src/database/db';
import {
  creatorApplicationRequests,
  creatorDeletionRequests,
  creatorPlans,
  creatorInfo,
  users,
  usersToken,
  userSessions,
} from 'src/database/schema';
import { approveCreatorDeletionRequestService as closeAccount } from 'src/modules/auth/services/approveCreatorDeletionRequest.service';
import { deleteSubscriptionService } from 'src/modules/subscription/services/deleteSubscription.service';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';

jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), transaction: jest.fn() },
}));
jest.mock(
  'src/modules/subscription/services/deleteSubscription.service',
  () => ({ deleteSubscriptionService: jest.fn() }),
);
jest.mock('src/lib/sendTemplateEmail', () => ({
  sendTemplateEmail: jest.fn().mockResolvedValue(true),
}));
jest.mock('src/utils/backgroundTask', () => ({ runInBackground: jest.fn() }));
jest.mock('src/logger/logger', () => ({ logger: { error: jest.fn() } }));

function rows(data: unknown[]) {
  const query = {
    from: () => query,
    where: () => query,
    leftJoin: () => query,
    limit: async () => data,
  };
  return query as unknown as ReturnType<typeof db.select>;
}
const creator = {
  userId: 'creator',
  userEmail: 'creator@example.com',
  userFirstName: 'Creator',
  userFullName: 'Creator Name',
};
let returningRows: unknown[][];
let pending: unknown[];
const mutations: { table: unknown; value?: unknown; kind: string }[] = [];
const tx = {
  select: jest.fn(() => rows(pending)),
  update: jest.fn((table: unknown) => {
    const query = {
      set: (value: unknown) => {
        mutations.push({ table, value, kind: 'update' });
        return query;
      },
      where: () => query,
      returning: async () => returningRows.shift() ?? [],
    };
    return query;
  }),
  delete: jest.fn((table: unknown) => {
    mutations.push({ table, kind: 'delete' });
    return { where: jest.fn().mockResolvedValue(undefined) };
  }),
  insert: jest.fn((table: unknown) => ({
    values: async (value: unknown) => {
      mutations.push({ table, value, kind: 'insert' });
    },
  })),
};

beforeEach(() => {
  jest.clearAllMocks();
  mutations.length = 0;
  pending = [];
  returningRows = [[{ id: 'creator' }]];
  jest
    .mocked(db.select)
    .mockReturnValueOnce(rows([creator]))
    .mockReturnValueOnce(rows([]));
  jest
    .mocked(db.transaction)
    .mockImplementation(async (callback) => callback(tx as never));
});

it('permanently closes a creator, revokes access, preserves financial records and sends Danish inactivity email', async () => {
  await expect(
    closeAccount('', 'admin', { creatorId: 'creator' }),
  ).resolves.toMatchObject({
    success: true,
    data: { id: 'creator', isDeleted: true },
  });
  expect(mutations).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        table: users,
        value: expect.objectContaining({
          isDeleted: true,
          isActive: false,
          isHidden: true,
          status: 'deleted',
        }),
      }),
      expect.objectContaining({
        table: creatorDeletionRequests,
        kind: 'insert',
        value: expect.objectContaining({
          userId: 'creator',
          approvedUserId: 'admin',
          status: 'approved',
        }),
      }),
      expect.objectContaining({
        table: creatorApplicationRequests,
        value: expect.objectContaining({ isDeleted: true }),
      }),
      expect.objectContaining({ table: userSessions, kind: 'delete' }),
      expect.objectContaining({ table: usersToken, kind: 'delete' }),
      expect.objectContaining({ table: creatorInfo, kind: 'delete' }),
      expect.objectContaining({
        table: creatorPlans,
        value: expect.objectContaining({ status: 'inactive' }),
      }),
    ]),
  );
  expect(sendTemplateEmail).toHaveBeenCalledWith(
    expect.objectContaining({
      to: creator.userEmail,
      templateName: 'creatorAccountClosed',
      subject: 'Din KiiBee-konto er lukket',
    }),
  );
  expect(deleteSubscriptionService).not.toHaveBeenCalled();
});

it('resolves an existing pending deletion request instead of creating a second audit entry', async () => {
  pending = [{ id: 'request' }];
  await closeAccount('', 'admin', { creatorId: 'creator' });
  expect(tx.insert).not.toHaveBeenCalled();
  expect(mutations).toContainEqual(
    expect.objectContaining({
      table: creatorDeletionRequests,
      kind: 'update',
      value: expect.objectContaining({
        status: 'approved',
        approvedUserId: 'admin',
      }),
    }),
  );
});

it('cancels active paid billing before closure and suppresses the separate cancellation email', async () => {
  jest
    .mocked(db.select)
    .mockReset()
    .mockReturnValueOnce(rows([creator]))
    .mockReturnValueOnce(
      rows([{ id: 'sub', agreementId: 'agreement', amount: '100' }]),
    );
  await closeAccount('', 'admin', { creatorId: 'creator' });
  expect(deleteSubscriptionService).toHaveBeenCalledWith('creator', {
    subscriptionId: 'sub',
    preserveCreatorPlan: true,
    notify: false,
  });
});

it('keeps the account open and sends no closure email when billing cancellation fails', async () => {
  jest
    .mocked(db.select)
    .mockReset()
    .mockReturnValueOnce(rows([creator]))
    .mockReturnValueOnce(
      rows([{ id: 'sub', agreementId: 'agreement', amount: '100' }]),
    );
  jest
    .mocked(deleteSubscriptionService)
    .mockRejectedValueOnce(
      new HttpException('Billing unavailable', HttpStatus.BAD_GATEWAY),
    );
  await expect(
    closeAccount('', 'admin', { creatorId: 'creator' }),
  ).rejects.toMatchObject({ status: 502 });
  expect(db.transaction).not.toHaveBeenCalled();
  expect(sendTemplateEmail).not.toHaveBeenCalled();
});

it('does not notify again when another closure already claimed the account', async () => {
  returningRows = [[]];
  await expect(
    closeAccount('', 'admin', { creatorId: 'creator' }),
  ).rejects.toMatchObject({ status: 409 });
  expect(sendTemplateEmail).not.toHaveBeenCalled();
});

it('rejects missing, deleted or non-creator targets before any mutation', async () => {
  jest.mocked(db.select).mockReset().mockReturnValueOnce(rows([]));
  await expect(
    closeAccount('', 'admin', { creatorId: 'missing' }),
  ).rejects.toMatchObject({ status: 404 });
  expect(db.transaction).not.toHaveBeenCalled();
  expect(sendTemplateEmail).not.toHaveBeenCalled();
});

it('preserves the existing user-requested deletion email flow', async () => {
  returningRows.push([{ userId: 'creator' }]);
  await closeAccount('request', 'admin');
  expect(sendTemplateEmail).toHaveBeenCalledWith(
    expect.objectContaining({ templateName: 'approvedCreatorDeletion' }),
  );
});
