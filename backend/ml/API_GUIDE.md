# AI/ML Disease Prediction API Guide

## Quick Start

### Step 1: Train the Model (One-time setup)

First, you need to train the ML model with your disease and symptom data. This requires doctor/admin privileges.

```bash
POST http://localhost:10000/api/ml/train
Authorization: Bearer YOUR_DOCTOR_TOKEN
Content-Type: application/json

{
  "trainRatio": 0.8,
  "k": 5,
  "distanceMetric": "euclidean",
  "maxDepth": 10,
  "minSamplesSplit": 2
}
```

**Response:**
```json
{
  "message": "Model trained successfully",
  "results": {
    "accuracy": 87.5,
    "individualAccuracies": {
      "naiveBayes": 84.2,
      "knn": 86.8,
      "decisionTree": 83.1
    },
    "trainingSize": 240,
    "testSize": 60
  }
}
```

### Step 2: Check Model Status

```bash
GET http://localhost:10000/api/ml/model-info
```

**Response:**
```json
{
  "exists": true,
  "timestamp": "2025-11-05T03:04:00.000Z",
  "numSymptoms": 50,
  "numDiseases": 30,
  "weights": {
    "naiveBayes": 0.35,
    "knn": 0.35,
    "decisionTree": 0.30
  }
}
```

### Step 3: Make Predictions

#### Option A: Hybrid Prediction (Recommended)
Uses both ML and rule-based approaches for best accuracy.

```bash
POST http://localhost:10000/api/symptoms/analyze
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "symptomIds": [
    "673a1234567890abcdef0001",
    "673a1234567890abcdef0002",
    "673a1234567890abcdef0003"
  ],
  "age": 35,
  "gender": "male"
}
```

**Response:**
```json
{
  "predictions": [
    {
      "diseaseId": "673a9876543210fedcba0001",
      "name": "Common Cold",
      "description": "Viral infection of the upper respiratory tract",
      "category": "infectious",
      "confidence": 85.5,
      "confidenceLevel": "High",
      "mlConfidence": 88.2,
      "ruleConfidence": 81.3,
      "consensus": 100,
      "predictionMethod": "hybrid",
      "matchedSymptoms": 3,
      "totalSymptoms": 5,
      "urgency": "low",
      "whenToSeekCare": "If symptoms persist beyond 7 days",
      "treatment": "Rest, fluids, and over-the-counter medications",
      "prevention": "Wash hands frequently, avoid close contact with sick people"
    },
    {
      "name": "Influenza",
      "confidence": 72.3,
      "confidenceLevel": "Medium",
      "mlConfidence": 75.1,
      "ruleConfidence": 68.2,
      "consensus": 66.7,
      "predictionMethod": "hybrid"
    }
  ],
  "recordId": "673a5555666677778888999a",
  "message": "Analysis completed successfully"
}
```

#### Option B: Pure ML Prediction
Uses only the ML ensemble model.

```bash
POST http://localhost:10000/api/ml/predict
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "symptomIds": [
    "673a1234567890abcdef0001",
    "673a1234567890abcdef0002"
  ],
  "age": 35,
  "gender": "male"
}
```

**Response:**
```json
{
  "predictions": {
    "primaryPrediction": {
      "disease": "Common Cold",
      "confidence": 88.2,
      "consensus": 100
    },
    "allPredictions": [
      {
        "disease": "Common Cold",
        "confidence": 88.2
      },
      {
        "disease": "Influenza",
        "confidence": 75.1
      },
      {
        "disease": "Bronchitis",
        "confidence": 45.3
      }
    ],
    "individualModels": {
      "naiveBayes": {
        "class": "Common Cold",
        "confidence": 89.5
      },
      "knn": {
        "class": "Common Cold",
        "confidence": 91.2
      },
      "decisionTree": {
        "class": "Common Cold",
        "confidence": 84.0
      }
    },
    "algorithm": "ensemble"
  },
  "message": "ML prediction completed successfully"
}
```

