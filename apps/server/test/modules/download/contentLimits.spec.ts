jest.mock('src/database/db', () => ({
  db: { select: jest.fn(), transaction: jest.fn() },
}));
import { db } from 'src/database/db';
import { contentLimits, mediaFiles } from 'src/database/schema';
import {
  getContentStreamLimit,
  setContentStreamLimit,
} from 'src/modules/download/services/contentStreamLimit.service';
import { setContentDownloadLimit } from 'src/modules/download/services/contentDownloadLimit.service';
import {
  SetDownloadLimitDto,
  SetStreamLimitDto,
} from 'src/modules/download/dto/download.dto';
import { validateSync } from 'class-validator';

const updated = jest.fn();
const inserted = jest.fn();
let existing: unknown[];
const select = () => ({ from: () => ({ limit: async () => existing }) });
describe('admin content limit settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    existing = [{ id: 'limits', maxLimit: 5, maxStreamLimit: 7 }];
    jest.mocked(db.select).mockImplementation(select as never);
    jest.mocked(db.transaction).mockImplementation(async (fn) =>
      fn({
        select,
        update: (table: unknown) => ({
          set: (value: unknown) => {
            updated(table, value);
            return { where: async () => undefined };
          },
        }),
        insert: (table: unknown) => ({
          values: async (value: unknown) => {
            inserted(table, value);
          },
        }),
      } as never),
    );
  });
  it('reads the configured stream limit and falls back to seven when unset', async () => {
    existing = [{ maxStreamLimit: 10 }];
    expect(await getContentStreamLimit()).toMatchObject({
      data: { maxStreamLimit: 10 },
    });
    existing = [];
    expect(await getContentStreamLimit()).toMatchObject({
      data: { maxStreamLimit: 7 },
    });
  });
  it('saves stream limit ten without changing the download setting', async () => {
    await setContentStreamLimit(10);
    expect(updated).toHaveBeenCalledTimes(1);
    expect(updated).toHaveBeenCalledWith(contentLimits, { maxStreamLimit: 10 });
  });
  it('initializes stream settings with the existing download default', async () => {
    existing = [];
    await setContentStreamLimit(10);
    expect(inserted).toHaveBeenCalledWith(
      contentLimits,
      expect.objectContaining({ maxLimit: 5, maxStreamLimit: 10 }),
    );
  });
  it('saves download limit ten and applies it to existing content', async () => {
    await setContentDownloadLimit(10);
    expect(updated).toHaveBeenCalledWith(contentLimits, { maxLimit: 10 });
    expect(updated).toHaveBeenCalledWith(mediaFiles, { maxDownloadCount: 10 });
  });
  it.each([-1, 11, 2.5, NaN, Infinity, '10', null])(
    'rejects invalid values %s before database writes',
    async (value) => {
      await expect(
        setContentDownloadLimit(value as number),
      ).rejects.toMatchObject({ status: 400 });
      await expect(
        setContentStreamLimit(value as number),
      ).rejects.toMatchObject({ status: 400 });
      expect(db.transaction).not.toHaveBeenCalled();
    },
  );
  it('rejects zero streams but retains the existing zero-download setting', async () => {
    await expect(setContentStreamLimit(0)).rejects.toMatchObject({
      status: 400,
    });
    await expect(setContentDownloadLimit(0)).resolves.toMatchObject({
      success: true,
    });
  });
  it('validates integer bounds at the API boundary', () => {
    for (const maximum of [1, 10]) {
      expect(
        validateSync(
          Object.assign(new SetStreamLimitDto(), { maxStreamLimit: maximum }),
        ),
      ).toHaveLength(0);
      expect(
        validateSync(
          Object.assign(new SetDownloadLimitDto(), { maxLimit: maximum }),
        ),
      ).toHaveLength(0);
    }
    expect(
      validateSync(
        Object.assign(new SetStreamLimitDto(), { maxStreamLimit: 11 }),
      ).length,
    ).toBeGreaterThan(0);
    expect(
      validateSync(Object.assign(new SetDownloadLimitDto(), { maxLimit: 11 }))
        .length,
    ).toBeGreaterThan(0);
    expect(
      validateSync(Object.assign(new SetDownloadLimitDto(), { maxLimit: 1.5 }))
        .length,
    ).toBeGreaterThan(0);
  });
});
