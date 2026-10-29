import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: text is required' },
        { status: 400 }
      );
    }

    // Create a temporary Python script file
    const tempScript = `/tmp/classify_${Date.now()}.py`;
    const pythonCode = `
import pickle
import json
import sys
import numpy as np
from scipy.sparse import hstack

text = """${text.replace(/"""/g, '\\"""')}"""

def extract_threat_features(text):
    text_lower = text.lower()
    text_len = len(text)
    word_count = len(text.split())
    
    if text_len == 0:
        return np.array([0] * 8)
    
    urgency_keywords = ['urgent', 'immediately', 'asap', 'emergency', 'critical', 
                       'exploit', 'attack', 'breach', 'hack', 'malware', 'virus', 'dos', 'ddos']
    urgency_count = sum(text_lower.count(kw) for kw in urgency_keywords)
    urgency_score = (urgency_count / max(word_count, 1)) * 10
    
    sensitivity_keywords = ['password', 'credit', 'ssn', 'account', 'verify', 'confirm']
    sensitivity_count = sum(text_lower.count(kw) for kw in sensitivity_keywords)
    sensitivity_score = (sensitivity_count / max(word_count, 1)) * 10
    
    suspicious_keywords = ['click', 'download', 'install', 'execute', 'run', 'backdoor', 
                          'ransomware', 'trojan', 'spyware', 'phishing', 'c2']
    suspicious_count = sum(text_lower.count(kw) for kw in suspicious_keywords)
    suspicious_score = (suspicious_count / max(word_count, 1)) * 10
    
    technical_keywords = ['cve', 'vulnerability', 'exploit', 'payload', 'shellcode', 
                         'obfuscated', 'bypass', 'rce', 'injection']
    technical_count = sum(text_lower.count(kw) for kw in technical_keywords)
    technical_score = (technical_count / max(word_count, 1)) * 10
    
    length_score = min(text_len / 100, 10)
    word_score = min(word_count / 20, 10)
    
    special_chars = sum(1 for c in text if not c.isalnum() and c != ' ')
    special_score = (special_chars / max(text_len, 1)) * 100
    
    caps_words = sum(1 for word in text.split() if word.isupper() and len(word) > 1)
    caps_score = (caps_words / max(word_count, 1)) * 10
    
    return np.array([urgency_score, sensitivity_score, suspicious_score, technical_score,
                    length_score, word_score, special_score, caps_score])

try:
    with open('/workspace/outputs/best_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('/workspace/outputs/vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
    
    X_tfidf = vectorizer.transform([text])
    threat_features = extract_threat_features(text)
    X_threat = threat_features.reshape(1, -1)
    X = hstack([X_tfidf, X_threat])
    
    prediction = model.predict(X)[0]
    probability = float(model.predict_proba(X)[0].max())
    
    result = {
        "label": "threat" if prediction == 1 else "safe",
        "confidence": probability
    }
    print(json.dumps(result))
except Exception as e:
    import traceback
    print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}))
    sys.exit(1)
`;

    fs.writeFileSync(tempScript, pythonCode);

    let result;
    try {
      result = execSync(`python3 ${tempScript}`, {
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024 * 10,
        timeout: 5000,
      });
    } catch (error: any) {
      console.error('Classification error:', error.message);
      fs.unlinkSync(tempScript);
      return NextResponse.json(
        { label: 'threat', confidence: 0.5, error: 'Classification failed' },
        { status: 200 }
      );
    }

    // Clean up temp file
    try {
      fs.unlinkSync(tempScript);
    } catch (e) {
      // Ignore cleanup errors
    }

    const classificationResult = JSON.parse(result.trim());

    if (classificationResult.error) {
      console.error('Model error:', classificationResult.error);
      return NextResponse.json({
        label: 'threat',
        confidence: 0.5,
        error: classificationResult.error,
      });
    }

    return NextResponse.json({
      label: classificationResult.label || 'threat',
      confidence: classificationResult.confidence || 0.5,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { label: 'threat', confidence: 0.5, error: error.message },
      { status: 200 }
    );
  }
}
