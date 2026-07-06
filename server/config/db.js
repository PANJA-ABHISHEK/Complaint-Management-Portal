/**
 * Database Connection Module
 * Prepared for MongoDB via Mongoose.
 * Currently uses an in-memory JSON store so the server runs without MongoDB.
 * To switch to MongoDB: npm install mongoose, uncomment the mongoose code below.
 */

// import mongoose from 'mongoose';
// import config from './env.js';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(config.mongoUri);
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ MongoDB Error: ${error.message}`);
//     process.exit(1);
//   }
// };
// export default connectDB;

// ───── In-Memory Store (no MongoDB required) ─────
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const generateId = () => crypto.randomUUID();

class InMemoryDB {
  constructor() {
    this.users = [];
    this.complaints = [];
    this.notifications = [];
    this._seed();
  }

  async _seed() {
    const hashedPw = await bcrypt.hash('password123', 10);
    this.users.push(
      {
        _id: generateId(),
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPw,
        phone: '+91 9999999999',
        role: 'admin',
        avatar: null,
        createdAt: new Date().toISOString(),
      },
      {
        _id: generateId(),
        name: 'John Doe',
        email: 'user@example.com',
        password: hashedPw,
        phone: '+91 8888888888',
        role: 'user',
        avatar: null,
        createdAt: new Date().toISOString(),
      }
    );

    const userId = this.users[1]._id;
    this.complaints.push(
      {
        _id: generateId(),
        title: 'Pothole on Main Street',
        category: 'Infrastructure',
        department: 'Public Works',
        priority: 'High',
        description: 'Massive pothole causing traffic issues near central park entrance.',
        location: '123 Main St, Springfield',
        status: 'In Progress',
        userId,
        assignedTo: null,
        attachments: [],
        timeline: [
          { status: 'Submitted', date: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Complaint registered.' },
          { status: 'Under Review', date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Assigned to Public Works.' },
          { status: 'In Progress', date: new Date(Date.now() - 86400000).toISOString(), note: 'Repair crew dispatched.' },
        ],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        _id: generateId(),
        title: 'Streetlight broken on Elm St',
        category: 'Utilities',
        department: 'Electrical',
        priority: 'Medium',
        description: 'The streetlight outside 45 Elm St has been non-functional for a week.',
        location: '45 Elm St, Springfield',
        status: 'Resolved',
        userId,
        assignedTo: null,
        attachments: [],
        timeline: [
          { status: 'Submitted', date: new Date(Date.now() - 86400000 * 7).toISOString(), note: 'Complaint registered.' },
          { status: 'Resolved', date: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Streetlight repaired and tested.' },
        ],
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    );
  }

  // ─── Helper ───
  generateId() {
    return generateId();
  }
}

const db = new InMemoryDB();
export default db;
