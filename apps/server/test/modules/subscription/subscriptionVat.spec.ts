import fs from 'fs';
import path from 'path';
import {
  addSubscriptionVat,
  subscriptionVatEmail,
} from 'src/utils/subscriptionVat';
import {
  subscriptionTerms,
  validateSubscriptionOverrides,
} from 'src/modules/subscription/services/subscriptionTerms';
import { calculatePayoutFees } from 'src/utils/payoutFees';
import { renderTemplate } from 'src/lib/renderTemplate';

describe('creator subscriptions excluding 25% VAT', () => {
  it.each([
    [129, 32.25, 161.25],
    [474, 118.5, 592.5],
    [399, 99.75, 498.75],
    [0, 0, 0],
  ])('adds VAT to %s DKK', (subtotal, vatAmount, total) => {
    expect(addSubscriptionVat(subtotal)).toMatchObject({
      subtotal,
      vatAmount,
      total,
      totalMinor: total * 100,
    });
    expect(subscriptionTerms(subtotal)).toMatchObject({
      subtotal,
      vatAmount,
      amount: total,
      minorAmount: total * 100,
    });
  });
  it('adds VAT once to the total custom six-month price', () => {
    expect(
      subscriptionTerms(129, { customPrice6: 474, paymentPeriod: '6' }),
    ).toMatchObject({
      months: 6,
      subtotal: 474,
      vatAmount: 118.5,
      amount: 592.5,
      minorAmount: 59250,
    });
  });
  it.each(['subscriptionActivated', 'subscriptionManualPayment'])(
    'renders a real %s email with subtotal, VAT and total',
    (name) => {
      const source = fs.readFileSync(
        path.resolve(__dirname, '../../../src/templates', name + '.html'),
        'utf8',
      );
      const html = renderTemplate(source, {
        creator: { fullName: 'Test Creator' },
        planName: 'Pro',
        amount: '161.25',
        currency: 'DKK',
        ...subscriptionVatEmail(addSubscriptionVat(129)),
      });
      expect(html).toContain('129.00 DKK');
      expect(html).toContain('32.25 DKK');
      expect(html).toContain('161.25 DKK');
      expect(html).toContain('25% moms');
      expect(html).not.toContain('{{');
    },
  );
  it('does not invent VAT on legacy checkouts with no tax snapshot', () => {
    expect(subscriptionVatEmail({})).toEqual({});
  });
});
describe('Kiibee percentage cut', () => {
  it('takes 20% of 1000 DKK, plus the separate 2% transaction fee', () => {
    expect(
      calculatePayoutFees({
        amount: 1000,
        basePlanPrice: 129,
        platformFeePct: 20,
        transactionFeePct: 2,
      }),
    ).toMatchObject({
      platformFeePercentage: 0.2,
      platformFee: 200,
      processingFee: 20,
      payableAmount: 780,
      fixedPlatformFee: null,
    });
  });
  it('allows a zero percent override and gives it priority over a legacy DKK fee', () => {
    expect(
      calculatePayoutFees({
        amount: 1000,
        basePlanPrice: 129,
        platformFeePct: 0,
        fixedPlatformFee: 20,
      }),
    ).toMatchObject({ platformFee: 0, platformFeePercentage: 0 });
  });
  it.each([-1, 101, NaN])('rejects invalid cut %s', (platformFeePct) => {
    expect(() =>
      calculatePayoutFees({ amount: 1000, basePlanPrice: 129, platformFeePct }),
    ).toThrow();
    expect(() =>
      validateSubscriptionOverrides({ customKiibeeCutPct: platformFeePct }),
    ).toThrow();
  });
  it('charges legacy DKK fees per sale until a percentage is saved', () => {
    expect(
      calculatePayoutFees({
        amount: 1000,
        basePlanPrice: 129,
        fixedPlatformFee: 20,
        saleCount: 1,
      }),
    ).toMatchObject({ platformFee: 20, platformFeePercentage: 0 });
  });
});
