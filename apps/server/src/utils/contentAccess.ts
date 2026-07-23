import { createHash, randomBytes } from 'crypto';

export const createApprovalToken = () => randomBytes(32).toString('hex');

export const hashApprovalToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

export const normalizeAccessRequest = (dto: {
  email: string;
  name?: string;
}) => ({
  email: dto.email.trim().toLowerCase(),
  viewerName: dto.name?.trim() || null,
});
