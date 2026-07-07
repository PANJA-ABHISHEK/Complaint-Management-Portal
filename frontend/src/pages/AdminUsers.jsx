import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiUserX, FiUserCheck } from 'react-icons/fi';

const AdminUsers = () => {
  const { showToast, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let query = '';
      const params = [];
      if (role) params.push(`role=${role}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      
      if (params.length > 0) {
        query = `?${params.join('&')}`;
      }
      
      const data = await api.get(`/users${query}`);
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userToUpdate) => {
    const nextStatus = userToUpdate.status === 'active' ? 'blocked' : 'active';
    
    if (userToUpdate._id === currentUser._id) {
      showToast('You cannot block your own administrative account', 'error');
      return;
    }

    if (!window.confirm(`Are you sure you want to ${nextStatus === 'blocked' ? 'Block' : 'Unblock'} ${userToUpdate.name}?`)) return;

    try {
      const data = await api.put(`/users/${userToUpdate._id}/status`, { status: nextStatus });
      if (data.success) {
        showToast(`User is now ${nextStatus}`, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === userToUpdate._id ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6 sm:p-10 flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Registries</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
          Review details of citizens and staff members. Restrict access or block accounts when necessary.
        </p>
      </div>

      {/* Search & filters */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex flex-col sm:flex-row gap-6 items-center justify-between relative overflow-hidden">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-xl relative z-10">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-5 top-4 text-slate-400 text-lg group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone number..."
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all active:scale-95"
          >
            Search
          </button>
        </form>

        <div className="flex gap-4 items-center relative z-10 w-full sm:w-auto">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex-shrink-0">Role Filter</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full sm:w-48 px-5 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium text-slate-700 cursor-pointer appearance-none"
          >
            <option value="">All Roles</option>
            <option value="user">Citizens (User)</option>
            <option value="admin">Officers (Admin)</option>
          </select>
        </div>
      </div>

      {/* Grid table */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/40 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm font-bold">Fetching user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <FiUserX className="text-2xl" />
            </div>
            <h3 className="text-slate-700 font-bold text-lg">No accounts found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm">
              We couldn't find any users matching your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-xs">
                  <th className="py-5 px-6 lg:px-8">User Name</th>
                  <th className="py-5 px-6 lg:px-8">Email Address</th>
                  <th className="py-5 px-6 lg:px-8">Phone Number</th>
                  <th className="py-5 px-6 lg:px-8">System Role</th>
                  <th className="py-5 px-6 lg:px-8">Account Status</th>
                  <th className="py-5 px-6 lg:px-8">Registered Date</th>
                  <th className="py-5 px-6 lg:px-8 text-center">Action Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-5 px-6 lg:px-8 font-extrabold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td className="py-5 px-6 lg:px-8 font-medium text-slate-500">{u.email}</td>
                    <td className="py-5 px-6 lg:px-8 font-medium text-slate-500">{u.phone || 'N/A'}</td>
                    <td className="py-5 px-6 lg:px-8">
                      <span
                        className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider border shadow-sm ${
                          u.role === 'admin'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-5 px-6 lg:px-8">
                      <span
                        className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase tracking-wider border shadow-sm flex items-center w-fit gap-1.5 ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 lg:px-8 text-slate-400 font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-6 lg:px-8">
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={u._id === currentUser._id}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm active:scale-95 border ${
                            u.status === 'active'
                              ? 'bg-white hover:bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-200'
                              : 'bg-white hover:bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200'
                          } disabled:opacity-40 disabled:active:scale-100`}
                        >
                          {u.status === 'active' ? (
                            <>
                              <FiUserX className="text-sm" /> Restrict
                            </>
                          ) : (
                            <>
                              <FiUserCheck className="text-sm" /> Activate
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
