import 'dotenv/config';
import { randomUUID } from 'crypto';
import { eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../src/database/db';
import { creatorChannels, creatorOwners, users } from '../src/database/schema';

const CREATOR_OWNERS: Array<{
  channel: string;
  email?: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
}> = [
  {
    channel: '%neuroterapeut%',
    email: 'ida@fysioteamet.dk',
    firstName: 'Jakob',
    lastName: 'Hansen',
    fullName: 'Jakob Hansen',
  },
  {
    channel: 'fysioteamet',
    email: 'jakob.prv@gmail.com',
    firstName: 'Jakob',
    lastName: 'Hansen',
    fullName: 'Jakob Hansen',
  },
  {
    channel: 'fbi.dk',
    email: 'peter@fbi-productions.dk',
    firstName: 'Peter Alan',
    lastName: 'Wheatley',
    fullName: 'Peter Alan Wheatley',
  },
  {
    channel: 'chief1',
    email: 'chiefment@gmail.com',
    firstName: 'Lars',
    lastName: 'Pedersen',
    fullName: 'Lars Pedersen',
  },
  {
    channel: 'microphone entertainment',
    email: 'marlene@microphone.dk',
    firstName: 'Mick',
    lastName: 'Øgendahl',
    fullName: 'Mick Øgendahl',
  },
  {
    channel: 'kammas kantine',
    email: 'jakob@kafekammas.dk',
    firstName: 'Jakob',
    lastName: 'Kamma',
    fullName: 'Jakob Kamma',
  },
  {
    channel: 'red barnet',
    email: 'sia@redbarnet.dk',
    firstName: 'Sia',
    lastName: null,
    fullName: 'Sia',
  },
  {
    channel: 'damkjær medier',
    email: 'simone@damkjaer-medier.dk',
    firstName: 'Simone',
    lastName: 'Damkjær',
    fullName: 'Simone Damkjær',
  },
  {
    channel: 'langes entertainment aps',
    email: 'book@nicolajlange.dk',
    firstName: 'Nicolaj',
    lastName: 'Lange',
    fullName: 'Nicolaj Lange',
  },
  {
    channel: 'signeneslein.dk',
    email: 'signe@neslein.com',
    firstName: 'Signe',
    lastName: 'Neslein',
    fullName: 'Signe Neslein',
  },
  {
    channel: 'networker',
    email: 'hej@henrikhavemand.dk',
    firstName: 'Henrik',
    lastName: 'Havemand',
    fullName: 'Henrik Havemand',
  },
  {
    channel: '%tania ellis%',
    email: 'te@taniaellis.com',
    firstName: 'Tania',
    lastName: 'Ellis',
    fullName: 'Tania Ellis',
  },
  {
    channel: '%you consulting%',
    email: 'jannie.hvidberg@gmail.com',
    firstName: 'Jannie',
    lastName: 'Hvidberg',
    fullName: 'Jannie Hvidberg',
  },
  {
    channel: '%skolero%',
    email: 'line@skolero.dk',
    firstName: 'Line',
    lastName: null,
    fullName: 'Line',
  },
  {
    channel: '%uffe holm%',
    email: 'malene@uffeholm.dk',
    firstName: 'Uffe',
    lastName: 'Holm',
    fullName: 'Uffe Holm',
  },
  {
    channel: '%amin jensen%',
    email: 'amin@aminjensen.dk',
    firstName: 'Amin',
    lastName: 'Jensen',
    fullName: 'Amin Jensen',
  },
  {
    channel: 'comedy-tv',
    email: 'halfters@gmail.com',
    firstName: 'Dan',
    lastName: 'Andersen',
    fullName: 'Dan Andersen',
  },
  {
    channel: '%britta koch%',
    email: 'undertryk@gmail.com',
    firstName: 'Britta',
    lastName: 'Koch',
    fullName: 'Britta Koch',
  },
  {
    channel: 'elstudio',
    email: 'info@elstudio.dk',
    firstName: 'Stine',
    lastName: 'Joy',
    fullName: 'Stine Joy',
  },
  {
    channel: 'raujensen',
    email: 'christineraujensen@gmail.com',
    firstName: 'Christine',
    lastName: 'Rau Jensen',
    fullName: 'Christine Rau Jensen',
  },
  {
    channel: '%jacob elk%',
    email: 'jacobkelk@gmail.com',
    firstName: 'Jacob',
    lastName: 'Elk',
    fullName: 'Jacob Elk',
  },
  {
    channel: 'gymstream',
    email: 'lars.borly@gmail.com',
    firstName: 'Lars',
    lastName: 'Borly',
    fullName: 'Lars Borly',
  },
  {
    channel: '%morten bonde%',
    email: 'mb@mortenbonde.dk',
    firstName: 'Morten',
    lastName: 'Bonde',
    fullName: 'Morten Bonde',
  },
  {
    channel: 'nuvenue',
    email: 'info@gottleben.com',
    firstName: 'Kaare',
    lastName: 'Thomsen',
    fullName: 'Kaare Thomsen',
  },
  {
    channel: 'gottleben',
    email: 'info@gottleben.com',
    firstName: 'Kaare',
    lastName: 'Thomsen',
    fullName: 'Kaare Thomsen',
  },
  {
    channel: 'tjelesvenner',
    firstName: 'Marie',
    lastName: 'Brixtofte',
    fullName: 'Marie Brixtofte',
  },
  {
    channel: 'mariebrixtofte',
    firstName: 'Marie',
    lastName: 'Brixtofte',
    fullName: 'Marie Brixtofte',
  },
  {
    channel: '%marner%',
    email: 'marner.michael@yahoo.com',
    firstName: 'Marner',
    lastName: 'Michael',
    fullName: 'Marner Michael',
  },
  {
    channel: '%hundedamen%',
    firstName: 'Christin',
    lastName: null,
    fullName: 'Christin',
  },
  {
    channel: '%kitnoergaard%',
    firstName: 'Kit',
    lastName: 'Nørgaard',
    fullName: 'Kit Nørgaard',
  },
];

async function ensureCreatorOwnersTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "creator_owners" (
      "id" text PRIMARY KEY NOT NULL,
      "creator_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
      "name" varchar(255) NOT NULL,
      "first_name" varchar(255),
      "last_name" varchar(255),
      "email" varchar(255),
      "phone" varchar(50),
      "created_at" timestamp with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp with time zone DEFAULT now() NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS "creator_owners_creator_id_unique" ON "creator_owners" ("creator_id");
    CREATE INDEX IF NOT EXISTS "creator_owners_name_idx" ON "creator_owners" ("name");
  `);
}

async function main() {
  console.log('Ensuring creator_owners table exists...');
  await ensureCreatorOwnersTable();

  console.log('Starting creator owners sync to creator_owners table...');
  const now = new Date();

  // 1. Sync specific known brand creators
  for (const item of CREATOR_OWNERS) {
    const filters = [ilike(creatorChannels.name, item.channel)];
    if (item.email) {
      filters.push(ilike(users.email, item.email));
    }

    const matchedUsers = await db
      .select({
        id: users.id,
        email: users.email,
        channelName: creatorChannels.name,
        currentFullName: users.fullName,
      })
      .from(users)
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .where(or(...filters));

    for (const u of matchedUsers) {
      // Upsert into creator_owners
      await db
        .insert(creatorOwners)
        .values({
          id: randomUUID(),
          creatorId: u.id,
          name: item.fullName,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email ?? u.email,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorOwners.creatorId,
          set: {
            name: item.fullName,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email ?? u.email,
            updatedAt: now,
          },
        });

      // Also update users table
      await db
        .update(users)
        .set({
          firstName: item.firstName,
          lastName: item.lastName,
          fullName: item.fullName,
          updatedAt: now,
        })
        .where(eq(users.id, u.id));

      console.log(
        `Synced creator_owners for ${u.email} (${u.channelName}): '${item.fullName}'`,
      );
    }
  }

  // 2. For any other creators without a creator_owners record, populate from their user record
  const allCreatorsWithoutOwner = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      fullName: users.fullName,
      channelName: creatorChannels.name,
      ownerId: creatorOwners.id,
    })
    .from(users)
    .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
    .leftJoin(creatorOwners, eq(creatorOwners.creatorId, users.id))
    .where(eq(users.role, 'creator'));

  for (const c of allCreatorsWithoutOwner) {
    if (!c.ownerId) {
      const fallbackName =
        c.fullName?.trim() ||
        [c.firstName, c.lastName].filter(Boolean).join(' ').trim() ||
        c.channelName?.trim() ||
        c.email;

      await db
        .insert(creatorOwners)
        .values({
          id: randomUUID(),
          creatorId: c.id,
          name: fallbackName,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing({ target: creatorOwners.creatorId });

      console.log(
        `Initialized default creator_owners for ${c.email}: '${fallbackName}'`,
      );
    }
  }

  console.log('Creator owners sync completed successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error during owner sync:', err);
  process.exit(1);
});
