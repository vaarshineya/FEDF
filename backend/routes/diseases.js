import express from 'express';
import Disease from '../models/Disease.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/diseases
// @desc    Get all diseases
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, urgency, limit = 50 } = req.query;
    
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (urgency) {
      query.urgency = urgency;
    }
    
    const diseases = await Disease.find(query)
      .populate('symptoms.symptomId')
      .limit(parseInt(limit))
      .sort({ name: 1 });
    
    res.json(diseases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/diseases/categories
// @desc    Get all disease categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Disease.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/diseases/:id
// @desc    Get disease by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate('symptoms.symptomId');
    
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    
    res.json(disease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/diseases
// @desc    Create a new disease (Admin/Doctor only)
// @access  Private
router.post('/', protect, authorize('doctor'), async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json(disease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/diseases/:id
// @desc    Update disease (Admin/Doctor only)
// @access  Private
router.put('/:id', protect, authorize('doctor'), async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    
    res.json(disease);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
