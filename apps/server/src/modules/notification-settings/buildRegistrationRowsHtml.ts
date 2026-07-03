type RegistrationRow = {
  name: string;
  email: string;
  date: string;
};

export const buildRegistrationRowsHtml = (registrations: RegistrationRow[]) => {
  if (registrations.length > 0) {
    return registrations
      .map(
        (row) => `<tr>
                    <td style="padding: 14px 16px; font-size: 14px; color: #1a1a1a; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.name}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #666666; border-top: 1px solid #eef0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.email}</td>
                    <td style="padding: 14px 16px; font-size: 13px; color: #666666; border-top: 1px solid #eef0f3; text-align: right; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">${row.date}</td>
                  </tr>`,
      )
      .join('');
  }

  return `<tr>
                  <td colspan="3" style="padding: 28px 20px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                    <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #444444;">No signups yet</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #888888;">No email signups were recorded for this period. When viewers submit your email-gated forms, they will appear here.</p>
                  </td>
                </tr>`;
};
