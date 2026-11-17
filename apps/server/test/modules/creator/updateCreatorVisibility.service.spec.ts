import { updateCreatorVisibilityService } from 'src/modules/creator/services/updateCreatorVisibility.service';

jest.mock('src/database/db', () => ({
  db: {},
}));

jest.mock('src/logger/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

const { db } = jest.requireMock('src/database/db') as {
  db: {
    select: jest.Mock;
    update: jest.Mock;
  };
};

describe('updateCreatorVisibilityService', () => {
  const creatorId = 'creator-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockSelectResult(rows: Array<{ id: string; isHidden: boolean }>) {
    db.select = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(rows),
        }),
      }),
    });
  }

  function mockUpdateResult(row: { id: string; isHidden: boolean }) {
    db.update = jest.fn().mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([row]),
        }),
      }),
    });
  }

  it('hides a visible creator', async () => {
    mockSelectResult([{ id: creatorId, isHidden: false }]);
    mockUpdateResult({ id: creatorId, isHidden: true });

    const result = await updateCreatorVisibilityService(creatorId, true);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: creatorId, isHidden: true });
    expect(db.update).toHaveBeenCalled();
  });

  it('returns the current state when already hidden', async () => {
    mockSelectResult([{ id: creatorId, isHidden: true }]);

    const result = await updateCreatorVisibilityService(creatorId, true);

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: creatorId, isHidden: true });
    expect(db.update).not.toHaveBeenCalled();
  });

  it('throws when the creator is missing', async () => {
    mockSelectResult([]);

    await expect(
      updateCreatorVisibilityService(creatorId, true),
    ).rejects.toThrow('Creator not found');
  });
});

import { PgDialect } from 'drizzle-orm/pg-core';
import {
  profileContentVisibleTo,
  creatorContentIsDiscoverable,
} from 'src/utils/publicCreatorVisibility';
import { OptionalJwtAuthGuard } from 'src/modules/auth/guards/optional-jwt-auth.guard';
describe('paid channel discovery visibility', () => {
  const dialect = new PgDialect();
  it('excludes paid/payment profiles from anonymous discovery', () => {
    const query = dialect.sqlToQuery(creatorContentIsDiscoverable);
    expect(query.sql).toContain("('payment', 'paid')");
    expect(query.sql).toContain('NOT EXISTS');
    expect(query.sql).not.toContain('OR EXISTS');
  });
  it('keeps individually code/email-gated content discoverable while hiding channel-level gates', () => {
    const query = dialect.sqlToQuery(creatorContentIsDiscoverable);
    expect(query.sql).not.toContain('"media_files"."access_type"');
    expect(query.sql).toContain("'set_password'");
    expect(query.sql).toContain("'request_email'");
    expect(query.sql).toContain('content_settings');
  });
  it('requires a completed unexpired pass or ownership for an identified viewer', () => {
    const query = dialect.sqlToQuery(profileContentVisibleTo('viewer-input'));
    expect(query.sql).not.toContain('viewer-input');
    expect(query.params).toContain('viewer-input');
    expect(query.sql).toContain("'completed'");
    expect(query.sql).toContain('rent_expires_at');
    expect(query.sql).toContain('> now()');
    expect(query.sql).toContain("'profile-access-'");
  });
  it('uses only a verified identity for optional public authentication', () => {
    const guard = new OptionalJwtAuthGuard();
    expect(guard.handleRequest(null, { userId: 'viewer' })).toEqual({
      userId: 'viewer',
    });
    expect(guard.handleRequest(new Error('invalid token'), false)).toBeNull();
  });
});
