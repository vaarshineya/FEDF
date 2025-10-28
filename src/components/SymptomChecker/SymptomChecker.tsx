import React, { useState } from 'react';
import { Search, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  category: string;
}

interface Condition {
  name: string;
  description: string;
  confidence: 'High' | 'Medium' | 'Low';
  urgency: 'urgent' | 'moderate' | 'low';
  whenToSeek: string;
}

export const SymptomChecker: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [results, setResults] = useState<Condition[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const availableSymptoms: Symptom[] = [
    { id: '1', name: 'Headache', category: 'neurological' },
    { id: '2', name: 'Fever', category: 'general' },
    { id: '3', name: 'Cough', category: 'respiratory' },
    { id: '4', name: 'Sore throat', category: 'respiratory' },
    { id: '5', name: 'Nausea', category: 'digestive' },
    { id: '6', name: 'Fatigue', category: 'general' },
    { id: '7', name: 'Muscle aches', category: 'musculoskeletal' },
    { id: '8', name: 'Difficulty breathing', category: 'respiratory' },
    { id: '9', name: 'Chest pain', category: 'cardiovascular' },
    { id: '10', name: 'Dizziness', category: 'neurological' },
    { id: '11', name: 'Abdominal pain', category: 'digestive' },
    { id: '12', name: 'Runny nose', category: 'respiratory' },
  ];

  const filteredSymptoms = availableSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(symptom.id)
  );

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0 || !age || !sex) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock results based on selected symptoms
    const mockResults: Condition[] = [
      {
        name: 'Common Cold',
        description: 'A viral upper respiratory tract infection that commonly causes runny nose, sore throat, and cough.',
        confidence: 'High',
        urgency: 'low',
        whenToSeek: 'See a doctor if symptoms persist for more than 10 days or worsen significantly.',
      },
      {
        name: 'Seasonal Flu',
        description: 'A contagious respiratory illness caused by influenza viruses, typically causing fever, body aches, and fatigue.',
        confidence: 'Medium',
        urgency: 'moderate',
        whenToSeek: 'Seek medical care if you have difficulty breathing, persistent chest pain, or severe dehydration.',
      },
      {
        name: 'Tension Headache',
        description: 'The most common type of headache, often caused by stress, muscle tension, or poor posture.',
        confidence: 'Medium',
        urgency: 'low',
        whenToSeek: 'Consult a doctor if headaches become frequent, severe, or are accompanied by vision changes.',
      },
    ];

    setResults(mockResults);
    setShowResults(true);
    setIsAnalyzing(false);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-700 bg-green-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'moderate': return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => {
              setShowResults(false);
              setResults([]);
              setSelectedSymptoms([]);
              setAge('');
              setSex('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Start New Analysis
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
        </div>

        {/* Critical Disclaimer */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">
                Important Medical Disclaimer
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  <strong>This is not a medical diagnosis.</strong> The results are for informational purposes only. 
                  Please consult a qualified healthcare professional for any health concerns. This tool cannot replace 
                  professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.map((condition, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getUrgencyIcon(condition.urgency)}
                    <h3 className="text-xl font-semibold text-gray-900">{condition.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(condition.confidence)}`}>
                      {condition.confidence} Likelihood
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{condition.description}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">When to See a Doctor:</h4>
                <p className="text-sm text-gray-600">{condition.whenToSeek}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Want to discuss these results with a medical professional?
            </h3>
            <p className="text-gray-600 mb-4">
              Book a consultation with one of our qualified doctors for personalized medical advice.
            </p>
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Symptom Checker</h1>
        <p className="text-gray-600">
          Get AI-powered insights about your symptoms. This tool provides information only and is not a substitute for professional medical advice.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-1">
                Sex at Birth
              </label>
              <select
                id="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select sex at birth</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Symptom Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Symptoms</h2>
          
          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search for symptoms..."
            />
          </div>

          {/* Selected Symptoms */}
          {selectedSymptoms.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Symptoms:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map(symptomId => {
                  const symptom = availableSymptoms.find(s => s.id === symptomId);
                  return (
                    <span
                      key={symptomId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {symptom?.name}
                      <button
                        onClick={() => handleSymptomToggle(symptomId)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Symptoms */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Available Symptoms:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {filteredSymptoms.map(symptom => (
                <button
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  className="text-left px-3 py-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  {symptom.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="text-center">
          <button
            onClick={analyzeSymptoms}
            disabled={selectedSymptoms.length === 0 || !age || !sex || isAnalyzing}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
                Analyzing Symptoms...
              </>
            ) : (
              'Analyze Symptoms'
            )}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs text-gray-600 text-center">
            <strong>Medical Disclaimer:</strong> This symptom checker is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  );
};