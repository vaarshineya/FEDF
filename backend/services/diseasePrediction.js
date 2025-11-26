import Disease from '../models/Disease.js';
import Symptom from '../models/Symptom.js';
import MLTrainingService from '../ml/services/MLTrainingService.js';

/**
 * Advanced disease prediction algorithm with improved precision
 * Uses ML algorithms combined with rule-based matching
 */
class DiseasePredictionService {
  /**
   * Predict diseases based on symptoms and patient demographics
   * @param {Array} symptomIds - Array of symptom IDs
   * @param {Object} demographics - Patient demographics (age, gender)
   * @returns {Array} Sorted array of disease predictions with confidence scores
   */
  async predictDiseases(symptomIds, demographics = {}, useML = true) {
    if (!symptomIds || symptomIds.length === 0) {
      throw new Error('At least one symptom is required for prediction');
    }

    let mlPredictions = null;
    let rulePredictions = [];

    // Try ML prediction first
    if (useML) {
      try {
        mlPredictions = await MLTrainingService.predict(symptomIds, demographics);
      } catch (error) {
        console.log('ML prediction not available, using rule-based approach:', error.message);
      }
    }

    // Fetch all diseases with their symptoms for rule-based prediction
    const diseases = await Disease.find({})
      .populate('symptoms.symptomId')
      .lean();

    // Calculate scores for each disease using rule-based approach
    for (const disease of diseases) {
      const score = this.calculateDiseaseScore(
        disease,
        symptomIds,
        demographics
      );

      if (score.matchScore > 0) {
        rulePredictions.push({
          diseaseId: disease._id,
          name: disease.name,
          description: disease.description,
          category: disease.category,
          confidence: score.confidence,
          matchScore: score.matchScore,
          matchedSymptoms: score.matchedSymptoms,
          totalSymptoms: disease.symptoms.length,
          urgency: disease.urgency,
          whenToSeekCare: disease.whenToSeekCare,
          treatment: disease.treatment,
          prevention: disease.prevention,
          prevalence: disease.prevalence,
        });
      }
    }

    // Sort rule-based predictions by confidence
    rulePredictions.sort((a, b) => b.confidence - a.confidence);

    // Combine ML and rule-based predictions if ML is available
    let finalPredictions = rulePredictions;
    
    if (mlPredictions) {
      finalPredictions = this.combineMLAndRulePredictions(
        mlPredictions,
        rulePredictions,
        diseases
      );
    }

    // Categorize confidence levels
    return finalPredictions.map(pred => ({
      ...pred,
      confidenceLevel: this.getConfidenceLevel(pred.confidence),
      predictionMethod: mlPredictions ? 'hybrid' : 'rule-based',
    }));
  }

