import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiFolderPlus } from 'react-icons/fi';

const AdminDepartments = () => {
  const { showToast } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [headOfDept, setHeadOfDept] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/departments');
      if (data.success) {
        setDepartments(data.departments);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setHeadOfDept('');
    setShowModal(true);
  };

  const openEditModal = (dept) => {
    setEditId(dept._id);
    setName(dept.name);
    setDescription(dept.description || '');
    setHeadOfDept(dept.headOfDept || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      if (editId) {
        // Edit Department
        const data = await api.put(`/departments/${editId}`, { name, description, headOfDept });
        if (data.success) {
          showToast('Department updated successfully', 'success');
          setDepartments((prev) =>
            prev.map((d) => (d._id === editId ? data.department : d))
          );
        }
      } else {
        // Add Department
        const data = await api.post('/departments', { name, description, headOfDept });
        if (data.success) {
          showToast('Department created successfully', 'success');
          setDepartments((prev) => [...prev, data.department]);
        }
      }
      setShowModal(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the "${name}" department category? This may affect tickets mapped to this department.`)) return;

    try {
      const data = await api.delete(`/departments/${id}`);
      if (data.success) {
        showToast('Department deleted successfully', 'success');
        setDepartments((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6 sm:p-10 flex flex-col gap-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Departments & Categories</h1>
          <p className="text-slate-500 text-sm mt-2 max-w-2xl leading-relaxed font-medium">
            Manage administrative service departments. These define the complaint categories available to citizens.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-6 py-4 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl flex items-center gap-2.5 shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <FiPlus className="text-lg" /> Add Department
        </button>
      </div>

      {/* Grid list */}
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-bold">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-20 shadow-xl shadow-slate-200/40 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
            <FiFolderPlus className="text-2xl" />
          </div>
          <h3 className="text-slate-700 font-bold text-lg">No departments configured</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Click "Add Department" to configure the first category for citizens to use.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform pointer-events-none"></div>
              
              <div className="flex flex-col gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-inner mb-2 group-hover:bg-indigo-100 transition-colors">
                  <FiFolderPlus />
                </div>
                <h3 className="font-black text-slate-800 text-lg leading-snug group-hover:text-brand-600 transition-colors">{dept.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium min-h-[60px]">
                  {dept.description || 'No description provided for this department.'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5 mt-6 flex justify-between items-end relative z-10">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Head of Dept</span>
                  <span className="font-bold text-slate-700 truncate max-w-[120px] block">{dept.headOfDept || 'Unassigned'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(dept)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-brand-600 rounded-xl transition-colors"
                    title="Edit Department"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(dept._id, dept.name)}
                    className="w-10 h-10 flex items-center justify-center bg-rose-50/50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 rounded-xl transition-colors"
                    title="Delete Department"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-lg w-full border border-slate-100 shadow-2xl p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-50 rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full font-bold transition-colors z-20"
            >
              ✕
            </button>
            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FiFolderPlus className="text-lg" />
              </div>
              {editId ? 'Modify Department' : 'Create Department'}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sanitation Department"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Head of Department Name
                </label>
                <input
                  type="text"
                  value={headOfDept}
                  onChange={(e) => setHeadOfDept(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Scope & Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter details about responsibilities and grievance scopes..."
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-medium transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl font-bold text-sm text-slate-600 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                  {submitting ? 'Saving changes...' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
