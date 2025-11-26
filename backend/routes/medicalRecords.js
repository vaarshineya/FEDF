import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/medical-records
// @desc    Get medical records (patients get their own, doctors get all)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query.patientId = req.user._id;
    }
    
    const { status, limit = 20, page = 1 } = req.query;
    
    if (status) {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const records = await MedicalRecord.find(query)
      .populate('patientId', 'name email')
      .populate('diagnosedBy', 'name specialty')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await MedicalRecord.countDocuments(query);
    
    res.json({
      records,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/medical-records/:id
// @desc    Get medical record by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patientId', 'name email dateOfBirth gender bloodType allergies chronicConditions')
      .populate('diagnosedBy', 'name specialty')
      .populate('symptoms.symptomId')
      .populate('predictedDiseases.diseaseId');
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Check authorization
    if (
      req.user.role === 'patient' &&
      record.patientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to access this record' });
    }
    
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/medical-records
// @desc    Create a new medical record
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const recordData = {
      ...req.body,
      patientId: req.user.role === 'patient' ? req.user._id : req.body.patientId,
    };
    
    const record = await MedicalRecord.create(recordData);
    
    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/medical-records/:id
// @desc    Update medical record (doctors only)
// @access  Private (Doctor)
router.put('/:id', protect, authorize('doctor'), async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Update allowed fields
    const allowedUpdates = ['diagnosis', 'notes', 'status'];
    
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        record[field] = req.body[field];
      }
    });
    
    if (req.body.status === 'diagnosed') {
      record.diagnosedBy = req.user._id;
    }
    
    await record.save();
    
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/medical-records/:id
// @desc    Delete medical record
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    
    // Check authorization
    if (
      req.user.role === 'patient' &&
      record.patientId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this record' });
    }
    
    await record.deleteOne();
    
    res.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/medical-records/patient/:patientId
// @desc    Get medical records for a specific patient (doctors only)
// @access  Private (Doctor)
router.get('/patient/:patientId', protect, authorize('doctor'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate('diagnosedBy', 'name specialty')
      .sort({ createdAt: -1 });
    
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
