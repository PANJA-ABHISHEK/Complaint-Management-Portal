const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Initialize mock local storage databases if not already present
const initMockDB = () => {
  const mockDepts = [
    { _id: '1', name: 'Water Supply & Sewage', description: 'Grievances related to drinking water shortage and quality.', headOfDept: 'John Carter' },
    { _id: '2', name: 'Electricity & Street Lights', description: 'Faulty streetlights and broken wiring.', headOfDept: 'Sarah Jenkins' },
    { _id: '3', name: 'Sanitation & Waste Management', description: 'Garbage accumulation and public toilet issues.', headOfDept: 'Robert De Niro' },
    { _id: '4', name: 'Roads & Infrastructure', description: 'Potholes and broken footpaths.', headOfDept: 'Diana Prince' },
    { _id: '5', name: 'Public Health & Safety', description: 'Stray dogs, chemical spraying, and food inspection.', headOfDept: 'Dr. Bruce Banner' }
  ];

  const mockUsers = [
    { _id: 'admin-id', name: 'Portal Administrator', email: 'admin@portal.gov.in', role: 'admin', status: 'active', createdAt: '2026-06-01T00:00:00.000Z' },
    { _id: 'officer-id', name: 'Officer John (Water Dept)', email: 'officer.water@portal.gov.in', role: 'officer', assignedDepartment: '1', status: 'active', createdAt: '2026-06-02T00:00:00.000Z' },
    { _id: 'officer-elec', name: 'Officer Sarah (Electricity)', email: 'officer.electricity@portal.gov.in', role: 'officer', assignedDepartment: '2', status: 'active', createdAt: '2026-06-02T00:00:00.000Z' },
    { _id: 'officer-san', name: 'Officer Mike (Sanitation)', email: 'officer.sanitation@portal.gov.in', role: 'officer', assignedDepartment: '3', status: 'active', createdAt: '2026-06-02T00:00:00.000Z' },
    { _id: 'officer-road', name: 'Officer Dave (Roads)', email: 'officer.roads@portal.gov.in', role: 'officer', assignedDepartment: '4', status: 'active', createdAt: '2026-06-02T00:00:00.000Z' },
    { _id: 'officer-health', name: 'Officer Lisa (Health)', email: 'officer.health@portal.gov.in', role: 'officer', assignedDepartment: '5', status: 'active', createdAt: '2026-06-02T00:00:00.000Z' },
    { _id: 'user-id', name: 'Aromal Kumar', email: 'aromal@gmail.com', role: 'user', status: 'active', createdAt: '2026-06-03T00:00:00.000Z' },
    { _id: 'user-id-2', name: 'Rohan Sharma', email: 'rohan@gmail.com', role: 'user', status: 'active', createdAt: '2026-06-04T00:00:00.000Z' }
  ];

  const mockComplaints = [
    {
      _id: 'c1',
      complaintId: 'CMP-20260707-1001',
      userId: mockUsers[2],
      title: 'Water pipeline leak in sector 4',
      description: 'The main drinking water pipe is leaking heavily near the public park entrance. Thousands of liters of drinking water are being wasted since last night. Please fix this on high priority.',
      category: mockDepts[0],
      priority: 'high',
      status: 'Submitted',
      assignedDepartment: mockDepts[0],
      location: 'Park Street Crossroad, Sector 4, City',
      slaDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-07-07T08:00:00.000Z',
      updatedAt: '2026-07-07T08:00:00.000Z'
    },
    {
      _id: 'c2',
      complaintId: 'CMP-20260707-1002',
      userId: mockUsers[2],
      title: 'Street light broken on Main Avenue',
      description: 'Three consecutive street lights have been down for a week. The road becomes pitch black after 7 PM, making it extremely unsafe for women and children.',
      category: mockDepts[1],
      priority: 'medium',
      status: 'Assigned',
      assignedDepartment: mockDepts[1],
      assignedTo: mockUsers[1],
      location: 'Main Avenue Road, Landmark: opposite SBI Bank',
      slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-07-06T10:00:00.000Z',
      updatedAt: '2026-07-06T12:00:00.000Z'
    },
    {
      _id: 'c3',
      complaintId: 'CMP-20260707-1003',
      userId: mockUsers[3],
      title: 'Garbage dump pile overflowing in colony park',
      description: 'The main community dump point is overflowing. The garbage truck has not arrived in 5 days. Foul smell is spreading.',
      category: mockDepts[2],
      priority: 'medium',
      status: 'In Progress',
      assignedDepartment: mockDepts[2],
      location: 'Colony Park Back gate, Sector 12',
      slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-07-05T09:00:00.000Z',
      updatedAt: '2026-07-05T15:00:00.000Z'
    },
    {
      _id: 'c4',
      complaintId: 'CMP-20260707-1004',
      userId: mockUsers[3],
      title: 'Severe mosquito breeding in stagnant water body',
      description: 'A vacant construction plot has stagnant water accumulated which is acting as a breeding ground for mosquitoes.',
      category: mockDepts[4],
      priority: 'critical',
      status: 'Resolved',
      assignedDepartment: mockDepts[4],
      location: 'Plot 404, Block-C, Green Woods Layout',
      slaDeadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      resolutionNotes: 'Stagnant water has been pumped out and larvicide chemical spraying was carried out across the entire street block.',
      resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      createdAt: '2026-07-06T09:00:00.000Z',
      updatedAt: '2026-07-07T01:00:00.000Z'
    }
  ];

  const mockTimelines = {
    c1: [
      { _id: 't1', complaintId: 'c1', status: 'Submitted', remarks: 'Complaint registered by citizen.', updatedBy: mockUsers[2], timestamp: '2026-07-07T08:00:00.000Z' }
    ],
    c2: [
      { _id: 't2', complaintId: 'c2', status: 'Submitted', remarks: 'Grievance ticket raised.', updatedBy: mockUsers[2], timestamp: '2026-07-06T10:00:00.000Z' },
      { _id: 't3', complaintId: 'c2', status: 'Assigned', remarks: 'Assigned to Electricity department and officer John.', updatedBy: mockUsers[0], timestamp: '2026-07-06T12:00:00.000Z' }
    ],
    c3: [
      { _id: 't4', complaintId: 'c3', status: 'Submitted', remarks: 'Registered.', updatedBy: mockUsers[3], timestamp: '2026-07-05T09:00:00.000Z' },
      { _id: 't5', complaintId: 'c3', status: 'In Progress', remarks: 'Sanitation inspection crew dispatched.', updatedBy: mockUsers[0], timestamp: '2026-07-05T15:00:00.000Z' }
    ],
    c4: [
      { _id: 't6', complaintId: 'c4', status: 'Submitted', remarks: 'Registered.', updatedBy: mockUsers[3], timestamp: '2026-07-06T09:00:00.000Z' },
      { _id: 't7', complaintId: 'c4', status: 'Resolved', remarks: 'Stagnant water pools dried. Chemical treatment carried out.', updatedBy: mockUsers[0], timestamp: '2026-07-07T01:00:00.000Z' }
    ]
  };

  const mockNotifications = [
    { _id: 'n1', userId: 'user-id', message: 'Your complaint CMP-20260707-1001 regarding water leak has been Submitted.', type: 'status_change', isRead: false, createdAt: new Date().toISOString() },
    { _id: 'n2', userId: 'user-id', message: 'Your complaint CMP-20260707-1002 has been assigned to Electricity department.', type: 'assignment', isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() }
  ];

  const mockFeedbacks = {
    c4: { _id: 'f1', complaintId: 'c4', rating: 5, comment: 'Thank you for the quick action! The health workers were professional and sprayed the chemicals thoroughly.', createdAt: '2026-07-07T02:00:00.000Z' }
  };

  const mockPlatformFeedbacks = [
    {
      _id: 'pf1',
      user: { name: 'Aromal Kumar', role: 'user', image: '11' },
      comment: 'File submission was seamless. The water leakage was resolved within 24 hours of reporting, and I was updated with SMS and timeline logs. Excellent initiative by the government.',
      rating: 5,
      createdAt: '2026-07-07T09:00:00.000Z'
    },
    {
      _id: 'pf2',
      user: { name: 'Rohan Sharma', role: 'user', image: '12' },
      comment: 'The street light issue in our area has been pending for months. After registering a ticket here, the status was updated and fixed within 3 days. The transparency is brilliant.',
      rating: 4,
      createdAt: '2026-07-06T11:00:00.000Z'
    },
    {
      _id: 'pf3',
      user: { name: 'Manoj Dev', role: 'admin', image: '14' },
      comment: 'As an administrator, compiling monthly reports and routing cases to field staff takes only a click. It has simplified municipal management immensely for our whole team.',
      rating: 5,
      createdAt: '2026-07-05T14:00:00.000Z'
    }
  ];

  if (!localStorage.getItem('mock_departments')) localStorage.setItem('mock_departments', JSON.stringify(mockDepts));
  if (!localStorage.getItem('mock_users')) localStorage.setItem('mock_users', JSON.stringify(mockUsers));
  if (!localStorage.getItem('mock_complaints')) localStorage.setItem('mock_complaints', JSON.stringify(mockComplaints));
  if (!localStorage.getItem('mock_timelines')) localStorage.setItem('mock_timelines', JSON.stringify(mockTimelines));
  if (!localStorage.getItem('mock_notifications')) localStorage.setItem('mock_notifications', JSON.stringify(mockNotifications));
  if (!localStorage.getItem('mock_feedbacks')) localStorage.setItem('mock_feedbacks', JSON.stringify(mockFeedbacks));
  if (!localStorage.getItem('mock_platform_feedbacks')) localStorage.setItem('mock_platform_feedbacks', JSON.stringify(mockPlatformFeedbacks));
};

