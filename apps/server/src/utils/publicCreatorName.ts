import { sql } from 'drizzle-orm';
import { creatorChannels, creatorInfo, users } from 'src/database/schema';

// Owner names are private account data. Public names come only from the company.
export const publicCreatorName = sql<string>`coalesce(
  (select nullif(trim(${creatorInfo.companyName}), '') from ${creatorInfo}
    where ${creatorInfo.userId} = ${users.id} limit 1),
  (select nullif(trim(${creatorChannels.name}), '') from ${creatorChannels}
    where ${creatorChannels.creatorId} = ${users.id} limit 1),
  'Creator'
)`;

export const publicCreatorSlug = sql<string | null>`(
  select ${creatorChannels.slug} from ${creatorChannels}
  where ${creatorChannels.creatorId} = ${users.id} limit 1
)`;
