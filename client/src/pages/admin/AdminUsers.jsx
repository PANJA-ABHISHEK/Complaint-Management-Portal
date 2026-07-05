import { formatDate } from '../../utils/dateUtils';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiUsers, HiUserAdd, HiTrash, HiPencil } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminService } from '../../services/dataService';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Avatar from '../../components/ui/Avatar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'user', password: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await adminService.getUsers(params);
      setUsers(res.data?.users || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const openCreateModal = () => {
    setEditUser(null);
    setFormData({ name: '', email: '', phone: '', role: 'user', password: '' });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, password: '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editUser) {
        await adminService.updateUser(editUser._id, formData);
        toast.success('User updated!');
      } else {
        await adminService.createUser(formData);
        toast.success('User created!');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await adminService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const roleVariants = { admin: 'danger', officer: 'info', user: 'secondary' };
  const roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'officer', label: 'Officer' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage users, officers, and admins</p>
        </div>
        <Button icon={HiUserAdd} onClick={openCreateModal}>Add User</Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-slate-900 dark:text-white" />
          </form>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="officer">Officer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />)}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <HiUsers className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No users found</h3>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">User</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Email</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Phone</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Role</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Joined</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={u.name} size="sm" />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-sm text-slate-500">{u.email}</td>
                      <td className="py-3 pr-3 text-sm text-slate-500">{u.phone || '—'}</td>
                      <td className="py-3 pr-3"><Badge variant={roleVariants[u.role]}>{u.role}</Badge></td>
                      <td className="py-3 pr-3 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-500 cursor-pointer">
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(u._id, u.name)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 cursor-pointer">
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
                <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Edit User' : 'Create New User'}>
        <div className="space-y-4">
          <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} disabled={!!editUser} />
          <Input label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          <Select label="Role" options={roleOptions} value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
          {!editUser && (
            <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editUser ? 'Save Changes' : 'Create User'}</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AdminUsers;