## Complete API Reference

### 1. Get Available Algorithms

```bash
GET http://localhost:10000/api/ml/algorithms
```

Returns information about all available ML algorithms, their strengths, and use cases.

### 2. Get Model Statistics

```bash
GET http://localhost:10000/api/ml/stats
Authorization: Bearer YOUR_DOCTOR_TOKEN
```

Returns detailed statistics about the trained model including complexity and memory usage.

### 3. Retrain Model

```bash
POST http://localhost:10000/api/ml/retrain
Authorization: Bearer YOUR_DOCTOR_TOKEN
Content-Type: application/json

{
  "trainRatio": 0.8,
  "k": 7,
  "distanceMetric": "cosine"
}
```

Retrains the model with the latest data from the database.

## Configuration Parameters

### Training Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trainRatio` | Number | 0.8 | Ratio of data used for training (0-1) |
| `k` | Number | 5 | Number of neighbors for KNN |
| `distanceMetric` | String | "euclidean" | Distance metric for KNN |
| `maxDepth` | Number | 10 | Maximum depth of decision tree |
| `minSamplesSplit` | Number | 2 | Minimum samples to split a node |

### Distance Metrics

- **euclidean**: Standard Euclidean distance (default)
- **cosine**: Cosine similarity-based distance
- **jaccard**: Jaccard similarity for binary features
- **manhattan**: Manhattan (L1) distance

## Understanding the Response

### Confidence Levels

- **High**: 75-100% - Strong prediction, high reliability
- **Medium**: 50-74% - Moderate confidence, consider multiple possibilities
- **Low**: 0-49% - Weak prediction, needs more information

### Consensus Score

Indicates agreement between the three ML models:
- **100%**: All three models agree
- **66.7%**: Two models agree
- **33.3%**: All models disagree

Higher consensus = more reliable prediction

### Prediction Methods

- **hybrid**: Combines ML (60%) and rule-based (40%) predictions
- **ml-only**: Pure ML ensemble prediction
- **rule-based**: Traditional symptom matching (fallback)

## Common Use Cases

### Use Case 1: Initial Diagnosis

```javascript
// Patient reports fever, cough, and fatigue
const response = await fetch('http://localhost:10000/api/symptoms/analyze', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symptomIds: [feverSymptomId, coughSymptomId, fatigueSymptomId],
    age: 42,
    gender: 'female'
  })
});

const { predictions } = await response.json();
console.log(`Top prediction: ${predictions[0].name} (${predictions[0].confidence}%)`);
```

### Use Case 2: Comparing Algorithms

```javascript
// Get predictions from all individual models
const mlResponse = await fetch('http://localhost:10000/api/ml/predict', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symptomIds: symptomIds,
    age: 35,
    gender: 'male'
  })
});

const { predictions } = await mlResponse.json();
console.log('Naive Bayes:', predictions.individualModels.naiveBayes);
console.log('KNN:', predictions.individualModels.knn);
console.log('Decision Tree:', predictions.individualModels.decisionTree);
```

### Use Case 3: Model Monitoring

```javascript
// Check model performance regularly
const infoResponse = await fetch('http://localhost:10000/api/ml/model-info');
const info = await infoResponse.json();

if (!info.exists) {
  console.log('Model needs training!');
  // Trigger training
}

// Check if model is outdated (older than 30 days)
const modelAge = Date.now() - new Date(info.timestamp).getTime();
const thirtyDays = 30 * 24 * 60 * 60 * 1000;

if (modelAge > thirtyDays) {
  console.log('Model is outdated, consider retraining');
}
```

## Error Handling

### Common Errors

#### 1. Model Not Trained
```json
{
  "message": "Error making prediction",
  "error": "Model not trained. Please train the model first."
}
```
**Solution**: Train the model using `/api/ml/train`

#### 2. Missing Parameters
```json
{
  "message": "At least one symptom is required"
}
```
**Solution**: Provide at least one symptom ID

