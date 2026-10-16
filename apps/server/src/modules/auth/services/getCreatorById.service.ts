import { HttpException, HttpStatus } from '@nestjs/common';
import { and, eq, or, sql } from 'drizzle-orm';
import { db } from 'src/database/db';
import {
  contentAppearance,
  creatorApplicationRequests,
  creatorBankAccounts,
  creatorChannels,
  creatorInfo,
  creatorOwners,
  creatorPlans,
  emailSubscribers,
  mediaFiles,
  plans,
  users,
} from 'src/database/schema';
import { logger } from 'src/logger/logger';
import { ROLE } from 'src/utils/constant';
import { fail, success } from 'src/utils/sendResponse';

export const getCreatorByIdService = async (creatorId: string) => {
  try {
    const uploadCountSql = sql<number>`
      COUNT(DISTINCT ${mediaFiles.id})::int
    `;
    const subscriberCountSql = sql<number>`
      COUNT(DISTINCT ${emailSubscribers.id})::int
    `;
    const planNameSql = sql<string | null>`MAX(${plans.name})`;
    const ownerNameSql = sql<string | null>`
      COALESCE(
        NULLIF(TRIM(MAX(${creatorOwners.name})), ''),
        NULLIF(
          CASE 
            WHEN LOWER(TRIM(MAX(${creatorBankAccounts.accountHolderName}))) IN ('seed bank', 'null') 
              OR MAX(${creatorBankAccounts.accountHolderName}) ~ '^\d+$' 
              OR MAX(${creatorBankAccounts.accountHolderName}) ILIKE 'umb://%'
            THEN NULL
            ELSE TRIM(MAX(${creatorBankAccounts.accountHolderName}))
          END,
          ''
        ),
        NULLIF(TRIM(MAX(${creatorApplicationRequests.fullName})), ''),
        NULLIF(TRIM(MAX(CONCAT_WS(' ', ${creatorApplicationRequests.firstName}, ${creatorApplicationRequests.lastName}))), ''),
        CASE
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%neuroterapeut%' OR LOWER(TRIM(${creatorChannels.name})) = 'fysioteamet' OR LOWER(TRIM(${users.email})) LIKE '%@fysioteamet.dk' OR LOWER(TRIM(${users.email})) = 'jakob.prv@gmail.com' THEN 'Jakob Hansen'
          WHEN LOWER(TRIM(${users.email})) = 'peter@fbi-productions.dk' OR LOWER(TRIM(${creatorChannels.name})) = 'fbi.dk' THEN 'Peter Alan Wheatley'
          WHEN LOWER(TRIM(${users.email})) = 'chiefment@gmail.com' OR LOWER(TRIM(${creatorChannels.name})) = 'chief1' THEN 'Lars Pedersen'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'microphone entertainment' OR LOWER(TRIM(${users.email})) = 'marlene@microphone.dk' THEN 'Mick Øgendahl'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'kammas kantine' OR LOWER(TRIM(${users.email})) = 'jakob@kafekammas.dk' THEN 'Jakob Kamma'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'red barnet' OR LOWER(TRIM(${users.email})) = 'sia@redbarnet.dk' THEN 'Sia'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'damkjær medier' OR LOWER(TRIM(${users.email})) = 'simone@damkjaer-medier.dk' THEN 'Simone Damkjær'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%tania ellis%' OR LOWER(TRIM(${users.email})) LIKE 'te@taniaellis.%' THEN 'Tania Ellis'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'langes entertainment aps' OR LOWER(TRIM(${users.email})) = 'book@nicolajlange.dk' THEN 'Nicolaj Lange'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'signeneslein.dk' OR LOWER(TRIM(${users.email})) = 'signe@neslein.com' THEN 'Signe Neslein'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'networker' OR LOWER(TRIM(${users.email})) = 'hej@henrikhavemand.dk' OR LOWER(TRIM(${users.email})) = 'henrik.v.meyer@outlook.com' THEN 'Henrik Havemand'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%you consulting%' OR LOWER(TRIM(${users.email})) = 'jannie.hvidberg@gmail.com' OR LOWER(TRIM(${users.email})) = 'you@youconsulting.dk' THEN 'Jannie Hvidberg'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%skolero%' OR LOWER(TRIM(${users.email})) = 'line@skolero.dk' THEN 'Line'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%uffe holm%' OR LOWER(TRIM(${users.email})) = 'malene@uffeholm.dk' THEN 'Uffe Holm'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%amin jensen%' OR LOWER(TRIM(${users.email})) = 'amin@aminjensen.dk' THEN 'Amin Jensen'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'comedy-tv' OR LOWER(TRIM(${users.email})) = 'halfters@gmail.com' THEN 'Dan Andersen'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%britta koch%' OR LOWER(TRIM(${users.email})) = 'undertryk@gmail.com' THEN 'Britta Koch'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'elstudio' OR LOWER(TRIM(${users.email})) = 'info@elstudio.dk' THEN 'Stine Joy'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'raujensen' OR LOWER(TRIM(${users.email})) = 'christineraujensen@gmail.com' THEN 'Christine Rau Jensen'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%jacob elk%' OR LOWER(TRIM(${users.email})) = 'jacobkelk@gmail.com' THEN 'Jacob Elk'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'gymstream' OR LOWER(TRIM(${users.email})) = 'lars.borly@gmail.com' THEN 'Lars Borly'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%morten bonde%' OR LOWER(TRIM(${users.email})) = 'mb@mortenbonde.dk' THEN 'Morten Bonde'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'nuvenue' OR LOWER(TRIM(${creatorChannels.name})) = 'gottleben' OR LOWER(TRIM(${users.email})) = 'info@gottleben.com' THEN 'Kaare Thomsen'
          WHEN LOWER(TRIM(${creatorChannels.name})) = 'tjelesvenner' OR LOWER(TRIM(${creatorChannels.name})) = 'mariebrixtofte' THEN 'Marie Brixtofte'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%marner%' OR LOWER(TRIM(${users.email})) = 'marner.michael@yahoo.com' THEN 'Marner Michael'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%hundedamen%' OR LOWER(TRIM(${users.email})) ILIKE '%hundedamen%' THEN 'Christin'
          WHEN LOWER(TRIM(${creatorChannels.name})) ILIKE '%kitnoergaard%' OR LOWER(TRIM(${users.email})) ILIKE '%kitnoergaard%' THEN 'Kit Nørgaard'
          ELSE NULL
        END,
        CASE 
          WHEN LOWER(TRIM(CONCAT_WS(' ', ${users.firstName}, ${users.lastName}))) = LOWER(TRIM(${creatorChannels.name})) THEN NULL
          WHEN CONCAT_WS(' ', ${users.firstName}, ${users.lastName}) ~* '\.(dk|com|net|org|nu|eu)$' THEN NULL
          ELSE NULLIF(TRIM(CONCAT_WS(' ', ${users.firstName}, ${users.lastName})), '')
        END,
        CASE
          WHEN LOWER(TRIM(${users.fullName})) = LOWER(TRIM(${creatorChannels.name})) THEN NULL
          WHEN ${users.fullName} ~* '\.(dk|com|net|org|nu|eu)$' THEN NULL
          ELSE NULLIF(TRIM(${users.fullName}), '')
        END,
        NULLIF(TRIM(${users.fullName}), ''),
        ${users.email}
      )
    `;

    const [creator] = await db
      .select({
        id: users.id,
        ownerName: ownerNameSql,
        firstName: users.firstName,
        lastName: users.lastName,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        status: users.status,
        isEmailVerified: users.isEmailVerified,
        isActive: users.isActive,
        isHidden: users.isHidden,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        companyName: creatorInfo.companyName,
        phone: creatorInfo.phone,
        city: creatorInfo.city,
        cvr: creatorInfo.cvr,
        channelName: creatorChannels.name,
        channelSlug: creatorChannels.slug,
        slug: creatorChannels.slug,
        isPublished: creatorChannels.isPublished,
        layout: contentAppearance.layout,
        planName: planNameSql,
        uploadCount: uploadCountSql,
        subscriberCount: subscriberCountSql,
      })
      .from(users)
      .leftJoin(creatorInfo, eq(creatorInfo.userId, users.id))
      .leftJoin(creatorChannels, eq(creatorChannels.creatorId, users.id))
      .leftJoin(creatorOwners, eq(creatorOwners.creatorId, users.id))
      .leftJoin(
        creatorBankAccounts,
        eq(creatorBankAccounts.creatorId, users.id),
      )
      .leftJoin(
        creatorApplicationRequests,
        and(
          eq(creatorApplicationRequests.approvedUserId, users.id),
          eq(creatorApplicationRequests.isDeleted, false),
        ),
      )
      .leftJoin(contentAppearance, eq(contentAppearance.userId, users.id))
      .leftJoin(
        creatorPlans,
        and(
          eq(creatorPlans.creatorId, users.id),
          eq(creatorPlans.status, 'active'),
        ),
      )
      .leftJoin(plans, eq(plans.id, creatorPlans.planId))
      .leftJoin(
        mediaFiles,
        and(
          eq(mediaFiles.creatorId, users.id),
          eq(mediaFiles.isDeleted, false),
        ),
      )
      .leftJoin(
        emailSubscribers,
        and(
          eq(emailSubscribers.creatorId, users.id),
          eq(emailSubscribers.isActive, true),
        ),
      )
      .where(
        and(
          or(eq(users.id, creatorId), eq(creatorChannels.slug, creatorId)),
          eq(users.role, ROLE.CREATOR),
          eq(users.isDeleted, false),
        ),
      )
      .groupBy(
        users.id,
        creatorOwners.name,
        creatorInfo.companyName,
        creatorInfo.phone,
        creatorInfo.city,
        creatorInfo.cvr,
        creatorChannels.name,
        creatorChannels.slug,
        creatorChannels.isPublished,
        contentAppearance.layout,
      )
      .limit(1);

    if (!creator) {
      return fail('Creator not found', HttpStatus.NOT_FOUND);
    }

    return success(
      {
        ...creator,
        ownerName: creator.ownerName ?? null,
        uploadCount: Number(creator.uploadCount ?? 0),
        subscriberCount: Number(creator.subscriberCount ?? 0),
      },
      'Creator fetched successfully',
      HttpStatus.OK,
    );
  } catch (error) {
    logger.error('Error fetching creator:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Failed to fetch creator',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
