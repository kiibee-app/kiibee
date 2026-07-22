import sanitize from 'sanitize-html';
import { STRING } from './constant';

export function stripHtml(value: string): string {
  if (typeof value !== STRING) {
    return value;
  }
  return sanitize(value, {
    allowedTags: [],
    allowedAttributes: {},
    allowedSchemes: [],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: [],
    transformTags: {},
    textFilter: null,
    exclusiveFilter: null,
    nonTextTags: [],
    nestedTags: [],
    blobOfTags: [],
    allowVulnerableTags: false,
    textFilterEnforcingTags: [],
  });
}

export function escapeHtml(value: string): string {
  if (typeof value !== STRING) {
    return value;
  }
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
