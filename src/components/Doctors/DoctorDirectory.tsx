import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Video, DollarSign } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  location: string;
  avatar: string;
  bio: string;
  availability: string[];
  experience: string;
  languages: string[];
}

interface DoctorDirectoryProps {
  onNavigate: (view: string, data?: any) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'General Practice',
      rating: 4.8,
      reviewCount: 156,
      consultationFee: 75,
      location: 'New York, NY',
      avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Board-certified family medicine physician with over 10 years of experience in primary care and preventive medicine.',
      availability: ['Today', 'Tomorrow', 'This Week'],
      experience: '10+ years',
      languages: ['English', 'Spanish'],
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.9,
      reviewCount: 203,
      consultationFee: 150,
      location: 'Los Angeles, CA',
      avatar: 'https://images.pexels.com/photos/6749818/pexels-photo-6749818.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Interventional cardiologist specializing in heart disease prevention and minimally invasive cardiac procedures.',
      availability: ['Tomorrow', 'This Week'],
      experience: '15+ years',
      languages: ['English', 'Mandarin'],
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      rating: 4.7,
      reviewCount: 98,
      consultationFee: 120,
      location: 'Miami, FL',
      avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Dermatologist with expertise in both medical and cosmetic dermatology, focusing on skin cancer prevention.',
      availability: ['This Week', 'Next Week'],
      experience: '8+ years',
      languages: ['English', 'Spanish'],
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialty: 'Mental Health',
      rating: 4.9,
      reviewCount: 174,
      consultationFee: 100,
      location: 'Chicago, IL',
      avatar: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=200',
      bio: 'Licensed psychiatrist specializing in anxiety, depression, and cognitive behavioral therapy.',
      availability: ['Today', 'Tomorrow'],
      experience: '12+ years',
      languages: ['English'],
    },
  ];

  const specialties = [
    'All Specialties',
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Mental Health',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
  ];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || selectedSpecialty === 'All Specialties' || 
                            doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor: Doctor) => {
    onNavigate('book-appointment', { doctor });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
        <p className="text-gray-600">
          Search and book consultations with qualified healthcare professionals
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Doctors
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name or specialty..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <select
              id="specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={doctor.avatar}
                  alt={doctor.name}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {doctor.rating} ({doctor.reviewCount})
                      </span>
                    </div>
                  </div>
                  <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {doctor.location}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mt-4 line-clamp-2">{doctor.bio}</p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {doctor.experience}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${doctor.consultationFee}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doctor.availability.includes('Today') && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Available Today
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleBookAppointment(doctor)}
                className="w-full mt-4 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Video className="h-4 w-4 mr-2" />
                Book Video Consultation
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all specialties.
          </p>
        </div>
      )}
    </div>
  );
};