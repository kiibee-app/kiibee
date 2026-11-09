import { sql, type SQLWrapper } from 'drizzle-orm';
import { creatorChannels, creatorInfo, users } from 'src/database/schema';

// Owner names are private account data. Public names come only from the company.
export const publicCreatorNameFor = (
  creatorId: SQLWrapper,
) => sql<string>`coalesce(
  (select nullif(trim(${creatorInfo.companyName}), '') from ${creatorInfo}
    where ${creatorInfo.userId} = ${creatorId} limit 1),
  (select nullif(trim(${creatorChannels.name}), '') from ${creatorChannels}
    where ${creatorChannels.creatorId} = ${creatorId} limit 1),
  'Creator'
)`;

export const publicCreatorName = publicCreatorNameFor(users.id);

export const publicCreatorSlug = sql<string | null>`(
  select ${creatorChannels.slug} from ${creatorChannels}
  where ${creatorChannels.creatorId} = ${users.id} limit 1
)`;
