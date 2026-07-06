const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

const INITIAL_DATA = {
  users: [
    {
      id: 'admin_1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    }
  ],
  complaints: [
    {
      id: 'cmp_1',
      title: 'Pothole on Main Street',
      category: 'Infrastructure',
      department: 'Public Works',
      priority: 'High',
      description: 'Massive pothole causing traffic issues near the central park.',
      location: '123 Main St, Springfield',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'In Progress',
      userId: 'user_1',
      attachments: [],
      timeline: [
        { status: 'Submitted', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { status: 'Assigned', date: new Date(Date.now() - 86400000 * 1.5).toISOString() },
        { status: 'In Progress', date: new Date(Date.now() - 86400000 * 1).toISOString() }
      ]
    },
    {
      id: 'cmp_2',
      title: 'Streetlight completely broken',
      category: 'Utilities',
      department: 'Electrical',
      priority: 'Medium',
      description: 'The streetlight outside my house has been broken for a week.',
      location: '45 Elm St, Springfield',
      date: new Date(Date.now() - 86400000 * 5).toISOString(),
      status: 'Resolved',
      userId: 'user_1',
      attachments: [],
      timeline: [
        { status: 'Submitted', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { status: 'Resolved', date: new Date(Date.now() - 86400000 * 2).toISOString() }
      ]
    }
  ]
};

class MockDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('cm_data_initialized')) {
      localStorage.setItem('cm_users', JSON.stringify(INITIAL_DATA.users));
      localStorage.setItem('cm_complaints', JSON.stringify(INITIAL_DATA.complaints));
      localStorage.setItem('cm_data_initialized', 'true');
    }
  }

  get(collection) {
    return JSON.parse(localStorage.getItem(`cm_${collection}`) || '[]');
  }

  set(collection, data) {
    localStorage.setItem(`cm_${collection}`, JSON.stringify(data));
  }

  // --- Auth Methods ---
  async login(email, password) {
    await delay();
    const users = this.get('users');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    const { password: _, ...userWithoutPassword } = user;
    return { token: `mock_token_${user.id}`, user: userWithoutPassword };
  }

  async register(data) {
    await delay();
    const users = this.get('users');
    if (users.find(u => u.email === data.email)) {
      throw new Error('Email already exists');
    }
    const newUser = {
      id: generateId(),
      ...data,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    };
    users.push(newUser);
    this.set('users', users);
    const { password: _, ...userWithoutPassword } = newUser;
    return { token: `mock_token_${newUser.id}`, user: userWithoutPassword };
  }

  async getCurrentUser(token) {
    await delay(300);
    const userId = token.split('mock_token_')[1];
    const users = this.get('users');
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('Invalid token');
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword };
  }

  // --- Complaint Methods ---
  async getComplaints(userId = null) {
    await delay();
    let complaints = this.get('complaints');
    if (userId) {
      complaints = complaints.filter(c => c.userId === userId);
    }
    return complaints.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getComplaintById(id) {
    await delay(500);
    const complaints = this.get('complaints');
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) throw new Error('Complaint not found');
    return complaint;
  }

  async createComplaint(data, userId) {
    await delay(1000);
    const complaints = this.get('complaints');
    const newComplaint = {
      id: generateId(),
      ...data,
      date: new Date().toISOString(),
      status: 'Submitted',
      userId,
      timeline: [
        { status: 'Submitted', date: new Date().toISOString() }
      ]
    };
    complaints.push(newComplaint);
    this.set('complaints', complaints);
    return newComplaint;
  }

  async updateComplaintStatus(id, status) {
    await delay();
    const complaints = this.get('complaints');
    const index = complaints.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Complaint not found');
    
    complaints[index].status = status;
    complaints[index].timeline.push({
      status,
      date: new Date().toISOString()
    });
    
    this.set('complaints', complaints);
    return complaints[index];
  }

  // --- Analytics Methods ---
  async getStats(isAdmin = false, userId = null) {
    await delay();
    const allComplaints = this.get('complaints');
    const complaints = isAdmin ? allComplaints : allComplaints.filter(c => c.userId === userId);
    
    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => ['Submitted', 'Under Review'].includes(c.status)).length,
      inProgress: complaints.filter(c => ['Assigned', 'In Progress'].includes(c.status)).length,
      resolved: complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length,
    };
    return stats;
  }
}

export const mockDb = new MockDatabase();
