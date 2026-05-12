/**
 * Umbraco CMS → Kiibee Database Field Mappings
 *
 * This file documents the exact mapping between old Umbraco SQL Server tables
 * and new Kiibee PostgreSQL tables. Used by the migration runner.
 *
 * Source: Umbraco CMS (SQL Server) + Cloudflare (media files)
 * Target: Kiibee (DigitalOcean PostgreSQL + DigitalOcean Spaces)
 */

// ─── USERS ───────────────────────────────────────────────────────────────
// Umbraco: umbracoUser + cmsMember + umbracoNode
// Kiibee:  users + user_profiles
export const USER_MAPPING = {
  source: {
    tables: ['umbracoUser', 'cmsMember', 'umbracoNode'],
    query: `
      SELECT
        u.id                    AS umbraco_id,
        u.userEmail             AS email,
        m.Password              AS password_hash,
        u.UserName              AS full_name,
        u.userLogin             AS login_name,
        u.userDisabled          AS is_disabled,
        u.userLanguage          AS language,
        u.createDate            AS created_at,
        u.updateDate            AS updated_at,
        u.avatar                AS avatar_url,
        u.emailConfirmedDate    AS email_confirmed_at,
        ug.userGroupAlias       AS role_alias
      FROM umbracoUser u
      LEFT JOIN cmsMember m ON m.nodeId = (
        SELECT TOP 1 n.id FROM umbracoNode n
        WHERE n.text = u.UserName AND n.nodeObjectType = 'MEMBER_OBJECT_TYPE'
      )
      LEFT JOIN umbracoUser2UserGroup u2g ON u2g.userId = u.id
      LEFT JOIN umbracoUserGroup ug ON ug.id = u2g.userGroupId
    `,
  },
  target: 'users',
  fieldMap: {
    umbraco_id: 'legacyUmbracoId',
    email: 'email',
    password_hash: 'passwordHash', // Note: Umbraco uses different hashing, may need rehash
    full_name: 'fullName',
    is_disabled: (val: boolean) => ({ isActive: !val }),
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    avatar_url: 'avatarUrl',
    email_confirmed_at: (val: string | null) => ({
      isEmailVerified: val !== null,
    }),
    role_alias: (val: string) => ({
      role: mapUmbracoRole(val),
    }),
  },
} as const;

// ─── CONTENT / MEDIA FILES ──────────────────────────────────────────────
// Umbraco: cmsContent + cmsDocument + cmsPropertyData + cmsContentType + umbracoNode
// Kiibee:  media_files
export const MEDIA_FILE_MAPPING = {
  source: {
    tables: [
      'cmsContent',
      'cmsDocument',
      'cmsPropertyData',
      'cmsContentType',
      'umbracoNode',
    ],
    query: `
      SELECT
        c.nodeId                AS umbraco_node_id,
        n.text                  AS title,
        n.path                  AS node_path,
        n.sortOrder             AS sort_order,
        n.trashed               AS is_trashed,
        d.published             AS is_published,
        d.updateDate            AS updated_at,
        d.releaseDate           AS published_at,
        ct.alias                AS content_type_alias,
        -- Property data extracted via pivoting
        pd_file.dataNtext       AS file_url,
        pd_desc.dataNtext       AS description,
        pd_thumb.dataNtext      AS thumbnail_url
      FROM cmsContent c
      INNER JOIN umbracoNode n ON n.id = c.nodeId
      INNER JOIN cmsDocument d ON d.nodeId = c.nodeId AND d.newest = 1
      INNER JOIN cmsContentType ct ON ct.nodeId = c.contentType
      LEFT JOIN cmsPropertyData pd_file ON pd_file.contentNodeId = c.nodeId
        AND pd_file.propertytypeId = (
          SELECT id FROM cmsPropertyType WHERE alias = 'umbracoFile'
        )
      LEFT JOIN cmsPropertyData pd_desc ON pd_desc.contentNodeId = c.nodeId
        AND pd_desc.propertytypeId = (
          SELECT id FROM cmsPropertyType WHERE alias = 'description'
        )
      LEFT JOIN cmsPropertyData pd_thumb ON pd_thumb.contentNodeId = c.nodeId
        AND pd_thumb.propertytypeId = (
          SELECT id FROM cmsPropertyType WHERE alias = 'thumbnail'
        )
      WHERE n.nodeObjectType = 'C66BA18E-EAF3-4CFF-8A22-41B16D66A972' -- Media type
    `,
  },
  target: 'media_files',
  fieldMap: {
    umbraco_node_id: 'legacyUmbracoId',
    title: 'title',
    description: 'description',
    file_url: 'legacyCloudflareUrl', // Original Cloudflare URL, will be migrated
    thumbnail_url: 'thumbnailUrl',
    sort_order: 'sortOrder',
    is_published: 'isPublished',
    published_at: 'publishedAt',
    is_trashed: (val: boolean) => ({ isDeleted: val }),
    content_type_alias: (val: string) => ({
      fileType: mapUmbracoContentType(val),
    }),
  },
} as const;

