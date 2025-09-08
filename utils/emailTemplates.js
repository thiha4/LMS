

export const resetPasswordEmailTemplate = (link) => {
  return `
    <div style="font-family:Arial,sans-serif">
      <h2>Password Reset Requested</h2>
      <p>Click the link below to reset your password. If you didn't request this, you can safely ignore this email.</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link will expire soon.</p>
    </div>
  `;
};

export const overdueReminderTemplate = (userName, bookTitle, dueAt) => {
  return `
    <div style="font-family:Arial,sans-serif">
      <h3>Overdue Reminder</h3>
      <p>Hi ${userName},</p>
      <p>This is a reminder that <strong>${bookTitle}</strong> was due on <strong>${new Date(dueAt).toLocaleDateString()}</strong>.</p>
      <p>Please return it as soon as possible.</p>
      <p>Thanks,<br/>Library Management</p>
    </div>
  `;
};
