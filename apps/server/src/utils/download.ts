import { extname } from 'path';

export const getDownloadDispositionAndFileName = (
  fileKey: string | null | undefined,
  title: string | null | undefined,
) => {
  const ext = fileKey ? extname(fileKey) : '';
  const rawTitle = title || 'download';
  const safeTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, '_').trim();
  const fileName = ext ? `${safeTitle}${ext}` : safeTitle;
  const encodedFileName = encodeURIComponent(fileName);

  return {
    fileName,
    contentDisposition: `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`,
  };
};
