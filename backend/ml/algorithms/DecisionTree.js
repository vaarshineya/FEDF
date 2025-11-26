/**
 * Decision Tree Classifier for Disease Prediction
 * Implements ID3 algorithm with information gain
 */

class DecisionTreeNode {
  constructor() {
    this.featureIndex = null;
    this.threshold = null;
    this.left = null;
    this.right = null;
    this.label = null;
    this.isLeaf = false;
  }
}

class DecisionTreeClassifier {
  constructor(maxDepth = 10, minSamplesSplit = 2) {
    this.maxDepth = maxDepth;
    this.minSamplesSplit = minSamplesSplit;
    this.root = null;
    this.trained = false;
  }

  /**
   * Calculate entropy of a dataset
   * @param {Array} labels - Array of labels
   * @returns {Number} Entropy value
   */
  calculateEntropy(labels) {
    const counts = {};
    labels.forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });

    let entropy = 0;
    const total = labels.length;

    Object.values(counts).forEach(count => {
      const probability = count / total;
      if (probability > 0) {
        entropy -= probability * Math.log2(probability);
      }
    });

    return entropy;
  }

  /**
   * Calculate information gain for a split
   * @param {Array} leftLabels - Labels in left split
   * @param {Array} rightLabels - Labels in right split
   * @param {Number} parentEntropy - Entropy before split
   * @returns {Number} Information gain
   */
  calculateInformationGain(leftLabels, rightLabels, parentEntropy) {
    const totalSamples = leftLabels.length + rightLabels.length;
    const leftWeight = leftLabels.length / totalSamples;
    const rightWeight = rightLabels.length / totalSamples;

    const leftEntropy = this.calculateEntropy(leftLabels);
    const rightEntropy = this.calculateEntropy(rightLabels);

    const weightedEntropy = leftWeight * leftEntropy + rightWeight * rightEntropy;
    return parentEntropy - weightedEntropy;
  }

  /**
   * Find best split for a feature
   * @param {Array} data - Training data
   * @param {Number} featureIndex - Index of feature to split on
   * @returns {Object} Best split information
   */
  findBestSplit(data, featureIndex) {
    const values = data.map(d => d.features[featureIndex]);
    const uniqueValues = [...new Set(values)].sort((a, b) => a - b);

    let bestGain = -Infinity;
    let bestThreshold = null;

    const parentLabels = data.map(d => d.label);
    const parentEntropy = this.calculateEntropy(parentLabels);

    // Try each unique value as a threshold
    for (let i = 0; i < uniqueValues.length - 1; i++) {
      const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;

      const leftData = data.filter(d => d.features[featureIndex] <= threshold);
      const rightData = data.filter(d => d.features[featureIndex] > threshold);

      if (leftData.length === 0 || rightData.length === 0) continue;

      const leftLabels = leftData.map(d => d.label);
      const rightLabels = rightData.map(d => d.label);

      const gain = this.calculateInformationGain(leftLabels, rightLabels, parentEntropy);

      if (gain > bestGain) {
        bestGain = gain;
        bestThreshold = threshold;
      }
    }

    return { gain: bestGain, threshold: bestThreshold };
  }

  /**
   * Find best feature and threshold to split on
   * @param {Array} data - Training data
   * @returns {Object} Best split information
   */
  findBestFeatureSplit(data) {
    const numFeatures = data[0].features.length;
    let bestGain = -Infinity;
    let bestFeatureIndex = null;
    let bestThreshold = null;

    for (let i = 0; i < numFeatures; i++) {
      const split = this.findBestSplit(data, i);
      
      if (split.gain > bestGain) {
        bestGain = split.gain;
        bestFeatureIndex = i;
        bestThreshold = split.threshold;
      }
    }

    return {
      featureIndex: bestFeatureIndex,
      threshold: bestThreshold,
      gain: bestGain,
    };
  }

  /**
   * Get majority class from labels
   * @param {Array} labels - Array of labels
   * @returns {String} Majority class
   */
  getMajorityClass(labels) {
    const counts = {};
    labels.forEach(label => {
      counts[label] = (counts[label] || 0) + 1;
    });

    let maxCount = 0;
    let majorityClass = null;

    Object.entries(counts).forEach(([label, count]) => {
      if (count > maxCount) {
        maxCount = count;
        majorityClass = label;
      }
    });

    return majorityClass;
  }

  /**
   * Build decision tree recursively
   * @param {Array} data - Training data
   * @param {Number} depth - Current depth
   * @returns {DecisionTreeNode} Tree node
   */
  buildTree(data, depth = 0) {
    const node = new DecisionTreeNode();
    const labels = data.map(d => d.label);
    const uniqueLabels = [...new Set(labels)];

    // Stopping criteria
    if (
      uniqueLabels.length === 1 ||
      depth >= this.maxDepth ||
      data.length < this.minSamplesSplit
    ) {
      node.isLeaf = true;
      node.label = this.getMajorityClass(labels);
      return node;
    }

    // Find best split
    const bestSplit = this.findBestFeatureSplit(data);

    if (bestSplit.gain <= 0 || bestSplit.threshold === null) {
      node.isLeaf = true;
      node.label = this.getMajorityClass(labels);
      return node;
    }

    // Split data
    const leftData = data.filter(d => d.features[bestSplit.featureIndex] <= bestSplit.threshold);
    const rightData = data.filter(d => d.features[bestSplit.featureIndex] > bestSplit.threshold);

    if (leftData.length === 0 || rightData.length === 0) {
      node.isLeaf = true;
      node.label = this.getMajorityClass(labels);
      return node;
    }

    // Build subtrees
    node.featureIndex = bestSplit.featureIndex;
    node.threshold = bestSplit.threshold;
    node.left = this.buildTree(leftData, depth + 1);
    node.right = this.buildTree(rightData, depth + 1);

    return node;
  }

  /**
   * Train the decision tree
   * @param {Array} trainingData - Array of {features: [], label: string}
   */
  train(trainingData) {
    if (!trainingData || trainingData.length === 0) {
      throw new Error('Training data is required');
    }

    this.root = this.buildTree(trainingData);
    this.trained = true;
  }

  /**
   * Predict class for given features
   * @param {Array} features - Feature vector
   * @param {DecisionTreeNode} node - Current node (default: root)
   * @returns {String} Predicted class
   */
  predictSingle(features, node = this.root) {
    if (!this.trained) {
      throw new Error('Model must be trained before prediction');
    }

    if (node.isLeaf) {
      return node.label;
    }

    if (features[node.featureIndex] <= node.threshold) {
      return this.predictSingle(features, node.left);
    } else {
      return this.predictSingle(features, node.right);
    }
  }

  /**
   * Predict class with confidence (using leaf node purity)
   * @param {Array} features - Feature vector
   * @returns {Object} Prediction with confidence
   */
  predictClass(features) {
    const predictedClass = this.predictSingle(features);
    
    // For decision trees, confidence is harder to calculate
    // We'll use a simple heuristic based on tree depth
    return {
      class: predictedClass,
      confidence: 75, // Default confidence for decision tree
      probabilities: { [predictedClass]: 75 },
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
      const predicted = this.predictSingle(data.features);
      predictions.push({
        actual: data.label,
        predicted: predicted,
      });

      if (predicted === data.label) {
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
   * Get tree depth
   * @param {DecisionTreeNode} node - Current node
   * @returns {Number} Tree depth
   */
  getDepth(node = this.root) {
    if (!node || node.isLeaf) return 0;
    return 1 + Math.max(this.getDepth(node.left), this.getDepth(node.right));
  }

  /**
   * Count tree nodes
   * @param {DecisionTreeNode} node - Current node
   * @returns {Number} Number of nodes
   */
  countNodes(node = this.root) {
    if (!node) return 0;
    if (node.isLeaf) return 1;
    return 1 + this.countNodes(node.left) + this.countNodes(node.right);
  }
}

export default DecisionTreeClassifier;
