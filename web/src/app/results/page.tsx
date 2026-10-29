'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function ResultsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        setResults(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch results:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CyberAmigo
          </Link>
          <div className="flex gap-6">
            <Link href="/classifier" className="text-slate-300 hover:text-cyan-400 transition font-medium">
              Classifier
            </Link>
            <Link href="/results" className="text-cyan-400 font-medium border-b-2 border-cyan-400">
              Results
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Model Performance</h1>
          <p className="text-slate-400 mb-12">Comprehensive evaluation metrics and results</p>

          {results && (
            <div className="space-y-8">
              {/* Dataset Info */}
              {results.dataset_info && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Dataset Information</h2>
                  <div className="grid grid-cols-4 gap-6">
                    <div>
                      <div className="text-cyan-400 font-semibold">Total Samples</div>
                      <div className="text-3xl font-bold text-white mt-2">
                        {results.dataset_info.total_samples}
                      </div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-semibold">Training</div>
                      <div className="text-3xl font-bold text-white mt-2">
                        {results.dataset_info.train_samples}
                      </div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-semibold">Test</div>
                      <div className="text-3xl font-bold text-white mt-2">
                        {results.dataset_info.test_samples}
                      </div>
                    </div>
                    <div>
                      <div className="text-cyan-400 font-semibold">Features</div>
                      <div className="text-3xl font-bold text-white mt-2">
                        {results.dataset_info.features}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Model Comparison */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Model Performance Comparison</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-cyan-400 font-semibold">Model</th>
                        <th className="px-4 py-3 text-cyan-400 font-semibold">Accuracy</th>
                        <th className="px-4 py-3 text-cyan-400 font-semibold">Precision</th>
                        <th className="px-4 py-3 text-cyan-400 font-semibold">Recall</th>
                        <th className="px-4 py-3 text-cyan-400 font-semibold">F1-Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.model_results && Object.entries(results.model_results).map(([key, value]: [string, any]) => (
                        <tr key={key} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition">
                          <td className="px-4 py-3 text-white font-semibold">
                            {key}
                            {key === results.best_model && ' ⭐'}
                          </td>
                          <td className="px-4 py-3 text-cyan-400">{(value.accuracy * 100).toFixed(2)}%</td>
                          <td className="px-4 py-3 text-cyan-400">{(value.precision * 100).toFixed(2)}%</td>
                          <td className="px-4 py-3 text-cyan-400">{(value.recall * 100).toFixed(2)}%</td>
                          <td className="px-4 py-3 text-cyan-400">{(value.f1 * 100).toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* Best Model Highlight */}
              {results.best_model && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/50 rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">🏆 Selected Model</h2>
                  <p className="text-cyan-400 text-lg font-semibold mb-2">{results.best_model}</p>
                  <p className="text-slate-300">
                    Selected for best accuracy ({(results.model_results[results.best_model].accuracy * 100).toFixed(2)}%) with balanced predictions
                  </p>
                </motion.div>
              )}

              {/* Class Distribution */}
              {results.dataset_info && (
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Class Distribution</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 rounded bg-red-500"></div>
                        <span className="text-white font-semibold">Threat Samples</span>
                      </div>
                      <div className="text-3xl font-bold text-red-500">
                        {results.dataset_info.threat_count}
                      </div>
                      <div className="text-slate-400 text-sm mt-2">
                        {((results.dataset_info.threat_count / results.dataset_info.total_samples) * 100).toFixed(1)}% of dataset
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-4 h-4 rounded bg-green-500"></div>
                        <span className="text-white font-semibold">Safe Samples</span>
                      </div>
                      <div className="text-3xl font-bold text-green-500">
                        {results.dataset_info.safe_count}
                      </div>
                      <div className="text-slate-400 text-sm mt-2">
                        {((results.dataset_info.safe_count / results.dataset_info.total_samples) * 100).toFixed(1)}% of dataset
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Feature Engineering */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Feature Engineering</h2>
                <div className="space-y-4">
                  <div className="bg-slate-900/50 rounded p-4">
                    <p className="text-cyan-400 font-semibold mb-2">1008 Total Features:</p>
                    <ul className="text-slate-300 text-sm space-y-1">
                      <li>✓ 1000 TF-IDF features (unigrams + bigrams)</li>
                      <li>✓ 8 threat indicator features:</li>
                    </ul>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="text-xs text-slate-400">• Urgency Score</div>
                      <div className="text-xs text-slate-400">• Sensitivity Score</div>
                      <div className="text-xs text-slate-400">• Suspicious Intent</div>
                      <div className="text-xs text-slate-400">• Technical Threat</div>
                      <div className="text-xs text-slate-400">• Text Length</div>
                      <div className="text-xs text-slate-400">• Word Count</div>
                      <div className="text-xs text-slate-400">• Special Char Ratio</div>
                      <div className="text-xs text-slate-400">• All Caps Ratio</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
