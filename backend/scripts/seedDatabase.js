import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Symptom from '../models/Symptom.js';
import Disease from '../models/Disease.js';
import User from '../models/User.js';

dotenv.config();

const symptoms = [
  // General Symptoms
  { name: 'Fever', category: 'general', severity: 'moderate', description: 'Elevated body temperature above normal', commonNames: ['high temperature', 'pyrexia'] },
  { name: 'Fatigue', category: 'general', severity: 'moderate', description: 'Extreme tiredness or lack of energy', commonNames: ['tiredness', 'exhaustion', 'lethargy'] },
  { name: 'Chills', category: 'general', severity: 'moderate', description: 'Feeling cold with shivering', commonNames: ['shivering', 'rigors'] },
  { name: 'Sweating', category: 'general', severity: 'mild', description: 'Excessive perspiration', commonNames: ['perspiration', 'diaphoresis'] },
  { name: 'Weight loss', category: 'general', severity: 'moderate', description: 'Unintentional decrease in body weight', commonNames: ['losing weight', 'weight reduction'] },
  { name: 'Weight gain', category: 'general', severity: 'mild', description: 'Unintentional increase in body weight', commonNames: ['gaining weight'] },
  { name: 'Weakness', category: 'general', severity: 'moderate', description: 'Lack of physical strength', commonNames: ['feebleness', 'debility'] },
  { name: 'Malaise', category: 'general', severity: 'mild', description: 'General feeling of discomfort or uneasiness', commonNames: ['unwellness'] },
  { name: 'Night sweats', category: 'general', severity: 'moderate', description: 'Excessive sweating during sleep', commonNames: ['nocturnal hyperhidrosis'] },
  { name: 'Dehydration', category: 'general', severity: 'moderate', description: 'Excessive loss of body water', commonNames: ['fluid loss'] },
  
  // Respiratory Symptoms
  { name: 'Cough', category: 'respiratory', severity: 'mild', description: 'Sudden expulsion of air from the lungs', commonNames: ['hacking', 'tussis'] },
  { name: 'Sore throat', category: 'respiratory', severity: 'mild', description: 'Pain or irritation in the throat', commonNames: ['pharyngitis', 'throat pain'] },
  { name: 'Runny nose', category: 'respiratory', severity: 'mild', description: 'Excess nasal drainage', commonNames: ['rhinorrhea', 'nasal discharge'] },
  { name: 'Congestion', category: 'respiratory', severity: 'mild', description: 'Blocked or stuffy nose', commonNames: ['nasal congestion', 'stuffy nose'] },
  { name: 'Sneezing', category: 'respiratory', severity: 'mild', description: 'Sudden involuntary expulsion of air through nose', commonNames: ['sternutation'] },
  { name: 'Wheezing', category: 'respiratory', severity: 'moderate', description: 'High-pitched whistling sound when breathing', commonNames: ['whistling breath'] },
  { name: 'Shortness of breath', category: 'respiratory', severity: 'severe', description: 'Difficulty breathing or feeling breathless', commonNames: ['dyspnea', 'breathlessness'] },
  { name: 'Difficulty breathing', category: 'respiratory', severity: 'severe', description: 'Labored or difficult breathing', commonNames: ['dyspnea', 'breathing problems'] },
  { name: 'Rapid breathing', category: 'respiratory', severity: 'moderate', description: 'Abnormally fast breathing rate', commonNames: ['tachypnea'] },
  { name: 'Coughing up blood', category: 'respiratory', severity: 'severe', description: 'Blood in cough or sputum', commonNames: ['hemoptysis'] },
  { name: 'Hoarseness', category: 'respiratory', severity: 'mild', description: 'Abnormal voice changes', commonNames: ['raspy voice', 'voice loss'] },
  { name: 'Loss of voice', category: 'respiratory', severity: 'mild', description: 'Inability to speak normally', commonNames: ['aphonia', 'laryngitis'] },
  
  // Neurological Symptoms
  { name: 'Headache', category: 'neurological', severity: 'mild', description: 'Pain in the head or upper neck', commonNames: ['head pain', 'cephalalgia'] },
  { name: 'Dizziness', category: 'neurological', severity: 'moderate', description: 'Feeling lightheaded or unsteady', commonNames: ['vertigo', 'lightheadedness'] },
  { name: 'Confusion', category: 'neurological', severity: 'severe', description: 'Inability to think clearly', commonNames: ['disorientation', 'mental fog'] },
  { name: 'Memory loss', category: 'neurological', severity: 'moderate', description: 'Difficulty remembering information', commonNames: ['amnesia', 'forgetfulness'] },
  { name: 'Seizures', category: 'neurological', severity: 'severe', description: 'Sudden uncontrolled electrical disturbance in brain', commonNames: ['convulsions', 'fits'] },
  { name: 'Tremors', category: 'neurological', severity: 'moderate', description: 'Involuntary shaking movements', commonNames: ['shaking', 'trembling'] },
  { name: 'Numbness', category: 'neurological', severity: 'moderate', description: 'Loss of sensation in body part', commonNames: ['tingling', 'pins and needles'] },
  { name: 'Tingling', category: 'neurological', severity: 'mild', description: 'Prickling sensation on skin', commonNames: ['paresthesia', 'pins and needles'] },
  { name: 'Fainting', category: 'neurological', severity: 'severe', description: 'Temporary loss of consciousness', commonNames: ['syncope', 'passing out'] },
  { name: 'Balance problems', category: 'neurological', severity: 'moderate', description: 'Difficulty maintaining equilibrium', commonNames: ['unsteadiness', 'ataxia'] },
  { name: 'Sensitivity to light', category: 'neurological', severity: 'mild', description: 'Discomfort in bright light', commonNames: ['photophobia'] },
  { name: 'Sensitivity to sound', category: 'neurological', severity: 'mild', description: 'Discomfort with loud noises', commonNames: ['phonophobia', 'hyperacusis'] },
  
  // Digestive Symptoms
  { name: 'Nausea', category: 'digestive', severity: 'moderate', description: 'Feeling of sickness with an urge to vomit', commonNames: ['queasiness', 'upset stomach'] },
  { name: 'Vomiting', category: 'digestive', severity: 'moderate', description: 'Forceful expulsion of stomach contents', commonNames: ['throwing up', 'emesis'] },
  { name: 'Diarrhea', category: 'digestive', severity: 'moderate', description: 'Loose or watery bowel movements', commonNames: ['loose stools', 'runs'] },
  { name: 'Constipation', category: 'digestive', severity: 'mild', description: 'Difficulty passing stools', commonNames: ['irregular bowel movements'] },
  { name: 'Abdominal pain', category: 'digestive', severity: 'moderate', description: 'Pain in the stomach area', commonNames: ['stomach ache', 'belly pain'] },
  { name: 'Bloating', category: 'digestive', severity: 'mild', description: 'Feeling of fullness or swelling in abdomen', commonNames: ['abdominal distension'] },
  { name: 'Gas', category: 'digestive', severity: 'mild', description: 'Excessive intestinal gas', commonNames: ['flatulence', 'wind'] },
  { name: 'Heartburn', category: 'digestive', severity: 'mild', description: 'Burning sensation in chest', commonNames: ['acid reflux', 'indigestion'] },
  { name: 'Loss of appetite', category: 'digestive', severity: 'mild', description: 'Reduced desire to eat', commonNames: ['anorexia', 'poor appetite'] },
  { name: 'Difficulty swallowing', category: 'digestive', severity: 'moderate', description: 'Trouble swallowing food or liquids', commonNames: ['dysphagia'] },
  { name: 'Blood in stool', category: 'digestive', severity: 'severe', description: 'Visible blood in bowel movements', commonNames: ['rectal bleeding', 'hematochezia'] },
  { name: 'Black stool', category: 'digestive', severity: 'severe', description: 'Dark, tarry stools', commonNames: ['melena'] },
  { name: 'Jaundice', category: 'digestive', severity: 'severe', description: 'Yellowing of skin and eyes', commonNames: ['icterus'] },
  
  // Cardiovascular Symptoms
  { name: 'Chest pain', category: 'cardiovascular', severity: 'severe', description: 'Pain or discomfort in the chest', commonNames: ['chest discomfort', 'angina'] },
  { name: 'Palpitations', category: 'cardiovascular', severity: 'moderate', description: 'Feeling of rapid or irregular heartbeat', commonNames: ['heart racing', 'fluttering'] },
  { name: 'Rapid heartbeat', category: 'cardiovascular', severity: 'moderate', description: 'Abnormally fast heart rate', commonNames: ['tachycardia'] },
  { name: 'Irregular heartbeat', category: 'cardiovascular', severity: 'moderate', description: 'Abnormal heart rhythm', commonNames: ['arrhythmia'] },
  { name: 'Swelling in legs', category: 'cardiovascular', severity: 'moderate', description: 'Fluid retention in lower extremities', commonNames: ['edema', 'leg swelling'] },
  { name: 'Cold hands and feet', category: 'cardiovascular', severity: 'mild', description: 'Reduced circulation to extremities', commonNames: ['poor circulation'] },
  { name: 'Blue lips or fingernails', category: 'cardiovascular', severity: 'severe', description: 'Bluish discoloration indicating low oxygen', commonNames: ['cyanosis'] },
  
  // Musculoskeletal Symptoms
  { name: 'Muscle aches', category: 'musculoskeletal', severity: 'moderate', description: 'Pain in muscles throughout the body', commonNames: ['myalgia', 'body aches'] },
  { name: 'Joint pain', category: 'musculoskeletal', severity: 'moderate', description: 'Pain in one or more joints', commonNames: ['arthralgia', 'joint ache'] },
  { name: 'Back pain', category: 'musculoskeletal', severity: 'moderate', description: 'Pain in the back area', commonNames: ['backache', 'dorsalgia'] },
  { name: 'Neck pain', category: 'musculoskeletal', severity: 'moderate', description: 'Pain in the neck region', commonNames: ['neck stiffness', 'cervicalgia'] },
  { name: 'Stiff joints', category: 'musculoskeletal', severity: 'moderate', description: 'Reduced joint flexibility', commonNames: ['joint stiffness'] },
  { name: 'Muscle weakness', category: 'musculoskeletal', severity: 'moderate', description: 'Reduced muscle strength', commonNames: ['muscle fatigue'] },
  { name: 'Muscle cramps', category: 'musculoskeletal', severity: 'mild', description: 'Sudden involuntary muscle contractions', commonNames: ['charley horse', 'spasms'] },
  { name: 'Swollen joints', category: 'musculoskeletal', severity: 'moderate', description: 'Inflammation and swelling of joints', commonNames: ['joint swelling'] },
  { name: 'Limited range of motion', category: 'musculoskeletal', severity: 'moderate', description: 'Difficulty moving joints fully', commonNames: ['reduced mobility'] },
  
  // Dermatological Symptoms
  { name: 'Rash', category: 'dermatological', severity: 'mild', description: 'Change in skin appearance or texture', commonNames: ['skin eruption', 'dermatitis'] },
  { name: 'Itching', category: 'dermatological', severity: 'mild', description: 'Uncomfortable skin sensation causing urge to scratch', commonNames: ['pruritus'] },
  { name: 'Hives', category: 'dermatological', severity: 'moderate', description: 'Raised, itchy welts on skin', commonNames: ['urticaria', 'welts'] },
  { name: 'Dry skin', category: 'dermatological', severity: 'mild', description: 'Lack of moisture in skin', commonNames: ['xerosis'] },
  { name: 'Skin discoloration', category: 'dermatological', severity: 'mild', description: 'Change in skin color', commonNames: ['pigmentation changes'] },
  { name: 'Blisters', category: 'dermatological', severity: 'moderate', description: 'Fluid-filled bumps on skin', commonNames: ['vesicles'] },
  { name: 'Bruising', category: 'dermatological', severity: 'mild', description: 'Discoloration from bleeding under skin', commonNames: ['contusion', 'ecchymosis'] },
  { name: 'Pale skin', category: 'dermatological', severity: 'moderate', description: 'Unusually light skin color', commonNames: ['pallor'] },
  { name: 'Flushed skin', category: 'dermatological', severity: 'mild', description: 'Redness of skin', commonNames: ['flushing', 'redness'] },
  
  // Psychological Symptoms
  { name: 'Anxiety', category: 'psychological', severity: 'moderate', description: 'Feeling of worry or unease', commonNames: ['nervousness', 'apprehension'] },
  { name: 'Depression', category: 'psychological', severity: 'moderate', description: 'Persistent sadness and loss of interest', commonNames: ['low mood', 'melancholy'] },
  { name: 'Irritability', category: 'psychological', severity: 'mild', description: 'Easily annoyed or angered', commonNames: ['mood swings'] },
  { name: 'Insomnia', category: 'psychological', severity: 'moderate', description: 'Difficulty falling or staying asleep', commonNames: ['sleeplessness'] },
  { name: 'Restlessness', category: 'psychological', severity: 'mild', description: 'Inability to relax or stay still', commonNames: ['agitation'] },
  { name: 'Difficulty concentrating', category: 'psychological', severity: 'mild', description: 'Trouble focusing attention', commonNames: ['poor concentration', 'brain fog'] },
  
  // Urinary Symptoms
  { name: 'Frequent urination', category: 'urinary', severity: 'mild', description: 'Need to urinate more often than usual', commonNames: ['polyuria'] },
  { name: 'Painful urination', category: 'urinary', severity: 'moderate', description: 'Pain or burning when urinating', commonNames: ['dysuria'] },
  { name: 'Blood in urine', category: 'urinary', severity: 'severe', description: 'Visible blood in urine', commonNames: ['hematuria'] },
  { name: 'Difficulty urinating', category: 'urinary', severity: 'moderate', description: 'Trouble starting or maintaining urine flow', commonNames: ['urinary retention'] },
  { name: 'Urgent urination', category: 'urinary', severity: 'moderate', description: 'Sudden strong need to urinate', commonNames: ['urgency'] },
  
  // Eye Symptoms
  { name: 'Blurred vision', category: 'neurological', severity: 'moderate', description: 'Lack of sharpness in vision', commonNames: ['vision problems', 'fuzzy vision'] },
  { name: 'Double vision', category: 'neurological', severity: 'severe', description: 'Seeing two images of single object', commonNames: ['diplopia'] },
  { name: 'Eye pain', category: 'neurological', severity: 'moderate', description: 'Pain in or around the eye', commonNames: ['ocular pain'] },
  { name: 'Red eyes', category: 'dermatological', severity: 'mild', description: 'Bloodshot or inflamed eyes', commonNames: ['bloodshot eyes', 'conjunctivitis'] },
  { name: 'Watery eyes', category: 'respiratory', severity: 'mild', description: 'Excessive tear production', commonNames: ['tearing', 'lacrimation'] },
  
  // Ear Symptoms
  { name: 'Ear pain', category: 'neurological', severity: 'moderate', description: 'Pain in the ear', commonNames: ['earache', 'otalgia'] },
  { name: 'Ringing in ears', category: 'neurological', severity: 'mild', description: 'Perception of sound without external source', commonNames: ['tinnitus'] },
  { name: 'Hearing loss', category: 'neurological', severity: 'moderate', description: 'Reduced ability to hear', commonNames: ['deafness'] },
];

