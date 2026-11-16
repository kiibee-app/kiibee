import fs from 'fs';
import path from 'path';
import { templateName } from 'src/utils/mailServiceConstant';
import { sendTemplateEmail } from 'src/lib/sendTemplateEmail';
import { sendEmailWithRetry } from 'src/lib/sendWithRetry';

jest.mock('src/lib/sendWithRetry', () => ({
  sendEmailWithRetry: jest.fn().mockResolvedValue(true),
}));

describe('subscription email template files', () => {
  beforeEach(() => jest.clearAllMocks());
  it.each(
    Object.values(templateName).filter((name) =>
      name.startsWith('subscription'),
    ),
  )('%s exists in the actual source tree', (name) => {
    const html = fs.readFileSync(
      path.resolve(__dirname, '../../src/templates', `${name}.html`),
      'utf8',
    );
    expect(html).toContain('<html');
  });
  it('renders a real plan-change email and forwards the CC without sending mail', async () => {
    await expect(
      sendTemplateEmail({
        to: 'creator@example.com',
        cc: 'info@kiibee.com',
        subject: 'Plan changed',
        templateName: templateName.SUBSCRIPTION_PLAN_CHANGED,
        variables: {
          creator: { fullName: 'Test Creator' },
          previousPlanName: 'Try Kiibee',
          planName: 'Start-up',
        },
      }),
    ).resolves.toBe(true);
    expect(sendEmailWithRetry).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'creator@example.com',
        cc: 'info@kiibee.com',
        html: expect.stringContaining('Ny plan: <strong>Start-up</strong>'),
      }),
    );
    const html = jest.mocked(sendEmailWithRetry).mock.calls[0][0].html;
    expect(html).toContain('Tidligere plan: <strong>Try Kiibee</strong>');
    expect(html).not.toContain('{{');
  });
});
