export const CATEGORIES = [
  { value: 'Electricity', label: 'Electricity', icon: '⚡', color: '#f59e0b' },
  { value: 'Water Supply', label: 'Water Supply', icon: '💧', color: '#3b82f6' },
  { value: 'Road Damage', label: 'Road Damage', icon: '🛣️', color: '#ef4444' },
  { value: 'Street Lights', label: 'Street Lights', icon: '💡', color: '#f97316' },
  { value: 'Garbage Collection', label: 'Garbage Collection', icon: '🗑️', color: '#10b981' },
  { value: 'Internet', label: 'Internet', icon: '🌐', color: '#6366f1' },
  { value: 'College', label: 'College', icon: '🎓', color: '#8b5cf6' },
  { value: 'Hostel', label: 'Hostel', icon: '🏠', color: '#ec4899' },
  { value: 'Transport', label: 'Transport', icon: '🚌', color: '#14b8a6' },
  { value: 'Health', label: 'Health', icon: '🏥', color: '#ef4444' },
  { value: 'Security', label: 'Security', icon: '🔒', color: '#64748b' },
  { value: 'Others', label: 'Others', icon: '📋', color: '#94a3b8' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' },
];

export const STATUSES = [
  { value: 'Submitted', label: 'Submitted', color: '#6366f1' },
  { value: 'Pending', label: 'Pending', color: '#f59e0b' },
  { value: 'Assigned', label: 'Assigned', color: '#3b82f6' },
  { value: 'In Progress', label: 'In Progress', color: '#8b5cf6' },
  { value: 'Resolved', label: 'Resolved', color: '#10b981' },
  { value: 'Closed', label: 'Closed', color: '#64748b' },
  { value: 'Rejected', label: 'Rejected', color: '#ef4444' },
];

export const STATUS_FLOW = ['Submitted', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

export const getStatusColor = (status) => {
  const s = STATUSES.find((st) => st.value === status);
  return s ? s.color : '#94a3b8';
};

export const getPriorityColor = (priority) => {
  const p = PRIORITIES.find((pr) => pr.value === priority);
  return p ? p.color : '#94a3b8';
};




export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

export const getStatusStep = (status) => {
  const index = STATUS_FLOW.indexOf(status);
  return index === -1 ? 0 : index;
};

export const getStatusVariant = (status) => {
  const map = {
    Submitted: 'info',
    Pending: 'warning',
    Assigned: 'info',
    'In Progress': 'primary',
    'Under Review': 'primary',
    Resolved: 'success',
    Closed: 'secondary',
    Rejected: 'danger',
  };
  return map[status] || 'secondary';
};

export const PRIORITY_COLORS = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

