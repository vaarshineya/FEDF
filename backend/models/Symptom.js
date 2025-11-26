import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'respiratory', 'cardiovascular', 'neurological', 'digestive', 'musculoskeletal', 'dermatological', 'psychological', 'urinary', 'reproductive'],
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'moderate',
  },
  description: {
    type: String,
  },
  commonNames: [{
    type: String,
  }],
  relatedSymptoms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Symptom',
  }],
}, {
  timestamps: true,
});

const Symptom = mongoose.model('Symptom', symptomSchema);

export default Symptom;
