import Notification from '../models/Notification.js';

export const createNotification = async ({ user, title, message, type, complaint }) => {
  try {
    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      complaint,
    });
    return notification;
  } catch (error) {
    console.error('❌ Notification creation failed:', error.message);
  }
};

export const notifyComplaintSubmitted = async (userId, complaint) => {
  await createNotification({
    user: userId,
    title: 'Complaint Submitted',
    message: `Your complaint "${complaint.title}" (${complaint.complaintId}) has been submitted successfully.`,
    type: 'complaint_submitted',
    complaint: complaint._id,
  });
};

export const notifyComplaintAssigned = async (officerId, complaint) => {
  await createNotification({
    user: officerId,
    title: 'New Complaint Assigned',
    message: `Complaint "${complaint.title}" (${complaint.complaintId}) has been assigned to you.`,
    type: 'complaint_assigned',
    complaint: complaint._id,
  });
};

export const notifyStatusUpdate = async (userId, complaint, newStatus) => {
  await createNotification({
    user: userId,
    title: 'Complaint Status Updated',
    message: `Your complaint "${complaint.title}" (${complaint.complaintId}) status has been updated to "${newStatus}".`,
    type: 'status_update',
    complaint: complaint._id,
  });
};

export const notifyComplaintResolved = async (userId, complaint) => {
  await createNotification({
    user: userId,
    title: 'Complaint Resolved',
    message: `Your complaint "${complaint.title}" (${complaint.complaintId}) has been resolved. Please provide your feedback.`,
    type: 'complaint_resolved',
    complaint: complaint._id,
  });
};

export const notifyComplaintClosed = async (userId, complaint) => {
  await createNotification({
    user: userId,
    title: 'Complaint Closed',
    message: `Your complaint "${complaint.title}" (${complaint.complaintId}) has been closed.`,
    type: 'complaint_closed',
    complaint: complaint._id,
  });
};
