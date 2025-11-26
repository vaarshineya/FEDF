import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Disease from '../models/Disease.js';
import Symptom from '../models/Symptom.js';

dotenv.config();

const newDiseases = [
  {
    name: 'COVID-19',
    description: 'A contagious respiratory illness caused by SARS-CoV-2 virus.',
    category: 'infectious',
    prevalence: 'very_common',
    urgency: 'moderate',
    whenToSeekCare: 'Seek immediate care if difficulty breathing, persistent chest pain, confusion, or bluish lips.',
    treatment: 'Rest, fluids, over-the-counter medications. Antiviral medications for severe cases.',
    prevention: 'Vaccination, mask-wearing, social distancing, hand hygiene.',
    ageGroup: ['child', 'adolescent', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Fever', weight: 0.9, isCommon: true },
      { symptomName: 'Cough', weight: 0.9, isCommon: true },
      { symptomName: 'Shortness of breath', weight: 0.8, isCommon: true },
      { symptomName: 'Fatigue', weight: 0.85, isCommon: true },
      { symptomName: 'Loss of taste', weight: 0.75, isCommon: true },
      { symptomName: 'Loss of smell', weight: 0.75, isCommon: true },
      { symptomName: 'Muscle aches', weight: 0.7, isCommon: false },
      { symptomName: 'Headache', weight: 0.65, isCommon: false },
    ],
  },
  {
    name: 'Myocardial Infarction (Heart Attack)',
    description: 'A medical emergency where blood flow to heart is blocked.',
    category: 'cardiovascular',
    prevalence: 'common',
    urgency: 'emergency',
    whenToSeekCare: 'Call emergency services IMMEDIATELY. Every minute counts.',
    treatment: 'Emergency medical care, medications to dissolve clots, angioplasty.',
    prevention: 'Healthy diet, exercise, not smoking, managing blood pressure.',
    ageGroup: ['adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Crushing chest pain', weight: 0.95, isCommon: true },
      { symptomName: 'Pain radiating to arm', weight: 0.9, isCommon: true },
      { symptomName: 'Pain radiating to jaw', weight: 0.85, isCommon: true },
      { symptomName: 'Shortness of breath', weight: 0.9, isCommon: true },
      { symptomName: 'Nausea', weight: 0.75, isCommon: true },
      { symptomName: 'Cold sweat', weight: 0.85, isCommon: true },
    ],
  },
  {
    name: 'Stroke',
    description: 'Medical emergency where blood supply to brain is interrupted.',
    category: 'cardiovascular',
    prevalence: 'common',
    urgency: 'emergency',
    whenToSeekCare: 'Call emergency IMMEDIATELY. Use FAST test: Face, Arms, Speech, Time.',
    treatment: 'Emergency clot-busting drugs, thrombectomy, rehabilitation.',
    prevention: 'Control blood pressure, healthy lifestyle, manage diabetes.',
    ageGroup: ['adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Drooping face', weight: 0.95, isCommon: true },
      { symptomName: 'Arm weakness', weight: 0.95, isCommon: true },
      { symptomName: 'Difficulty speaking', weight: 0.95, isCommon: true },
      { symptomName: 'Severe headache', weight: 0.85, isCommon: true },
      { symptomName: 'Confusion', weight: 0.8, isCommon: true },
    ],
  },
  {
    name: 'Type 2 Diabetes',
    description: 'Chronic condition affecting how body processes blood sugar.',
    category: 'endocrine',
    prevalence: 'very_common',
    urgency: 'moderate',
    whenToSeekCare: 'Regular monitoring needed. Seek care for very high/low blood sugar.',
    treatment: 'Lifestyle changes, oral medications, insulin therapy, monitoring.',
    prevention: 'Healthy diet, regular exercise, maintain healthy weight.',
    ageGroup: ['adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Increased thirst', weight: 0.9, isCommon: true },
      { symptomName: 'Frequent urination', weight: 0.9, isCommon: true },
      { symptomName: 'Extreme hunger', weight: 0.85, isCommon: true },
      { symptomName: 'Fatigue', weight: 0.8, isCommon: true },
      { symptomName: 'Blurred vision', weight: 0.75, isCommon: true },
      { symptomName: 'Slow-healing sores', weight: 0.7, isCommon: false },
    ],
  },
  {
    name: 'Alzheimer\'s Disease',
    description: 'Progressive brain disorder causing memory loss and cognitive decline.',
    category: 'neurological',
    prevalence: 'common',
    urgency: 'low',
    whenToSeekCare: 'Seek evaluation if memory problems interfere with daily life.',
    treatment: 'Medications to slow progression, supportive care, lifestyle interventions.',
    prevention: 'Healthy lifestyle, mental stimulation, social engagement.',
    ageGroup: ['elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Progressive memory loss', weight: 0.95, isCommon: true },
      { symptomName: 'Confusion', weight: 0.9, isCommon: true },
      { symptomName: 'Difficulty concentrating', weight: 0.85, isCommon: true },
      { symptomName: 'Personality changes', weight: 0.8, isCommon: true },
    ],
  },
  {
    name: 'Parkinson\'s Disease',
    description: 'Progressive nervous system disorder affecting movement.',
    category: 'neurological',
    prevalence: 'common',
    urgency: 'low',
    whenToSeekCare: 'Seek evaluation if you notice tremors or movement difficulties.',
    treatment: 'Medications (levodopa), physical therapy, sometimes surgery.',
    prevention: 'Cannot be prevented, but exercise may help.',
    ageGroup: ['adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Tremors', weight: 0.95, isCommon: true },
      { symptomName: 'Slow movement', weight: 0.95, isCommon: true },
      { symptomName: 'Stiff joints', weight: 0.85, isCommon: true },
      { symptomName: 'Loss of balance', weight: 0.8, isCommon: true },
    ],
  },
  {
    name: 'Lyme Disease',
    description: 'Bacterial infection transmitted by tick bites.',
    category: 'infectious',
    prevalence: 'uncommon',
    urgency: 'moderate',
    whenToSeekCare: 'Seek care if rash after tick bite or symptoms of Lyme disease.',
    treatment: 'Antibiotics (doxycycline, amoxicillin). Early treatment prevents complications.',
    prevention: 'Tick avoidance, protective clothing, tick checks.',
    ageGroup: ['child', 'adolescent', 'adult'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Bull\'s-eye rash', weight: 0.9, isCommon: true },
      { symptomName: 'Fever', weight: 0.8, isCommon: true },
      { symptomName: 'Fatigue', weight: 0.85, isCommon: true },
      { symptomName: 'Muscle aches', weight: 0.8, isCommon: true },
      { symptomName: 'Joint pain', weight: 0.8, isCommon: true },
    ],
  },
  {
    name: 'Lupus (SLE)',
    description: 'Autoimmune disease where immune system attacks own tissues.',
    category: 'autoimmune',
    prevalence: 'uncommon',
    urgency: 'moderate',
    whenToSeekCare: 'Seek care if persistent symptoms or organ involvement.',
    treatment: 'Immunosuppressants, corticosteroids, antimalarial drugs.',
    prevention: 'Cannot be prevented, but flares can be managed.',
    ageGroup: ['adolescent', 'adult'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Butterfly-shaped rash', weight: 0.9, isCommon: true },
      { symptomName: 'Fatigue', weight: 0.9, isCommon: true },
      { symptomName: 'Joint pain', weight: 0.85, isCommon: true },
      { symptomName: 'Fever', weight: 0.75, isCommon: true },
      { symptomName: 'Sun sensitivity', weight: 0.8, isCommon: true },
    ],
  },
  {
    name: 'Asthma',
    description: 'Chronic condition causing inflammation and narrowing of airways.',
    category: 'respiratory',
    prevalence: 'very_common',
    urgency: 'moderate',
    whenToSeekCare: 'Seek immediate care for severe shortness of breath.',
    treatment: 'Inhaled corticosteroids, bronchodilators, avoiding triggers.',
    prevention: 'Identify and avoid triggers, take controller medications.',
    ageGroup: ['child', 'adolescent', 'adult'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Wheezing', weight: 0.95, isCommon: true },
      { symptomName: 'Shortness of breath', weight: 0.9, isCommon: true },
      { symptomName: 'Chest tightness', weight: 0.85, isCommon: true },
      { symptomName: 'Cough', weight: 0.8, isCommon: true },
    ],
  },
  {
    name: 'COPD',
    description: 'Progressive lung disease causing breathing difficulties.',
    category: 'respiratory',
    prevalence: 'common',
    urgency: 'moderate',
    whenToSeekCare: 'Seek care if symptoms worsen or bluish lips.',
    treatment: 'Bronchodilators, inhaled steroids, oxygen therapy, smoking cessation.',
    prevention: 'Don\'t smoke, avoid lung irritants.',
    ageGroup: ['adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Persistent cough', weight: 0.95, isCommon: true },
      { symptomName: 'Shortness of breath', weight: 0.95, isCommon: true },
      { symptomName: 'Wheezing', weight: 0.8, isCommon: true },
      { symptomName: 'Coughing up mucus', weight: 0.85, isCommon: true },
    ],
  },
];

const addDiseases = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB\n');

    const allSymptoms = await Symptom.find({});
    const symptomMap = {};
    allSymptoms.forEach(symptom => {
      symptomMap[symptom.name] = symptom._id;
    });

    let added = 0;
    let skipped = 0;

    for (const disease of newDiseases) {
      const existing = await Disease.findOne({ name: disease.name });
      if (!existing) {
        const diseasewithIds = {
          ...disease,
          symptoms: disease.symptoms.map(s => ({
            symptomId: symptomMap[s.symptomName],
            weight: s.weight,
            isCommon: s.isCommon,
          })),
        };
        
        await Disease.create(diseasewithIds);
        added++;
        console.log(`✓ Added: ${disease.name}`);
      } else {
        skipped++;
        console.log(`- Skipped (exists): ${disease.name}`);
      }
    }

    console.log(`\n✅ Complete! Added ${added} new diseases, skipped ${skipped} existing diseases.`);
    console.log(`Total diseases in database: ${await Disease.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error adding diseases:', error);
    process.exit(1);
  }
};

addDiseases();
