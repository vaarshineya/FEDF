/**
 * ML Training Service
 * Handles model training, evaluation, and persistence
 */

import Disease from '../../models/Disease.js';
import Symptom from '../../models/Symptom.js';
import MedicalRecord from '../../models/MedicalRecord.js';
import EnsembleModel from '../algorithms/EnsembleModel.js';
import dataPreprocessor from '../utils/dataPreprocessing.js';
import fs from 'fs/promises';
import path from 'path';

class MLTrainingService {
  constructor() {
    this.model = null;
    this.allSymptoms = [];
    this.diseaseMap = {};
    this.modelPath = path.join(process.cwd(), 'ml', 'models', 'trained_model.json');
  }

  /**
   * Prepare training data from database
   * @returns {Array} Training data with features and labels
   */
  async prepareTrainingData() {
    console.log('Fetching data from database...');
    
    // Get all symptoms (for feature vector creation)
    this.allSymptoms = await Symptom.find({}).lean();
    
    // Get all diseases with their symptoms
    const diseases = await Disease.find({})
      .populate('symptoms.symptomId')
      .lean();

    // Create disease map for quick lookup
    diseases.forEach(disease => {
      this.diseaseMap[disease._id.toString()] = disease.name;
    });

    const trainingData = [];

    // Generate training samples from disease definitions
    for (const disease of diseases) {
      // Create multiple samples per disease with different symptom combinations
      const diseaseSymptoms = disease.symptoms.map(s => s.symptomId._id);
      
      // Full symptom set
      trainingData.push(this.createTrainingSample(
        diseaseSymptoms,
        disease,
        disease.name
      ));

      // Partial symptom sets (simulate real-world scenarios)
      if (diseaseSymptoms.length >= 3) {
        // 80% of symptoms
        const partial80 = diseaseSymptoms.slice(0, Math.ceil(diseaseSymptoms.length * 0.8));
        trainingData.push(this.createTrainingSample(partial80, disease, disease.name));

        // 60% of symptoms
        const partial60 = diseaseSymptoms.slice(0, Math.ceil(diseaseSymptoms.length * 0.6));
        trainingData.push(this.createTrainingSample(partial60, disease, disease.name));
      }

      // Add samples with different demographics
      if (disease.ageGroup && disease.ageGroup.length > 0) {
        disease.ageGroup.forEach(ageGroup => {
          const age = this.getAgeFromGroup(ageGroup);
          const demographics = { age, gender: disease.affectedGender || 'both' };
          trainingData.push(this.createTrainingSample(
            diseaseSymptoms,
            disease,
            disease.name,
            demographics
          ));
        });
      }
    }

    // Augment with medical records if available
    const medicalRecords = await MedicalRecord.find({ status: 'confirmed' })
      .limit(1000)
      .lean();

    medicalRecords.forEach(record => {
      if (record.confirmedDiagnosis && record.symptoms.length > 0) {
        const symptomIds = record.symptoms.map(s => s.symptomId);
        const demographics = {
          age: record.age,
          gender: record.gender,
        };
        
        trainingData.push(this.createTrainingSample(
          symptomIds,
          null,
          record.confirmedDiagnosis,
          demographics
        ));
      }
    });

    console.log(`Prepared ${trainingData.length} training samples`);
    return trainingData;
  }

  /**
   * Create a training sample with features and label
   * @param {Array} symptomIds - Symptom IDs
   * @param {Object} disease - Disease object
   * @param {String} label - Disease name
   * @param {Object} demographics - Patient demographics
   * @returns {Object} Training sample
   */
  createTrainingSample(symptomIds, disease, label, demographics = null) {
    // Use disease demographics if not provided
    if (!demographics && disease) {
      const ageGroup = disease.ageGroup?.[0] || 'adult';
      demographics = {
        age: this.getAgeFromGroup(ageGroup),
        gender: disease.affectedGender === 'both' ? 'male' : disease.affectedGender,
      };
    }

    const features = dataPreprocessor.createFeatureVector(
      symptomIds,
      this.allSymptoms,
      demographics || { age: 40, gender: 'male' }
    );

    return {
      features,
      label,
      symptomIds,
      demographics,
    };
  }

  /**
   * Get representative age from age group
   * @param {String} ageGroup 
   * @returns {Number} Age
   */
  getAgeFromGroup(ageGroup) {
    const ageMap = {
      infant: 1,
      child: 8,
      adolescent: 15,
      adult: 40,
      elderly: 70,
    };
    return ageMap[ageGroup] || 40;
  }