const diseases = [
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
  {
    name: 'Common Cold',
    description: 'A viral infection of the upper respiratory tract, primarily affecting the nose and throat. Usually harmless and resolves within 7-10 days.',
    category: 'infectious',
    prevalence: 'very_common',
    urgency: 'low',
    whenToSeekCare: 'Seek medical attention if symptoms persist beyond 10 days, if you develop a high fever (above 101.3°F), or if symptoms worsen significantly.',
    treatment: 'Rest, hydration, over-the-counter pain relievers, and decongestants. Antibiotics are not effective against viral infections.',
    prevention: 'Frequent handwashing, avoiding close contact with infected individuals, and maintaining good hygiene.',
    ageGroup: ['child', 'adolescent', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Runny nose', weight: 0.9, isCommon: true },
      { symptomName: 'Congestion', weight: 0.85, isCommon: true },
      { symptomName: 'Sneezing', weight: 0.8, isCommon: true },
      { symptomName: 'Sore throat', weight: 0.75, isCommon: true },
      { symptomName: 'Cough', weight: 0.7, isCommon: true },
      { symptomName: 'Headache', weight: 0.5, isCommon: false },
      { symptomName: 'Fatigue', weight: 0.4, isCommon: false },
    ],
  },
  {
    name: 'Influenza (Flu)',
    description: 'A contagious respiratory illness caused by influenza viruses. More severe than the common cold with sudden onset of symptoms.',
    category: 'infectious',
    prevalence: 'very_common',
    urgency: 'moderate',
    whenToSeekCare: 'Seek immediate care if you experience difficulty breathing, chest pain, severe weakness, confusion, or if symptoms improve then suddenly worsen.',
    treatment: 'Antiviral medications (if started within 48 hours), rest, fluids, and over-the-counter medications for symptom relief.',
    prevention: 'Annual flu vaccination, frequent handwashing, avoiding close contact with sick individuals.',
    ageGroup: ['child', 'adolescent', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Fever', weight: 0.95, isCommon: true },
      { symptomName: 'Chills', weight: 0.9, isCommon: true },
      { symptomName: 'Muscle aches', weight: 0.9, isCommon: true },
      { symptomName: 'Fatigue', weight: 0.85, isCommon: true },
      { symptomName: 'Headache', weight: 0.8, isCommon: true },
      { symptomName: 'Cough', weight: 0.75, isCommon: true },
      { symptomName: 'Sore throat', weight: 0.6, isCommon: false },
      { symptomName: 'Runny nose', weight: 0.5, isCommon: false },
    ],
  },
  {
    name: 'Gastroenteritis',
    description: 'Inflammation of the stomach and intestines, commonly called "stomach flu". Usually caused by viral or bacterial infection.',
    category: 'infectious',
    prevalence: 'common',
    urgency: 'moderate',
    whenToSeekCare: 'Seek care if you have signs of severe dehydration, bloody stools, high fever, or symptoms lasting more than several days.',
    treatment: 'Hydration with oral rehydration solutions, rest, gradual reintroduction of bland foods. Antibiotics only if bacterial cause is confirmed.',
    prevention: 'Proper food handling, handwashing, avoiding contaminated water, and vaccination (for rotavirus in children).',
    ageGroup: ['infant', 'child', 'adolescent', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Diarrhea', weight: 0.95, isCommon: true },
      { symptomName: 'Nausea', weight: 0.9, isCommon: true },
      { symptomName: 'Vomiting', weight: 0.85, isCommon: true },
      { symptomName: 'Abdominal pain', weight: 0.8, isCommon: true },
      { symptomName: 'Fever', weight: 0.6, isCommon: false },
      { symptomName: 'Headache', weight: 0.4, isCommon: false },
      { symptomName: 'Muscle aches', weight: 0.4, isCommon: false },
    ],
  },
  {
    name: 'Migraine',
    description: 'A neurological condition characterized by intense, debilitating headaches often accompanied by other symptoms.',
    category: 'neurological',
    prevalence: 'common',
    urgency: 'low',
    whenToSeekCare: 'Seek immediate care if headache is sudden and severe ("thunderclap"), accompanied by fever, stiff neck, confusion, vision changes, or difficulty speaking.',
    treatment: 'Pain relievers, triptans, anti-nausea medications, preventive medications for frequent migraines, and lifestyle modifications.',
    prevention: 'Identifying and avoiding triggers, maintaining regular sleep schedule, stress management, and preventive medications.',
    ageGroup: ['adolescent', 'adult'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Headache', weight: 0.95, isCommon: true },
      { symptomName: 'Nausea', weight: 0.75, isCommon: true },
      { symptomName: 'Dizziness', weight: 0.6, isCommon: false },
      { symptomName: 'Fatigue', weight: 0.5, isCommon: false },
    ],
  },
  {
    name: 'Bronchitis',
    description: 'Inflammation of the bronchial tubes that carry air to and from the lungs. Can be acute or chronic.',
    category: 'respiratory',
    prevalence: 'common',
    urgency: 'moderate',
    whenToSeekCare: 'Seek care if cough lasts more than 3 weeks, you have difficulty breathing, chest pain, high fever, or cough up blood.',
    treatment: 'Rest, fluids, cough suppressants, bronchodilators if wheezing. Antibiotics only if bacterial infection is confirmed.',
    prevention: 'Avoiding smoking and secondhand smoke, getting flu vaccine, practicing good hygiene.',
    ageGroup: ['child', 'adolescent', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Cough', weight: 0.95, isCommon: true },
      { symptomName: 'Fatigue', weight: 0.7, isCommon: true },
      { symptomName: 'Shortness of breath', weight: 0.65, isCommon: true },
      { symptomName: 'Chest pain', weight: 0.6, isCommon: false },
      { symptomName: 'Wheezing', weight: 0.6, isCommon: false },
      { symptomName: 'Fever', weight: 0.5, isCommon: false },
      { symptomName: 'Sore throat', weight: 0.4, isCommon: false },
    ],
  },
  {
    name: 'Strep Throat',
    description: 'A bacterial infection of the throat and tonsils caused by group A Streptococcus bacteria.',
    category: 'infectious',
    prevalence: 'common',
    urgency: 'moderate',
    whenToSeekCare: 'See a doctor if you have severe throat pain, difficulty swallowing or breathing, or if symptoms don\'t improve within a few days.',
    treatment: 'Antibiotics (usually penicillin or amoxicillin), pain relievers, rest, and increased fluid intake.',
    prevention: 'Good hygiene practices, avoiding sharing utensils or drinks, and staying away from infected individuals.',
    ageGroup: ['child', 'adolescent', 'adult'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Sore throat', weight: 0.95, isCommon: true },
      { symptomName: 'Fever', weight: 0.85, isCommon: true },
      { symptomName: 'Headache', weight: 0.7, isCommon: true },
      { symptomName: 'Nausea', weight: 0.5, isCommon: false },
      { symptomName: 'Vomiting', weight: 0.4, isCommon: false },
      { symptomName: 'Rash', weight: 0.3, isCommon: false },
    ],
  },
  {
    name: 'Pneumonia',
    description: 'An infection that inflames air sacs in one or both lungs, which may fill with fluid. Can range from mild to life-threatening.',
    category: 'respiratory',
    prevalence: 'common',
    urgency: 'urgent',
    whenToSeekCare: 'Seek immediate care if you have difficulty breathing, chest pain, persistent high fever, or bluish lips or fingernails.',
    treatment: 'Antibiotics for bacterial pneumonia, antivirals for viral pneumonia, rest, fluids, and oxygen therapy if needed.',
    prevention: 'Vaccination (pneumococcal and flu vaccines), good hygiene, not smoking, and maintaining a healthy immune system.',
    ageGroup: ['infant', 'child', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Cough', weight: 0.9, isCommon: true },
      { symptomName: 'Fever', weight: 0.9, isCommon: true },
      { symptomName: 'Shortness of breath', weight: 0.85, isCommon: true },
      { symptomName: 'Chest pain', weight: 0.8, isCommon: true },
      { symptomName: 'Fatigue', weight: 0.75, isCommon: true },
      { symptomName: 'Chills', weight: 0.7, isCommon: false },
      { symptomName: 'Sweating', weight: 0.6, isCommon: false },
      { symptomName: 'Confusion', weight: 0.5, isCommon: false },
    ],
  },
  {
    name: 'Sinusitis',
    description: 'Inflammation or swelling of the tissue lining the sinuses, often following a cold or allergies.',
    category: 'respiratory',
    prevalence: 'common',
    urgency: 'low',
    whenToSeekCare: 'See a doctor if symptoms last more than 10 days, worsen after initial improvement, or if you have severe headache or facial pain.',
    treatment: 'Nasal decongestants, saline nasal irrigation, pain relievers, and antibiotics if bacterial infection is confirmed.',
    prevention: 'Managing allergies, avoiding irritants, staying hydrated, and using a humidifier.',
    ageGroup: ['adolescent', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Congestion', weight: 0.9, isCommon: true },
      { symptomName: 'Headache', weight: 0.85, isCommon: true },
      { symptomName: 'Runny nose', weight: 0.8, isCommon: true },
      { symptomName: 'Cough', weight: 0.6, isCommon: false },
      { symptomName: 'Fatigue', weight: 0.5, isCommon: false },
      { symptomName: 'Fever', weight: 0.4, isCommon: false },
    ],
  },
  {
    name: 'Urinary Tract Infection (UTI)',
    description: 'An infection in any part of the urinary system, most commonly affecting the bladder and urethra.',
    category: 'infectious',
    prevalence: 'common',
    urgency: 'moderate',
    whenToSeekCare: 'Seek care if you have fever, back pain, blood in urine, or if symptoms don\'t improve with treatment.',
    treatment: 'Antibiotics, increased fluid intake, and pain relievers for discomfort.',
    prevention: 'Staying hydrated, urinating after intercourse, wiping front to back, and avoiding irritating feminine products.',
    ageGroup: ['adolescent', 'adult', 'elderly'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Abdominal pain', weight: 0.8, isCommon: true },
      { symptomName: 'Fever', weight: 0.6, isCommon: false },
      { symptomName: 'Back pain', weight: 0.6, isCommon: false },
      { symptomName: 'Fatigue', weight: 0.4, isCommon: false },
    ],
  },
  {
    name: 'Allergic Rhinitis',
    description: 'An allergic response to specific allergens, commonly known as hay fever. Causes cold-like symptoms.',
    category: 'autoimmune',
    prevalence: 'very_common',
    urgency: 'low',
    whenToSeekCare: 'See a doctor if symptoms interfere with daily life, over-the-counter medications don\'t help, or you develop complications like sinus infections.',
    treatment: 'Antihistamines, nasal corticosteroids, decongestants, and allergen immunotherapy for severe cases.',
    prevention: 'Avoiding known allergens, keeping windows closed during high pollen seasons, and using air purifiers.',
    ageGroup: ['child', 'adolescent', 'adult'],
    affectedGender: 'both',
    symptoms: [
      { symptomName: 'Sneezing', weight: 0.9, isCommon: true },
      { symptomName: 'Runny nose', weight: 0.9, isCommon: true },
      { symptomName: 'Congestion', weight: 0.85, isCommon: true },
      { symptomName: 'Cough', weight: 0.5, isCommon: false },
      { symptomName: 'Fatigue', weight: 0.4, isCommon: false },
    ],
  },
];

