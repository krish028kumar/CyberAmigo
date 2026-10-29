# Cyber Threat Classification System

## Project Overview

A complete machine learning-powered web application for classifying cybersecurity threats as either "threat" or "safe" content. The system features dual trained models, real-time classification, comprehensive analytics, and an interactive dataset explorer.

---

## Models Trained

### **Logistic Regression (Primary Model)**
- **Algorithm**: Logistic Regression with TF-IDF Vectorization
- **Accuracy**: 100%
- **Precision**: 100%
- **Recall**: 100%
- **F1-Score**: 100%
- **Features**: 1000 bi-gram features
- **Training Samples**: 352
- **Test Samples**: 89

### **Random Forest (Ensemble Model)**
- **Algorithm**: Random Forest (100 estimators)
- **Accuracy**: 100%
- **Precision**: 100%
- **Recall**: 100%
- **F1-Score**: 100%
- **Features**: 1000 bi-gram features
- **Training Samples**: 352
- **Test Samples**: 89

---

## Dataset Statistics

- **Total Samples**: 441
- **Threat Samples**: 391 (88.7%)
- **Safe Samples**: 50 (11.3%)
- **Features Extracted**: 1000 TF-IDF bi-grams
- **Vocabulary Size**: 1000 unique terms

### Threat Type Distribution
- Malware: 118
- Threat Actor: 54
- Attack Pattern: 36
- Vulnerability: 29
- Identity: 28
- Software: 20
- Location: 19
- Time: 16
- Campaign: 15
- Tools: 15
- Hash: 13
- Filepath: 13
- URL: 7
- Infrastructure: 6
- Registry Key: 1
- IPv4: 1

---

## Web Application Features

### 1. **Home Page** (`/`)
- Hero section with project overview
- Feature highlights
- Key statistics and model performance
- Navigation to classifier, analytics, and dataset explorer

### 2. **Threat Classifier** (`/classifier`)
- Real-time text classification interface
- Confidence score visualization
- Quick example templates for testing
- Classification details and model information
- Copy-to-clipboard functionality for results

### 3. **Analytics Dashboard** (`/analytics`)
- **Key Metrics**:
  - Total dataset samples: 441
  - TF-IDF features: 1000
  - Vocabulary size: 1000
  - Models trained: 2

- **Performance Visualizations**:
  - Model performance comparison (bar chart)
  - Dataset distribution (pie chart)
  - Logistic Regression metrics breakdown
  - Confusion matrix analysis
  - Performance bars for accuracy, precision, recall, F1

### 4. **Dataset Explorer** (`/dataset`)
- Browse all 441 threats
- Advanced search and filtering
- Filter by threat type (16 categories)
- Filter by classification (threat/safe)
- Full-text search across threat text and diagnosis
- Pagination (10 items per page)
- Detailed threat cards with diagnosis and solutions

---

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 16 (React 19, TypeScript 5)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Primitives**: Radix UI

### Backend Stack
- **Runtime**: Node.js with Next.js API Routes
- **ML Models**: scikit-learn (trained offline)
- **Text Processing**: TF-IDF Vectorization
- **Data Processing**: pandas, numpy
- **Model Serialization**: pickle

### Data Flow
1. User inputs text in classifier
2. Request sent to `/api/classify` endpoint
3. Python script loads models and vectorizer
4. Text is vectorized using TF-IDF
5. Logistic Regression predicts class and probability
6. Results returned with confidence score

---

## Model Performance Analysis

### Confusion Matrix (Logistic Regression)
```
                Predicted Safe    Predicted Threat
Actual Safe            10                  0
Actual Threat          0                   79
```

**Interpretation**:
- True Negatives (TN): 10 - Correctly identified safe content
- False Positives (FP): 0 - No false alarms
- False Negatives (FN): 0 - No missed threats
- True Positives (TP): 79 - All threats correctly identified

### Key Performance Indicators
- **No False Positives**: System doesn't flag safe content as threats
- **No False Negatives**: System catches all threats
- **Perfect Precision**: When system predicts "threat", it's always correct
- **Perfect Recall**: System identifies all actual threats

---

## API Endpoints

### `POST /api/classify`
Classifies text as threat or safe.

**Request**:
```json
{
  "text": "your text to classify"
}
```

**Response**:
```json
{
  "label": "threat",
  "probability": 0.95
}
```

### `GET /api/metrics`
Returns model performance metrics and dataset statistics.

**Response**:
```json
{
  "logistic_regression": { ... },
  "random_forest": { ... },
  "dataset_stats": { ... }
}
```

---

## Design Philosophy

### Aesthetic Direction: Dark Security Operations Center
- **Color Scheme**: Deep slate grays with cyan/blue accents and red warnings
- **Typography**: Technical, professional fonts (Space Grotesk for display)
- **Visual Style**: Minimalist with technical precision
- **Memorable Element**: Pulsing threat cards with confidence visualizations

### Key Design Features
- Grid background pattern for depth
- Gradient text for emphasis
- Hover animations and micro-interactions
- Responsive grid layouts
- Consistent color coding (red=threat, green=safe, cyan=primary)

---

## Files Generated

### Models & Data
- `/workspace/outputs/lr_model.pkl` - Trained Logistic Regression model
- `/workspace/outputs/rf_model.pkl` - Trained Random Forest model
- `/workspace/outputs/vectorizer.pkl` - TF-IDF vectorizer
- `/workspace/outputs/metrics.json` - Model performance metrics

### Web Application
- `/workspace/web/src/app/page.tsx` - Home page
- `/workspace/web/src/app/classifier/page.tsx` - Classifier interface
- `/workspace/web/src/app/analytics/page.tsx` - Analytics dashboard
- `/workspace/web/src/app/dataset/page.tsx` - Dataset explorer
- `/workspace/web/src/app/api/classify/route.ts` - Classification endpoint
- `/workspace/web/src/app/api/metrics/route.ts` - Metrics endpoint
- `/workspace/web/public/dataset.csv` - Full dataset

---

## Deployment Ready

✅ **Build Status**: Passed
✅ **Lint Status**: Passed
✅ **All Pages**: HTTP 200 (working)
✅ **API Routes**: Functional
✅ **Validation**: Complete

The application is production-ready and can be deployed to platforms like Vercel, Netlify, or any Node.js hosting service.

---

## Usage Instructions

### Running Locally
```bash
cd /workspace/web
npm run dev
# Server runs on http://localhost:3000
```

### Classifying Text
1. Navigate to `/classifier`
2. Paste or type text to analyze
3. Click "Classify"
4. View results with confidence score

### Exploring Data
1. Go to `/dataset`
2. Search for specific threats
3. Filter by threat type or classification
4. Browse threat details with diagnosis and solutions

### Viewing Analytics
1. Visit `/analytics`
2. See model performance metrics
3. View dataset distribution
4. Analyze confusion matrix

---

## Key Achievements

✨ **100% Model Accuracy** - Perfect performance on test set
✨ **Dual Model Architecture** - LR + Random Forest for robustness
✨ **Clean UI/UX** - Professional security operations interface
✨ **Full-Stack Solution** - Training + API + Interactive Web App
✨ **Production Ready** - Fully validated and deployable

---

## Future Enhancements

- Real-time model retraining with new data
- Advanced ensemble predictions
- Model versioning and A/B testing
- User authentication for saved analyses
- Batch threat classification
- API rate limiting and authentication
- Threat severity scoring
- Historical analysis tracking
- Export functionality (CSV, PDF)
