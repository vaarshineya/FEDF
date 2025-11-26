/**
 * Ensemble Model combining multiple ML algorithms
 * Uses weighted voting for final prediction
 */

import NaiveBayesClassifier from './NaiveBayes.js';
import KNNClassifier from './KNN.js';
import DecisionTreeClassifier from './DecisionTree.js';

class EnsembleModel {
  constructor(config = {}) {
    this.naiveBayes = new NaiveBayesClassifier();
    this.knn = new KNNClassifier(config.k || 5, config.distanceMetric || 'euclidean');
    this.decisionTree = new DecisionTreeClassifier(
      config.maxDepth || 10,
      config.minSamplesSplit || 2
    );
    
    // Model weights (can be adjusted based on performance)
    this.weights = {
      naiveBayes: config.naiveBayesWeight || 0.35,
      knn: config.knnWeight || 0.35,
      decisionTree: config.decisionTreeWeight || 0.30,
    };
    
    this.trained = false;
  }

  /**
   * Train all models in the ensemble
   * @param {Array} trainingData - Array of {features: [], label: string}
   */
  async train(trainingData) {
    if (!trainingData || trainingData.length === 0) {
      throw new Error('Training data is required');
    }

    console.log('Training Naive Bayes...');
    this.naiveBayes.train(trainingData);
    
    console.log('Training KNN...');
    this.knn.train(trainingData);
    
    console.log('Training Decision Tree...');
    this.decisionTree.train(trainingData);
    
    this.trained = true;
    console.log('Ensemble model training complete');
  }

  /**
   * Predict using all models and combine results
   * @param {Array} features - Feature vector
   * @returns {Object} Combined prediction
   */
  predict(features) {
    if (!this.trained) {
      throw new Error('Model must be trained before prediction');
    }

    // Get predictions from each model
    const nbPrediction = this.naiveBayes.predict(features);
    const knnPrediction = this.knn.predict(features);
    const dtPrediction = this.decisionTree.predictClass(features);

    // Combine probabilities using weighted voting
    const combinedProbabilities = {};
    const allClasses = new Set([
      ...Object.keys(nbPrediction),
      ...Object.keys(knnPrediction),
      ...Object.keys(dtPrediction.probabilities),
    ]);

    allClasses.forEach(cls => {
      const nbProb = nbPrediction[cls] || 0;
      const knnProb = knnPrediction[cls] || 0;
      const dtProb = dtPrediction.probabilities[cls] || 0;

      combinedProbabilities[cls] =
        nbProb * this.weights.naiveBayes +
        knnProb * this.weights.knn +
        dtProb * this.weights.decisionTree;
    });

    // Normalize probabilities
    const totalProb = Object.values(combinedProbabilities).reduce((a, b) => a + b, 0);
    Object.keys(combinedProbabilities).forEach(cls => {
      combinedProbabilities[cls] = (combinedProbabilities[cls] / totalProb) * 100;
    });

    return combinedProbabilities;
  }

  /**
   * Predict the most likely class with detailed information
   * @param {Array} features - Feature vector
   * @returns {Object} Detailed prediction
   */
  predictClass(features) {
    const combinedProbabilities = this.predict(features);
    
    // Get individual model predictions
    const nbPrediction = this.naiveBayes.predictClass(features);
    const knnPrediction = this.knn.predictClass(features);
    const dtPrediction = this.decisionTree.predictClass(features);

    // Find class with highest combined probability
    let maxProb = -Infinity;
    let predictedClass = null;

    Object.entries(combinedProbabilities).forEach(([cls, prob]) => {
      if (prob > maxProb) {
        maxProb = prob;
        predictedClass = cls;
      }
    });

    // Calculate consensus (how many models agree)
    const modelPredictions = [
      nbPrediction.class,
      knnPrediction.class,
      dtPrediction.class,
    ];
    const consensus = modelPredictions.filter(p => p === predictedClass).length;

    return {
      class: predictedClass,
      confidence: maxProb,
      probabilities: combinedProbabilities,
      consensus: (consensus / 3) * 100,
      individualPredictions: {
        naiveBayes: {
          class: nbPrediction.class,
          confidence: nbPrediction.confidence,
        },
        knn: {
          class: knnPrediction.class,
          confidence: knnPrediction.confidence,
        },
        decisionTree: {
          class: dtPrediction.class,
          confidence: dtPrediction.confidence,
        },
      },
    };
  }

  /**
   * Get top N predictions
   * @param {Array} features - Feature vector
   * @param {Number} topN - Number of top predictions to return
   * @returns {Array} Top predictions sorted by confidence
   */
  predictTopN(features, topN = 5) {
    const probabilities = this.predict(features);
    
    return Object.entries(probabilities)
      .map(([cls, prob]) => ({ class: cls, confidence: prob }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topN);
  }

  /**
   * Evaluate ensemble model
   * @param {Array} testData - Array of {features: [], label: string}
   * @returns {Object} Evaluation metrics
   */
  evaluate(testData) {
    let correct = 0;
    const predictions = [];
    const confusionMatrix = {};

    // Also evaluate individual models
    const nbEval = this.naiveBayes.evaluate(testData);
    const knnEval = this.knn.evaluate(testData);
    const dtEval = this.decisionTree.evaluate(testData);

    testData.forEach(data => {
      const prediction = this.predictClass(data.features);
      predictions.push({
        actual: data.label,
        predicted: prediction.class,
        confidence: prediction.confidence,
        consensus: prediction.consensus,
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
      individualAccuracies: {
        naiveBayes: nbEval.accuracy,
        knn: knnEval.accuracy,
        decisionTree: dtEval.accuracy,
      },
    };
  }

  /**
   * Optimize model weights using validation data
   * @param {Array} validationData - Validation dataset
   * @returns {Object} Optimized weights
   */
  optimizeWeights(validationData) {
    const weightCombinations = [];
    
    // Generate weight combinations (sum to 1)
    for (let nb = 0; nb <= 10; nb++) {
      for (let knn = 0; knn <= 10 - nb; knn++) {
        const dt = 10 - nb - knn;
        weightCombinations.push({
          naiveBayes: nb / 10,
          knn: knn / 10,
          decisionTree: dt / 10,
        });
      }
    }

    let bestAccuracy = 0;
    let bestWeights = this.weights;

    weightCombinations.forEach(weights => {
      this.weights = weights;
      const evaluation = this.evaluate(validationData);
      
      if (evaluation.accuracy > bestAccuracy) {
        bestAccuracy = evaluation.accuracy;
        bestWeights = { ...weights };
      }
    });

    this.weights = bestWeights;
    
    return {
      bestWeights,
      bestAccuracy,
    };
  }

  /**
   * Export ensemble model
   * @returns {Object} Model data
   */
  export() {
    return {
      naiveBayes: this.naiveBayes.export(),
      knn: this.knn.export(),
      weights: this.weights,
      trained: this.trained,
    };
  }

  /**
   * Import ensemble model
   * @param {Object} modelData - Saved model data
   */
  import(modelData) {
    this.naiveBayes.import(modelData.naiveBayes);
    this.knn.import(modelData.knn);
    this.weights = modelData.weights;
    this.trained = modelData.trained;
  }
}

export default EnsembleModel;
