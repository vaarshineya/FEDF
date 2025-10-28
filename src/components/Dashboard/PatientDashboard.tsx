import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, 
  Search, 
  Activity, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface PatientDashboardProps {
  onNavigate: (view: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'General Practice',
      date: '2025-01-15',
      time: '10:00 AM',
      type: 'Video Consultation',
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      date: '2025-01-20',
      time: '2:30 PM',
      type: 'Video Consultation',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'symptom-check',
      description: 'Completed symptom analysis',
      date: '2025-01-10',
      status: 'completed',
    },
    {
      id: '2',
      type: 'appointment',
      description: 'Consultation with Dr. Johnson',
      date: '2025-01-08',
      status: 'completed',
    },
    {
      id: '3',
      type: 'prescription',
      description: 'New prescription received',
      date: '2025-01-08',
      status: 'new',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your health journey
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => onNavigate('symptom-checker')}
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-6 text-left transition-colors group"
        >
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Check Symptoms</h3>
              <p className="text-sm text-gray-600">Get AI-powered health insights</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('find-doctors')}
          className="bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg p-6 text-left transition-colors group"
        >
          <div className="flex items-center">
            <Search className="h-8 w-8 text-teal-600 group-hover:scale-110 transition-transform" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Find Doctors</h3>
              <p className="text-sm text-gray-600">Book appointments with specialists</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('appointments')}
          className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-6 text-left transition-colors group"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">My Appointments</h3>
              <p className="text-sm text-gray-600">View and manage consultations</p>
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                Upcoming Appointments
              </h2>
            </div>
            <div className="p-6">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
                  <button
                    onClick={() => onNavigate('find-doctors')}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Book an appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.doctorName}
                          </h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <p className="text-sm text-blue-600 mt-1">{appointment.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.date}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Overview & Recent Activity */}
        <div className="space-y-6">
          {/* Health Score (Mock) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                Health Score
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">85</div>
                <p className="text-sm text-gray-600 mb-4">Good health status</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};