import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Stethoscope, Clock, DollarSign, Save, Calendar } from 'lucide-react';

export const DoctorProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(!user?.profileComplete);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    specialty: user?.specialty || '',
    bio: user?.bio || '',
    consultationFee: user?.consultationFee || 75,
    licenseNumber: '',
    yearsOfExperience: '',
    education: '',
    languages: '',
    hospitalAffiliations: '',
    availableHours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '09:00', end: '13:00', available: false },
    },
  });

  const specialties = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Mental Health',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'Gastroenterology',
    'Endocrinology',
    'Ophthalmology',
    'Otolaryngology',
    'Pulmonology',
  ];

  const handleSave = () => {
    updateProfile({ 
      ...user!, 
      ...formData, 
      profileComplete: true 
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvailabilityChange = (day: string, field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      availableHours: {
        ...formData.availableHours,
        [day]: {
          ...formData.availableHours[day as keyof typeof formData.availableHours],
          [field]: value,
        },
      },
    });
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your professional information and availability
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Stethoscope className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4 mr-1" />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Medical Specialty
                </label>
                <select
                  name="specialty"
                  id="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select specialty</option>
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Consultation Fee (USD)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  id="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="0"
                  step="5"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Professional Bio
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Share your experience, expertise, and approach to patient care..."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                  Medical License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  id="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="0"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-6">
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                  Education & Certifications
                </label>
                <textarea
                  name="education"
                  id="education"
                  rows={3}
                  value={formData.education}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Medical school, residency, fellowships, board certifications..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                  Languages Spoken
                </label>
                <input
                  type="text"
                  name="languages"
                  id="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="e.g., English, Spanish, French"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label htmlFor="hospitalAffiliations" className="block text-sm font-medium text-gray-700">
                  Hospital Affiliations
                </label>
                <textarea
                  name="hospitalAffiliations"
                  id="hospitalAffiliations"
                  rows={2}
                  value={formData.hospitalAffiliations}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="List affiliated hospitals or medical centers..."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Availability Schedule */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              Availability Schedule
            </h3>
            <div className="space-y-4">
              {daysOfWeek.map(day => {
                const dayData = formData.availableHours[day.key as keyof typeof formData.availableHours];
                return (
                  <div key={day.key} className="flex items-center space-x-4 py-2">
                    <div className="w-20">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={dayData.available}
                          onChange={(e) => handleAvailabilityChange(day.key, 'available', e.target.checked)}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 disabled:opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                      </label>
                    </div>
                    {dayData.available && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <input
                            type="time"
                            value={dayData.start}
                            onChange={(e) => handleAvailabilityChange(day.key, 'start', e.target.value)}
                            disabled={!isEditing}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={dayData.end}
                            onChange={(e) => handleAvailabilityChange(day.key, 'end', e.target.value)}
                            disabled={!isEditing}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};