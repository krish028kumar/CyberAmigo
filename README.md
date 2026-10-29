# 🛡️ CyberAmigo — AI-Powered Cyber Threat Detection & Classification Platform

[![GitHub repo](https://img.shields.io/badge/GitHub-krish028kumar%2FCyberAmigo-blue?logo=github)](https://github.com/krish028kumar/CyberAmigo)
[![Model Accuracy](https://img.shields.io/badge/Model%20Accuracy-95.43%25-brightgreen)](https://github.com/krish028kumar/CyberAmigo)
[![Inference Time](https://img.shields.io/badge/Inference-%3C1ms-success)](https://github.com/krish028kumar/CyberAmigo)
[![Next.js](https://img.shields.io/badge/Next.js-16%20App%20Router-black?logo=next.js)](https://nextjs.org/)

**CyberAmigo** is a full-stack cyber threat detection and text classification platform. Powered by an ensemble of machine learning models trained on real cyber attack data and semantic threat indicators, it identifies malicious text patterns including phishing, ransomware demands, DoS/DDoS threats, malware execution, SQL injections, and data breach attempts in real time.

---

## 📌 Key Capabilities

- **High-Precision ML Classification**: Gradient Boosting classifier trained on 983 cyber threat samples with **95.43% accuracy** and balanced class detection to prevent false negatives.
- **Deep Feature Engineering (1008 Dimensions)**:
  - 1000 TF-IDF n-gram features (unigrams + bigrams)
  - 8 Hand-crafted semantic threat indicators (Urgency, Sensitivity, Suspicious Intent, Technical Threat, Character Ratios, Capitalization metrics).
- **Comprehensive Threat Analysis API (`/api/analyze-threat`)**:
  - Classifies threat categories (Ransomware, Phishing, Malware, DoS/DDoS, Vulnerability Exploitation, SQL Injection, XSS, Data Breach).
  - Calculates dynamic **Danger Level (0–100%)**.
  - Generates real-time incident **diagnosis** and actionable **remediation playbooks**.
  - **Full CORS Support** for external SIEM, SOAR, KAVACH, and browser integrations.
- **Interactive Web Application**:
  - Real-time text classifier with quick example presets.
  - Model metrics dashboard with confusion matrices and performance benchmarks.
  - Responsive dark-themed modern UI built with Next.js 16, React 19, and Tailwind CSS.

---

## 📁 Repository Structure

```
CyberAmigo/
├── inputs/                         # Cleaned cyber security threat datasets
│   ├── 2clean_cyber_dataset-c216.csv
│   └── ...
├── outputs/                        # Trained machine learning artifacts & evaluations
│   ├── best_model.pkl              # Production Gradient Boosting model (1008 features)
│   ├── vectorizer.pkl              # TF-IDF vectorizer (1000 features)
│   ├── model_results.json          # Benchmark evaluation metrics
│   └── classify_helper.py          # Standalone Python inference helper
├── web/                            # Full-stack Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── analyze-threat/ # Comprehensive threat analysis API (CORS enabled)
│   │   │   │   ├── classify/       # Fast binary classification API
│   │   │   │   └── results/        # Model metrics API
│   │   │   ├── classifier/         # Interactive threat analysis page
│   │   │   ├── results/            # Model performance dashboard
│   │   │   └── page.tsx            # CyberAmigo landing page
│   │   └── components/             # Reusable UI components
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts
├── DEPLOYMENT_GUIDE.md             # Production deployment instructions
├── FINAL_PROJECT_SUMMARY.md        # Comprehensive ML pipeline report
└── README.md                       # Project documentation
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- Python packages: `scikit-learn`, `numpy`, `scipy`, `pandas`

```bash
pip install scikit-learn numpy scipy pandas
```

### 2. Frontend & Backend Setup
```bash
cd web
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Documentation

### 1. Advanced Threat Analysis
**Endpoint:** `POST /api/analyze-threat`  
**Headers:** `Content-Type: application/json`  
**CORS:** Enabled (`*`)

```bash
curl -X POST http://localhost:3000/api/analyze-threat \
  -H "Content-Type: application/json" \
  -d '{"text": "URGENT: Click here to verify your account or access will be suspended"}'
```

**Response:**
```json
{
  "threat_type": "Phishing/Social Engineering",
  "danger_level": 100,
  "diagnosis": "Identified as Phishing/Social Engineering with 99.7% confidence. High urgency language detected | Suspicious action requests detected",
  "solution": "Do not click links or download attachments | Report email to security team | Verify sender through official channels",
  "confidence": 0.997,
  "is_threat": true
}
```

### 2. Fast Binary Classification
**Endpoint:** `POST /api/classify`

```bash
curl -X POST http://localhost:3000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "ransomware attack targeting hospital databases"}'
```

**Response:**
```json
{
  "label": "threat",
  "confidence": 0.993
}
```

---

## 📊 Model Benchmark

| Model | Accuracy | Precision | Recall | F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting** | **95.43%** | **95.70%** | **95.43%** | **95.56%** | **Selected (Production)** |
| Random Forest | 94.92% | 95.12% | 94.92% | 95.02% | Benchmark |
| Logistic Regression | 93.91% | 94.20% | 93.91% | 94.05% | Baseline |

---

## 🔒 Security & Privacy

- All sensitive credentials and environment variables are strictly ignored from version control (`.env*`, `.user_env`).
- Inputs are sanitized before feature extraction to prevent command injection and script execution vulnerabilities.

---

## 📄 License
MIT License. Developed for cybersecurity intelligence and threat prevention.
