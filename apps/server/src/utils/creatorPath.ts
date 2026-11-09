import { and, eq, or, sql, type SQL } from 'drizzle-orm';
import { db } from 'src/database/db';
import { creatorChannels, users } from 'src/database/schema';
import { ROLE, STATUS } from './constant';
import { publicCreatorName } from './publicCreatorName';
import { slugify } from './slug';

// Compare public names as well as stored slugs: old imports sometimes dropped ø/æ.
export const creatorPathKey = (value: string) =>
  slugify(value, '').replace(/[^a-z0-9]/g, '');

const publicPathKeySql = (value: SQL) => sql`regexp_replace(
  replace(replace(replace(replace(lower(coalesce(${value}, '')),
    'æ', 'ae'), 'ø', 'oe'), 'å', 'aa'), '&', ' and '),
  '[^a-z0-9]', '', 'g'
)`;

export const creatorPathMatches = (path: string) => {
  const key = creatorPathKey(path);
  if (!key) return sql`false`;
  return or(
    sql`${publicPathKeySql(sql`${creatorChannels.slug}`)} = ${key}`,
    sql`${publicPathKeySql(sql`${creatorChannels.name}`)} = ${key}`,
    sql`${publicPathKeySql(publicCreatorName)} = ${key}`,
  )!;
};

export const resolvePublicCreatorPath = async (path: string) => {
  const visible = and(
    eq(users.role, ROLE.CREATOR),
    eq(users.isDeleted, false),
    eq(users.isHidden, false),
    eq(users.isActive, true),
    eq(users.status, STATUS.ACTIVE),
  );
  const find = (match: SQL) =>
    db
      .selectDistinct({ id: users.id })
      .from(users)
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .where(and(visible, match))
      .limit(2);

  // A real stored slug always takes priority over a normalized name alias.
  const exact = await find(
    or(eq(users.id, path), eq(creatorChannels.slug, path))!,
  );
  if (exact.length) return exact.length === 1 ? exact[0].id : null;
  if (!creatorPathKey(path)) return null;
  const aliases = await find(creatorPathMatches(path));
  // Never choose an arbitrary account if two public names normalize identically.
  return aliases.length === 1 ? aliases[0].id : null;
};
