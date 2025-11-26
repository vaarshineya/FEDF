import express from 'express';
import MLTrainingService from '../ml/services/MLTrainingService.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/ml/train
// @desc    Train ML model (Admin/Doctor only)
// @access  Private
router.post('/train', protect, authorize('doctor'), async (req, res) => {
  try {
    const config = {
      trainRatio: req.body.trainRatio || 0.8,
      k: req.body.k || 5,
      distanceMetric: req.body.distanceMetric || 'euclidean',
      maxDepth: req.body.maxDepth || 10,
      minSamplesSplit: req.body.minSamplesSplit || 2,
    };

    console.log('Starting ML model training...');
    const results = await MLTrainingService.trainModel(config);

    res.json({
      message: 'Model trained successfully',
      results,
    });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ 
      message: 'Error training model', 
      error: error.message 
    });
  }
});

// @route   POST /api/ml/retrain
// @desc    Retrain ML model with latest data (Admin/Doctor only)
// @access  Private
router.post('/retrain', protect, authorize('doctor'), async (req, res) => {
  try {
    const config = {
      trainRatio: req.body.trainRatio || 0.8,
      k: req.body.k || 5,
      distanceMetric: req.body.distanceMetric || 'euclidean',
      maxDepth: req.body.maxDepth || 10,
      minSamplesSplit: req.body.minSamplesSplit || 2,
    };

    console.log('Retraining ML model...');
    const results = await MLTrainingService.retrainModel(config);

    res.json({
      message: 'Model retrained successfully',
      results,
    });
  } catch (error) {
    console.error('Retraining error:', error);
    res.status(500).json({ 
      message: 'Error retraining model', 
      error: error.message 
    });
  }
});

// @route   GET /api/ml/model-info
// @desc    Get ML model information
// @access  Public
router.get('/model-info', async (req, res) => {
  try {
    const info = await MLTrainingService.getModelInfo();
    res.json(info);
  } catch (error) {
    console.error('Error getting model info:', error);
    res.status(500).json({ 
      message: 'Error getting model information', 
      error: error.message 
    });
  }
});

// @route   POST /api/ml/predict
// @desc    Predict disease using ML model
// @access  Private
router.post('/predict', protect, async (req, res) => {
  try {
    const { symptomIds, age, gender } = req.body;

    if (!symptomIds || symptomIds.length === 0) {
      return res.status(400).json({ message: 'At least one symptom is required' });
    }

    if (!age || !gender) {
      return res.status(400).json({ message: 'Age and gender are required' });
    }

    const predictions = await MLTrainingService.predict(
      symptomIds,
      { age: parseInt(age), gender }
    );

    res.json({
      predictions,
      message: 'ML prediction completed successfully',
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      message: 'Error making prediction', 
      error: error.message 
    });
  }
});

// @route   GET /api/ml/algorithms
// @desc    Get information about available ML algorithms
// @access  Public
router.get('/algorithms', (req, res) => {
  res.json({
    algorithms: [
      {
        name: 'Naive Bayes',
        description: 'Probabilistic classifier based on Bayes theorem with Gaussian distribution',
        strengths: [
          'Fast training and prediction',
          'Works well with small datasets',
          'Handles continuous and discrete features',
          'Provides probability estimates'
        ],
        use_case: 'Good for baseline predictions and when features are independent'
      },
      {
        name: 'K-Nearest Neighbors (KNN)',
        description: 'Instance-based learning using distance metrics',
        strengths: [
          'No training phase required',
          'Adapts to new data easily',
          'Works well with multi-class problems',
          'Intuitive and easy to understand'
        ],
        use_case: 'Effective when similar cases have similar outcomes'
      },
      {
        name: 'Decision Tree',
        description: 'Tree-based model using information gain for splits',
        strengths: [
          'Easy to interpret and visualize',
          'Handles non-linear relationships',
          'No feature scaling required',
          'Can capture complex patterns'
        ],
        use_case: 'Useful for understanding decision rules and feature importance'
      },
      {
        name: 'Ensemble Model',
        description: 'Combines all three algorithms using weighted voting',
        strengths: [
          'Higher accuracy than individual models',
          'Reduces overfitting',
          'More robust predictions',
          'Provides consensus measure'
        ],
        use_case: 'Best for production use with highest accuracy'
      }
    ],
    current_model: 'Ensemble (Naive Bayes + KNN + Decision Tree)',
    prediction_method: 'Hybrid (ML + Rule-based)',
  });
});

// @route   GET /api/ml/stats
// @desc    Get ML model statistics and performance metrics
// @access  Private (Doctor only)
router.get('/stats', protect, authorize('doctor'), async (req, res) => {
  try {
    const info = await MLTrainingService.getModelInfo();
    
    res.json({
      modelInfo: info,
      algorithms: {
        naiveBayes: {
          type: 'Gaussian Naive Bayes',
          complexity: 'O(n * d)',
          memory: 'Low'
        },
        knn: {
          type: 'K-Nearest Neighbors',
          complexity: 'O(n * d * k)',
          memory: 'High (stores all training data)'
        },
        decisionTree: {
          type: 'ID3 Decision Tree',
          complexity: 'O(n * d * log(n))',
          memory: 'Medium'
        }
      },
      ensemble: {
        method: 'Weighted Voting',
        weights: info.weights || { naiveBayes: 0.35, knn: 0.35, decisionTree: 0.30 }
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ 
      message: 'Error getting statistics', 
      error: error.message 
    });
  }
});

export default router;
