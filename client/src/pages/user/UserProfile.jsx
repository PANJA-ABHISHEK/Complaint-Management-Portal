import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiPhone, HiCamera } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/dataService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: { name: user?.name, email: user?.email, phone: user?.phone || '' },
  });

  const { register: regPassword, handleSubmit: handlePassword, formState: { errors: passErrors }, reset: resetPassword } = useForm();

  const onProfileSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await authService.updateProfile(data);
      updateUser(res.data?.user || data);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    try {
      setPasswordLoading(true);
      await authService.changePassword(data);
      toast.success('Password changed!');
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await authService.uploadAvatar(formData);
      updateUser({ ...user, avatar: res.data?.avatar });
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>

      {/* Avatar */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Avatar src={user?.avatar} name={user?.name} size="xl" />
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <HiCamera className="w-6 h-6 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            <p className="text-xs text-primary-500 capitalize mt-1">{user?.role}</p>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h2>
        <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            icon={HiUser}
            error={profileErrors.name?.message}
            {...regProfile('name', { required: 'Name is required' })}
          />
          <Input
            label="Email"
            type="email"
            icon={HiMail}
            disabled
            error={profileErrors.email?.message}
            {...regProfile('email')}
          />
          <Input
            label="Phone"
            icon={HiPhone}
            {...regProfile('phone')}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={loading}>Save Changes</Button>
          </div>
        </form>
      </Card>

      {/* Password Change */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Change Password</h2>
        <form onSubmit={handlePassword(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            error={passErrors.currentPassword?.message}
            {...regPassword('currentPassword', { required: 'Current password is required' })}
          />
          <Input
            label="New Password"
            type="password"
            error={passErrors.newPassword?.message}
            {...regPassword('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            error={passErrors.confirmPassword?.message}
            {...regPassword('confirmPassword', { required: 'Please confirm password' })}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={passwordLoading} variant="outline">Change Password</Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