  /**
   * Combine ML and rule-based predictions using weighted ensemble
   */
  combineMLAndRulePredictions(mlPredictions, rulePredictions, diseases) {
    const combined = {};
    const mlWeight = 0.6; // ML predictions have 60% weight
    const ruleWeight = 0.4; // Rule-based has 40% weight

    // Add ML predictions
    mlPredictions.allPredictions.forEach(mlPred => {
      const disease = diseases.find(d => d.name === mlPred.disease);
      if (disease) {
        combined[disease.name] = {
          diseaseId: disease._id,
          name: disease.name,
          description: disease.description,
          category: disease.category,
          confidence: mlPred.confidence * mlWeight,
          urgency: disease.urgency,
          whenToSeekCare: disease.whenToSeekCare,
          treatment: disease.treatment,
          prevention: disease.prevention,
          prevalence: disease.prevalence,
          mlConfidence: mlPred.confidence,
          ruleConfidence: 0,
          consensus: mlPredictions.primaryPrediction.consensus || 0,
        };
      }
    });

    // Add or merge rule-based predictions
    rulePredictions.forEach(rulePred => {
      if (combined[rulePred.name]) {
        // Merge: add weighted rule-based confidence
        combined[rulePred.name].confidence += rulePred.confidence * ruleWeight;
        combined[rulePred.name].ruleConfidence = rulePred.confidence;
        combined[rulePred.name].matchedSymptoms = rulePred.matchedSymptoms;
        combined[rulePred.name].totalSymptoms = rulePred.totalSymptoms;
      } else {
        // Add new prediction with only rule-based confidence
        combined[rulePred.name] = {
          ...rulePred,
          confidence: rulePred.confidence * ruleWeight,
          mlConfidence: 0,
          ruleConfidence: rulePred.confidence,
          consensus: 0,
        };
      }
    });

    // Convert to array and sort by combined confidence
    return Object.values(combined).sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Calculate disease score based on symptom matching and demographics
   */
  calculateDiseaseScore(disease, patientSymptomIds, demographics) {
    let matchScore = 0;
    let totalWeight = 0;
    let matchedSymptoms = 0;

    // Convert patient symptom IDs to strings for comparison
    const patientSymptomIdStrings = patientSymptomIds.map(id => id.toString());

    // Calculate weighted symptom match
    for (const diseaseSymptom of disease.symptoms) {
      const symptomIdString = diseaseSymptom.symptomId._id.toString();
      totalWeight += diseaseSymptom.weight;

      if (patientSymptomIdStrings.includes(symptomIdString)) {
        matchScore += diseaseSymptom.weight;
        matchedSymptoms++;
      }
    }

    // Base confidence from symptom matching
    let confidence = totalWeight > 0 ? (matchScore / totalWeight) * 100 : 0;

    // Apply demographic adjustments
    confidence = this.applyDemographicFactors(
      confidence,
      disease,
      demographics
    );

    // Apply prevalence factor
    confidence = this.applyPrevalenceFactor(confidence, disease.prevalence);

    // Penalty for missing common symptoms
    confidence = this.applyCommonSymptomPenalty(
      confidence,
      disease,
      patientSymptomIdStrings
    );

    // Ensure confidence is between 0 and 100
    confidence = Math.max(0, Math.min(100, confidence));

    return {
      matchScore,
      confidence: Math.round(confidence * 100) / 100,
      matchedSymptoms,
    };
  }

  /**
   * Apply demographic factors (age, gender) to confidence score
   */
  applyDemographicFactors(confidence, disease, demographics) {
    let adjustedConfidence = confidence;

    // Age group matching
    if (demographics.age && disease.ageGroup && disease.ageGroup.length > 0) {
      const ageGroup = this.getAgeGroup(demographics.age);
      if (disease.ageGroup.includes(ageGroup)) {
        adjustedConfidence *= 1.15; // 15% boost for age match
      } else {
        adjustedConfidence *= 0.85; // 15% penalty for age mismatch
      }
    }

    // Gender matching
    if (demographics.gender && disease.affectedGender !== 'both') {
      if (disease.affectedGender === demographics.gender) {
        adjustedConfidence *= 1.1; // 10% boost for gender match
      } else {
        adjustedConfidence *= 0.7; // 30% penalty for gender mismatch
      }
    }

    return adjustedConfidence;
  }

  /**
   * Apply prevalence factor to confidence score
   */
  applyPrevalenceFactor(confidence, prevalence) {
    const prevalenceMultipliers = {
      very_common: 1.2,
      common: 1.1,
      uncommon: 1.0,
      rare: 0.85,
      very_rare: 0.7,
    };

    return confidence * (prevalenceMultipliers[prevalence] || 1.0);
  }

  /**
   * Apply penalty for missing common symptoms
   */
  applyCommonSymptomPenalty(confidence, disease, patientSymptomIds) {
    const commonSymptoms = disease.symptoms.filter(s => s.isCommon);
    const matchedCommonSymptoms = commonSymptoms.filter(s =>
      patientSymptomIds.includes(s.symptomId._id.toString())
    );

    if (commonSymptoms.length > 0) {
      const commonSymptomMatchRate =
        matchedCommonSymptoms.length / commonSymptoms.length;

      // If less than 50% of common symptoms are matched, apply penalty
      if (commonSymptomMatchRate < 0.5) {
        confidence *= 0.7;
      }
    }

    return confidence;
  }

  /**
   * Determine age group from age
   */
  getAgeGroup(age) {
    if (age < 2) return 'infant';
    if (age < 13) return 'child';
    if (age < 20) return 'adolescent';
    if (age < 65) return 'adult';
    return 'elderly';
  }

  /**
   * Categorize confidence level
   */
  getConfidenceLevel(confidence) {
    if (confidence >= 75) return 'High';
    if (confidence >= 50) return 'Medium';
    return 'Low';
  }

  /**
   * Get symptom suggestions based on partial input
   */
  async getSymptomSuggestions(searchTerm, limit = 10) {
    const symptoms = await Symptom.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { commonNames: { $regex: searchTerm, $options: 'i' } },
      ],
    })
      .limit(limit)
      .lean();

    return symptoms;
  }

  /**
   * Get related symptoms for better diagnosis
   */
  async getRelatedSymptoms(symptomIds) {
    const symptoms = await Symptom.find({
      _id: { $in: symptomIds },
    })
      .populate('relatedSymptoms')
      .lean();

    const relatedSymptomIds = new Set();
    symptoms.forEach(symptom => {
      if (symptom.relatedSymptoms) {
        symptom.relatedSymptoms.forEach(related => {
          relatedSymptomIds.add(related._id.toString());
        });
      }
    });

    // Remove already selected symptoms
    symptomIds.forEach(id => relatedSymptomIds.delete(id.toString()));

    return Array.from(relatedSymptomIds);
  }
}

export default new DiseasePredictionService();
