# Parkinson Disease Detection Using Speech

A machine learning-based web application for detecting Parkinson's Disease from speech patterns using advanced audio analysis and ensemble models.

## Overview

This project leverages speech analysis and machine learning to detect potential signs of Parkinson's Disease. The system processes audio recordings and extracts acoustic features to make predictions using ensemble and Vision Transformer models.

## Features

- 🎤 Real-time audio processing and analysis
- 📊 Advanced spectrogram generation and feature extraction
- 🤖 Multiple ML models (Random Forest, Ensemble, Vision Transformer)
- 🌐 Web-based interface for easy access
- 📱 Phone-based recording integration (Twilio support)
- 📈 Comprehensive performance metrics and evaluation

## Project Structure

```
├── app.py                          # Flask web application
├── requirements.txt                # Python dependencies
├── data/                           # Dataset files
│   ├── healthy.csv
│   ├── unhealthy.csv
│   └── parkinsons_timeseries.csv
├── filters/                        # Audio processing modules
│   ├── praat.py                   # Praat-based audio analysis
│   ├── wma_to_wav.py              # Audio format conversion
│   └── SpectrogramGen.m           # MATLAB spectrogram generation
├── models/                         # ML models
│   ├── randomForest.py            # Random Forest implementation
│   ├── ensemble.py                # Ensemble model
│   ├── vit.py                     # Vision Transformer model
│   ├── metrics.py                 # Model evaluation metrics
│   └── randomforest.joblib        # Pre-trained Random Forest
├── helpers/                        # Utility functions
│   ├── textFormat.py
│   └── trainingSet.py
├── static/                         # Static assets
│   ├── js/
│   └── img/
├── templates/                      # HTML templates
│   ├── index.html
│   ├── uploaded.html
│   ├── loading.html
│   ├── results.html
│   └── failure.html
├── upload/                         # Uploaded audio files
└── tmp/                            # Temporary files
```

## Installation

### Prerequisites
- Python 3.7+
- pip
- MATLAB (optional, for spectrogram generation)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/NammanGoyal/Parkinson_Disease_Detection-.git
cd Parkinson_Disease_Detection-
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
export TWILIO_ACCOUNT_SID=your_twilio_account_sid
export TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

## Usage

### Running the Web Application

```bash
python app.py
```

The application will be available at `http://localhost:5000`

### API Endpoints

- **GET `/`** - Home page for audio upload
- **POST `/upload_file`** - Process uploaded audio file
- **POST `/execute_pipeline_phone`** - Process audio from Twilio phone call

## Dataset

The project uses speech samples from individuals with and without Parkinson's Disease:
- `healthy.csv` - Features from healthy individuals
- `unhealthy.csv` - Features from Parkinson's patients
- `parkinsons_timeseries.csv` - Time-series speech data

### Features Extracted
- Fundamental frequency characteristics
- Jitter and shimmer measurements
- Noise-to-harmonic ratios
- Spectral features
- MFCC coefficients

## Models

### 1. Random Forest
- Fast and efficient classification
- Feature importance analysis
- Pre-trained model available (`randomforest.joblib`)

### 2. Ensemble Model
- Combines multiple algorithms
- Improved accuracy and robustness
- Voting-based predictions

### 3. Vision Transformer (ViT)
- Deep learning approach
- Works with spectrogram images
- State-of-the-art performance

## Performance Metrics

The models are evaluated using:
- Accuracy
- Precision
- Recall
- F1-Score
- AUC-ROC
- Confusion Matrix

See `models/metrics.py` for detailed evaluation code.

## Audio Processing

### Supported Formats
- WAV
- MP3 (converted to WAV)
- Phone recordings (via Twilio)

### Feature Extraction Pipeline
1. Audio normalization
2. Spectrogram generation
3. Feature extraction
4. Preprocessing and scaling
5. Model prediction

## Configuration

Environment variables (optional):
```
TWILIO_ACCOUNT_SID    # Twilio account ID
TWILIO_AUTH_TOKEN     # Twilio authentication token
UPLOAD_FOLDER         # Directory for uploaded files
```

## Documentation

- `PROJECT_EXPLANATION.md` - Detailed project explanation
- `IMPLEMENTATION GUIDE.txt` - Implementation details
- `INTERVIEW_CHEAT_SHEET.md` - Key project concepts
- `INTERVIEW_ANSWERS.md` - Common questions and answers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Disclaimer

This application is for educational and research purposes only. It should not be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare professionals for medical advice.

## Contact

For questions or support, please open an issue in the repository.

---

**Last Updated:** August 2025
