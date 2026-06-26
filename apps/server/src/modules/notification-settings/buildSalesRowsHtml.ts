type SalesRow = {
  name: string;
  itemType: string;
  price: string;
  date: string;
};

export const buildSalesRowsHtml = (sales: SalesRow[]) => {
  if (sales.length > 0) {
    return sales
      .map(
        (row) => `<tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.name}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #53baa9; border-top: 1px solid #eef0f3; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.itemType}</td>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; text-align: right; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.price}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #666666; border-top: 1px solid #eef0f3; text-align: right; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.date}</td>
                  </tr>`,
      )
      .join('');
  }

  return `<tr>
                  <td colspan="4" style="padding: 28px 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                    <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #444444;">No sales yet</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #888888;">No completed sales were recorded for this period.</p>
                  </td>
                </tr>`;
};
