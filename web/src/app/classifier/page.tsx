'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Send, Copy } from 'lucide-react';

export default function ClassifierPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClassify = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Classification failed:', error);
    }
    setLoading(false);
  };

  const examples = [
    'a cybersquatting domain launching dos attacks on news sites',
    'malware detected in system registry executing backdoor',
    'hello everyone have a great day',
    'let me proceed with the meeting schedule',
    'ransomware campaign targeting healthcare institutions',
    'good morning enjoy your day'
  ];

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(`${result.label}: ${(result.confidence * 100).toFixed(2)}%`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CyberAmigo
          </Link>
          <div className="flex gap-6">
            <Link href="/classifier" className="text-cyan-400 font-medium border-b-2 border-cyan-400">
              Classifier
            </Link>
            <Link href="/results" className="text-slate-300 hover:text-cyan-400 transition font-medium">
              Results
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">CyberAmigo Analyzer</h1>
          <p className="text-slate-400 mb-12">Enter text to classify it as a threat or safe content</p>

          {/* Input Section */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-8">
            <label className="block text-white font-semibold mb-4">Enter Text to Classify</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste text here to analyze..."
              className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-none"
            />

            <div className="mt-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClassify}
                disabled={!input.trim() || loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Classifying...' : 'Classify'}
              </motion.button>
              <button
                onClick={() => {
                  setInput('');
                  setResult(null);
                }}
                className="px-4 py-3 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-slate-500 transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Quick Examples */}
          <div className="mb-8">
            <p className="text-slate-400 text-sm font-semibold mb-3">Quick Examples:</p>
            <div className="grid grid-cols-2 gap-3">
              {examples.map((ex, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setInput(ex)}
                  className="text-left px-4 py-3 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition text-slate-300 text-sm truncate"
                >
                  {ex.substring(0, 50)}...
                </motion.button>
              ))}
            </div>
          </div>

          {/* Result Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`rounded-lg p-8 backdrop-blur-sm border ${
                result.label === 'threat'
                  ? 'bg-red-500/10 border-red-500/50'
                  : 'bg-green-500/10 border-green-500/50'
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                {result.label === 'threat' ? (
                  <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {result.label === 'threat' ? '🚨 Threat Detected' : '✓ Safe Content'}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            result.label === 'threat'
                              ? 'bg-gradient-to-r from-red-500 to-orange-500'
                              : 'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                      <p className="text-slate-400 text-sm mt-2">Confidence Score</p>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={copyToClipboard}
                  className="p-3 border border-slate-600 rounded-lg hover:border-cyan-500 transition"
                >
                  <Copy className={`w-5 h-5 ${copied ? 'text-green-500' : 'text-slate-400'}`} />
                </motion.button>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <p className="text-slate-400 text-sm font-semibold mb-2">Model Details:</p>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• <strong>Model:</strong> Gradient Boosting (95.43% accuracy)</li>
                  <li>• <strong>Features:</strong> 1008 (1000 TF-IDF + 8 threat indicators)</li>
                  <li>• <strong>Training Data:</strong> 983 cyber threat texts</li>
                  <li>• <strong>Threat Detection:</strong> Identifies urgency, sensitivity, suspicious patterns</li>
                  <li>• <strong>Inference:</strong> &lt;1 millisecond</li>
                </ul>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
