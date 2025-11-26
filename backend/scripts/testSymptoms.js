import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Symptom from '../models/Symptom.js';

dotenv.config();

const testSymptoms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db');
    console.log('Connected to MongoDB\n');

    // Get total count
    const totalCount = await Symptom.countDocuments();
    console.log(`📊 Total Symptoms in Database: ${totalCount}\n`);

    // Count by category
    const categories = await Symptom.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('📋 Symptoms by Category:');
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} symptoms`);
    });

    // Sample some new symptoms
    console.log('\n🔍 Sample of Recently Added Symptoms:');
    const sampleSymptoms = await Symptom.find({
      name: {
        $in: [
          'Loss of smell',
          'Loss of taste',
          'Bull\'s-eye rash',
          'Crushing chest pain',
          'Progressive memory loss',
          'Butterfly-shaped rash',
          'Increased thirst',
          'Extreme hunger'
        ]
      }
    }).select('name category severity');

    sampleSymptoms.forEach(symptom => {
      console.log(`   ✓ ${symptom.name} (${symptom.category}, ${symptom.severity})`);
    });

    console.log('\n✅ Database is ready for comprehensive disease prediction!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error testing symptoms:', error);
    process.exit(1);
  }
};

testSymptoms();
