import React from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Shield } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">My Profile</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <Avatar name={user?.name} size="xl" className="mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{user?.role} Account</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-bg rounded-xl">
              <User className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Full Name</p>
                <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-bg rounded-xl">
              <Mail className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Email</p>
                <p className="font-semibold text-slate-900 dark:text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-dark-bg rounded-xl">
              <Shield className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Role</p>
                <p className="font-semibold text-slate-900 dark:text-white capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button variant="outline">Edit Profile</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserProfile;
