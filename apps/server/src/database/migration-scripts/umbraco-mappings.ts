/**
 * Umbraco CMS → Kiibee Database Field Mappings
 *
 * Actual Umbraco content tree structure (from CMS admin panel):
 *
 *   Kiibee (root)
 *   ├── Settings
 *   ├── Admin
 *   ├── Uffe Holm (creator node)
 *   │   ├── Stats
 *   │   ├── Log
 *   │   ├── Invoices
 *   │   ├── Payouts
 *   │   ├── Purchases
 *   │   │   └── n7a208052026233830 (purchase record)
 *   │   │       → Name, Email, Video ID, Price, Message, ExpireDate, Downloads, Streams
 *   │   ├── Subscribers
 *   │   └── Shows
 *   │       └── "Uffe Holm InstaChamp" (media item)
 *   │           → Type, Video ID, Video Status, Video Size, Thumbnail URL,
 *   │             Download URL, Trailer, WebContent URL, Hidden, Order ID
 *   ├── Microphone Entertainment (creator node)
 *   └── ... more creators
 *
 * All data stored in Umbraco EAV tables:
 *   - umbracoNode (tree hierarchy)
 *   - cmsContent (content items)
 *   - cmsPropertyData (field values via cmsPropertyType.alias)
 *
 * Videos hosted on Cloudflare Stream (videodelivery.net/{streamId}/...).
 */

// ─── HELPER: EAV Property Join ───────────────────────────────────────────
const propJoin = (alias: string, prefix: string) => `
  LEFT JOIN cmsPropertyData pd_${prefix}
    ON pd_${prefix}.contentNodeId = c.nodeId
    AND pd_${prefix}.propertytypeId = (
      SELECT TOP 1 pt.id FROM cmsPropertyType pt WHERE pt.alias = '${alias}'
    )
`;

const propVal = (prefix: string, column = 'dataNvarchar') =>
  `pd_${prefix}.${column}`;

// ─── 1. CREATORS ─────────────────────────────────────────────────────────
// Top-level content nodes under the Kiibee root
// → Kiibee: users (role='creator') + creator_channels + creator_info
export const CREATOR_QUERY = `
  SELECT
    n.id                          AS umbraco_node_id,
    n.text                        AS creator_name,
    n.sortOrder                   AS sort_order,
    n.createDate                  AS created_at,
    n.path                        AS node_path
  FROM umbracoNode n
  INNER JOIN cmsContent c ON c.nodeId = n.id
  INNER JOIN cmsContentType ct ON ct.nodeId = c.contentType
  WHERE n.parentID = (
    SELECT TOP 1 id FROM umbracoNode WHERE text = 'Kiibee' AND level = 1
  )
  AND n.trashed = 0
  AND n.text NOT IN ('Settings', 'Admin')
  ORDER BY n.sortOrder
`;

// ─── 2. SHOWS (Media Files) ──────────────────────────────────────────────
// Children of "Shows" folder under each creator
// → Kiibee: media_files + cloud_storage_files
export const SHOWS_QUERY = `
  SELECT
    c.nodeId                                AS umbraco_node_id,
    n.text                                  AS title,
    n.parentID                              AS parent_node_id,
    n.sortOrder                             AS sort_order,
    n.createDate                            AS created_at,
    n.trashed                               AS is_trashed,
    creator_node.id                         AS creator_node_id,
    creator_node.text                       AS creator_name,
    ${propVal('type')}                      AS content_type,
    ${propVal('videoId')}                   AS video_id,
    ${propVal('videoStatus')}               AS video_status,
    ${propVal('videoSize')}                 AS video_size,
    ${propVal('videoThumbnailUrl')}         AS thumbnail_url,
    ${propVal('videoDownloadUrl')}          AS download_url,
    ${propVal('trailer')}                   AS trailer_url,
    ${propVal('webContentUrl')}             AS web_content_url,
    ${propVal('hidden')}                    AS is_hidden,
    ${propVal('orderId')}                   AS order_id
  FROM cmsContent c
  INNER JOIN umbracoNode n ON n.id = c.nodeId
  INNER JOIN umbracoNode shows_folder ON shows_folder.id = n.parentID
    AND shows_folder.text = 'Shows'
  INNER JOIN umbracoNode creator_node ON creator_node.id = shows_folder.parentID
  ${propJoin('type', 'type')}
  ${propJoin('videoId', 'videoId')}
  ${propJoin('videoStatus', 'videoStatus')}
  ${propJoin('videoSize', 'videoSize')}
  ${propJoin('videoThumbnailUrl', 'videoThumbnailUrl')}
  ${propJoin('videoDownloadUrl', 'videoDownloadUrl')}
  ${propJoin('trailer', 'trailer')}
  ${propJoin('webContentUrl', 'webContentUrl')}
  ${propJoin('hidden', 'hidden')}
  ${propJoin('orderId', 'orderId')}
  WHERE n.trashed = 0
  ORDER BY creator_node.id, n.sortOrder
`;