  /**
   * Train the ML model
   * @param {Object} config - Training configuration
   * @returns {Object} Training results
   */
  async trainModel(config = {}) {
    console.log('Starting model training...');
    
    // Prepare training data
    const allData = await this.prepareTrainingData();
    
    if (allData.length === 0) {
      throw new Error('No training data available');
    }

    // Split data into train and test sets
    const split = dataPreprocessor.trainTestSplit(allData, config.trainRatio || 0.8);
    
    console.log(`Training set: ${split.train.length} samples`);
    console.log(`Test set: ${split.test.length} samples`);

    // Initialize and train ensemble model
    this.model = new EnsembleModel({
      k: config.k || 5,
      distanceMetric: config.distanceMetric || 'euclidean',
      maxDepth: config.maxDepth || 10,
      minSamplesSplit: config.minSamplesSplit || 2,
    });

    await this.model.train(split.train);

    // Evaluate model
    console.log('Evaluating model...');
    const evaluation = this.model.evaluate(split.test);

    console.log(`Model Accuracy: ${evaluation.accuracy.toFixed(2)}%`);
    console.log('Individual Model Accuracies:');
    console.log(`  - Naive Bayes: ${evaluation.individualAccuracies.naiveBayes.toFixed(2)}%`);
    console.log(`  - KNN: ${evaluation.individualAccuracies.knn.toFixed(2)}%`);
    console.log(`  - Decision Tree: ${evaluation.individualAccuracies.decisionTree.toFixed(2)}%`);

    // Save model
    await this.saveModel();

    return {
      accuracy: evaluation.accuracy,
      individualAccuracies: evaluation.individualAccuracies,
      trainingSize: split.train.length,
      testSize: split.test.length,
      evaluation,
    };
  }

  /**
   * Predict disease using ML model
   * @param {Array} symptomIds - Symptom IDs
   * @param {Object} demographics - Patient demographics
   * @returns {Array} Predictions
   */
  async predict(symptomIds, demographics) {
    if (!this.model || !this.model.trained) {
      await this.loadModel();
    }

    if (!this.model || !this.model.trained) {
      throw new Error('Model not trained. Please train the model first.');
    }

    // Create feature vector
    const features = dataPreprocessor.createFeatureVector(
      symptomIds,
      this.allSymptoms,
      demographics
    );

    // Get predictions
    const prediction = this.model.predictClass(features);
    const topPredictions = this.model.predictTopN(features, 10);

    return {
      primaryPrediction: {
        disease: prediction.class,
        confidence: prediction.confidence,
        consensus: prediction.consensus,
      },
      allPredictions: topPredictions.map(p => ({
        disease: p.class,
        confidence: p.confidence,
      })),
      individualModels: prediction.individualPredictions,
      algorithm: 'ensemble',
    };
  }

  /**
   * Save trained model to file
   */
  async saveModel() {
    try {
      const modelDir = path.dirname(this.modelPath);
      await fs.mkdir(modelDir, { recursive: true });

      const modelData = {
        model: this.model.export(),
        allSymptoms: this.allSymptoms,
        diseaseMap: this.diseaseMap,
        timestamp: new Date().toISOString(),
      };

      await fs.writeFile(this.modelPath, JSON.stringify(modelData, null, 2));
      console.log(`Model saved to ${this.modelPath}`);
    } catch (error) {
      console.error('Error saving model:', error);
      throw error;
    }
  }

  /**
   * Load trained model from file
   */
  async loadModel() {
    try {
      const data = await fs.readFile(this.modelPath, 'utf-8');
      const modelData = JSON.parse(data);

      this.model = new EnsembleModel();
      this.model.import(modelData.model);
      this.allSymptoms = modelData.allSymptoms;
      this.diseaseMap = modelData.diseaseMap;

      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.log('No trained model found or error loading model');
      return false;
    }
  }

  /**
   * Get model information
   * @returns {Object} Model info
   */
  async getModelInfo() {
    try {
      const data = await fs.readFile(this.modelPath, 'utf-8');
      const modelData = JSON.parse(data);

      return {
        exists: true,
        timestamp: modelData.timestamp,
        numSymptoms: modelData.allSymptoms.length,
        numDiseases: Object.keys(modelData.diseaseMap).length,
        weights: modelData.model.weights,
      };
    } catch (error) {
      return {
        exists: false,
        message: 'No trained model found',
      };
    }
  }

  /**
   * Retrain model with new data
   * @param {Object} config - Training configuration
   * @returns {Object} Training results
   */
  async retrainModel(config = {}) {
    console.log('Retraining model with latest data...');
    return await this.trainModel(config);
  }
}

export default new MLTrainingService();
