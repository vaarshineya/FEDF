import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Stethoscope, User } from 'lucide-react';

interface RoleInfoProps {
  onProceed: () => void;
}

export const RoleInfo: React.FC<RoleInfoProps> = ({ onProceed }) => {
  const { user } = useAuth();
  const roleLabel = user?.role === 'doctor' ? 'Doctor' : 'Patient';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-100 rounded-full shadow-md">
            {user?.role === 'doctor' ? (
              <Stethoscope className="h-12 w-12 text-blue-600" />
            ) : (
              <User className="h-12 w-12 text-teal-600" />
            )}
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome</h1>
        <p className="text-gray-600 mb-6">You are logged in as</p>
        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 mb-8">
          {roleLabel}
        </div>

        <button
          type="button"
          onClick={onProceed}
          className="w-full py-3 px-4 rounded-lg text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-md transition"
        >
          Go to {roleLabel} Dashboard
        </button>
      </div>
    </div>
  );
};