// ─── 3. PURCHASES ────────────────────────────────────────────────────────
// Children of "Purchases" folder under each creator
// → Kiibee: orders + order_items + user_content_access
export const PURCHASES_QUERY = `
  SELECT
    c.nodeId                                  AS umbraco_node_id,
    n.text                                    AS purchase_id,
    n.createDate                              AS created_at,
    creator_node.id                           AS creator_node_id,
    creator_node.text                         AS creator_name,
    ${propVal('purchase')}                    AS is_purchase,
    ${propVal('videoId')}                     AS video_id,
    ${propVal('name')}                        AS customer_name,
    ${propVal('email')}                       AS customer_email,
    ${propVal('price')}                       AS price,
    ${propVal('message', 'dataNtext')}        AS message,
    ${propVal('expireDate')}                  AS expire_date,
    ${propVal('downloads')}                   AS downloads,
    ${propVal('streams')}                     AS streams
  FROM cmsContent c
  INNER JOIN umbracoNode n ON n.id = c.nodeId
  INNER JOIN umbracoNode purchases_folder ON purchases_folder.id = n.parentID
    AND purchases_folder.text = 'Purchases'
  INNER JOIN umbracoNode creator_node ON creator_node.id = purchases_folder.parentID
  ${propJoin('purchase', 'purchase')}
  ${propJoin('videoId', 'videoId')}
  ${propJoin('name', 'name')}
  ${propJoin('email', 'email')}
  ${propJoin('price', 'price')}
  ${propJoin('message', 'message')}
  ${propJoin('expireDate', 'expireDate')}
  ${propJoin('downloads', 'downloads')}
  ${propJoin('streams', 'streams')}
  WHERE n.trashed = 0
  ORDER BY n.createDate DESC
`;

// ─── 4. SUBSCRIBERS ──────────────────────────────────────────────────────
// Children of "Subscribers" folder under each creator
// → Kiibee: email_subscribers
export const SUBSCRIBERS_QUERY = `
  SELECT
    c.nodeId                                AS umbraco_node_id,
    n.text                                  AS subscriber_id,
    n.createDate                            AS created_at,
    creator_node.id                         AS creator_node_id,
    creator_node.text                       AS creator_name,
    ${propVal('name')}                      AS subscriber_name,
    ${propVal('email')}                     AS subscriber_email
  FROM cmsContent c
  INNER JOIN umbracoNode n ON n.id = c.nodeId
  INNER JOIN umbracoNode sub_folder ON sub_folder.id = n.parentID
    AND sub_folder.text = 'Subscribers'
  INNER JOIN umbracoNode creator_node ON creator_node.id = sub_folder.parentID
  ${propJoin('name', 'name')}
  ${propJoin('email', 'email')}
  WHERE n.trashed = 0
  ORDER BY n.createDate DESC
`;

// ─── 5. INVOICES ─────────────────────────────────────────────────────────
// Children of "Invoices" folder under each creator
// → Kiibee: subscription_invoices
export const INVOICES_QUERY = `
  SELECT
    c.nodeId                                AS umbraco_node_id,
    n.text                                  AS invoice_label,
    n.createDate                            AS created_at,
    creator_node.id                         AS creator_node_id,
    creator_node.text                       AS creator_name
  FROM cmsContent c
  INNER JOIN umbracoNode n ON n.id = c.nodeId
  INNER JOIN umbracoNode inv_folder ON inv_folder.id = n.parentID
    AND inv_folder.text = 'Invoices'
  INNER JOIN umbracoNode creator_node ON creator_node.id = inv_folder.parentID
  WHERE n.trashed = 0
  ORDER BY n.createDate DESC
`;

