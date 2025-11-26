# AI/ML Disease Prediction System

## Overview

This system implements advanced machine learning algorithms for accurate disease prediction based on symptoms and patient demographics. It uses an ensemble approach combining multiple algorithms for improved accuracy.

## Algorithms Implemented

### 1. **Naive Bayes Classifier**
- **Type**: Gaussian Naive Bayes
- **Approach**: Probabilistic classification based on Bayes' theorem
- **Strengths**:
  - Fast training and prediction
  - Works well with small datasets
  - Provides probability estimates
  - Handles continuous features well
- **Use Case**: Baseline predictions and when features are relatively independent

### 2. **K-Nearest Neighbors (KNN)**
- **Type**: Instance-based learning
- **Approach**: Classifies based on similarity to K nearest training examples
- **Strengths**:
  - No training phase required
  - Adapts to new data easily
  - Intuitive and interpretable
  - Supports multiple distance metrics
- **Distance Metrics**: Euclidean, Cosine, Jaccard, Manhattan
- **Use Case**: When similar symptom patterns indicate similar diseases

### 3. **Decision Tree Classifier**
- **Type**: ID3 algorithm with information gain
- **Approach**: Creates a tree of decisions based on feature splits
- **Strengths**:
  - Easy to interpret and visualize
  - Handles non-linear relationships
  - No feature scaling required
  - Captures complex patterns
- **Use Case**: Understanding decision rules and feature importance

### 4. **Ensemble Model**
- **Type**: Weighted voting ensemble
- **Approach**: Combines predictions from all three algorithms
- **Weights**: 
  - Naive Bayes: 35%
  - KNN: 35%
  - Decision Tree: 30%
- **Strengths**:
  - Higher accuracy than individual models
  - Reduces overfitting
  - More robust predictions
  - Provides consensus measure
- **Use Case**: Production deployment for highest accuracy

## Feature Engineering

### Feature Vector Composition
1. **Symptom Features** (Binary encoding)
   - 1 if symptom is present
   - 0 if symptom is absent
   
2. **Demographic Features**
   - Age (normalized 0-1)
   - Gender (one-hot encoded)

### Data Preprocessing
- Min-max normalization
- Feature scaling
- Train-test splitting
- Cross-validation support

## Hybrid Prediction System

The system uses a **hybrid approach** combining:
- **ML Predictions** (60% weight): Ensemble model predictions
- **Rule-Based Predictions** (40% weight): Traditional symptom matching with weighted scoring

This hybrid approach provides:
- Higher accuracy
- Better handling of edge cases
- Fallback mechanism if ML model is unavailable
- Interpretable results

## API Endpoints

### Training & Management

#### Train Model
```http
POST /api/ml/train
Authorization: Bearer <token>
Content-Type: application/json

{
  "trainRatio": 0.8,
  "k": 5,
  "distanceMetric": "euclidean",
  "maxDepth": 10,
  "minSamplesSplit": 2
}
```

#### Retrain Model
```http
POST /api/ml/retrain
Authorization: Bearer <token>
```

#### Get Model Info
```http
GET /api/ml/model-info
```

#### Get Algorithm Info
```http
GET /api/ml/algorithms
```

#### Get Model Statistics
```http
GET /api/ml/stats
Authorization: Bearer <token>
```

### Prediction

#### ML Prediction
```http
POST /api/ml/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "symptomIds": ["symptom_id_1", "symptom_id_2"],
  "age": 35,
  "gender": "male"
}
```

#### Hybrid Prediction (ML + Rule-based)
```http
POST /api/symptoms/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "symptomIds": ["symptom_id_1", "symptom_id_2"],
  "age": 35,
  "gender": "male"
}
```

## Training Data

The model is trained on:
1. **Disease Definitions**: Symptoms associated with each disease in the database
2. **Medical Records**: Confirmed diagnoses from patient records
3. **Synthetic Variations**: Multiple symptom combinations per disease

### Data Augmentation
- Full symptom sets
- Partial symptom sets (80%, 60%)
- Different demographic variations
- Age group variations

