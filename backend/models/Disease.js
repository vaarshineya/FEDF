import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['infectious', 'chronic', 'genetic', 'autoimmune', 'metabolic', 'cardiovascular', 'respiratory', 'neurological', 'digestive', 'endocrine', 'musculoskeletal', 'dermatological', 'other'],
  },
  symptoms: [{
    symptomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Symptom',
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      default: 0.5,
    },
    isCommon: {
      type: Boolean,
      default: true,
    },
  }],
  riskFactors: [{
    factor: String,
    weight: Number,
  }],
  prevalence: {
    type: String,
    enum: ['very_common', 'common', 'uncommon', 'rare', 'very_rare'],
    default: 'common',
  },
  urgency: {
    type: String,
    enum: ['emergency', 'urgent', 'moderate', 'low'],
    default: 'moderate',
  },
  whenToSeekCare: {
    type: String,
    required: true,
  },
  treatment: {
    type: String,
  },
  prevention: {
    type: String,
  },
  ageGroup: [{
    type: String,
    enum: ['infant', 'child', 'adolescent', 'adult', 'elderly'],
  }],
  affectedGender: {
    type: String,
    enum: ['male', 'female', 'both'],
    default: 'both',
  },
}, {
  timestamps: true,
});

// Index for faster symptom matching
diseaseSchema.index({ 'symptoms.symptomId': 1 });

const Disease = mongoose.model('Disease', diseaseSchema);

export default Disease;
