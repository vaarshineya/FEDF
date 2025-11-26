# Healthcare Disease Prediction Backend

A comprehensive backend API for disease prediction based on symptoms with improved precision using medical knowledge base.

## Features

- **Advanced Disease Prediction Algorithm**: Uses weighted symptom matching, demographic factors, and prevalence data
- **User Authentication**: JWT-based authentication for patients and doctors
- **Medical Records Management**: Store and retrieve patient medical history
- **Comprehensive Symptom Database**: 25+ symptoms with categories and relationships
- **Disease Knowledge Base**: 10+ diseases with detailed information and symptom mappings
- **RESTful API**: Well-structured endpoints for all operations

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 10000)

3. Install and start MongoDB:
- Download from https://www.mongodb.com/try/download/community
- Start MongoDB service

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Symptoms
- `GET /api/symptoms` - Get all symptoms
- `GET /api/symptoms/categories` - Get symptom categories
- `GET /api/symptoms/suggestions?q=search` - Get symptom suggestions
- `POST /api/symptoms/analyze` - Analyze symptoms and predict diseases (Protected)
- `GET /api/symptoms/:id` - Get symptom by ID

### Diseases
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/categories` - Get disease categories
- `GET /api/diseases/:id` - Get disease by ID
- `POST /api/diseases` - Create disease (Doctor only)
- `PUT /api/diseases/:id` - Update disease (Doctor only)

### Medical Records
- `GET /api/medical-records` - Get medical records (Protected)
- `GET /api/medical-records/:id` - Get specific record (Protected)
- `POST /api/medical-records` - Create medical record (Protected)
- `PUT /api/medical-records/:id` - Update record (Doctor only)
- `DELETE /api/medical-records/:id` - Delete record (Protected)
- `GET /api/medical-records/patient/:patientId` - Get patient records (Doctor only)

## Disease Prediction Algorithm

The prediction algorithm uses multiple factors for improved precision:

1. **Weighted Symptom Matching**: Each symptom has a weight indicating its importance for a disease
2. **Common Symptom Analysis**: Penalties for missing common symptoms
3. **Demographic Factors**: Age and gender matching (±15% adjustment)
4. **Prevalence Weighting**: More common diseases get higher confidence
5. **Confidence Categorization**: High (≥75%), Medium (50-74%), Low (<50%)

## Sample Data

After seeding, you can use these credentials:

**Patient Account:**
- Email: patient@demo.com
- Password: password123

**Doctor Account:**
- Email: doctor@demo.com
- Password: password123

## Database Schema

### User
- Authentication and profile information
- Role-based (patient/doctor)
- Medical history for patients

### Symptom
- Name, category, severity
- Related symptoms
- Common names for search

### Disease
- Name, description, category
- Weighted symptom associations
- Urgency level and care instructions
- Prevalence and demographic data

### MedicalRecord
- Patient symptoms and predictions
- Diagnosis from doctors
- Status tracking

## Development

```bash
# Start development server
npm run dev

# Seed database
npm run seed
```

## Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use strong `JWT_SECRET`
3. Use MongoDB Atlas or production MongoDB instance
4. Enable HTTPS
5. Set up proper CORS origins

## API Response Format

Success:
```json
{
  "data": {},
  "message": "Success message"
}
```

Error:
```json
{
  "message": "Error message",
  "errors": []
}
```

## License

MIT
