import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Navbar } from './components/Layout/Navbar';
import { PatientDashboard } from './components/Dashboard/PatientDashboard';
import { DoctorDashboard } from './components/Dashboard/DoctorDashboard';
import { SymptomChecker } from './components/SymptomChecker/SymptomChecker';
import { DoctorDirectory } from './components/Doctors/DoctorDirectory';
import { AppointmentBooking } from './components/Appointments/AppointmentBooking';
import { AppointmentsList } from './components/Appointments/AppointmentsList';
import { ConsultationRoom } from './components/Consultation/ConsultationRoom';
import { PatientProfile } from './components/Profile/PatientProfile';
import { DoctorProfile } from './components/Profile/DoctorProfile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewData, setViewData] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(true);

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    setViewData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return user.role === 'patient' 
          ? <PatientDashboard onNavigate={handleNavigate} />
          : <DoctorDashboard onNavigate={handleNavigate} />;
      
      case 'symptom-checker':
        return <SymptomChecker />;
      
      case 'find-doctors':
        return <DoctorDirectory onNavigate={handleNavigate} />;
      
      case 'book-appointment':
        return <AppointmentBooking doctor={viewData?.doctor} onNavigate={handleNavigate} />;
      
      case 'appointments':
        return <AppointmentsList onNavigate={handleNavigate} />;
      
      case 'consultation':
        return <ConsultationRoom appointmentId={viewData?.appointmentId} onNavigate={handleNavigate} />;
      
      case 'profile':
        return user.role === 'patient' 
          ? <PatientProfile />
          : <DoctorProfile />;
      
      case 'patients':
        return (
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Records</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Patient records management would be implemented here.</p>
            </div>
          </div>
        );
      
      default:
        return user.role === 'patient' 
          ? <PatientDashboard onNavigate={handleNavigate} />
          : <DoctorDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;