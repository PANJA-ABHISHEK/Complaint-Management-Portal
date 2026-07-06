import nodemailer from 'nodemailer';
import config from '../config/env.js';

/**
 * Create a reusable transporter.
 * In development, logs to console instead of actually sending.
 */
const createTransporter = () => {
  if (config.nodeEnv === 'development' || !config.smtp.user) {
    // Development: just log the email
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

const transporter = createTransporter();

/**
 * Send email notification.
 * @param {Object} options - { to, subject, html }
 */
export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!transporter) {
      console.log('📧 [DEV EMAIL]');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body: ${html.substring(0, 200)}...`);
      return { success: true, dev: true };
    }

    const info = await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.from}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Email templates
 */
export const emailTemplates = {
  complaintRegistered: (complaint) => ({
    subject: `Complaint Registered: ${complaint.title}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <div style="background: #4f46e5; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🛡️ ComplaintPortal</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; margin-top: 0;">Complaint Registered Successfully</h2>
          <p style="color: #64748b;">Your complaint has been submitted and assigned ID: <strong>${complaint._id}</strong></p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 4px 0; color: #334155;"><strong>Title:</strong> ${complaint.title}</p>
            <p style="margin: 4px 0; color: #334155;"><strong>Category:</strong> ${complaint.category}</p>
            <p style="margin: 4px 0; color: #334155;"><strong>Priority:</strong> ${complaint.priority}</p>
            <p style="margin: 4px 0; color: #334155;"><strong>Status:</strong> ${complaint.status}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">You will receive updates as your complaint is processed.</p>
        </div>
      </div>
    `,
  }),

  statusUpdated: (complaint, newStatus) => ({
    subject: `Status Update: ${complaint.title}`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <div style="background: #4f46e5; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🛡️ ComplaintPortal</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; margin-top: 0;">Complaint Status Updated</h2>
          <p style="color: #64748b;">The status of your complaint <strong>"${complaint.title}"</strong> has been updated.</p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
            <p style="font-size: 18px; color: #4f46e5; font-weight: bold; margin: 0;">${newStatus}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">Log in to your dashboard for more details.</p>
        </div>
      </div>
    `,
  }),

  welcome: (user) => ({
    subject: 'Welcome to ComplaintPortal!',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <div style="background: #4f46e5; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 22px;">🛡️ ComplaintPortal</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
          <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${user.name}!</h2>
          <p style="color: #64748b;">Thank you for joining ComplaintPortal. You can now file and track civic complaints with complete transparency.</p>
          <a href="${config.clientUrl}/login" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px;">Go to Dashboard</a>
        </div>
      </div>
    `,
  }),
};
