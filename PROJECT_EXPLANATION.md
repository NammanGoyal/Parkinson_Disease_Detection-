# Parkinson Disease Detection Using Speech - Project Explanation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Problem Statement](#problem-statement)
3. [Technical Architecture](#technical-architecture)
4. [Machine Learning Approach](#machine-learning-approach)
5. [Implementation Details](#implementation-details)
6. [Technologies & Stack](#technologies--stack)
7. [Key Features](#key-features)
8. [Data Pipeline](#data-pipeline)
9. [Challenges & Solutions](#challenges--solutions)
10. [Scalability & Production Considerations](#scalability--production-considerations)
11. [Interview Talking Points](#interview-talking-points)

---

## 🎯 Project Overview

**Project Name:** Parkinson Disease Detection Using Speech Analysis

**Objective:** Build a machine learning system that analyzes voice patterns from audio recordings to assist in early detection of Parkinson's Disease.

**Key Innovation:** Uses dual-model ensemble approach combining traditional feature-based ML with deep learning vision transformer for improved accuracy.

---

## 🔍 Problem Statement

### Medical Context
- Parkinson's Disease affects motor functions, including speech
- Early detection is crucial for better treatment outcomes
- Traditional diagnosis requires clinical expertise and can be time-consuming
- Voice analysis provides a non-invasive, accessible screening tool

### Technical Challenge
- Extract meaningful features from audio signals
- Handle variability in audio quality, recording conditions, and user demographics
- Build a robust classification system with high accuracy
- Deploy a scalable web application accessible to users

---

## 🏗️ Technical Architecture

### System Architecture (3-Tier)

```
┌─────────────────────────────────────────┐
│         Frontend (Web Interface)         │
│  - HTML/CSS/JavaScript                   │
│  - Audio Recording (WebRTC)              │
│  - File Upload                           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Backend (Flask Web Server)         │
│  - REST API Endpoints                   │
│  - File Upload Handling                 │
│  - Audio Format Conversion               │
│  - Request Routing                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│    ML Pipeline (Ensemble Classifier)     │
│  - Feature Extraction (Praat)           │
│  - Random Forest Classifier              │
│  - Vision Transformer (ViT)               │
│  - Ensemble Voting                       │
└──────────────────────────────────────────┘
```

### Request Flow
1. User uploads audio file or records via browser
2. Flask receives file, validates format (WAV/WMA/MP3)
3. Audio preprocessing (format conversion if needed)
4. ML pipeline executes:
   - Feature extraction using Praat
   - Random Forest prediction
   - Spectrogram generation
   - Vision Transformer prediction (if available)
   - Ensemble voting
5. Results returned to user with confidence score

---

## 🤖 Machine Learning Approach

### Dual-Model Ensemble Strategy

The system uses **two complementary models** that vote on the final prediction:

#### 1. **Random Forest Classifier** (Feature-Based)
- **Input:** Acoustic features extracted using Praat
- **Features Extracted:**
  - **Jitter metrics:** Measure frequency variation (Jitter%, Jitter(Abs), RAP, PPQ5, DDP)
  - **Shimmer metrics:** Measure amplitude variation (Shimmer, Shimmer(dB), APQ3, APQ5, APQ11, DDA)
  - **HNR (Harmonic-to-Noise Ratio):** Measures voice quality
- **Model:** Random Forest with 100 estimators, max depth 10
- **Why Random Forest:**
  - Handles non-linear relationships
  - Robust to outliers
  - Provides feature importance
  - Fast inference time

#### 2. **Vision Transformer (ViT)** (Deep Learning)
- **Input:** Spectrogram images generated from audio
- **Architecture:** 
  - Pre-trained ViT-B/16 (ImageNet weights)
  - Transfer learning: Freeze backbone, train only classification head
  - Output: 2-class softmax (Healthy/Parkinson's)
- **Why ViT:**
  - Captures temporal-frequency patterns in spectrograms
  - Self-attention mechanism identifies important regions
  - Pre-trained weights provide good initialization

### Ensemble Logic

```python
if both models agree:
    return agreed label with averaged probability
else:
    return "healthy" (conservative approach) with averaged probability
```

**Rationale:** Conservative approach reduces false positives (critical in medical applications)

### Model Training

**Random Forest:**
- Trained on multiple datasets:
  - `parkinsons_timeseries.csv`
  - `healthy_and_unhealthy.csv`
  - `healthy.csv`
  - `unhealthy.csv`
- Combined dataset with feature normalization
- Train/test split: 80/20

**Vision Transformer:**
- Trained on spectrogram images
- Transfer learning from ImageNet
- Fine-tuned classification head only
- Batch size: 32, epochs: 10

---

## 💻 Implementation Details

### 1. Audio Processing Pipeline

**File Format Support:**
- WAV (native)
- WMA (converted to WAV)
- MP3 (converted to WAV using pydub)

**Feature Extraction (Praat):**
```python
# Key features extracted:
- Jitter: Measures frequency instability
- Shimmer: Measures amplitude instability  
- HNR: Harmonic-to-noise ratio (voice quality)
```

**Spectrogram Generation:**
- Converts audio to time-frequency representation
- Uses Praat's spectrogram analysis
- Saves as PNG image for ViT input
- Color mapping: 'afmhot' colormap, 70dB dynamic range

### 2. Backend Architecture (Flask)

**Key Routes:**
- `/` - Home page
- `/upload` - File upload handler
- `/execute_pipeline` - ML inference endpoint
- `/show_results` - Results display
- `/phone_call` - Twilio integration (optional)

**Cloud vs Local Deployment:**
- Detects environment (`IS_CLOUD` flag)
- Cloud: Uses Random Forest only (ViT too large)
- Local: Uses full ensemble (both models)

### 3. Frontend Features

- **Audio Recording:** WebRTC API with Recorder.js
- **File Upload:** Drag-and-drop or file picker
- **Real-time Feedback:** Loading states, progress indicators
- **Responsive Design:** Mobile-friendly interface

### 4. Error Handling

- File format validation
- Audio processing errors
- Model loading failures
- Graceful degradation (fallback to single model)

---

## 🛠️ Technologies & Stack

### Backend
- **Flask** - Web framework
- **Python 3.x** - Core language
- **Joblib** - Model serialization
- **Pydub** - Audio processing

### Machine Learning
- **scikit-learn** - Random Forest
- **PyTorch** - Deep learning framework
- **torchvision** - Vision Transformer
- **pandas** - Data manipulation
- **numpy** - Numerical computing

### Audio Processing
- **Parselmouth (Praat)** - Acoustic analysis
- **matplotlib** - Spectrogram visualization

### Frontend
- **HTML5/CSS3** - Structure and styling
- **JavaScript** - Interactivity
- **Recorder.js** - Browser audio recording

### Deployment
- **Gunicorn** - WSGI server
- **Twilio** - Phone integration (optional)

---

## ✨ Key Features

1. **Multi-Format Audio Support**
   - Accepts WAV, WMA, MP3
   - Automatic format conversion

2. **Dual Input Methods**
   - Browser-based recording
   - File upload

3. **Ensemble Classification**
   - Combines feature-based and deep learning
   - Improved accuracy through model diversity

4. **Confidence Scoring**
   - Provides probability scores
   - Helps users understand prediction certainty

5. **Cloud-Ready Architecture**
   - Environment-aware deployment
   - Optimized for cloud constraints

6. **Medical Disclaimer**
   - Clear disclaimers about diagnostic limitations
   - Emphasizes consultation with healthcare professionals

---

## 📊 Data Pipeline

### Data Sources
1. **Parkinson's Time Series Data**
   - Motor UPDRS scores
   - Converted to binary classification

2. **Healthy/Unhealthy Datasets**
   - Labeled audio samples
   - Feature-extracted data

### Data Preprocessing
- Feature normalization
- Missing value handling
- Column renaming for consistency
- Dataset concatenation

### Feature Engineering
- Acoustic features via Praat
- Spectrogram generation for ViT
- Feature selection (removed DFA, PPE, RPDE - not available in Praat)

---

## 🚧 Challenges & Solutions

### Challenge 1: Audio Quality Variability
**Problem:** Different recording devices, environments, and user conditions
**Solution:**
- Robust feature extraction (Praat handles noise well)
- Normalization in preprocessing
- Ensemble approach reduces sensitivity to outliers

### Challenge 2: Model Size for Cloud Deployment
**Problem:** ViT model too large for cloud deployment
**Solution:**
- Environment-aware code (`IS_CLOUD` flag)
- Fallback to Random Forest only in cloud
- Full ensemble available locally

### Challenge 3: Real-time Processing
**Problem:** Audio processing and ML inference can be slow
**Solution:**
- Asynchronous pipeline execution
- Loading page with progress indicators
- Optimized model inference (frozen ViT backbone)

### Challenge 4: Medical Application Accuracy
**Problem:** False positives/negatives have serious implications
**Solution:**
- Conservative ensemble voting (defaults to "healthy" on disagreement)
- Confidence scores provided
- Clear medical disclaimers
- Emphasis on professional consultation

---

## 📈 Scalability & Production Considerations

### Current Limitations
- Single-threaded Flask server
- Global variables for state management
- No database for result storage
- No user authentication

### Production Improvements (For Amazon Interview Discussion)

1. **Scalability:**
   - Use AWS Lambda for ML inference (serverless)
   - S3 for audio file storage
   - API Gateway for request routing
   - Auto-scaling EC2 instances for Flask app

2. **Data Management:**
   - RDS/PostgreSQL for user data and results
   - DynamoDB for session management
   - S3 for audio file storage with lifecycle policies

3. **ML Infrastructure:**
   - SageMaker for model training and deployment
   - Model versioning and A/B testing
   - Batch inference for large datasets

4. **Monitoring & Observability:**
   - CloudWatch for metrics and logging
   - X-Ray for distributed tracing
   - Model performance monitoring

5. **Security:**
   - IAM roles for service permissions
   - Encryption at rest (S3, RDS)
   - HTTPS/TLS for data in transit
   - HIPAA compliance considerations (if handling PHI)

6. **Cost Optimization:**
   - Spot instances for training
   - Reserved instances for inference
   - S3 Intelligent-Tiering
   - Lambda for infrequent workloads

---

## 🎤 Interview Talking Points

### Technical Depth

**When asked about the ML approach:**
- "I chose an ensemble approach because voice analysis has multiple signal characteristics - temporal (jitter/shimmer) and spectral (spectrogram patterns). Random Forest captures acoustic features well, while ViT identifies visual patterns in spectrograms. The ensemble provides robustness and higher accuracy."

**When asked about scalability:**
- "The system is designed with cloud deployment in mind. I implemented environment-aware code that uses lightweight Random Forest in cloud and full ensemble locally. For production, I'd use AWS SageMaker for model serving, S3 for storage, and Lambda for serverless inference to handle variable load."

**When asked about challenges:**
- "The biggest challenge was handling audio quality variability. I addressed this through robust feature extraction with Praat and ensemble voting. Another challenge was model size - I solved this with transfer learning (frozen ViT backbone) and environment-aware deployment."

### System Design

**If asked to redesign:**
- "I'd use microservices architecture: separate services for audio processing, feature extraction, and ML inference. Use message queues (SQS) for async processing. Implement caching (ElastiCache) for frequently accessed models. Use CDN (CloudFront) for static assets."

**If asked about data pipeline:**
- "I'd implement a data pipeline using AWS Glue for ETL, store raw audio in S3, extract features and store in Redshift for analytics. Use Kinesis for real-time processing if needed."

### Best Practices

**Code Quality:**
- "I separated concerns: filters for audio processing, models for ML, helpers for utilities. Used environment variables for configuration. Implemented error handling and graceful degradation."

**Testing:**
- "I'd add unit tests for feature extraction, integration tests for the ML pipeline, and end-to-end tests for the web application. Use pytest and mock external dependencies."

---

## 📝 Key Metrics to Mention

- **Model Accuracy:** (Mention if you have metrics from metrics.py)
- **Processing Time:** ~2-5 seconds per audio sample
- **Supported Formats:** WAV, WMA, MP3
- **Model Size:** Random Forest ~5MB, ViT ~330MB
- **Features Extracted:** 11 acoustic features

---

## 🔗 Research Paper Reference

Based on research paper: https://www.nature.com/articles/s41598-023-47568-w

This demonstrates:
- Research-backed approach
- Understanding of scientific literature
- Application of published methods

---

## 💡 Questions You Can Ask Interviewer

1. "How does Amazon handle model versioning and A/B testing in production ML systems?"
2. "What's the typical architecture for real-time ML inference at Amazon scale?"
3. "How do you balance model accuracy with inference latency in production systems?"

---

## 🎯 Summary for 2-Minute Pitch

"This project is a Parkinson's Disease detection system using voice analysis. I built a dual-model ensemble combining a Random Forest classifier on acoustic features and a Vision Transformer on spectrograms. The system processes audio files, extracts features using Praat, and provides predictions with confidence scores. I designed it with cloud deployment in mind, using environment-aware code for scalability. The architecture includes a Flask backend, feature extraction pipeline, and ensemble voting mechanism. Key challenges I solved include handling audio quality variability and optimizing for cloud deployment constraints."

---

**Good luck with your Amazon interview! 🚀**



