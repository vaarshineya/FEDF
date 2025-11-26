import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, Info, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { apiService, Symptom as ApiSymptom, DiseasePrediction } from '../../services/api.service';

interface Symptom {
  _id: string;
  name: string;
  category: string;
  severity?: string;
}

interface SymptomCheckerProps {
  onNavigate?: (view: string, data?: any) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onNavigate }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [results, setResults] = useState<DiseasePrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [availableSymptoms, setAvailableSymptoms] = useState<Symptom[]>([]);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapDiseaseToSpecialty = (d: DiseasePrediction): string => {
    const name = d.name.toLowerCase();
    const category = (d.category || '').toLowerCase();
    if (name.includes('heart') || category.includes('cardio')) return 'Cardiology';
    if (name.includes('skin') || category.includes('derma')) return 'Dermatology';
    if (name.includes('anxiety') || name.includes('depress') || category.includes('mental')) return 'Mental Health';
    if (name.includes('asthma') || name.includes('pneumonia') || category.includes('respir')) return 'General Practice';
    if (name.includes('diabetes') || name.includes('thyroid') || category.includes('endocr')) return 'General Practice';
    if (name.includes('fracture') || name.includes('arthritis') || category.includes('ortho')) return 'Orthopedics';
    if (name.includes('migraine') || name.includes('seizure') || category.includes('neuro')) return 'Neurology';
    return 'General Practice';
  };

  // Load symptoms from API
  useEffect(() => {
    const loadSymptoms = async () => {
      try {
        setIsLoadingSymptoms(true);
        const symptoms = await apiService.getSymptoms();
        setAvailableSymptoms(symptoms);
      } catch (error) {
        console.error('Failed to load symptoms:', error);
        // Fallback to mock symptoms if API fails
        setAvailableSymptoms([
          { _id: '1', name: 'Headache', category: 'neurological' },
          { _id: '2', name: 'Fever', category: 'general' },
          { _id: '3', name: 'Cough', category: 'respiratory' },
          { _id: '4', name: 'Sore throat', category: 'respiratory' },
          { _id: '5', name: 'Nausea', category: 'digestive' },
          { _id: '6', name: 'Fatigue', category: 'general' },
          { _id: '7', name: 'Runny nose', category: 'respiratory' },
          { _id: '8', name: 'Body aches', category: 'general' },
          { _id: '9', name: 'Shortness of breath', category: 'respiratory' },
          { _id: '10', name: 'Chest pain', category: 'cardiology' },
          { _id: '11', name: 'Wheezing', category: 'respiratory' },
          { _id: '12', name: 'Abdominal pain', category: 'digestive' },
          { _id: '13', name: 'Diarrhea', category: 'digestive' },
          { _id: '14', name: 'Vomiting', category: 'digestive' },
          { _id: '15', name: 'Rash', category: 'dermatology' },
          { _id: '16', name: 'Itching', category: 'dermatology' },
          { _id: '17', name: 'Dizziness', category: 'neurological' },
          { _id: '18', name: 'Sensitivity to light', category: 'neurological' },
          { _id: '19', name: 'Joint pain', category: 'orthopedics' },
          { _id: '20', name: 'Back pain', category: 'orthopedics' },
          { _id: '21', name: 'Sputum', category: 'respiratory' },
          { _id: '22', name: 'Sensation of tight chest', category: 'respiratory' },
          { _id: '23', name: 'Night sweats', category: 'general' },
          { _id: '24', name: 'Chills', category: 'general' },
          { _id: '25', name: 'Loss of smell', category: 'general' },
          { _id: '26', name: 'Loss of taste', category: 'general' },
        ]);
      } finally {
        setIsLoadingSymptoms(false);
      }
    };
    loadSymptoms();
  }, []);

  const filteredSymptoms = availableSymptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(symptom._id)
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
    setError(null);
    
    try {
      // Call real API with ML predictions
      const response = await apiService.analyzeSymptoms({
        symptomIds: selectedSymptoms,
        age: parseInt(age),
        gender: sex,
      });

      // Sort by confidence desc and keep top results
      const sorted = [...response.predictions].sort((a, b) => b.confidence - a.confidence);
      setResults(sorted);
      setShowResults(true);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        selectedSymptoms,
        age,
        sex
      });
      setError(`API Error: ${error.message || 'Failed to analyze symptoms. Using offline predictions.'}`);

      // Offline rule-based prediction for improved accuracy
      const selectedNames = selectedSymptoms
        .map(id => availableSymptoms.find(s => s._id === id)?.name.toLowerCase())
        .filter(Boolean) as string[];

      // Normalize common synonyms to improve matching
      const alias: Record<string, string> = {
        'pharyngitis': 'sore throat',
        'dyspnea': 'shortness of breath',
        'sob': 'shortness of breath',
        'myalgia': 'body aches',
        'photophobia': 'sensitivity to light',
        'itch': 'itching',
        'emesis': 'vomiting',
        'loose stools': 'diarrhea',
        'tiredness': 'fatigue',
        'runny nose': 'runny nose',
        'rhinorrhea': 'runny nose',
        'productive cough': 'sputum',
      };

      const selectedSet = new Set(
        selectedNames.map(n => alias[n] ? alias[n] : n)
      );

      type Rule = {
        category: string;
        desc: string;
        symptoms: string[]; // canonical names lowercased
        keySymptoms?: string[]; // extra weight
        excludeSymptoms?: string[]; // negative weight
        urgency: 'low' | 'moderate' | 'urgent';
        treatment?: string;
        when?: string;
        sexBias?: 'male' | 'female' | 'any';
        minAge?: number;
        maxAge?: number;
      };

      const RULES: Record<string, Rule> = {
        'Viral Upper Respiratory Infection': {
          category: 'respiratory',
          desc: 'Common cold-like viral illness causing sore throat, cough, and runny nose.',
          symptoms: ['cough', 'sore throat', 'runny nose', 'fever', 'fatigue'],
          keySymptoms: ['runny nose', 'sore throat'],
          urgency: 'low',
          treatment: 'Rest, fluids, steam inhalation, over-the-counter symptom relief.',
          when: 'If symptoms persist beyond 10 days or high fever develops.',
        },
        'Influenza (Flu)': {
          category: 'general',
          desc: 'Acute viral infection with fever, body aches, and cough.',
          symptoms: ['fever', 'chills', 'body aches', 'cough', 'fatigue'],
          keySymptoms: ['fever', 'body aches', 'chills'],
          urgency: 'moderate',
          treatment: 'Hydration, antipyretics; consider antivirals if early/high-risk.',
          when: 'If breathing difficulty or chest pain occurs.',
        },
        'Asthma Exacerbation': {
          category: 'respiratory',
          desc: 'Airway inflammation leading to wheeze and chest tightness.',
          symptoms: ['wheezing', 'shortness of breath', 'sensation of tight chest', 'cough'],
          keySymptoms: ['wheezing', 'shortness of breath', 'sensation of tight chest'],
          urgency: 'urgent',
          treatment: 'Short-acting bronchodilator; seek medical care if not improving.',
          when: 'If severe breathlessness or cyanosis occurs.',
        },
        'Gastroenteritis': {
          category: 'digestive',
          desc: 'Stomach and intestinal inflammation causing vomiting and diarrhea.',
          symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever'],
          keySymptoms: ['vomiting', 'diarrhea'],
          urgency: 'moderate',
          treatment: 'Oral rehydration, light diet; seek care if dehydration signs.',
          when: 'If blood in stool or persistent vomiting.',
        },
        'Migraine': {
          category: 'neurological',
          desc: 'Recurrent headache, often with photophobia and nausea.',
          symptoms: ['headache', 'sensitivity to light', 'nausea', 'vomiting', 'dizziness'],
          keySymptoms: ['headache', 'sensitivity to light'],
          urgency: 'low',
          treatment: 'Rest in dark room; analgesics or triptans as advised.',
          when: 'If worst-ever headache, neuro deficits, or sudden onset.',
        },
        'Contact Dermatitis': {
          category: 'dermatology',
          desc: 'Skin inflammation triggered by irritants or allergens.',
          symptoms: ['rash', 'itching'],
          keySymptoms: ['rash', 'itching'],
          urgency: 'low',
          treatment: 'Avoid triggers; topical emollients; mild steroids if needed.',
          when: 'If widespread rash or signs of infection.',
        },
        'Pneumonia (Suspected)': {
          category: 'respiratory',
          desc: 'Lower respiratory infection causing cough, fever, and sputum.',
          symptoms: ['cough', 'fever', 'shortness of breath', 'sputum', 'chills', 'night sweats', 'chest pain'],
          keySymptoms: ['fever', 'sputum', 'shortness of breath'],
          urgency: 'urgent',
          treatment: 'Medical evaluation and antibiotics as indicated.',
          when: 'If high fever with breathlessness or chest pain.',
        },
      };

      const ageNum = parseInt(age || '0', 10) || 0;

      const scored = Object.entries(RULES).map(([name, rule]) => {
        const matched = rule.symptoms.filter(sym => selectedSet.has(sym)).length;
        const keyMatched = (rule.keySymptoms || []).filter(sym => selectedSet.has(sym)).length;
        const excluded = (rule.excludeSymptoms || []).filter(sym => selectedSet.has(sym)).length;

        // Weighted scoring: keys weigh double, exclusions subtract
        let score = matched + keyMatched * 2 - excluded * 1.5;

        // Age/sex adjustments
        if (rule.minAge && ageNum < rule.minAge) score -= 0.5;
        if (rule.maxAge && ageNum > rule.maxAge) score -= 0.5;
        if (rule.sexBias && rule.sexBias !== 'any' && rule.sexBias !== (sex as any)) score -= 0.5;

        // Normalize to percentage relative to unique symptoms considered
        const denom = Math.max(1, new Set([...(rule.symptoms || []), ...((rule.keySymptoms)||[])]).size);
        const confidence = Math.max(0, Math.min(100, (score / denom) * 100));
        const confidenceLevel = confidence >= 75 ? 'High' : confidence >= 50 ? 'Medium' : 'Low';

        return {
          diseaseId: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          description: rule.desc,
          category: rule.category,
          confidence,
          confidenceLevel,
          mlConfidence: undefined,
          ruleConfidence: confidence,
          consensus: confidence,
          predictionMethod: 'rules',
          matchedSymptoms: matched + keyMatched,
          totalSymptoms: selectedSet.size,
          urgency: rule.urgency,
          whenToSeekCare: rule.when || '',
          treatment: rule.treatment,
        } as DiseasePrediction;
      }).filter(p => p.matchedSymptoms && p.matchedSymptoms > 0 && p.confidence > 0);

      const sorted = scored.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
      setResults(sorted);
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceColor = (confidenceLevel: string) => {
    switch (confidenceLevel) {
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
              setError(null);
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
          {results.map((prediction, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getUrgencyIcon(prediction.urgency)}
                    <h3 className="text-xl font-semibold text-gray-900">{prediction.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidenceLevel)}`}>
                      {prediction.confidence.toFixed(1)}% {prediction.confidenceLevel}
                    </span>
                    {prediction.predictionMethod === 'hybrid' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI + Medical Rules
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{prediction.description}</p>
                  
                  {/* ML Metrics */}
                  {(prediction.mlConfidence || prediction.consensus) && (
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      {prediction.mlConfidence && (
                        <div>
                          <span className="font-medium">ML Confidence:</span> {prediction.mlConfidence.toFixed(1)}%
                        </div>
                      )}
                      {prediction.consensus && (
                        <div>
                          <span className="font-medium">Model Consensus:</span> {prediction.consensus.toFixed(0)}%
                        </div>
                      )}
                      {prediction.matchedSymptoms && (
                        <div>
                          <span className="font-medium">Matched Symptoms:</span> {prediction.matchedSymptoms}/{prediction.totalSymptoms}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">When to See a Doctor:</h4>
                <p className="text-sm text-gray-600">{prediction.whenToSeekCare}</p>
              </div>
              
              {prediction.treatment && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Treatment:</h4>
                  <p className="text-sm text-gray-600">{prediction.treatment}</p>
                </div>
              )}

              {/* Doctor Recommendation */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Recommended Doctor Specialty:</h4>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                    {mapDiseaseToSpecialty(prediction)}
                  </span>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('find-doctors', { specialty: mapDiseaseToSpecialty(prediction), diseaseName: prediction.name })}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    >
                      Find Doctors
                    </button>
                  )}
                </div>
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
                  const symptom = availableSymptoms.find(s => s._id === symptomId);
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
            {isLoadingSymptoms ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading symptoms...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                {filteredSymptoms.map(symptom => (
                  <button
                    key={symptom._id}
                    onClick={() => handleSymptomToggle(symptom._id)}
                    className="text-left px-3 py-2 border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium">{symptom.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{symptom.category}</div>
                  </button>
                ))}
              </div>
            )}
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