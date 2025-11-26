/**
 * Data Preprocessing and Feature Engineering Utilities for ML Models
 */

class DataPreprocessor {
  /**
   * Convert symptoms and demographics to feature vector
   * @param {Array} symptomIds - Array of symptom IDs
   * @param {Array} allSymptoms - All possible symptoms
   * @param {Object} demographics - Patient demographics
   * @returns {Array} Feature vector
   */
  createFeatureVector(symptomIds, allSymptoms, demographics = {}) {
    const features = [];
    
    // Binary encoding for symptoms (1 if present, 0 if absent)
    const symptomIdStrings = symptomIds.map(id => id.toString());
    allSymptoms.forEach(symptom => {
      features.push(symptomIdStrings.includes(symptom._id.toString()) ? 1 : 0);
    });
    
    // Normalize age (0-1 scale, assuming max age 100)
    if (demographics.age !== undefined) {
      features.push(demographics.age / 100);
    } else {
      features.push(0.5); // Default middle age
    }
    
    // One-hot encoding for gender
    if (demographics.gender === 'male') {
      features.push(1, 0);
    } else if (demographics.gender === 'female') {
      features.push(0, 1);
    } else {
      features.push(0.5, 0.5); // Unknown
    }
    
    return features;
  }

  /**
   * Normalize feature vector using min-max normalization
   * @param {Array} features - Feature vector
   * @param {Object} stats - Min/max statistics
   * @returns {Array} Normalized features
   */
  normalize(features, stats = null) {
    if (!stats) {
      return features.map(f => f); // Return as-is if no stats
    }
    
    return features.map((value, index) => {
      const min = stats.min[index] || 0;
      const max = stats.max[index] || 1;
      if (max === min) return 0.5;
      return (value - min) / (max - min);
    });
  }

  /**
   * Calculate feature statistics for normalization
   * @param {Array} featureVectors - Array of feature vectors
   * @returns {Object} Statistics (min, max, mean, std)
   */
  calculateStats(featureVectors) {
    if (featureVectors.length === 0) return null;
    
    const numFeatures = featureVectors[0].length;
    const stats = {
      min: new Array(numFeatures).fill(Infinity),
      max: new Array(numFeatures).fill(-Infinity),
      mean: new Array(numFeatures).fill(0),
      std: new Array(numFeatures).fill(0),
    };
    
    // Calculate min, max, mean
    featureVectors.forEach(vector => {
      vector.forEach((value, index) => {
        stats.min[index] = Math.min(stats.min[index], value);
        stats.max[index] = Math.max(stats.max[index], value);
        stats.mean[index] += value;
      });
    });
    
    stats.mean = stats.mean.map(sum => sum / featureVectors.length);
    
    // Calculate standard deviation
    featureVectors.forEach(vector => {
      vector.forEach((value, index) => {
        stats.std[index] += Math.pow(value - stats.mean[index], 2);
      });
    });
    
    stats.std = stats.std.map(sum => Math.sqrt(sum / featureVectors.length));
    
    return stats;
  }

  /**
   * Split data into training and testing sets
   * @param {Array} data - Array of data points
   * @param {Number} trainRatio - Ratio of training data (0-1)
   * @returns {Object} Training and testing sets
   */
  trainTestSplit(data, trainRatio = 0.8) {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const trainSize = Math.floor(shuffled.length * trainRatio);
    
    return {
      train: shuffled.slice(0, trainSize),
      test: shuffled.slice(trainSize),
    };
  }

  /**
   * Calculate Euclidean distance between two vectors
   * @param {Array} vector1 
   * @param {Array} vector2 
   * @returns {Number} Distance
   */
  euclideanDistance(vector1, vector2) {
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
      sum += Math.pow(vector1[i] - vector2[i], 2);
    }
    return Math.sqrt(sum);
  }

  /**
   * Calculate cosine similarity between two vectors
   * @param {Array} vector1 
   * @param {Array} vector2 
   * @returns {Number} Similarity (0-1)
   */
  cosineSimilarity(vector1, vector2) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    
    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      magnitude1 += vector1[i] * vector1[i];
      magnitude2 += vector2[i] * vector2[i];
    }
    
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    
    if (magnitude1 === 0 || magnitude2 === 0) return 0;
    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Calculate Jaccard similarity for binary vectors
   * @param {Array} vector1 
   * @param {Array} vector2 
   * @returns {Number} Similarity (0-1)
   */
  jaccardSimilarity(vector1, vector2) {
    let intersection = 0;
    let union = 0;
    
    for (let i = 0; i < vector1.length; i++) {
      if (vector1[i] === 1 || vector2[i] === 1) {
        union++;
        if (vector1[i] === 1 && vector2[i] === 1) {
          intersection++;
        }
      }
    }
    
    return union === 0 ? 0 : intersection / union;
  }
}

export default new DataPreprocessor();
