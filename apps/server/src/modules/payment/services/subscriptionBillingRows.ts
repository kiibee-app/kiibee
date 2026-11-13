import { sql } from 'drizzle-orm';
import { db } from 'src/database/db';

export async function subscriptionBillingRows(
  page: number,
  creatorId?: string,
  pattern?: string,
  database: Pick<typeof db, 'execute'> = db,
) {
  const result = await database.execute(sql`
    WITH billing AS (
      SELECT h.id, h.creator_id, h.transaction_id AS reference,
        coalesce(p.name, h.subscription_id) AS description,
        h.amount, h.currency, h.status, h.payment_method_type AS method,
        h.created_at, NULL::text AS email_status, NULL::timestamp AS email_sent_at
      FROM subscription_payments_history h
      LEFT JOIN subscriptions s ON s.id = h.subscription_id
      LEFT JOIN plans p ON p.id = s.plan_id
      WHERE NOT EXISTS (
        SELECT 1 FROM admin_billing_requests r
        WHERE r.creator_id = h.creator_id AND r.transaction_id = h.transaction_id
      )
      UNION ALL
      SELECT r.id, r.creator_id, r.transaction_id, r.plan_name,
        r.amount, r.currency, r.status, (SELECT h.payment_method_type FROM subscription_payments_history h WHERE h.creator_id = r.creator_id AND h.transaction_id = r.transaction_id LIMIT 1), r.created_at,
        r.email_status, r.email_sent_at
      FROM admin_billing_requests r
    )
    SELECT b.id, u.email, c.company_name AS "companyName", b.reference,
      b.description, b.amount, b.currency, b.status, b.method,
      b.created_at AS "createdAt", b.email_status AS "emailStatus", b.email_sent_at AS "emailSentAt"
    FROM billing b
    LEFT JOIN users u ON u.id = b.creator_id
    LEFT JOIN creator_info c ON c.user_id = b.creator_id
    WHERE ${creatorId ? sql`b.creator_id = ${creatorId}` : sql`true`}
      AND ${pattern ? sql`(u.full_name ILIKE ${pattern} OR concat_ws(' ', u.first_name, u.last_name) ILIKE ${pattern} OR u.email ILIKE ${pattern} OR c.company_name ILIKE ${pattern} OR b.reference ILIKE ${pattern} OR b.description ILIKE ${pattern})` : sql`true`}
    ORDER BY b.created_at DESC, b.id DESC
    LIMIT 21 OFFSET ${(page - 1) * 20}
  `);
  return result.rows;
}
