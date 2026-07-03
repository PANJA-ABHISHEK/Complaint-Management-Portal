import nodemailer from 'nodemailer';
import config from '../config/env.js';

const createTransporter = () => {
  if (!config.smtp.user || !config.smtp.pass) {
    console.log('⚠️  SMTP not configured. Emails will be logged to console.');
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

const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.log('📧 Email (dev mode):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${html.substring(0, 200)}...`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Complaint Portal" <${config.smtp.from}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
  }
};

export const sendWelcomeEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Complaint Management Portal',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome!</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your account has been created successfully. You can now submit complaints, track their progress, and provide feedback.</p>
          <a href="${config.clientUrl}/login" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Login to Portal</a>
          <p style="color: #64748b; font-size: 14px;">If you didn't create this account, please ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (user, resetUrl) => {
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested a password reset. Click the button below to reset your password. This link is valid for 30 minutes.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Reset Password</a>
          <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  });
};

export const sendStatusUpdateEmail = async (user, complaint, newStatus) => {
  await sendEmail({
    to: user.email,
    subject: `Complaint ${complaint.complaintId} - Status Update`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Status Update</h1>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your complaint <strong>${complaint.complaintId}</strong> has been updated.</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Title:</strong> ${complaint.title}</p>
            <p style="margin: 4px 0;"><strong>New Status:</strong> <span style="color: #6366f1; font-weight: bold;">${newStatus}</span></p>
          </div>
          <a href="${config.clientUrl}/dashboard/complaints/${complaint._id}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">View Complaint</a>
        </div>
      </div>
    `,
  });
};

export default sendEmail;
