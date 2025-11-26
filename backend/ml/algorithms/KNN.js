/**
 * K-Nearest Neighbors (KNN) Classifier for Disease Prediction
 * Implements weighted voting based on distance
 */

import dataPreprocessor from '../utils/dataPreprocessing.js';

class KNNClassifier {
  constructor(k = 5, distanceMetric = 'euclidean') {
    this.k = k;
    this.distanceMetric = distanceMetric;
    this.trainingData = [];
    this.trained = false;
  }

  /**
   * Train the KNN model (stores training data)
   * @param {Array} trainingData - Array of {features: [], label: string}
   */
  train(trainingData) {
    if (!trainingData || trainingData.length === 0) {
      throw new Error('Training data is required');
    }

    this.trainingData = trainingData;
    this.trained = true;
  }

  /**
   * Calculate distance between two feature vectors
   * @param {Array} features1 
   * @param {Array} features2 
   * @returns {Number} Distance
   */
  calculateDistance(features1, features2) {
    switch (this.distanceMetric) {
      case 'euclidean':
        return dataPreprocessor.euclideanDistance(features1, features2);
      
      case 'cosine':
        // Convert similarity to distance
        return 1 - dataPreprocessor.cosineSimilarity(features1, features2);
      
      case 'jaccard':
        // Convert similarity to distance
        return 1 - dataPreprocessor.jaccardSimilarity(features1, features2);
      
      case 'manhattan':
        return features1.reduce((sum, val, i) => sum + Math.abs(val - features2[i]), 0);
      
      default:
        return dataPreprocessor.euclideanDistance(features1, features2);
    }
  }

  /**
   * Find K nearest neighbors
   * @param {Array} features - Feature vector to classify
   * @returns {Array} K nearest neighbors with distances
   */
  findKNearestNeighbors(features) {
    const distances = this.trainingData.map(data => ({
      label: data.label,
      distance: this.calculateDistance(features, data.features),
      features: data.features,
    }));

    // Sort by distance (ascending)
    distances.sort((a, b) => a.distance - b.distance);

    // Return K nearest neighbors
    return distances.slice(0, this.k);
  }

  /**
   * Predict class probabilities using weighted voting
   * @param {Array} features - Feature vector
   * @returns {Object} Class probabilities
   */
  predict(features) {
    if (!this.trained) {
      throw new Error('Model must be trained before prediction');
    }

    const neighbors = this.findKNearestNeighbors(features);
    
    // Weighted voting (inverse distance weighting)
    const votes = {};
    let totalWeight = 0;

    neighbors.forEach(neighbor => {
      // Use inverse distance as weight (add small value to avoid division by zero)
      const weight = 1 / (neighbor.distance + 1e-5);
      votes[neighbor.label] = (votes[neighbor.label] || 0) + weight;
      totalWeight += weight;
    });

    // Normalize to get probabilities
    const probabilities = {};
    Object.keys(votes).forEach(label => {
      probabilities[label] = (votes[label] / totalWeight) * 100;
    });

    return probabilities;
  }

  /**
   * Predict the most likely class
   * @param {Array} features - Feature vector
   * @returns {Object} Prediction with class and confidence
   */
  predictClass(features) {
    const probabilities = this.predict(features);
    
    let maxProb = -Infinity;
    let predictedClass = null;
    
    Object.entries(probabilities).forEach(([cls, prob]) => {
      if (prob > maxProb) {
        maxProb = prob;
        predictedClass = cls;
      }
    });
    
    return {
      class: predictedClass,
      confidence: maxProb,
      probabilities,
      neighbors: this.findKNearestNeighbors(features),
    };
  }

  /**
   * Evaluate model accuracy
   * @param {Array} testData - Array of {features: [], label: string}
   * @returns {Object} Evaluation metrics
   */
  evaluate(testData) {
    let correct = 0;
    const predictions = [];
    const confusionMatrix = {};
    
    testData.forEach(data => {
      const prediction = this.predictClass(data.features);
      predictions.push({
        actual: data.label,
        predicted: prediction.class,
        confidence: prediction.confidence,
      });
      
      // Update confusion matrix
      if (!confusionMatrix[data.label]) {
        confusionMatrix[data.label] = {};
      }
      confusionMatrix[data.label][prediction.class] = 
        (confusionMatrix[data.label][prediction.class] || 0) + 1;
      
      if (prediction.class === data.label) {
        correct++;
      }
    });
    
    return {
      accuracy: (correct / testData.length) * 100,
      correct,
      total: testData.length,
      predictions,
      confusionMatrix,
    };
  }

  /**
   * Optimize K value using cross-validation
   * @param {Array} data - Training data
   * @param {Array} kValues - Array of K values to test
   * @param {Number} folds - Number of cross-validation folds
   * @returns {Object} Best K and accuracies
   */
  optimizeK(data, kValues = [3, 5, 7, 9, 11], folds = 5) {
    const results = {};
    
    kValues.forEach(k => {
      const accuracies = [];
      const foldSize = Math.floor(data.length / folds);
      
      for (let i = 0; i < folds; i++) {
        const testStart = i * foldSize;
        const testEnd = testStart + foldSize;
        
        const testData = data.slice(testStart, testEnd);
        const trainData = [...data.slice(0, testStart), ...data.slice(testEnd)];
        
        const tempKNN = new KNNClassifier(k, this.distanceMetric);
        tempKNN.train(trainData);
        
        const evaluation = tempKNN.evaluate(testData);
        accuracies.push(evaluation.accuracy);
      }
      
      results[k] = {
        meanAccuracy: accuracies.reduce((a, b) => a + b, 0) / accuracies.length,
        accuracies,
      };
    });
    
    // Find best K
    let bestK = kValues[0];
    let bestAccuracy = results[bestK].meanAccuracy;
    
    Object.entries(results).forEach(([k, result]) => {
      if (result.meanAccuracy > bestAccuracy) {
        bestK = parseInt(k);
        bestAccuracy = result.meanAccuracy;
      }
    });
    
    return {
      bestK,
      bestAccuracy,
      results,
    };
  }

  /**
   * Export model for persistence
   * @returns {Object} Model data
   */
  export() {
    return {
      k: this.k,
      distanceMetric: this.distanceMetric,
      trainingData: this.trainingData,
      trained: this.trained,
    };
  }

  /**
   * Import model from saved data
   * @param {Object} modelData - Saved model data
   */
  import(modelData) {
    this.k = modelData.k;
    this.distanceMetric = modelData.distanceMetric;
    this.trainingData = modelData.trainingData;
    this.trained = modelData.trained;
  }
}

export default KNNClassifier;
