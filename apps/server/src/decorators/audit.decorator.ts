import { SetMetadata } from '@nestjs/common';

export const AUDIT_LOG_KEY = 'audit_log';

export interface AuditLogMetadata {
  action: string;
  resource: string;
}

export function AuditLog(action: string, resource: string) {
  return SetMetadata(AUDIT_LOG_KEY, { action, resource });
}
