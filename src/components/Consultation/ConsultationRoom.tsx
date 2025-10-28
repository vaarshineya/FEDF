import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  FileText, 
  User,
  Clock,
  MessageCircle
} from 'lucide-react';

interface ConsultationRoomProps {
  appointmentId: string;
  onNavigate: (view: string) => void;
}

export const ConsultationRoom: React.FC<ConsultationRoomProps> = ({ appointmentId, onNavigate }) => {
  const { user } = useAuth();
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);

  // Mock patient/doctor info
  const consultationInfo = {
    patientName: user?.role === 'doctor' ? 'John Doe' : user?.name,
    doctorName: user?.role === 'patient' ? 'Dr. Sarah Johnson' : user?.name,
    appointmentTime: '10:00 AM',
    reason: 'Follow-up consultation',
  };

  // Timer for call duration
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    if (user?.role === 'doctor' && (notes || prescription)) {
      // Save consultation notes and prescription
      alert('Consultation notes and prescription saved successfully!');
    }
    onNavigate('appointments');
  };

  const savePrescription = () => {
    alert('Prescription saved successfully!');
    setShowPrescription(false);
  };

  const saveNotes = () => {
    alert('Notes saved successfully!');
    setShowNotes(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-white">
              Consultation with {user?.role === 'patient' ? consultationInfo.doctorName : consultationInfo.patientName}
            </h1>
            <div className="flex items-center text-green-400">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">Live</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-gray-300">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatDuration(callDuration)}</span>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Doctor Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                  {isVideoEnabled ? (
                    <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <VideoOff className="h-16 w-16 mx-auto mb-2" />
                      <p>Video disabled</p>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                    {consultationInfo.doctorName} {user?.role === 'doctor' && '(You)'}
                  </span>
                </div>
              </div>

              {/* Patient Video */}
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center">
                  {isVideoEnabled ? (
                    <div className="w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white" />
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <VideoOff className="h-16 w-16 mx-auto mb-2" />
                      <p>Video disabled</p>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                    {consultationInfo.patientName} {user?.role === 'patient' && '(You)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  isAudioEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              </button>

              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
              </button>

              <button
                onClick={endCall}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
              >
                <Phone className="h-6 w-6 transform rotate-135" />
              </button>

              {user?.role === 'doctor' && (
                <>
                  <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </button>

                  <button
                    onClick={() => setShowPrescription(!showPrescription)}
                    className="p-3 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors"
                  >
                    <FileText className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel for Notes/Prescription (Doctor only) */}
        {user?.role === 'doctor' && (showNotes || showPrescription) && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="flex border-b">
              <button
                onClick={() => { setShowNotes(true); setShowPrescription(false); }}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  showNotes ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => { setShowPrescription(true); setShowNotes(false); }}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  showPrescription ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
                }`}
              >
                Prescription
              </button>
            </div>

            <div className="flex-1 p-4">
              {showNotes && (
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter consultation notes..."
                    className="flex-1 w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={saveNotes}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              )}

              {showPrescription && (
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Prescription</h3>
                  <textarea
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    placeholder="Enter prescription details..."
                    className="flex-1 w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={savePrescription}
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save Prescription
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};