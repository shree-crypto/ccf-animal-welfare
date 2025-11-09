// Email templates for notifications
// These templates will be used by Appwrite Functions to send emails

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export const generateTaskReminderEmail = (
  volunteerName: string,
  taskTitle: string,
  taskDescription: string,
  scheduledDate: string,
  taskUrl: string
): EmailTemplate => {
  return {
    subject: `Task Reminder: ${taskTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .task-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Task Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${volunteerName},</p>
              <p>This is a reminder about your upcoming task:</p>
              <div class="task-details">
                <h2>${taskTitle}</h2>
                <p><strong>Description:</strong> ${taskDescription}</p>
                <p><strong>Scheduled:</strong> ${new Date(scheduledDate).toLocaleString()}</p>
              </div>
              <a href="${taskUrl}" class="button">View Task Details</a>
              <div class="footer">
                <p>Committee for Campus Fauna (CCF) - Animal Welfare System</p>
                <p>You're receiving this email because you have task reminders enabled.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Task Reminder: ${taskTitle}

Hi ${volunteerName},

This is a reminder about your upcoming task:

Task: ${taskTitle}
Description: ${taskDescription}
Scheduled: ${new Date(scheduledDate).toLocaleString()}

View task details: ${taskUrl}

---
Committee for Campus Fauna (CCF) - Animal Welfare System
You're receiving this email because you have task reminders enabled.
    `,
  };
};

export const generateTaskAssignedEmail = (
  volunteerName: string,
  taskTitle: string,
  taskDescription: string,
  scheduledDate: string,
  taskUrl: string
): EmailTemplate => {
  return {
    subject: `New Task Assigned: ${taskTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .task-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Task Assigned</h1>
            </div>
            <div class="content">
              <p>Hi ${volunteerName},</p>
              <p>You have been assigned a new task:</p>
              <div class="task-details">
                <h2>${taskTitle}</h2>
                <p><strong>Description:</strong> ${taskDescription}</p>
                <p><strong>Scheduled:</strong> ${new Date(scheduledDate).toLocaleString()}</p>
              </div>
              <a href="${taskUrl}" class="button">View Task Details</a>
              <div class="footer">
                <p>Committee for Campus Fauna (CCF) - Animal Welfare System</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Task Assigned: ${taskTitle}

Hi ${volunteerName},

You have been assigned a new task:

Task: ${taskTitle}
Description: ${taskDescription}
Scheduled: ${new Date(scheduledDate).toLocaleString()}

View task details: ${taskUrl}

---
Committee for Campus Fauna (CCF) - Animal Welfare System
    `,
  };
};

export const generateMedicalAlertEmail = (
  volunteerName: string,
  animalName: string,
  alertMessage: string,
  animalUrl: string
): EmailTemplate => {
  return {
    subject: `URGENT: Medical Alert for ${animalName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert-box { background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
            .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .urgent { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ URGENT MEDICAL ALERT</h1>
            </div>
            <div class="content">
              <p>Hi ${volunteerName},</p>
              <p class="urgent">This is an urgent medical alert requiring immediate attention:</p>
              <div class="alert-box">
                <h2>${animalName}</h2>
                <p><strong>Alert:</strong> ${alertMessage}</p>
              </div>
              <p>Please review this alert and take appropriate action as soon as possible.</p>
              <a href="${animalUrl}" class="button">View Animal Profile</a>
              <div class="footer">
                <p>Committee for Campus Fauna (CCF) - Animal Welfare System</p>
                <p>This is an urgent notification. Please respond promptly.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
⚠️ URGENT MEDICAL ALERT: ${animalName}

Hi ${volunteerName},

This is an urgent medical alert requiring immediate attention:

Animal: ${animalName}
Alert: ${alertMessage}

Please review this alert and take appropriate action as soon as possible.

View animal profile: ${animalUrl}

---
Committee for Campus Fauna (CCF) - Animal Welfare System
This is an urgent notification. Please respond promptly.
    `,
  };
};

export const generateDailyDigestEmail = (
  volunteerName: string,
  upcomingTasks: Array<{ title: string; scheduledDate: string }>,
  recentAlerts: Array<{ animalName: string; message: string }>,
  dashboardUrl: string
): EmailTemplate => {
  const tasksHtml = upcomingTasks
    .map(
      task => `
    <li>
      <strong>${task.title}</strong> - ${new Date(task.scheduledDate).toLocaleDateString()}
    </li>
  `
    )
    .join('');

  const alertsHtml = recentAlerts
    .map(
      alert => `
    <li>
      <strong>${alert.animalName}:</strong> ${alert.message}
    </li>
  `
    )
    .join('');

  return {
    subject: 'Your Daily CCF Digest',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8b4513; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background-color: #8b4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            ul { padding-left: 20px; }
            li { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Your Daily Digest</h1>
            </div>
            <div class="content">
              <p>Hi ${volunteerName},</p>
              <p>Here's your daily summary of CCF activities:</p>
              
              ${
                upcomingTasks.length > 0
                  ? `
              <div class="section">
                <h2>📅 Upcoming Tasks (${upcomingTasks.length})</h2>
                <ul>${tasksHtml}</ul>
              </div>
              `
                  : ''
              }
              
              ${
                recentAlerts.length > 0
                  ? `
              <div class="section">
                <h2>⚠️ Recent Alerts (${recentAlerts.length})</h2>
                <ul>${alertsHtml}</ul>
              </div>
              `
                  : ''
              }
              
              <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
              
              <div class="footer">
                <p>Committee for Campus Fauna (CCF) - Animal Welfare System</p>
                <p>You're receiving this daily digest because you have it enabled in your preferences.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Your Daily CCF Digest

Hi ${volunteerName},

Here's your daily summary of CCF activities:

${
  upcomingTasks.length > 0
    ? `
Upcoming Tasks (${upcomingTasks.length}):
${upcomingTasks.map(task => `- ${task.title} - ${new Date(task.scheduledDate).toLocaleDateString()}`).join('\n')}
`
    : ''
}

${
  recentAlerts.length > 0
    ? `
Recent Alerts (${recentAlerts.length}):
${recentAlerts.map(alert => `- ${alert.animalName}: ${alert.message}`).join('\n')}
`
    : ''
}

Go to Dashboard: ${dashboardUrl}

---
Committee for Campus Fauna (CCF) - Animal Welfare System
You're receiving this daily digest because you have it enabled in your preferences.
    `,
  };
};
