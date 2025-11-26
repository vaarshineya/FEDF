import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Symptom from '../models/Symptom.js';
import Disease from '../models/Disease.js';
import diseasePredictionService from '../services/diseasePrediction.js';

dotenv.config();

const testPrediction = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB\n');

    // Test COVID-19 symptoms
    console.log('🧪 Test 1: COVID-19 Symptoms');
    console.log('Symptoms: Fever, Cough, Loss of smell, Loss of taste\n');
    
    const covidSymptoms = await Symptom.find({
      name: { $in: ['Fever', 'Cough', 'Loss of smell', 'Loss of taste'] }
    });
    
    console.log('Found symptoms:');
    covidSymptoms.forEach(s => console.log(`  - ${s.name} (${s._id})`));
    
    const symptomIds = covidSymptoms.map(s => s._id);
    
    const predictions = await diseasePredictionService.predictDiseases(
      symptomIds,
      { age: 30, gender: 'male' }
    );
    
    console.log('\n📊 Predictions:');
    predictions.slice(0, 5).forEach((pred, index) => {
      console.log(`${index + 1}. ${pred.name} - ${pred.confidence.toFixed(1)}% (${pred.confidenceLevel})`);
      console.log(`   Matched: ${pred.matchedSymptoms}/${pred.totalSymptoms} symptoms`);
    });

    // Check what diseases exist
    console.log('\n\n📋 All Diseases in Database:');
    const diseases = await Disease.find({});
    diseases.forEach(d => {
      console.log(`  - ${d.name} (${d.symptoms.length} symptoms)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPrediction();