const sampleUsers = [
  {
    email: 'patient@demo.com',
    password: 'password123',
    name: 'John Doe',
    role: 'patient',
    dateOfBirth: new Date('1990-05-15'),
    gender: 'male',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: [],
    profileComplete: true,
  },
  {
    email: 'doctor@demo.com',
    password: 'password123',
    name: 'Dr. Sarah Johnson',
    role: 'doctor',
    specialty: 'General Practice',
    bio: 'Experienced family medicine physician with over 10 years of practice. Specialized in preventive care and chronic disease management.',
    consultationFee: 75,
    profileComplete: true,
  },
  {
    email: 'doctor2@demo.com',
    password: 'password123',
    name: 'Dr. Michael Chen',
    role: 'doctor',
    specialty: 'Internal Medicine',
    bio: 'Board-certified internist focusing on adult medicine and complex medical conditions.',
    consultationFee: 100,
    profileComplete: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Symptom.deleteMany({});
    await Disease.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Seed symptoms
    const createdSymptoms = await Symptom.insertMany(symptoms);
    console.log(`Seeded ${createdSymptoms.length} symptoms`);

    // Create a map of symptom names to IDs
    const symptomMap = {};
    createdSymptoms.forEach(symptom => {
      symptomMap[symptom.name] = symptom._id;
    });

    // Prepare diseases with symptom IDs
    const diseasesWithIds = diseases.map(disease => ({
      ...disease,
      symptoms: disease.symptoms.map(s => ({
        symptomId: symptomMap[s.symptomName],
        weight: s.weight,
        isCommon: s.isCommon,
      })),
    }));

    // Seed diseases
    const createdDiseases = await Disease.insertMany(diseasesWithIds);
    console.log(`Seeded ${createdDiseases.length} diseases`);

    // Seed sample users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Seeded ${createdUsers.length} users`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Patient: patient@demo.com / password123');
    console.log('Doctor: doctor@demo.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
