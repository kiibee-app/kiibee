import 'dotenv/config';
import { sendTemplateEmail } from '../src/lib/sendTemplateEmail';
import {
  buildNotificationReportVariables,
  getNotificationMailSubject,
  getNotificationTemplateName,
} from '../src/modules/notification-settings/buildNotificationReportData';

const TEST_USER_ID = 'b4b73f4d-a825-49af-adad-f22d5ae7705c';
const TEST_EMAIL = 'muksanaakter3@gmail.com';
const TEST_NAME = 'Muksana';

const REPORT_TYPES = ['overview', 'sales', 'form'] as const;

async function main() {
  const typeArg = process.argv[2] as (typeof REPORT_TYPES)[number] | undefined;
  const typesToSend =
    typeArg && REPORT_TYPES.includes(typeArg) ? [typeArg] : [...REPORT_TYPES];

  for (const type of typesToSend) {
    const variables = await buildNotificationReportVariables(
      TEST_USER_ID,
      type,
      'monthly',
      TEST_NAME,
    );

    const sent = await sendTemplateEmail({
      to: TEST_EMAIL,
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

    console.log(`✓ ${type} report sent to ${TEST_EMAIL}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
