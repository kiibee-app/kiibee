import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';

import { db } from '../db';
import {
  creatorBankAccounts,
  creatorChannels,
  creatorInfo,
  creatorPlans,
  plans,
  users,
} from '../schema';

const DEFAULT_PLAN_NAME = 'Pro';

const rawCreatorEmails = `
Email
jh@fysioteamet.dk
anders@kiibee.com
kari@flicflac.dk
cathrine.guldberg@gmail.com
malene@uffeholm.dk
marlene@microphone.dk
amin@aminjensen.dk
te@taniaellis.com
helle@praktiskpraksis.dk
kontakt@slankogwellness.dk
info@kiibee.dk
gitte@gittebsk.com
min@email.com
anders@kiibee.dk
min@mail.dk
a.halfter@gmail.com
tsj@automation-people.dk
slankogwellness9@gmail.com
elsebeth@global-partner.dk
info@elstudio.dk
jan.hansen@letsmove.dk
energicoaching@gmail.com
mb@mortenbonde.dk
arne.e@mail.dk
info@finddigikkeismerte.dk
kontakt@stopsygefravaer.nu
jacobkelk@gmail.com
betinaskou@gjesing.eu
birgitte@skolepsykologi.org
contact@adalfaragalla.com
tegnestuen@undertryk.dk
granli.velvaere@gmail.com
undertryk@gmail.com
boe@millfactory.dk
malene-kjaergaard@hotmail.com
kongsbak89@gmail.com
steffen@impulsmotion.dk
Christin@hundedamen.dk
medlemsservice.tjelesvenner@gmail.com
vig@lyngsgaard.com
chiefment@gmail.com
ilona@ilonamargibell.dk
mail@lindaandrews.dk
info@kiibee.com
signe@neslein.com
kristian@govideo.dk
book@nicolajlange.dk
halfters@gmail.com
jakob@kafekammas.dk
thomas@thomashartmann.dk
henrik.v.meyer@outlook.com
peter@fbi-productions.dk
bang@gnab.dk
tobiasdybvad@hotmail.com
mail@danandersen.dk
brianabekat@gmail.com
tanja.surmann@t-online.de
wivel1@mail.dk
jacobtingleff@gmail.com
andersfjelsted@gmail.com
tc@torbenchris.dk
eliasehlers@gmail.com
line.frkr@gmail.com
jacob-wilson@hotmail.com
sia@redbarnet.dk
omar@omarmarzouk.dk
info@gottleben.com
contact@henschel.dk
post@selbaek.dk
info@mccaffe.dk
lars.borly@gmail.com
tim@bentertained.dk
eva@fognoer.dk
mhs@vns.dk
fohlmann@fdr.dk
rikkenoehr@gmail.com
tekstfokus@tekstfokus.dk
info@kiropraktorsine.dk
galleribusk@gmail.com
info@a5forlag.dk
adhdfokus@aarhuspsykiatriklinik.dk
mp@michaelpedersen.dk
simon@simontalbot.dk
jannie.hvidberg@gmail.com
hej@linejl.dk
henrik@lawn.dk
allan@grevinderne.dk
camilla@familierfoedes.dk
per@vers.dk
info@kitnoergaard.dk
simone@damkjaermedier.dk
keckhausen@yahoo.com
pr@eventyrteatret.dk
mail@forlagetakka.dk
levnuditliv@gmail.com
christineraujensen@gmail.com
damkjaermedier@gmail.com
kontakt@cam-comm.dk
janni.soeberg@gmail.com
mail@bilplan.dk
jakob.prv@gmail.com
camillasolberg@hotmail.com
line@skolero.dk
hypnose@ivanjakobsen.dk
oliviamejer@gmail.com
tarangjasmin@gmail.com
mich314q@gmail.com
nicolas.halfter@gmail.com
info@fysioteamet.dk
hanna.siyum@gmail.com
ziadhamdan2907@gmail.com
annek47a@gmail.com
kenneth.hansen@dr.com
ana@xiia.dk
ana@steamgreen.dk
ali@xiia.dk
jwengjensen@outlook.dk
foersum@outlook.dk
annacosme@live.dk
nilaus87@gmail.com
tildekofoed@gmail.com
tine88rask@gmail.com
rikke@holms-vinotek.dk
ehmedeusseb@gmail.com
vogeltreatment@gmail.com
nethenomondedalgaard@gmail.com
kontakt@dahl-grp.dk
rachelrasmussen80@gmail.com
tljlykke@gmail.com
producent@vocalline.dk
ann.hvarregaard@gmail.com
laura@bareosto.dk
mads883n@gmail.com
annemoel@gmail.com
emilschoenfeld08@gmail.com
sallyrugholt@gmail.com
dianamyjak@hotmail.dk
morten@oreby.net
hellbithz@outllook.dk
mirnab@outlook.dk
niko04050607@gmail.com
tuutmut@yahoo.com
fbiundercover@hotmail.com
joanelise83@hotmail.com
rasmussenalex1812@gmail.com
`;

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function slugify(value: string): string {
  return normalizeEmail(value)
    .replace(/@/g, '-at-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function deterministicUuid(value: string): string {
  const hex = createHash('sha256').update(value).digest('hex');
  const uuidHex = `${hex.slice(0, 12)}4${hex.slice(13, 16)}8${hex.slice(
    17,
    20,
  )}${hex.slice(20, 32)}`;

  return [
    uuidHex.slice(0, 8),
    uuidHex.slice(8, 12),
    uuidHex.slice(12, 16),
    uuidHex.slice(16, 20),
    uuidHex.slice(20, 32),
  ].join('-');
}

function userUuidFromEmail(email: string): string {
  return deterministicUuid(`user:${normalizeEmail(email)}`);
}

function seedUuid(scope: string, email: string): string {
  return deterministicUuid(`${scope}:${normalizeEmail(email)}`);
}

function toTitleCase(value: string): string {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function getDisplayName(email: string): {
  firstName: string;
  lastName: string;
} {
  const localPart = email.split('@')[0] || 'creator';
  const parts = toTitleCase(localPart.replace(/\d+/g, ''))
    .split(' ')
    .filter(Boolean);

  return {
    firstName: parts[0] || 'Creator',
    lastName: parts.slice(1).join(' ') || 'Account',
  };
}

function parseCreatorEmails(): string[] {
  return rawCreatorEmails
    .trim()
    .split('\n')
    .slice(1)
    .map(normalizeEmail)
    .filter(Boolean);
}

export const seedCreatorAccounts = async () => {
  const emails = parseCreatorEmails();
  const creatorPasswordHash = process.env.CREATOR_SEED_PASSWORD_HASH?.trim();

  if (!creatorPasswordHash) {
    throw new Error(
      'Missing CREATOR_SEED_PASSWORD_HASH. Set it to a bcrypt password hash before running seedCreatorAccounts.',
    );
  }

  const [plan] = await db
    .select({ id: plans.id })
    .from(plans)
    .where(eq(plans.name, DEFAULT_PLAN_NAME))
    .limit(1);

  if (!plan) {
    throw new Error(
      `Missing plan "${DEFAULT_PLAN_NAME}". Run seedPlans before seedCreatorAccounts.`,
    );
  }

  for (const email of emails) {
    const { firstName, lastName } = getDisplayName(email);
    const slug = slugify(email);
    const userId = userUuidFromEmail(email);
    const fullName = [firstName, lastName].join(' ');
    const now = new Date();

    await db.transaction(async (tx) => {
      const [seededUser] = await tx
        .insert(users)
        .values({
          id: userId,
          email,
          firstName,
          lastName,
          fullName,
          role: 'creator',
          status: 'active',
          isEmailVerified: true,
          isActive: true,
          createdAt: now,
          updatedAt: now,
          passwordHash: creatorPasswordHash,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            firstName,
            lastName,
            fullName,
            role: 'creator',
            status: 'active',
            isEmailVerified: true,
            isActive: true,
            updatedAt: now,
          },
        })
        .returning({ id: users.id });

      const creatorId = seededUser.id;

      await tx
        .insert(creatorInfo)
        .values({
          id: seedUuid('creator-info', email),
          userId: creatorId,
          companyName: fullName,
          phone: '',
          cvr: '',
          address: '',
          city: '',
          postalCode: '',
          exampleWorkLink: '',
          contentDescription: 'Seeded creator account.',
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorInfo.userId,
          set: {
            companyName: fullName,
            contentDescription: 'Seeded creator account.',
            updatedAt: now,
          },
        });

      await tx
        .insert(creatorChannels)
        .values({
          id: seedUuid('creator-channel', email),
          creatorId,
          name: fullName,
          slug,
          description: 'Seeded creator channel.',
          bio: `Creator account for ${email}.`,
          themeColor: '#2563eb',
          isPublished: true,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorChannels.creatorId,
          set: {
            name: fullName,
            slug,
            description: 'Seeded creator channel.',
            bio: `Creator account for ${email}.`,
            themeColor: '#2563eb',
            isPublished: true,
            updatedAt: now,
          },
        });

      await tx
        .insert(creatorBankAccounts)
        .values({
          id: seedUuid('creator-bank', email),
          creatorId,
          bankName: 'Seed Bank',
          registrationNumber: '0000',
          accountNumber: '0000000000',
          isDefault: true,
          isVerified: false,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: creatorBankAccounts.creatorId,
          set: {
            bankName: 'Seed Bank',
            registrationNumber: '0000',
            accountNumber: '0000000000',
            isDefault: true,
            isVerified: false,
            updatedAt: now,
          },
        });

      await tx
        .insert(creatorPlans)
        .values({
          id: seedUuid('creator-plan', email),
          creatorId,
          planId: plan.id,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing({ target: creatorPlans.id });
    });
  }

  console.log(
    `Creator accounts seeded successfully (${emails.length} processed, existing data preserved)`,
  );
};
