/**
 * Naive Bayes Classifier for Disease Prediction
 * Uses Gaussian Naive Bayes for continuous features
 */

class NaiveBayesClassifier {
  constructor() {
    this.classes = [];
    this.classProbabilities = {};
    this.featureStats = {}; // Mean and variance for each feature per class
    this.trained = false;
  }

  /**
   * Train the Naive Bayes model
   * @param {Array} trainingData - Array of {features: [], label: string}
   */
  train(trainingData) {
    if (!trainingData || trainingData.length === 0) {
      throw new Error('Training data is required');
    }

    // Extract unique classes
    this.classes = [...new Set(trainingData.map(d => d.label))];
    
    // Calculate class probabilities (prior probabilities)
    const classCounts = {};
    trainingData.forEach(data => {
      classCounts[data.label] = (classCounts[data.label] || 0) + 1;
    });
    
    this.classes.forEach(cls => {
      this.classProbabilities[cls] = classCounts[cls] / trainingData.length;
    });

    // Calculate feature statistics for each class
    this.classes.forEach(cls => {
      const classData = trainingData.filter(d => d.label === cls);
      const numFeatures = trainingData[0].features.length;
      
      this.featureStats[cls] = [];
      
      for (let i = 0; i < numFeatures; i++) {
        const values = classData.map(d => d.features[i]);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        
        this.featureStats[cls].push({
          mean,
          variance: variance + 1e-9, // Add small value to avoid division by zero
          std: Math.sqrt(variance + 1e-9),
        });
      }
    });

    this.trained = true;
  }

  /**
   * Calculate Gaussian probability density
   * @param {Number} x - Value
   * @param {Number} mean - Mean
   * @param {Number} variance - Variance
   * @returns {Number} Probability density
   */
  gaussianProbability(x, mean, variance) {
    const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
    return (1 / Math.sqrt(2 * Math.PI * variance)) * exponent;
  }

  /**
   * Predict class probabilities for given features
   * @param {Array} features - Feature vector
   * @returns {Object} Class probabilities
   */
  predict(features) {
    if (!this.trained) {
      throw new Error('Model must be trained before prediction');
    }

    const probabilities = {};
    
    this.classes.forEach(cls => {
      // Start with prior probability (log scale to avoid underflow)
      let logProb = Math.log(this.classProbabilities[cls]);
      
      // Multiply by likelihood of each feature (add in log scale)
      features.forEach((value, index) => {
        const stats = this.featureStats[cls][index];
        const prob = this.gaussianProbability(value, stats.mean, stats.variance);
        logProb += Math.log(prob + 1e-10); // Add small value to avoid log(0)
      });
      
      probabilities[cls] = logProb;
    });

    // Convert log probabilities back to probabilities and normalize
    const maxLogProb = Math.max(...Object.values(probabilities));
    const expProbs = {};
    let sumExpProbs = 0;
    
    Object.keys(probabilities).forEach(cls => {
      expProbs[cls] = Math.exp(probabilities[cls] - maxLogProb);
      sumExpProbs += expProbs[cls];
    });
    
    // Normalize to get final probabilities
    Object.keys(expProbs).forEach(cls => {
      probabilities[cls] = (expProbs[cls] / sumExpProbs) * 100; // Convert to percentage
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
    
    testData.forEach(data => {
      const prediction = this.predictClass(data.features);
      predictions.push({
        actual: data.label,
        predicted: prediction.class,
        confidence: prediction.confidence,
      });
      
      if (prediction.class === data.label) {
        correct++;
      }
    });
    
    return {
      accuracy: (correct / testData.length) * 100,
      correct,
      total: testData.length,
      predictions,
    };
  }

  /**
   * Export model for persistence
   * @returns {Object} Model data
   */
  export() {
    return {
      classes: this.classes,
      classProbabilities: this.classProbabilities,
      featureStats: this.featureStats,
      trained: this.trained,
    };
  }

  /**
   * Import model from saved data
   * @param {Object} modelData - Saved model data
   */
  import(modelData) {
    this.classes = modelData.classes;
    this.classProbabilities = modelData.classProbabilities;
    this.featureStats = modelData.featureStats;
    this.trained = modelData.trained;
  }
}

export default NaiveBayesClassifier;
