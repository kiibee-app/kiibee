type TopContentRow = {
  name: string;
  views: string;
  visits: string;
};

export const buildTopContentRowsHtml = (topContent: TopContentRow[]) => {
  if (topContent.length > 0) {
    return topContent
      .map(
        (row) => `<tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.name}</td>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; text-align: right; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.views}</td>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; text-align: right; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.visits}</td>
                  </tr>`,
      )
      .join('');
  }

  return `<tr>
                  <td colspan="3" style="padding: 28px 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                    <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #444444;">No activity yet</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #888888;">No content activity recorded for this period. Share your channel to start collecting views.</p>
                  </td>
                </tr>`;
};
