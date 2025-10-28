import React, { useState } from 'react';
import { Calendar, Clock, Video, ArrowLeft, CreditCard } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  avatar: string;
}

interface AppointmentBookingProps {
  doctor: Doctor;
  onNavigate: (view: string) => void;
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ doctor, onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('video');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Mock available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      }),
      available: i < 5, // First 5 days available
    };
  });

  // Mock available time slots
  const availableTimeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsBooking(true);

    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate Stripe payment integration
    alert('Booking successful! In a real app, this would integrate with Stripe for payment processing.');
    
    setIsBooking(false);
    onNavigate('appointments');
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => onNavigate('find-doctors')}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Doctor Directory
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={doctor.avatar}
                alt={doctor.name}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                <p className="text-blue-600 font-medium">{doctor.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-semibold text-gray-900">${doctor.consultationFee}</span>
              </div>
              <div className="flex items-center">
                <Video className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-600">Video consultation available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Your Appointment</h2>

            <div className="space-y-6">
              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Consultation Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <label className="relative flex cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none hover:border-blue-300">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="video"
                      checked={appointmentType === 'video'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <Video className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <span className="font-medium text-gray-900">Video Consultation</span>
                        <p className="text-sm text-gray-600">Secure video call from home</p>
                      </div>
                    </div>
                    {appointmentType === 'video' && (
                      <div className="ml-auto flex-shrink-0">
                        <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Select Date
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableDates.map(date => (
                    <button
                      key={date.value}
                      onClick={() => date.available && setSelectedDate(date.value)}
                      disabled={!date.available}
                      className={`p-3 text-sm rounded-lg border transition-colors ${
                        selectedDate === date.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : date.available
                          ? 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableTimeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your symptoms or concerns..."
                />
              </div>

              {/* Payment Info */}
              {selectedDate && selectedTime && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Payment Summary</h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-semibold">${doctor.consultationFee}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold border-t pt-3">
                    <span>Total:</span>
                    <span>${doctor.consultationFee}</span>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || isBooking}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isBooking ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Book & Pay ${doctor.consultationFee}
                  </>
                )}
              </button>

              {/* Stripe Integration Note */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Secure payment processing powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};