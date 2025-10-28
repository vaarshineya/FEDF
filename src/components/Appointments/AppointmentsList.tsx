import React, { useState } from 'react';
import { Calendar, Clock, Video, User, FileText, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Appointment {
  id: string;
  patientName?: string;
  doctorName?: string;
  specialty?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'in-person';
  notes?: string;
  prescription?: string;
}

interface AppointmentsListProps {
  onNavigate: (view: string, data?: any) => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      ...(user?.role === 'patient' 
        ? { doctorName: 'Dr. Sarah Johnson', specialty: 'General Practice' }
        : { patientName: 'John Doe' }
      ),
      date: '2025-01-15',
      time: '10:00 AM',
      status: 'upcoming',
      type: 'video',
      notes: 'Follow-up on recent symptoms',
    },
    {
      id: '2',
      ...(user?.role === 'patient' 
        ? { doctorName: 'Dr. Michael Chen', specialty: 'Cardiology' }
        : { patientName: 'Jane Smith' }
      ),
      date: '2025-01-20',
      time: '2:30 PM',
      status: 'upcoming',
      type: 'video',
      notes: 'Initial consultation for chest pain',
    },
    {
      id: '3',
      ...(user?.role === 'patient' 
        ? { doctorName: 'Dr. Emily Rodriguez', specialty: 'Dermatology' }
        : { patientName: 'Robert Johnson' }
      ),
      date: '2025-01-08',
      time: '11:00 AM',
      status: 'completed',
      type: 'video',
      notes: 'Skin examination and treatment',
      prescription: 'Topical cream - Apply twice daily for 2 weeks',
    },
  ];

  const upcomingAppointments = mockAppointments.filter(apt => apt.status === 'upcoming');
  const pastAppointments = mockAppointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-700 bg-blue-100';
      case 'completed': return 'text-green-700 bg-green-100';
      case 'cancelled': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const startConsultation = (appointmentId: string) => {
    onNavigate('consultation', { appointmentId });
  };

  const viewPrescription = (prescription: string) => {
    alert(`Prescription: ${prescription}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {user?.role === 'patient' ? 'My Appointments' : 'Patient Appointments'}
        </h1>
        <p className="mt-2 text-gray-600">
          {user?.role === 'patient' 
            ? 'Manage your upcoming and past consultations'
            : 'View and manage your scheduled consultations'
          }
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past ({pastAppointments.length})
          </button>
        </nav>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map(appointment => (
          <div key={appointment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user?.role === 'patient' ? appointment.doctorName : appointment.patientName}
                      </h3>
                      {user?.role === 'patient' && appointment.specialty && (
                        <p className="text-sm text-blue-600">{appointment.specialty}</p>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {appointment.time}
                  </div>
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-1" />
                    {appointment.type === 'video' ? 'Video Call' : 'In-Person'}
                  </div>
                </div>

                {appointment.notes && (
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>Notes:</strong> {appointment.notes}
                  </p>
                )}

                {appointment.prescription && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800">Prescription Available</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-6 flex flex-col space-y-2">
                {appointment.status === 'upcoming' && (
                  <button
                    onClick={() => startConsultation(appointment.id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Video className="h-4 w-4 mr-1" />
                    {user?.role === 'patient' ? 'Join Call' : 'Start Consultation'}
                  </button>
                )}

                {appointment.status === 'completed' && appointment.prescription && (
                  <button
                    onClick={() => viewPrescription(appointment.prescription!)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Prescription
                  </button>
                )}

                {appointment.status === 'upcoming' && (
                  <button className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} appointments
            </h3>
            <p className="text-gray-600">
              {activeTab === 'upcoming' 
                ? 'Book your first consultation with one of our doctors.'
                : 'Your consultation history will appear here.'
              }
            </p>
            {activeTab === 'upcoming' && user?.role === 'patient' && (
              <button
                onClick={() => onNavigate('find-doctors')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Find a Doctor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};