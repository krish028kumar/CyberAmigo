import pickle
import json
import sys
import re
import numpy as np
from scipy.sparse import hstack

def extract_threat_features(text):
    """Extract 8 threat indicator features from text"""
    text_lower = text.lower()
    text_len = len(text)
    word_count = len(text.split())
    
    # Prevent division by zero
    if text_len == 0:
        return np.array([0] * 8)
    
    # 1. Urgency score
    urgency_keywords = ['urgent', 'immediately', 'asap', 'emergency', 'critical', 
                       'exploit', 'attack', 'breach', 'hack', 'malware', 'virus']
    urgency_count = sum(text_lower.count(kw) for kw in urgency_keywords)
    urgency_score = (urgency_count / max(word_count, 1)) * 10
    
    # 2. Sensitivity score
    sensitivity_keywords = ['password', 'credit', 'ssn', 'account', 'verify', 'confirm', 'update']
    sensitivity_count = sum(text_lower.count(kw) for kw in sensitivity_keywords)
    sensitivity_score = (sensitivity_count / max(word_count, 1)) * 10
    
    # 3. Suspicious intent score
    suspicious_keywords = ['click', 'download', 'install', 'execute', 'run', 'backdoor', 
                          'ransomware', 'trojan', 'spyware', 'phishing']
    suspicious_count = sum(text_lower.count(kw) for kw in suspicious_keywords)
    suspicious_score = (suspicious_count / max(word_count, 1)) * 10
    
    # 4. Technical threat score
    technical_keywords = ['cve', 'vulnerability', 'exploit', 'payload', 'shellcode', 
                         'obfuscated', 'c2', 'command', 'control']
    technical_count = sum(text_lower.count(kw) for kw in technical_keywords)
    technical_score = (technical_count / max(word_count, 1)) * 10
    
    # 5. Text length (normalized)
    length_score = min(text_len / 100, 10)
    
    # 6. Word count (normalized)
    word_score = min(word_count / 20, 10)
    
    # 7. Special character ratio
    special_chars = sum(1 for c in text if not c.isalnum() and c != ' ')
    special_score = (special_chars / max(text_len, 1)) * 100
    
    # 8. All caps ratio
    caps_words = sum(1 for word in text.split() if word.isupper() and len(word) > 1)
    caps_score = (caps_words / max(word_count, 1)) * 10
    
    return np.array([
        urgency_score, sensitivity_score, suspicious_score, technical_score,
        length_score, word_score, special_score, caps_score
    ])

def classify_text(text):
    """Classify text using the trained model with feature engineering"""
    try:
        # Load model and vectorizer
        with open('/workspace/outputs/best_model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('/workspace/outputs/vectorizer.pkl', 'rb') as f:
            vectorizer = pickle.load(f)
        
        # Get TF-IDF features
        X_tfidf = vectorizer.transform([text])
        
        # Extract threat indicator features
        threat_features = extract_threat_features(text)
        X_threat = threat_features.reshape(1, -1)
        
        # Combine features
        X = hstack([X_tfidf, X_threat])
        
        # Predict
        prediction = model.predict(X)[0]
        probability = float(model.predict_proba(X)[0].max())
        
        return {
            "label": str(prediction),
            "confidence": probability,
            "success": True
        }
    except Exception as e:
        import traceback
        return {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "success": False
        }

if __name__ == "__main__":
    text = sys.argv[1] if len(sys.argv) > 1 else "test"
    result = classify_text(text)
    print(json.dumps(result))
