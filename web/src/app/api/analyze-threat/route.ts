import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';

// Enable CORS for all origins
function createCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: createCORSHeaders(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid input: text field is required',
          threat_type: 'unknown',
          danger_level: 0,
          diagnosis: 'No text provided for analysis',
          solution: 'Please provide valid text input',
        },
        { status: 400, headers: createCORSHeaders() }
      );
    }

    // Create a temporary Python script for comprehensive threat analysis
    const tempScript = `/tmp/analyze_threat_${Date.now()}.py`;
    const pythonCode = `
import pickle
import json
import sys
import numpy as np
from scipy.sparse import hstack
import re

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

def analyze_threat_type(text, confidence):
    text_lower = text.lower()
    
    # Ransomware
    if any(kw in text_lower for kw in ['ransomware', 'encrypt', 'ransom', 'payment', 'bitcoin']):
        return 'ransomware', 'Ransomware Attack'
    
    # Phishing
    if any(kw in text_lower for kw in ['phishing', 'verify', 'confirm', 'click here', 'urgent action', 'update password']):
        return 'phishing', 'Phishing/Social Engineering'
    
    # Malware
    if any(kw in text_lower for kw in ['malware', 'virus', 'trojan', 'backdoor', 'worm', 'spyware']):
        return 'malware', 'Malware/Virus'
    
    # DOS/DDOS
    if any(kw in text_lower for kw in ['dos attack', 'ddos', 'denial of service', 'flood']):
        return 'dos_attack', 'DoS/DDoS Attack'
    
    # Exploitation
    if any(kw in text_lower for kw in ['exploit', 'vulnerability', 'cve', 'zero-day', 'payload']):
        return 'exploitation', 'Vulnerability Exploitation'
    
    # SQL Injection
    if any(kw in text_lower for kw in ['sql', 'injection', 'database', 'query', 'drop table']):
        return 'sql_injection', 'SQL Injection'
    
    # XSS
    if any(kw in text_lower for kw in ['xss', 'script', 'javascript', 'alert', 'onclick']):
        return 'xss', 'Cross-Site Scripting (XSS)'
    
    # Data Breach
    if any(kw in text_lower for kw in ['breach', 'leak', 'stolen', 'compromised', 'exposed']):
        return 'data_breach', 'Data Breach'
    
    if confidence > 0.7:
        return 'general_threat', 'General Threat'
    
    return 'unknown', 'Unknown Threat Type'

def calculate_danger_level(confidence, threat_type_code):
    base_level = int(confidence * 100)
    
    high_risk = ['ransomware', 'dos_attack', 'sql_injection', 'exploitation']
    medium_risk = ['malware', 'phishing', 'xss', 'data_breach']
    
    if threat_type_code in high_risk:
        return min(100, base_level + 20)
    elif threat_type_code in medium_risk:
        return min(100, base_level + 10)
    else:
        return base_level

def generate_diagnosis(text, threat_type, threat_type_code, confidence):
    text_lower = text.lower()
    findings = []
    
    # Urgency indicators
    urgency_kws = ['urgent', 'immediately', 'asap', 'emergency', 'critical']
    if any(kw in text_lower for kw in urgency_kws):
        findings.append('High urgency language detected')
    
    # Suspicious keywords
    if any(kw in text_lower for kw in ['click', 'verify', 'confirm', 'authenticate']):
        findings.append('Suspicious action requests detected')
    
    # Technical indicators
    if any(kw in text_lower for kw in ['payload', 'shellcode', 'exploit', 'vulnerability']):
        findings.append('Technical threat indicators identified')
    
    # Sensitive data requests
    if any(kw in text_lower for kw in ['password', 'credit', 'ssn', 'account']):
        findings.append('Attempts to obtain sensitive information')
    
    # Confidence assessment
    if confidence > 0.9:
        findings.append('High confidence threat detection')
    elif confidence > 0.7:
        findings.append('Moderate confidence threat detection')
    else:
        findings.append('Low confidence threat detection')
    
    return findings

def generate_solution(threat_type_code, findings, confidence):
    solutions = {
        'ransomware': [
            'Isolate affected systems immediately',
            'Do not pay ransom - contact law enforcement',
            'Restore from clean backups',
            'Run malware detection tools',
            'Monitor for data exfiltration'
        ],
        'phishing': [
            'Do not click links or download attachments',
            'Report email to security team',
            'Verify sender through official channels',
            'Enable multi-factor authentication',
            'Educate users on phishing tactics'
        ],
        'malware': [
            'Disconnect from network immediately',
            'Run comprehensive antivirus scan',
            'Update all security software',
            'Change all passwords from clean system',
            'Restore from clean backups'
        ],
        'dos_attack': [
            'Contact ISP/hosting provider',
            'Implement DDoS mitigation',
            'Block suspicious IP addresses',
            'Monitor traffic patterns',
            'Enable rate limiting'
        ],
        'exploitation': [
            'Patch vulnerable systems immediately',
            'Review logs for unauthorized access',
            'Monitor system behavior',
            'Isolate compromised systems',
            'Investigate potential data theft'
        ],
        'sql_injection': [
            'Use parameterized queries',
            'Input validation and sanitization',
            'Use Web Application Firewall (WAF)',
            'Review database access logs',
            'Update all database drivers'
        ],
        'xss': [
            'Encode all user input',
            'Implement Content Security Policy (CSP)',
            'Use security headers',
            'Sanitize HTML/JavaScript',
            'Regular security testing'
        ],
        'data_breach': [
            'Notify affected users',
            'Change compromised credentials',
            'Monitor for unauthorized access',
            'Implement breach containment',
            'Review security measures'
        ]
    }
    
    base_solutions = solutions.get(threat_type_code, [
        'Review security policies',
        'Implement monitoring',
        'Conduct security assessment',
        'Update access controls',
        'Regular security audits'
    ])
    
    if confidence < 0.5:
        base_solutions.append('Monitor situation and reassess')
    
    return base_solutions[:3]  # Return top 3 recommendations

try:
    with open('/workspace/outputs/best_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('/workspace/outputs/vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
    
    X_tfidf = vectorizer.transform([text])
    threat_features = extract_threat_features(text)
    X_threat = threat_features.reshape(1, -1)
    
    # Ensure threat_features is a numpy array for concatenation
    if not isinstance(X_threat, np.ndarray):
        X_threat = np.array(X_threat)
    
    # Convert sparse matrix to dense or use proper concatenation
    from scipy.sparse import csr_matrix
    X_threat_sparse = csr_matrix(X_threat)
    X = hstack([X_tfidf, X_threat_sparse])
    
    prediction = model.predict(X)[0]
    confidence = float(model.predict_proba(X)[0].max())
    
    is_threat = prediction == 1
    
    if is_threat:
        threat_type_code, threat_type = analyze_threat_type(text, confidence)
        danger_level = calculate_danger_level(confidence, threat_type_code)
        diagnosis_list = generate_diagnosis(text, threat_type, threat_type_code, confidence)
        solution_list = generate_solution(threat_type_code, diagnosis_list, confidence)
        
        diagnosis = f"Identified as {threat_type} with {confidence*100:.1f}% confidence. " + " | ".join(diagnosis_list)
        solution = " | ".join(solution_list)
    else:
        threat_type = 'No Threat Detected'
        threat_type_code = 'safe'
        danger_level = 0
        diagnosis = f"Content analyzed as safe with {confidence*100:.1f}% confidence. No immediate threat indicators detected."
        solution = "Continue monitoring and maintain standard security practices."
    
    result = {
        "threat_type": threat_type,
        "danger_level": danger_level,
        "diagnosis": diagnosis,
        "solution": solution,
        "confidence": confidence,
        "is_threat": bool(is_threat)
    }
    print(json.dumps(result, default=str))
except Exception as e:
    import traceback
    print(json.dumps({
        "threat_type": "error",
        "danger_level": 0,
        "diagnosis": str(e),
        "solution": "Error in threat analysis",
        "confidence": 0,
        "is_threat": False,
        "error": True
    }))
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
      console.error('Analysis error:', error.message);
      console.error('Stderr:', error.stderr?.toString());
      console.error('Stdout:', error.stdout?.toString());
      
      try {
        fs.unlinkSync(tempScript);
      } catch (e) {
        // Ignore cleanup errors
      }
      
      return NextResponse.json(
        {
          threat_type: 'unknown',
          danger_level: 0,
          diagnosis: 'Analysis encountered an error. Please try again.',
          solution: 'Retry with a different input text.',
          confidence: 0,
          is_threat: false,
        },
        { status: 200, headers: createCORSHeaders() }
      );
    }

    // Clean up temp file
    try {
      fs.unlinkSync(tempScript);
    } catch (e) {
      // Ignore cleanup errors
    }

    const analysisResult = JSON.parse(result.trim());

    return NextResponse.json(
      {
        threat_type: analysisResult.threat_type,
        danger_level: analysisResult.danger_level,
        diagnosis: analysisResult.diagnosis,
        solution: analysisResult.solution,
        confidence: analysisResult.confidence,
        is_threat: analysisResult.is_threat,
      },
      { status: 200, headers: createCORSHeaders() }
    );
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        threat_type: 'error',
        danger_level: 0,
        diagnosis: 'Server error during analysis',
        solution: 'Please contact support if issue persists',
        confidence: 0,
        is_threat: false,
      },
      { status: 500, headers: createCORSHeaders() }
    );
  }
}
