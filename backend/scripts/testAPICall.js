import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Symptom from '../models/Symptom.js';

dotenv.config();

const testAPICall = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB\n');

    // Get symptom IDs
    const symptoms = await Symptom.find({
      name: { $in: ['Fever', 'Cough', 'Loss of smell', 'Loss of taste'] }
    });

    console.log('Found symptoms:');
    symptoms.forEach(s => console.log(`  ${s.name}: ${s._id}`));

    const symptomIds = symptoms.map(s => s._id.toString());

    console.log('\n📡 Making API call to http://localhost:10000/api/symptoms/analyze\n');

    const response = await fetch('http://localhost:10000/api/symptoms/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symptomIds: symptomIds,
        age: 30,
        gender: 'male'
      })
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    } else {
      const data = await response.json();
      console.log('\n✅ Success! Predictions:');
      console.log(JSON.stringify(data, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testAPICall();
