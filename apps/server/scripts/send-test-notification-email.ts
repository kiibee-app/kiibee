import 'dotenv/config';
import { eq, sql } from 'drizzle-orm';
import { db } from '../src/database/db';
import { notificationSettings, users } from '../src/database/schema';
import { sendTemplateEmail } from '../src/lib/sendTemplateEmail';
import { formatUserDisplayName } from '../src/modules/creator-users/creator-users.helper';
import {
  buildNotificationReportVariables,
  getNotificationMailSubject,
  getNotificationTemplateName,
  resolveNotificationRecipientEmail,
} from '../src/modules/notification-settings/buildNotificationReportData';

import {
  NOTIFICATION_FREQUENCY,
  NOTIFICATION_RECIPIENT,
  NOTIFICATION_TYPE,
} from '../src/utils/notificationSettings.constant';

const REPORT_TYPES = [
  NOTIFICATION_TYPE.OVERVIEW,
  NOTIFICATION_TYPE.SALES,
  NOTIFICATION_TYPE.FORM,
] as const;
type ReportType = (typeof REPORT_TYPES)[number];

const printUsage = () => {
  console.log(`
Usage:
  npx tsx scripts/send-test-notification-email.ts [report-type] <creator-email-or-id>

Examples:
  npx tsx scripts/send-test-notification-email.ts overview creator@example.com
  npx tsx scripts/send-test-notification-email.ts sales muksanaakter3@gmail.com
  npx tsx scripts/send-test-notification-email.ts form <user-uuid>
  npx tsx scripts/send-test-notification-email.ts overview   # uses saved settings type for given creator

Report types: overview | sales | form
`);
};

const findCreator = async (lookup: string) => {
  const value = lookup.trim();
  const isUuid = /^[0-9a-f-]{36}$/i.test(value);

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
    })
    .from(users)
    .where(
      isUuid
        ? eq(users.id, value)
        : sql`lower(${users.email}) = lower(${value})`,
    )
    .limit(1);

  if (!user || user.role !== 'creator') {
    return null;
  }

  return user;
};

const listCreators = async () => {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.role, 'creator'))
    .limit(20);

  if (rows.length === 0) {
    console.log('No creators found in this database.');
    return;
  }

  console.log('Available creators in this database:\n');
  for (const row of rows) {
    const name = formatUserDisplayName(row);
    console.log(`  • ${row.email}`);
    console.log(`    id: ${row.id}${name !== row.email ? ` (${name})` : ''}\n`);
  }
};

async function main() {
  const args = process.argv.slice(2).filter(Boolean);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    return;
  }

  let reportType: ReportType | undefined;
  let creatorLookup: string | undefined;

  for (const arg of args) {
    if (REPORT_TYPES.includes(arg as ReportType)) {
      reportType = arg as ReportType;
      continue;
    }

    creatorLookup = arg;
  }

  if (!creatorLookup) {
    printUsage();
    console.error('Error: creator email or user id is required.\n');
    await listCreators();
    process.exit(1);
  }

  const user = await findCreator(creatorLookup);

  if (!user) {
    console.error(`Error: creator not found for "${creatorLookup}".\n`);
    await listCreators();
    process.exit(1);
  }

  const [settings] = await db
    .select()
    .from(notificationSettings)
    .where(eq(notificationSettings.userId, user.id))
    .limit(1);

  const effectiveSettings = settings ?? {
    type: NOTIFICATION_TYPE.OVERVIEW,
    frequency: NOTIFICATION_FREQUENCY.MONTHLY,
    recipient: NOTIFICATION_RECIPIENT.ACCOUNT_EMAIL,
    otherEmail: null,
  };

  const recipientEmail = resolveNotificationRecipientEmail(
    effectiveSettings.recipient,
    user.email,
    effectiveSettings.otherEmail,
  );

  if (!recipientEmail) {
    throw new Error(
      `Creator "${user.email}" has recipient set to other email, but no other email is saved. Update Settings → Notifications first.`,
    );
  }

  const typesToSend = reportType ? [reportType] : [effectiveSettings.type];
  const displayName = formatUserDisplayName(user);

  console.log(`Creator: ${user.email} (${user.id})`);
  console.log(`Sending to: ${recipientEmail} [${effectiveSettings.recipient}]`);
  console.log(`Report type(s): ${typesToSend.join(', ')}\n`);

  for (const type of typesToSend) {
    const variables = await buildNotificationReportVariables(
      user.id,
      type,
      effectiveSettings.frequency,
      displayName,
    );

    const sent = await sendTemplateEmail({
      to: recipientEmail,
      subject: getNotificationMailSubject(
        type,
        variables.periodLabel as string,
      ),
      templateName: getNotificationTemplateName(type),
      variables,
    });

    if (!sent) {
      console.error(`Failed to send ${type} report email.`);
      process.exit(1);
    }

    console.log(`✓ ${type} report sent to ${recipientEmail}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
