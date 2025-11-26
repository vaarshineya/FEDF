import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Disease from '../models/Disease.js';

dotenv.config();

const checkDiseases = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB\n');

    const diseases = await Disease.find({});
    console.log(`📊 Total Diseases in Database: ${diseases.length}\n`);

    console.log('📋 Diseases:');
    diseases.forEach((disease, index) => {
      console.log(`${index + 1}. ${disease.name} (${disease.category}) - ${disease.symptoms.length} symptoms`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDiseases();