## Model Persistence

Models are saved to: `ml/models/trained_model.json`

Saved data includes:
- Trained model parameters
- All symptom definitions
- Disease mappings
- Training timestamp

## Performance Metrics

The system provides:
- **Overall Accuracy**: Percentage of correct predictions
- **Individual Model Accuracies**: Performance of each algorithm
- **Confusion Matrix**: Detailed prediction breakdown
- **Consensus Score**: Agreement between models (0-100%)
- **Confidence Scores**: Prediction confidence for each disease

## Usage Example

### 1. Train the Model (First Time Setup)
```javascript
// As a doctor/admin user
POST /api/ml/train
{
  "trainRatio": 0.8,
  "k": 5
}
```

### 2. Make Predictions
```javascript
// As any authenticated user
POST /api/symptoms/analyze
{
  "symptomIds": ["fever_id", "cough_id", "fatigue_id"],
  "age": 35,
  "gender": "male"
}
```

### 3. Response Format
```json
{
  "predictions": [
    {
      "name": "Common Cold",
      "confidence": 85.5,
      "confidenceLevel": "High",
      "mlConfidence": 88.2,
      "ruleConfidence": 81.3,
      "consensus": 100,
      "predictionMethod": "hybrid",
      "matchedSymptoms": 3,
      "totalSymptoms": 5,
      "urgency": "low",
      "treatment": "Rest and fluids",
      "whenToSeekCare": "If symptoms persist beyond 7 days"
    }
  ]
}
```

## Model Optimization

### Hyperparameter Tuning
- **K (KNN)**: Number of neighbors (default: 5)
- **Distance Metric**: euclidean, cosine, jaccard, manhattan
- **Max Depth (Decision Tree)**: Maximum tree depth (default: 10)
- **Min Samples Split**: Minimum samples to split a node (default: 2)

### Weight Optimization
The ensemble weights can be optimized using validation data:
```javascript
const results = await model.optimizeWeights(validationData);
```

## Advantages Over Traditional Methods

1. **Learning from Data**: Adapts to patterns in historical data
2. **Multiple Perspectives**: Combines different algorithmic approaches
3. **Probability Estimates**: Provides confidence scores
4. **Scalability**: Improves with more training data
5. **Consensus Validation**: Multiple models must agree
6. **Hybrid Approach**: Combines ML with medical knowledge

## Future Enhancements

- [ ] Deep learning models (Neural Networks)
- [ ] Natural Language Processing for symptom descriptions
- [ ] Time-series analysis for symptom progression
- [ ] Integration with medical imaging
- [ ] Real-time model updates
- [ ] A/B testing framework
- [ ] Model versioning and rollback
- [ ] Explainable AI (SHAP values)

## Technical Details

### Complexity Analysis
- **Naive Bayes**: O(n × d) - Linear in samples and features
- **KNN**: O(n × d × k) - Depends on dataset size
- **Decision Tree**: O(n × d × log(n)) - Logarithmic in samples

### Memory Requirements
- **Naive Bayes**: Low (stores statistics only)
- **KNN**: High (stores all training data)
- **Decision Tree**: Medium (stores tree structure)

## Best Practices

1. **Regular Retraining**: Retrain model monthly with new data
2. **Data Quality**: Ensure accurate symptom-disease mappings
3. **Validation**: Use separate test set for evaluation
4. **Monitoring**: Track prediction accuracy over time
5. **Fallback**: Always have rule-based system as backup
6. **User Feedback**: Collect feedback on predictions for improvement

## Troubleshooting

### Model Not Found
- Train the model using `/api/ml/train` endpoint
- Check if `ml/models/trained_model.json` exists

### Low Accuracy
- Increase training data
- Adjust hyperparameters
- Retrain with latest data
- Check data quality

### Slow Predictions
- Reduce K value in KNN
- Limit decision tree depth
- Use faster distance metrics

## References

- Naive Bayes: Probabilistic classification
- KNN: Instance-based learning
- Decision Trees: ID3 algorithm
- Ensemble Methods: Weighted voting
