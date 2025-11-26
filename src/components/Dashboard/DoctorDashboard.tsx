import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api.service';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp,
  Video,
  FileText,
  CheckCircle
} from 'lucide-react';

interface DoctorDashboardProps {
  onNavigate: (view: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [mappedPatients, setMappedPatients] = useState<Array<{ id: string; name: string; bookedAt?: string }>>([]);

  useEffect(() => {
    const load = async () => {
      // Try backend first if we have a user id
      if (user?.id) {
        try {
          const apiPatients = await apiService.getPatientsForDoctor(user.id);
          // Ensure shape with optional bookedAt
          const normalized = (apiPatients || []).map(p => ({ id: p.id, name: p.name, bookedAt: p.bookedAt }));
          setMappedPatients(normalized);
          // Sync to localStorage for directory badges
          try {
            const key = 'doctorPatients';
            const raw = localStorage.getItem(key);
            const store: Record<string, Array<{ id: string; name: string; bookedAt?: string }>> = raw ? JSON.parse(raw) : {};
            const doctorKey = user?.name || '';
            if (doctorKey) {
              store[doctorKey] = normalized;
              localStorage.setItem(key, JSON.stringify(store));
            }
          } catch {}
          return;
        } catch (e) {
          // fall through to local storage
        }
      }

      // Fallback to localStorage using doctor name as key (mock/demo mode)
      try {
        const key = 'doctorPatients';
        const raw = localStorage.getItem(key);
        const store: Record<string, Array<{ id: string; name: string; bookedAt?: string }>> = raw ? JSON.parse(raw) : {};
        const doctorKey = user?.name || '';
        setMappedPatients(store[doctorKey] || []);
      } catch (e) {
        setMappedPatients([]);
      }
    };
    load();
  }, [user?.name]);

  const todayAppointments = [
    {
      id: '1',
      patientName: 'John Doe',
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'upcoming',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      time: '11:30 AM',
      type: 'Initial Consultation',
      status: 'upcoming',
    },
    {
      id: '3',
      patientName: 'Robert Johnson',
      time: '2:00 PM',
      type: 'Follow-up',
      status: 'completed',
    },
  ];

  const stats = [
    {
      label: 'Today\'s Appointments',
      value: '5',
      icon: Calendar,
      color: 'blue',
    },
    {
      label: 'Active Patients',
      value: String(mappedPatients.length),
      icon: Users,
      color: 'teal',
    },
    {
      label: 'This Week',
      value: '23',
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Completed Today',
      value: '3',
      icon: CheckCircle,
      color: 'purple',
    },
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      teal: 'text-teal-600 bg-teal-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Good morning, {user?.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Here's your practice overview for today
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 text-teal-600 mr-2" />
            Mapped Patients
          </h2>
        </div>
        <div className="p-6">
          {mappedPatients.length === 0 ? (
            <div className="text-gray-600">No patients mapped yet. When a patient books you, they'll appear here.</div>
          ) : (
            <div className="space-y-3">
              {mappedPatients.map((p) => (
                <div key={`${p.id}-${p.bookedAt}`} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-sm text-gray-600">Booked: {p.bookedAt}</div>
                  </div>
                  <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors" onClick={() => onNavigate('appointments')}>
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${getStatColor(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => onNavigate('appointments')}
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-6 text-left transition-colors group"
        >
          <div className="flex items-center">
            <Video className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Start Consultation</h3>
              <p className="text-sm text-gray-600">Join scheduled video calls</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('patients')}
          className="bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-6 text-left transition-colors group"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-teal-600 group-hover:scale-110 transition-transform" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
              <p className="text-sm text-gray-600">View patient history and notes</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-6 text-left transition-colors group"
        >
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Manage availability and info</p>
            </div>
          </div>
        </button>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            Today's Schedule
          </h2>
        </div>
        <div className="p-6">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    appointment.status === 'completed' 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patientName}
                      </h3>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">
                        {appointment.time}
                      </span>
                      {appointment.status === 'upcoming' ? (
                        <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};