#### 3. Invalid Symptom IDs
```json
{
  "message": "Server error",
  "error": "Invalid symptom ID format"
}
```
**Solution**: Ensure symptom IDs are valid MongoDB ObjectIds

#### 4. Unauthorized
```json
{
  "message": "Not authorized to access this route"
}
```
**Solution**: Provide valid authentication token

## Performance Optimization

### Tips for Better Predictions

1. **Provide Complete Information**
   - Include all relevant symptoms
   - Provide accurate age and gender
   - More data = better predictions

2. **Use Hybrid Mode**
   - Combines ML and medical knowledge
   - More robust than pure ML
   - Better handles edge cases

3. **Regular Retraining**
   - Retrain monthly with new data
   - Improves accuracy over time
   - Adapts to new patterns

4. **Monitor Consensus**
   - High consensus = reliable prediction
   - Low consensus = needs more symptoms
   - Use as confidence indicator

## Integration Examples

### React/Frontend Integration

```javascript
import { useState } from 'react';

function DiseasePrediction() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const analyzeSymptons = async (symptomIds, age, gender) => {
    setLoading(true);
    try {
      const response = await fetch('/api/symptoms/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ symptomIds, age, gender })
      });
      
      const data = await response.json();
      setPredictions(data.predictions);
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Analyzing symptoms...</p>
      ) : (
        <div>
          {predictions.map(pred => (
            <div key={pred.diseaseId}>
              <h3>{pred.name}</h3>
              <p>Confidence: {pred.confidence}%</p>
              <p>Method: {pred.predictionMethod}</p>
              {pred.consensus && <p>Consensus: {pred.consensus}%</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Node.js Backend Integration

```javascript
import axios from 'axios';

class HealthcareService {
  constructor(apiUrl, token) {
    this.apiUrl = apiUrl;
    this.token = token;
  }

  async predictDisease(symptomIds, demographics) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/symptoms/analyze`,
        {
          symptomIds,
          age: demographics.age,
          gender: demographics.gender
        },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      return {
        success: true,
        predictions: response.data.predictions,
        topPrediction: response.data.predictions[0]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async trainModel(config = {}) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/ml/train`,
        config,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      return {
        success: true,
        results: response.data.results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default HealthcareService;
```

## Testing

### Manual Testing with cURL

```bash
# 1. Train model
curl -X POST http://localhost:10000/api/ml/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"trainRatio": 0.8, "k": 5}'

# 2. Check model info
curl http://localhost:10000/api/ml/model-info

# 3. Make prediction
curl -X POST http://localhost:10000/api/symptoms/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symptomIds": ["symptom_id_1", "symptom_id_2"],
    "age": 35,
    "gender": "male"
  }'
```

### Testing with Postman

1. Import the API collection
2. Set environment variables:
   - `baseUrl`: http://localhost:10000
   - `token`: Your authentication token
3. Run the collection tests

## Best Practices

1. ✅ **Always use hybrid prediction** for production
2. ✅ **Check model info** before making predictions
3. ✅ **Handle errors gracefully** with fallback logic
4. ✅ **Monitor consensus scores** for reliability
5. ✅ **Retrain regularly** with new data
6. ✅ **Validate input data** before sending
7. ✅ **Cache model info** to reduce API calls
8. ✅ **Log predictions** for quality monitoring

## Troubleshooting

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Low accuracy | Insufficient training data | Add more disease-symptom mappings |
| Slow predictions | Large dataset in KNN | Reduce K value or use different metric |
| Model not found | Never trained | Run `/api/ml/train` |
| Inconsistent results | Model needs retraining | Run `/api/ml/retrain` |
| High memory usage | KNN stores all data | Consider using only Naive Bayes + Decision Tree |

## Support

For issues or questions:
1. Check the ML README.md for technical details
2. Review the API documentation
3. Check server logs for errors
4. Verify database connectivity
5. Ensure sufficient training data exists