class ApiService {
  constructor() {
    this.baseURL = API_URL;
    initMockDB();
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, method = 'GET', body = null, isMultipart = false) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders();
    
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = isMultipart ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.warn(`Backend connection failed (${error.message}). Redirecting to Mock Offline Preview data for ${method} ${endpoint}`);
      return this.handleMockRequest(endpoint, method, body);
    }
  }

  // Local Storage Database Mock logic
  handleMockRequest(endpoint, method, body) {
    return new Promise((resolve, reject) => {
      // Parse active mock databases
      const depts = JSON.parse(localStorage.getItem('mock_departments') || '[]');
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const complaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
      const timelines = JSON.parse(localStorage.getItem('mock_timelines') || '{}');
      const notifications = JSON.parse(localStorage.getItem('mock_notifications') || '[]');
      const feedbacks = JSON.parse(localStorage.getItem('mock_feedbacks') || '{}');
      const platformFeedbacks = JSON.parse(localStorage.getItem('mock_platform_feedbacks') || '[]');
      const activeMockUser = JSON.parse(localStorage.getItem('mock_user') || 'null');

      // Helper save functions
      const saveComplaints = (data) => localStorage.setItem('mock_complaints', JSON.stringify(data));
      const saveTimelines = (data) => localStorage.setItem('mock_timelines', JSON.stringify(data));
      const saveNotifications = (data) => localStorage.setItem('mock_notifications', JSON.stringify(data));
      const saveFeedbacks = (data) => localStorage.setItem('mock_feedbacks', JSON.stringify(data));
      const saveUsers = (data) => localStorage.setItem('mock_users', JSON.stringify(data));
      const savePlatformFeedbacks = (data) => localStorage.setItem('mock_platform_feedbacks', JSON.stringify(data));

      // 1. Authentication login mock
      if (endpoint.startsWith('/auth/login')) {
        const { email } = body;
        const matched = users.find((u) => u.email === email);
        if (matched) {
          localStorage.setItem('mock_user', JSON.stringify(matched));
          localStorage.setItem('token', 'mock_token');
          resolve({
            success: true,
            token: 'mock_token',
            user: matched
          });
        } else {
          reject(new Error('Invalid credentials. User account not found. Please register first.'));
        }
        return;
      }

      // 2. Authentication register mock
      if (endpoint.startsWith('/auth/register')) {
        const { name, email, phone } = body;
        const newUser = {
          _id: 'mock-dynamic-' + Date.now(),
          name,
          email,
          phone,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        saveUsers(users);
        localStorage.setItem('mock_user', JSON.stringify(newUser));
        localStorage.setItem('token', 'mock_token');
        resolve({
          success: true,
          token: 'mock_token',
          user: newUser
        });
        return;
      }

      // 3. Get current session user
      if (endpoint.startsWith('/auth/me')) {
        if (activeMockUser) {
          resolve({ success: true, user: activeMockUser });
        } else {
          reject(new Error('Unauthorized'));
        }
        return;
      }

      // 4. Update Profile
      if (endpoint.startsWith('/auth/profile')) {
        if (!activeMockUser) return reject(new Error('Unauthorized'));
        const updated = { ...activeMockUser, ...body };
        localStorage.setItem('mock_user', JSON.stringify(updated));
        
        const updatedUsers = users.map((u) => u._id === activeMockUser._id ? updated : u);
        saveUsers(updatedUsers);
        resolve({ success: true, user: updated });
        return;
      }

      // 5. Get Department categories
      if (endpoint.startsWith('/departments') && method === 'GET') {
        resolve({ success: true, count: depts.length, departments: depts });
        return;
      }

      // 6. Admin create department
      if (endpoint.startsWith('/departments') && method === 'POST') {
        const newDept = { _id: 'dept-' + Date.now(), ...body };
        depts.push(newDept);
        localStorage.setItem('mock_departments', JSON.stringify(depts));
        resolve({ success: true, department: newDept });
        return;
      }

      // 7. Get Notifications
      if (endpoint.startsWith('/notifications') && method === 'GET') {
        const userNotifs = notifications.filter((n) => n.userId === activeMockUser._id);
        resolve({ success: true, count: userNotifs.length, notifications: userNotifs });
        return;
      }

      // 8. Mark notification read
      if (endpoint.startsWith('/notifications/read-all')) {
        const updated = notifications.map((n) => n.userId === activeMockUser._id ? { ...n, isRead: true } : n);
        saveNotifications(updated);
        resolve({ success: true });
        return;
      }

      if (endpoint.startsWith('/notifications/')) {
        const notifId = endpoint.split('/')[2];
        const updated = notifications.map((n) => n._id === notifId ? { ...n, isRead: true } : n);
        saveNotifications(updated);
        resolve({ success: true });
        return;
      }

      // 9. Admin Dashboard Reports & Statistics
      if (endpoint.startsWith('/reports/admin-dashboard')) {
        const pendingCount = complaints.filter((c) => ['Submitted', 'Assigned', 'In Progress'].includes(c.status)).length;
        const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
        const closedCount = complaints.filter((c) => c.status === 'Closed').length;

        // priority groups
        const prioritySplit = { low: 0, medium: 0, high: 0, critical: 0 };
        complaints.forEach((c) => { if (c.priority in prioritySplit) prioritySplit[c.priority]++; });

        // category splits
        const categorySplit = depts.map((d) => ({
          name: d.name,
          count: complaints.filter((c) => c.category?._id === d._id || c.category === d._id).length
        }));

        const monthlyTrend = [
          { monthName: 'Feb 2026', count: 4 },
          { monthName: 'Mar 2026', count: 8 },
          { monthName: 'Apr 2026', count: 15 },
          { monthName: 'May 2026', count: 24 },
          { monthName: 'Jun 2026', count: 32 },
          { monthName: 'Jul 2026', count: complaints.length }
        ];

        resolve({
          success: true,
          stats: {
            total: complaints.length,
            pending: pendingCount,
            resolved: resolvedCount,
            closed: closedCount,
            slaBreach: 2,
            avgResolutionTimeHours: 14.2
          },
          prioritySplit,
          categorySplit,
          monthlyTrend
        });
        return;
      }

      // 10. User Dashboard Reports
      if (endpoint.startsWith('/reports/user-dashboard')) {
        const userComps = complaints.filter((c) => c.userId?._id === activeMockUser._id || c.userId === activeMockUser._id || c.userId === activeMockUser);
        const pendingCount = userComps.filter((c) => ['Submitted', 'Assigned', 'In Progress'].includes(c.status)).length;
        const resolvedCount = userComps.filter((c) => c.status === 'Resolved').length;
        const closedCount = userComps.filter((c) => c.status === 'Closed').length;

        resolve({
          success: true,
          stats: {
            total: userComps.length,
            pending: pendingCount,
            resolved: resolvedCount,
            closed: closedCount
          },
          recentComplaints: userComps.slice(0, 5)
        });
        return;
      }

      // 10b. Officer Dashboard Reports
      if (endpoint.startsWith('/reports/officer-dashboard')) {
        const deptComps = complaints.filter(
          (c) => c.assignedDepartment?._id === activeMockUser.assignedDepartment || c.category?._id === activeMockUser.assignedDepartment
        );
        const pendingCount = deptComps.filter((c) => ['Submitted', 'Assigned', 'In Progress'].includes(c.status)).length;
        const resolvedCount = deptComps.filter((c) => c.status === 'Resolved').length;
        const closedCount = deptComps.filter((c) => c.status === 'Closed').length;

        // SLA breaches
        const now = new Date();
        const activeBreaches = deptComps.filter((c) => 
          ['Submitted', 'Assigned', 'In Progress'].includes(c.status) && new Date(c.slaDeadline) < now
        ).length;

        const monthlyTrend = [
          { monthName: 'Feb 2026', count: 1 },
          { monthName: 'Mar 2026', count: 2 },
          { monthName: 'Apr 2026', count: 5 },
          { monthName: 'May 2026', count: 8 },
          { monthName: 'Jun 2026', count: 12 },
          { monthName: 'Jul 2026', count: deptComps.length }
        ];

        const department = depts.find(d => d._id === activeMockUser.assignedDepartment) || null;

        resolve({
          success: true,
          department,
          recentComplaints: deptComps.slice(0, 10),
          stats: {
            total: deptComps.length,
            pending: pendingCount,
            resolved: resolvedCount,
            closed: closedCount,
            slaBreach: activeBreaches,
            avgResolutionTimeHours: 12.5
          },
          monthlyTrend
        });
        return;
      }

      // 11. Create a Complaint (Citizen submission)
      if (endpoint === '/complaints' && method === 'POST') {
        let title, description, category, priority, location;
        if (body instanceof FormData) {
          title = body.get('title');
          description = body.get('description');
          category = body.get('category');
          priority = body.get('priority');
          location = body.get('location');
        } else {
          ({ title, description, category, priority, location } = body);
        }
        
        // Find matching category object
        const catObj = depts.find((d) => d._id === category) || depts[0];
        
        const generatedId = `CMP-20260707-${Math.floor(1000 + Math.random() * 9000)}`;
        const newComp = {
          _id: 'c-' + Date.now(),
          complaintId: generatedId,
          userId: activeMockUser,
          title,
          description,
          category: catObj,
          priority: priority || 'medium',
          status: 'Submitted',
          assignedDepartment: catObj,
          location,
          slaDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        complaints.unshift(newComp);
        saveComplaints(complaints);

        // Add to timeline
        timelines[newComp._id] = [
          { _id: 't-' + Date.now(), complaintId: newComp._id, status: 'Submitted', remarks: 'Complaint registered by citizen.', updatedBy: activeMockUser, timestamp: new Date().toISOString() }
        ];
        saveTimelines(timelines);

        resolve({ success: true, complaint: newComp });
        return;
      }

      // 12. Get Citizen complaints list
      if (endpoint === '/complaints' && method === 'GET') {
        const userComps = complaints.filter((c) => {
          const uId = c.userId?._id || c.userId;
          return uId === activeMockUser._id;
        });
        resolve({ success: true, complaints: userComps });
        return;
      }

      // 13. Get all complaints (Admin View)
      if (endpoint.startsWith('/complaints/all') && method === 'GET') {
        resolve({ success: true, complaints });
        return;
      }

      // 13b. Get department complaints (Officer View)
      if (endpoint.startsWith('/complaints/department') && method === 'GET') {
        const deptComps = complaints.filter(
          (c) => c.assignedDepartment?._id === activeMockUser.assignedDepartment || c.category?._id === activeMockUser.assignedDepartment
        );
        resolve({ success: true, complaints: deptComps });
        return;
      }

      // 14. Get details of a single Complaint
      if (endpoint.startsWith('/complaints/') && method === 'GET') {
        const compId = endpoint.split('/')[2];
        const comp = complaints.find((c) => c._id === compId);
        if (!comp) return reject(new Error('Complaint not found'));

        const compTimeline = timelines[compId] || [];
        const compFeedback = feedbacks[compId] || null;

        resolve({
          success: true,
          complaint: comp,
          timeline: compTimeline,
          feedback: compTimeline.status === 'Closed' ? compFeedback : compFeedback
        });
        return;
      }

      // 15. Admin assign complaint department
      if (endpoint.startsWith('/complaints/') && endpoint.endsWith('/assign') && method === 'PUT') {
        const compId = endpoint.split('/')[2];
        const { departmentId, officerId } = body;
        
        const compIndex = complaints.findIndex((c) => c._id === compId);
        if (compIndex === -1) return reject(new Error('Complaint not found'));

        const deptObj = depts.find((d) => d._id === departmentId);
        const officerObj = users.find((u) => u._id === officerId);

        complaints[compIndex].assignedDepartment = deptObj;
        complaints[compIndex].assignedTo = officerObj || null;
        
        if (complaints[compIndex].status === 'Submitted') {
          complaints[compIndex].status = 'Assigned';
        }

        saveComplaints(complaints);

        // Add history timeline log
        const log = {
          _id: 't-' + Date.now(),
          complaintId: compId,
          status: complaints[compIndex].status,
          remarks: `Assigned to department: ${deptObj?.name}. Officer: ${officerObj ? officerObj.name : 'Unassigned'}`,
          updatedBy: activeMockUser,
          timestamp: new Date().toISOString()
        };

        if (!timelines[compId]) timelines[compId] = [];
        timelines[compId].push(log);
        saveTimelines(timelines);

        resolve({ success: true, complaint: complaints[compIndex] });
        return;
      }

      // 16. Admin/Officer Update Complaint Status
      if (endpoint.startsWith('/complaints/') && endpoint.endsWith('/status') && method === 'PUT') {
        const compId = endpoint.split('/')[2];
        const { status, remarks, resolutionNotes } = body;

        const compIndex = complaints.findIndex((c) => c._id === compId);
        if (compIndex === -1) return reject(new Error('Complaint not found'));

        complaints[compIndex].status = status;
        if (status === 'Resolved') {
          complaints[compIndex].resolutionNotes = resolutionNotes || 'Resolution remarks updated.';
          complaints[compIndex].resolvedAt = new Date().toISOString();
        }

        saveComplaints(complaints);

        // Add timeline
        const log = {
          _id: 't-' + Date.now(),
          complaintId: compId,
          status,
          remarks: remarks || `Status updated to ${status}`,
          updatedBy: activeMockUser,
          timestamp: new Date().toISOString()
        };

        if (!timelines[compId]) timelines[compId] = [];
        timelines[compId].push(log);
        saveTimelines(timelines);

        resolve({ success: true, complaint: complaints[compIndex] });
        return;
      }

      // 17. Submit feedback
      if (endpoint.startsWith('/feedback') && method === 'POST') {
        const { complaintId, rating, comment } = body;
        const newFeedback = {
          _id: 'f-' + Date.now(),
          complaintId,
          rating: Number(rating),
          comment,
          createdAt: new Date().toISOString()
        };
        feedbacks[complaintId] = newFeedback;
        saveFeedbacks(feedbacks);

        resolve({ success: true, feedback: newFeedback });
        return;
      }

      // 17b. Platform Feedback (General Testimonials)
      if (endpoint === '/platform-feedback' && method === 'GET') {
        resolve({ success: true, feedbacks: platformFeedbacks });
        return;
      }

      if (endpoint === '/platform-feedback' && method === 'POST') {
        const { rating, comment } = body;
        const newPF = {
          _id: 'pf-' + Date.now(),
          user: {
            name: activeMockUser.name,
            role: activeMockUser.role,
            image: String(Math.floor(Math.random() * 70)) // random avatar
          },
          rating: Number(rating),
          comment,
          createdAt: new Date().toISOString()
        };
        platformFeedbacks.unshift(newPF); // add to top
        savePlatformFeedbacks(platformFeedbacks);

        resolve({ success: true, feedback: newPF });
        return;
      }

      // 18. Get User list (Admin)
      if (endpoint.startsWith('/users') && method === 'GET') {
        const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
        const roleQuery = urlParams.get('role');
        const searchQuery = urlParams.get('search');

        let filteredUsers = [...users];

        if (roleQuery) {
          filteredUsers = filteredUsers.filter((u) => u.role === roleQuery);
        }

        if (searchQuery) {
          const lowerSearch = searchQuery.toLowerCase();
          filteredUsers = filteredUsers.filter((u) => 
            u.name?.toLowerCase().includes(lowerSearch) || 
            u.email?.toLowerCase().includes(lowerSearch) || 
            u.phone?.toLowerCase().includes(lowerSearch)
          );
        }

        resolve({ success: true, count: filteredUsers.length, users: filteredUsers });
        return;
      }

      // 19. Block/Unblock user
      if (endpoint.startsWith('/users/') && endpoint.endsWith('/status') && method === 'PUT') {
        const userId = endpoint.split('/')[2];
        const { status } = body;

        const updatedUsers = users.map((u) => u._id === userId ? { ...u, status } : u);
        saveUsers(updatedUsers);

        resolve({ success: true, message: `User account is now ${status}` });
        return;
      }

      // Default reject if endpoint not simulated
      reject(new Error(`Offline Preview doesn't support: ${method} ${endpoint}`));
    });
  }

  get(endpoint) {
    return this.request(endpoint, 'GET');
  }

  post(endpoint, body, isMultipart = false) {
    return this.request(endpoint, 'POST', body, isMultipart);
  }

  put(endpoint, body) {
    return this.request(endpoint, 'PUT', body);
  }

  delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  }
}

export const api = new ApiService();