// ─── 6. PAYOUTS ──────────────────────────────────────────────────────────
// Children of "Payouts" folder under each creator
// → Kiibee: creator_payouts
export const PAYOUTS_QUERY = `
  SELECT
    c.nodeId                                AS umbraco_node_id,
    n.text                                  AS payout_label,
    n.createDate                            AS created_at,
    creator_node.id                         AS creator_node_id,
    creator_node.text                       AS creator_name
  FROM cmsContent c
  INNER JOIN umbracoNode n ON n.id = c.nodeId
  INNER JOIN umbracoNode pay_folder ON pay_folder.id = n.parentID
    AND pay_folder.text = 'Payouts'
  INNER JOIN umbracoNode creator_node ON creator_node.id = pay_folder.parentID
  WHERE n.trashed = 0
  ORDER BY n.createDate DESC
`;

// ─── FIELD MAP: Show → media_files ───────────────────────────────────────
export function mapShowToMediaFile(row: Record<string, unknown>) {
  const videoId = row.video_id as string | null;
  const thumbnailUrl =
    (row.thumbnail_url as string) ||
    (videoId
      ? `https://videodelivery.net/${videoId}/thumbnails/thumbnail.jpg`
      : null);
  const downloadUrl =
    (row.download_url as string) ||
    (videoId
      ? `https://videodelivery.net/${videoId}/downloads/default.mp4`
      : null);

  const contentType = ((row.content_type as string) || 'video').toLowerCase();
  const fileTypeMap: Record<string, string> = {
    video: 'video',
    audio: 'audio',
    pdf: 'pdf',
    epub: 'epub',
    webcontent: 'web',
  };

  return {
    title: row.title as string,
    slug: slugify(row.title as string),
    fileType: fileTypeMap[contentType] || 'video',
    fileSize: row.video_size ? parseInt(row.video_size as string, 10) : null,
    thumbnailUrl,
    trailerUrl: (row.trailer_url as string) || null,
    videoDownloadUrl: downloadUrl,
    webContentUrl: (row.web_content_url as string) || null,
    cloudflareStreamId: videoId,
    videoStatus: (row.video_status as string) || null,
    visibility:
      row.is_hidden === '1' ? ('hidden' as const) : ('public' as const),
    accessType: 'paid' as const,
    isPublished: true,
    sortOrder: row.sort_order ? parseInt(row.sort_order as string, 10) : 0,
    legacyUmbracoId: row.umbraco_node_id as number,
    legacyCloudflareUrl: downloadUrl,
  };
}

// ─── FIELD MAP: Purchase → orders + order_items ──────────────────────────
export function mapPurchaseToOrder(row: Record<string, unknown>) {
  const expireDate = row.expire_date as string | null;
  const isPurchase = !expireDate;

  return {
    order: {
      orderNumber: row.purchase_id as string,
      totalAmount: row.price as string,
      currency: 'DKK',
      status: 'completed' as const,
    },
    orderItem: {
      itemType: isPurchase ? ('purchase' as const) : ('rental' as const),
      price: row.price as string,
      rentExpiresAt: expireDate ? new Date(expireDate) : null,
    },
    customer: {
      name: row.customer_name as string,
      email: row.customer_email as string,
    },
    videoId: row.video_id as string,
    stats: {
      downloads: parseInt((row.downloads as string) || '0', 10),
      streams: parseInt((row.streams as string) || '0', 10),
    },
    legacyUmbracoId: row.umbraco_node_id as number,
  };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'oe')
    .replace(/[å]/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── MIGRATION ORDER ─────────────────────────────────────────────────────
export const MIGRATION_ORDER = [
  'creators',
  'shows',
  'purchases',
  'subscribers',
  'invoices',
  'payouts',
] as const;

export type MigrationEntity = (typeof MIGRATION_ORDER)[number];