// ─── TAGS ────────────────────────────────────────────────────────────────
// Umbraco: cmsTags
// Kiibee:  tags
export const TAG_MAPPING = {
  source: {
    tables: ['cmsTags'],
    query: `SELECT id, tag, [group] AS tag_group FROM cmsTags`,
  },
  target: 'tags',
  fieldMap: {
    id: 'legacyUmbracoId',
    tag: 'name',
    // slug is auto-generated from name during migration
  },
} as const;

// ─── TAG RELATIONS ──────────────────────────────────────────────────────
// Umbraco: cmsTagRelationship
// Kiibee:  media_file_tags
export const TAG_RELATION_MAPPING = {
  source: {
    tables: ['cmsTagRelationship'],
    query: `SELECT nodeId, tagId FROM cmsTagRelationship`,
  },
  target: 'media_file_tags',
  fieldMap: {
    nodeId: 'mediaFileId', // resolved via legacy_umbraco_id lookup
    tagId: 'tagId', // resolved via legacy_umbraco_id lookup
  },
} as const;

// ─── CLOUDFLARE MEDIA FILES ─────────────────────────────────────────────
// Source: Cloudflare R2 / CDN
// Target: cloud_storage_files + DigitalOcean Spaces
export const CLOUDFLARE_MEDIA_MAPPING = {
  description: `
    For each media_file with a legacy_cloudflare_url:
    1. Fetch file from Cloudflare using API token
    2. Upload to DigitalOcean Spaces bucket
    3. Create cloud_storage_files record with:
       - storage_provider = 'do_spaces'
       - bucket = DO_SPACES_BUCKET
       - storage_key = generated path (e.g. 'media/{creator_id}/{file_id}/{filename}')
       - cdn_url = DO_SPACES_CDN_URL + storage_key
       - is_migrated = true
       - migrated_from_url = original Cloudflare URL
    4. Update media_file.file_url to new DO Spaces CDN URL
  `,
  cloudflareApi: {
    listObjects:
      'https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets/{bucket}/objects',
    getObject:
      'https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets/{bucket}/objects/{key}',
  },
} as const;

// ─── HELPERS ─────────────────────────────────────────────────────────────

function mapUmbracoRole(alias: string): string {
  const roleMap: Record<string, string> = {
    admin: 'admin',
    editor: 'creator',
    writer: 'creator',
    translator: 'creator',
    sensitiveData: 'admin',
  };
  return roleMap[alias] || 'viewer';
}

function mapUmbracoContentType(alias: string): string {
  const typeMap: Record<string, string> = {
    umbracoMediaVideo: 'video',
    umbracoMediaAudio: 'audio',
    Image: 'web', // images treated as web content
    File: 'pdf', // generic files default to PDF
    umbracoMediaArticle: 'epub',
  };
  return typeMap[alias] || 'video';
}

export const MIGRATION_ORDER = [
  'tags',
  'content_categories',
  'content_types',
  'users',
  'media_files',
  'collections',
  'tag_relations',
  'cloudflare_media',
] as const;
