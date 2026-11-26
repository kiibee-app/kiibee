import {
  resolvePayoutBankDetails,
  payoutBankEmailVariables,
} from 'src/utils/payoutBankDetails';
import { renderTemplate } from 'src/lib/renderTemplate';
import fs from 'fs';
import path from 'path';
const bank = {
  bankName: 'Demo Bank',
  accountHolderName: 'Demo Creator',
  registrationNumber: '1234',
  accountNumber: '0012345678',
};
it('keeps the recorded payout bank instead of later account changes', () => {
  expect(
    resolvePayoutBankDetails(JSON.stringify(bank), {
      ...bank,
      accountNumber: '9999',
    }),
  ).toEqual(bank);
});
it('uses the selected account when no snapshot is available', () => {
  expect(resolvePayoutBankDetails(null, bank)).toEqual(bank);
  expect(resolvePayoutBankDetails('old opaque bank description', bank)).toEqual(
    bank,
  );
});
it('does not invent bank information when no bank account was selected', () => {
  expect(resolvePayoutBankDetails(null, null)).toBeNull();
  expect(payoutBankEmailVariables(null).accountNumber).toBe('Ikke oplyst');
});
it('renders all bank fields in the Danish payout email and escapes account holder names', () => {
  const template = fs.readFileSync(
    path.join(__dirname, '../../../src/templates/approvedPayout.html'),
    'utf8',
  );
  const html = renderTemplate(template, {
    creator: { fullName: 'Demo' },
    payoutId: 'demo',
    rawAmount: '1425',
    processingFee: '85.50',
    platformFee: '570',
    payableAmount: '769.50',
    currency: 'DKK',
    bank: payoutBankEmailVariables({
      ...bank,
      accountHolderName: '<Demo & Co>',
    }),
  });
  for (const value of [
    'Bankoplysninger',
    'Kontohaver',
    '1234',
    '0012345678',
    'Demo Bank',
    '&lt;Demo &amp; Co&gt;',
  ])
    expect(html).toContain(value);
  expect(html).not.toContain('{{');
});
