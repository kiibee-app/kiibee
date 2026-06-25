import 'dotenv/config';
import { eq } from 'drizzle-orm';
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

const TEST_USER_ID = process.argv[3] ?? 'b4b73f4d-a825-49af-adad-f22d5ae7705c';
const REPORT_TYPES = ['overview', 'sales', 'form'] as const;

async function main() {
  const [user] = await db
    .select({
      email: users.email,
      fullName: users.fullName,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(eq(users.id, TEST_USER_ID))
    .limit(1);

  if (!user) {
    throw new Error(`User not found: ${TEST_USER_ID}`);
  }

  const [settings] = await db
    .select()
    .from(notificationSettings)
    .where(eq(notificationSettings.userId, TEST_USER_ID))
    .limit(1);

  const effectiveSettings = settings ?? {
    type: 'overview' as const,
    frequency: 'monthly' as const,
    recipient: 'account_email' as const,
    otherEmail: null,
  };

  const recipientEmail = resolveNotificationRecipientEmail(
    effectiveSettings.recipient,
    user.email,
    effectiveSettings.otherEmail,
  );

  if (!recipientEmail) {
    throw new Error(
      'Recipient is set to other email, but no other email is saved in notification settings.',
    );
  }

  const typeArg = process.argv[2] as (typeof REPORT_TYPES)[number] | undefined;
  const typesToSend =
    typeArg && REPORT_TYPES.includes(typeArg)
      ? [typeArg]
      : [effectiveSettings.type];

  const displayName = formatUserDisplayName(user);

  for (const type of typesToSend) {
    const variables = await buildNotificationReportVariables(
      TEST_USER_ID,
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

    console.log(
      `✓ ${type} report sent to ${recipientEmail} (${effectiveSettings.recipient})`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
