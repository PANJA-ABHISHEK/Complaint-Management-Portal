import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import Settings from '../models/Settings.js';
import ActivityLog from '../models/ActivityLog.js';
import { Counter } from '../models/Complaint.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/complaint_portal';

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Complaint.deleteMany({}),
      Department.deleteMany({}),
      Notification.deleteMany({}),
      Settings.deleteMany({}),
      ActivityLog.deleteMany({}),
      Counter.deleteMany({}),
    ]);

    // ─── Departments ───
    console.log('🏢 Seeding departments...');
    const departments = await Department.insertMany([
      { name: 'Public Works', code: 'PWD', description: 'Roads, bridges, and public infrastructure', categories: ['Infrastructure', 'Transportation'], contactEmail: 'pwd@city.gov' },
      { name: 'Electrical', code: 'ELEC', description: 'Streetlights, power lines, and electrical systems', categories: ['Utilities'], contactEmail: 'electrical@city.gov' },
      { name: 'Water Supply', code: 'WTR', description: 'Water supply, drainage, and sewage', categories: ['Utilities', 'Sanitation'], contactEmail: 'water@city.gov' },
      { name: 'Health Department', code: 'HLTH', description: 'Public health and sanitation services', categories: ['Health', 'Sanitation'], contactEmail: 'health@city.gov' },
      { name: 'Police Department', code: 'PD', description: 'Law enforcement and public safety', categories: ['Safety'], contactEmail: 'police@city.gov' },
      { name: 'Transport Authority', code: 'TA', description: 'Public transport and traffic management', categories: ['Transportation'], contactEmail: 'transport@city.gov' },
      { name: 'Environment Division', code: 'ENV', description: 'Parks, pollution control, and environment', categories: ['Environment'], contactEmail: 'environment@city.gov' },
      { name: 'Municipal Corporation', code: 'MC', description: 'General civic administration', categories: ['Other', 'Education'], contactEmail: 'municipal@city.gov' },
    ]);
    console.log(`   ✅ ${departments.length} departments created`);

    // ─── Users ───
    console.log('👤 Seeding users...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      phone: '+91 9999999999',
      role: 'admin',
    });

    const johnDoe = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      phone: '+91 8888888888',
      role: 'user',
    });

    const janeSmith = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      phone: '+91 7777777777',
      role: 'user',
    });

    const officerMike = await User.create({
      name: 'Mike Wilson',
      email: 'officer@example.com',
      password: 'password123',
      phone: '+91 6666666666',
      role: 'officer',
      department: departments[0]._id,
    });
    console.log('   ✅ 4 users created (admin, 2 users, 1 officer)');

    // ─── Complaints ───
    console.log('📋 Seeding complaints...');
    const complaintsData = [
      {
        title: 'Massive pothole on Main Street',
        description: 'There is a massive pothole near the central park entrance on Main Street that has been causing traffic issues and is a hazard for motorcyclists.',
        category: 'Infrastructure',
        departmentName: 'Public Works',
        department: departments[0]._id,
        priority: 'High',
        location: '123 Main St, Springfield',
        status: 'In Progress',
        userId: johnDoe._id,
        assignedTo: officerMike._id,
        timeline: [
          { status: 'Submitted', note: 'Complaint registered.', date: new Date(Date.now() - 86400000 * 5) },
          { status: 'Under Review', note: 'Forwarded to Public Works.', date: new Date(Date.now() - 86400000 * 4), updatedBy: adminUser._id },
          { status: 'Assigned', note: 'Assigned to Officer Mike Wilson.', date: new Date(Date.now() - 86400000 * 3), updatedBy: adminUser._id },
          { status: 'In Progress', note: 'Repair crew dispatched.', date: new Date(Date.now() - 86400000 * 1), updatedBy: officerMike._id },
        ],
      },
      {
        title: 'Streetlight broken on Elm Street',
        description: 'The streetlight outside house number 45 on Elm Street has been non-functional for over a week now. It creates a safety concern at night.',
        category: 'Utilities',
        departmentName: 'Electrical',
        department: departments[1]._id,
        priority: 'Medium',
        location: '45 Elm St, Springfield',
        status: 'Resolved',
        userId: johnDoe._id,
        resolution: { note: 'Streetlight repaired and tested successfully.', resolvedAt: new Date(Date.now() - 86400000 * 2), resolvedBy: adminUser._id },
        timeline: [
          { status: 'Submitted', note: 'Complaint registered.', date: new Date(Date.now() - 86400000 * 10) },
          { status: 'Assigned', note: 'Assigned to Electrical dept.', date: new Date(Date.now() - 86400000 * 8), updatedBy: adminUser._id },
          { status: 'Resolved', note: 'Streetlight fixed.', date: new Date(Date.now() - 86400000 * 2), updatedBy: adminUser._id },
        ],
        feedback: { rating: 4, comment: 'Good service, just took a bit long.', submittedAt: new Date(Date.now() - 86400000 * 1) },
      },
      {
        title: 'Water leakage from main pipeline',
        description: 'Major water leakage from the main pipeline near Oak Avenue intersection. Water is flooding the street and disrupting traffic flow significantly.',
        category: 'Utilities',
        departmentName: 'Water Supply',
        department: departments[2]._id,
        priority: 'Critical',
        location: 'Oak Avenue Intersection, Springfield',
        status: 'Assigned',
        userId: janeSmith._id,
        assignedTo: officerMike._id,
        timeline: [
          { status: 'Submitted', note: 'Complaint registered.', date: new Date(Date.now() - 86400000 * 2) },
          { status: 'Under Review', note: 'Marked as critical.', date: new Date(Date.now() - 86400000 * 1), updatedBy: adminUser._id },
          { status: 'Assigned', note: 'Emergency team assigned.', date: new Date(Date.now() - 86400000 * 0.5), updatedBy: adminUser._id },
        ],
      },
      {
        title: 'Garbage not collected for 3 days',
        description: 'The garbage collection truck has not visited our locality in Maple Drive for 3 consecutive days. The garbage bins are overflowing and causing bad smell.',
        category: 'Sanitation',
        departmentName: 'Health Department',
        department: departments[3]._id,
        priority: 'Medium',
        location: 'Maple Drive, Block C, Springfield',
        status: 'Submitted',
        userId: janeSmith._id,
        timeline: [
          { status: 'Submitted', note: 'Complaint registered.', date: new Date(Date.now() - 86400000 * 1) },
        ],
      },
      {
        title: 'Broken traffic signal at Park Junction',
        description: 'The traffic signal at Park Junction has been malfunctioning for the past week. The red light stays on permanently causing huge traffic jams.',
        category: 'Transportation',
        departmentName: 'Transport Authority',
        department: departments[5]._id,
        priority: 'High',
        location: 'Park Junction, Springfield',
        status: 'Under Review',
        userId: johnDoe._id,
        timeline: [
          { status: 'Submitted', note: 'Complaint registered.', date: new Date(Date.now() - 86400000 * 3) },
          { status: 'Under Review', note: 'Under investigation by transport authority.', date: new Date(Date.now() - 86400000 * 2), updatedBy: adminUser._id },
        ],
      },
      {
        title: 'Illegal dumping in Cedar Park',
        description: 'Someone has been illegally dumping construction waste in Cedar Park near the playground area. This is a health hazard for children playing there.',
        category: 'Environment',
        departmentName: 'Environment Division',
        department: departments[6]._id,
        priority: 'High',
        location: 'Cedar Park, Springfield',
        status: 'Resolved',
        userId: janeSmith._id,
        resolution: { note: 'Waste cleared. CCTV cameras installed.', resolvedAt: new Date(Date.now() - 86400000 * 1), resolvedBy: adminUser._id },
        timeline: [
          { status: 'Submitted', note: 'Complaint registered.', date: new Date(Date.now() - 86400000 * 6) },
          { status: 'In Progress', note: 'Cleanup crew dispatched.', date: new Date(Date.now() - 86400000 * 4), updatedBy: adminUser._id },
          { status: 'Resolved', note: 'Area cleaned and monitored.', date: new Date(Date.now() - 86400000 * 1), updatedBy: adminUser._id },
        ],
        feedback: { rating: 5, comment: 'Excellent response! Park is clean again.', submittedAt: new Date() },
      },
    ];

    const complaints = await Complaint.create(complaintsData);
    console.log(`   ✅ ${complaints.length} complaints created`);

    // ─── Notifications ───
    console.log('🔔 Seeding notifications...');
    await Notification.insertMany([
      { userId: johnDoe._id, type: 'status_update', title: 'Complaint Updated', message: 'Your complaint "Massive pothole on Main Street" is now In Progress.', complaintId: complaints[0]._id },
      { userId: johnDoe._id, type: 'resolution', title: 'Complaint Resolved', message: 'Your complaint "Streetlight broken on Elm Street" has been resolved.', complaintId: complaints[1]._id },
      { userId: janeSmith._id, type: 'assignment', title: 'Complaint Assigned', message: 'Your complaint about water leakage has been assigned to an emergency team.', complaintId: complaints[2]._id },
      { userId: janeSmith._id, type: 'complaint_created', title: 'Complaint Registered', message: 'Your complaint about garbage collection has been submitted.', complaintId: complaints[3]._id },
    ]);
    console.log('   ✅ 4 notifications created');

    // ─── Settings ───
    console.log('⚙️  Seeding settings...');
    await Settings.insertMany([
      { key: 'site_name', value: 'Complaint Management Portal', category: 'general', description: 'Name of the application' },
      { key: 'max_file_size', value: 5242880, category: 'complaint', description: 'Maximum file upload size in bytes' },
      { key: 'max_attachments', value: 5, category: 'complaint', description: 'Maximum attachments per complaint' },
      { key: 'auto_assign', value: false, category: 'complaint', description: 'Auto-assign complaints to officers' },
      { key: 'email_notifications', value: true, category: 'notification', description: 'Enable email notifications' },
      { key: 'escalation_days', value: 7, category: 'complaint', description: 'Days before auto-escalation' },
      { key: 'session_timeout', value: 3600, category: 'security', description: 'Session timeout in seconds' },
      { key: 'allowed_file_types', value: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'], category: 'complaint', description: 'Allowed file types for upload' },
    ]);
    console.log('   ✅ 8 settings created');

    // ─── Activity Logs ───
    console.log('📝 Seeding activity logs...');
    await ActivityLog.insertMany([
      { userId: adminUser._id, action: 'LOGIN', resource: 'User', description: 'Admin logged in', ipAddress: '127.0.0.1' },
      { userId: johnDoe._id, action: 'COMPLAINT_CREATED', resource: 'Complaint', resourceId: complaints[0]._id, description: 'Created complaint: Massive pothole on Main Street' },
      { userId: adminUser._id, action: 'STATUS_CHANGED', resource: 'Complaint', resourceId: complaints[0]._id, description: 'Changed status to In Progress', metadata: { from: 'Assigned', to: 'In Progress' } },
      { userId: johnDoe._id, action: 'COMPLAINT_CREATED', resource: 'Complaint', resourceId: complaints[1]._id, description: 'Created complaint: Streetlight broken on Elm Street' },
    ]);
    console.log('   ✅ 4 activity logs created');

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('  ✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('  Demo Credentials:');
    console.log('  Admin:   admin@example.com / password123');
    console.log('  User:    user@example.com  / password123');
    console.log('  User 2:  jane@example.com  / password123');
    console.log('  Officer: officer@example.com / password123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seed();
