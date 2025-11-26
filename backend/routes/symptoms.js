import express from 'express';
import jwt from 'jsonwebtoken';
import Symptom from '../models/Symptom.js';
import diseasePredictionService from '../services/diseasePrediction.js';
import MedicalRecord from '../models/MedicalRecord.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/symptoms
// @desc    Get all symptoms
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, limit = 50 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { commonNames: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const symptoms = await Symptom.find(query)
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    res.json(symptoms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/symptoms/categories
// @desc    Get all symptom categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Symptom.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/symptoms/suggestions
// @desc    Get symptom suggestions based on search term
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    const suggestions = await diseasePredictionService.getSymptomSuggestions(
      q,
      parseInt(limit)
    );
    
    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/symptoms/analyze
// @desc    Analyze symptoms and predict diseases
// @access  Public (saves record if authenticated)
router.post('/analyze', async (req, res) => {
  try {
    const { symptomIds, age, gender } = req.body;
    
    if (!symptomIds || symptomIds.length === 0) {
      return res.status(400).json({ message: 'At least one symptom is required' });
    }
    
    if (!age || !gender) {
      return res.status(400).json({ message: 'Age and gender are required' });
    }
    
    // Predict diseases
    const predictions = await diseasePredictionService.predictDiseases(
      symptomIds,
      { age: parseInt(age), gender }
    );
    
    // Get symptom details
    const symptoms = await Symptom.find({ _id: { $in: symptomIds } });
    
    let recordId = null;
    
    // Save to medical record only if user is authenticated
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        // User is logged in, save the record
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const medicalRecord = await MedicalRecord.create({
          patientId: decoded.id,
          symptoms: symptoms.map(s => ({
            symptomId: s._id,
            name: s.name,
            severity: s.severity,
          })),
          predictedDiseases: predictions.slice(0, 5).map(p => ({
            diseaseId: p.diseaseId,
            name: p.name,
            confidence: p.confidence,
            matchedSymptoms: p.matchedSymptoms,
            totalSymptoms: p.totalSymptoms,
          })),
          age: parseInt(age),
          gender,
          status: 'pending',
        });
        recordId = medicalRecord._id;
      } catch (authError) {
        // Ignore auth errors, just don't save record
        console.log('Auth error (non-critical):', authError.message);
      }
    }
    
    res.json({
      predictions,
      recordId,
      message: 'Analysis completed successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/symptoms/:id
// @desc    Get symptom by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id)
      .populate('relatedSymptoms');
    
    if (!symptom) {
      return res.status(404).json({ message: 'Symptom not found' });
    }
    
    res.json(symptom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
