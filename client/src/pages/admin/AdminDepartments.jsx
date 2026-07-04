import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOfficeBuilding, HiPlusCircle, HiPencil, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminService } from '../../services/dataService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '' });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDepartments();
      setDepartments(res.data?.departments || res.data || []);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const openCreateModal = () => {
    setEditDept(null);
    setFormData({ name: '', code: '', description: '' });
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditDept(dept);
    setFormData({ name: dept.name, code: dept.code, description: dept.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code) return toast.error('Name and code are required');
    try {
      if (editDept) {
        await adminService.updateDepartment(editDept._id, formData);
        toast.success('Department updated!');
      } else {
        await adminService.createDepartment(formData);
        toast.success('Department created!');
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete department "${name}"?`)) return;
    try {
      await adminService.deleteDepartment(id);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Departments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage complaint departments</p>
        </div>
        <Button icon={HiPlusCircle} onClick={openCreateModal}>Add Department</Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : departments.length === 0 ? (
        <Card>
          <div className="text-center py-16">
            <HiOfficeBuilding className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No departments yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Create your first department to organize complaints</p>
            <Button icon={HiPlusCircle} onClick={openCreateModal}>Create Department</Button>
          </div>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <Card key={dept._id} className="relative group">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <button onClick={() => openEditModal(dept)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-500 cursor-pointer">
                  <HiPencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(dept._id, dept.name)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 cursor-pointer">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mb-4">
                <HiOfficeBuilding className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{dept.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{dept.code}</Badge>
                {dept.isActive !== false && <Badge variant="success" dot>Active</Badge>}
              </div>
              {dept.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">{dept.description}</p>
              )}
              {dept.officerCount !== undefined && (
                <p className="text-xs text-slate-400 mt-3">{dept.officerCount} officers</p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editDept ? 'Edit Department' : 'Create Department'}>
        <div className="space-y-4">
          <Input label="Department Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Public Works" />
          <Input label="Department Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g., PWD" />
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description..." rows={3} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editDept ? 'Save Changes' : 'Create Department'}</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AdminDepartments;
