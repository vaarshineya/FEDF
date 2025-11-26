import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symptoms: [{
    symptomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Symptom',
    },
    name: String,
    severity: String,
    duration: String,
  }],
  predictedDiseases: [{
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disease',
    },
    name: String,
    confidence: Number,
    matchedSymptoms: Number,
    totalSymptoms: Number,
  }],
  diagnosis: {
    type: String,
  },
  diagnosedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'diagnosed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Index for faster patient lookups
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;
