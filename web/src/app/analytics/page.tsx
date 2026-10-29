'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metrics {
  logistic_regression: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    confusion_matrix: number[][];
    training_samples: number;
    test_samples: number;
  };
  random_forest: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    confusion_matrix: number[][];
    training_samples: number;
    test_samples: number;
  };
  dataset_stats: {
    total_samples: number;
    threat_count: number;
    safe_count: number;
    features: number;
    vocab_size: number;
  };
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading analytics...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-red-400">Failed to load metrics</div>
      </div>
    );
  }

  const modelComparison = [
    {
      name: 'Logistic Regression',
      accuracy: (metrics.logistic_regression.accuracy * 100).toFixed(1),
      precision: (metrics.logistic_regression.precision * 100).toFixed(1),
      recall: (metrics.logistic_regression.recall * 100).toFixed(1),
      f1: (metrics.logistic_regression.f1 * 100).toFixed(1),
    },
    {
      name: 'Random Forest',
      accuracy: (metrics.random_forest.accuracy * 100).toFixed(1),
      precision: (metrics.random_forest.precision * 100).toFixed(1),
      recall: (metrics.random_forest.recall * 100).toFixed(1),
      f1: (metrics.random_forest.f1 * 100).toFixed(1),
    },
  ];

  const datasetDistribution = [
    { name: 'Threats', value: metrics.dataset_stats.threat_count, fill: '#ef4444' },
    { name: 'Safe', value: metrics.dataset_stats.safe_count, fill: '#10b981' },
  ];

  const confusionMatrixData = [
    { label: 'True Negatives', value: metrics.logistic_regression.confusion_matrix[0][0], color: '#10b981' },
    { label: 'False Positives', value: metrics.logistic_regression.confusion_matrix[0][1], color: '#f97316' },
    { label: 'False Negatives', value: metrics.logistic_regression.confusion_matrix[1][0], color: '#f97316' },
    { label: 'True Positives', value: metrics.logistic_regression.confusion_matrix[1][1], color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50 sticky top-0">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CyberAI
            </Link>
            <div className="flex gap-8">
              <Link href="/classifier" className="text-slate-300 hover:text-cyan-400 transition font-medium">
                Classifier
              </Link>
              <Link href="/analytics" className="text-cyan-400 font-medium border-b-2 border-cyan-400">
                Analytics
              </Link>
              <Link href="/dataset" className="text-slate-300 hover:text-cyan-400 transition font-medium">
                Dataset
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Model Analytics</h1>
            <p className="text-slate-400 mb-12">
              Comprehensive performance metrics and dataset statistics
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">Total Samples</div>
                <div className="text-3xl font-bold text-cyan-400">{metrics.dataset_stats.total_samples}</div>
                <div className="text-slate-500 text-xs mt-2">{metrics.dataset_stats.threat_count} threats, {metrics.dataset_stats.safe_count} safe</div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">Features (TF-IDF)</div>
                <div className="text-3xl font-bold text-cyan-400">{metrics.dataset_stats.features}</div>
                <div className="text-slate-500 text-xs mt-2">Bi-grams vocabulary</div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">Vocab Size</div>
                <div className="text-3xl font-bold text-cyan-400">{metrics.dataset_stats.vocab_size}</div>
                <div className="text-slate-500 text-xs mt-2">Unique terms extracted</div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">Models Trained</div>
                <div className="text-3xl font-bold text-cyan-400">2</div>
                <div className="text-slate-500 text-xs mt-2">LR + Random Forest</div>
              </motion.div>
            </div>

            {/* Model Comparison Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm mb-12"
            >
              <h2 className="text-xl font-bold text-white mb-6">Model Performance Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#06b6d4" />
                  <Bar dataKey="precision" fill="#0ea5e9" />
                  <Bar dataKey="recall" fill="#6366f1" />
                  <Bar dataKey="f1" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-slate-400 text-sm mt-4">All metrics shown as percentages</p>
            </motion.div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              {/* Dataset Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold text-white mb-6">Dataset Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={datasetDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {datasetDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Logistic Regression Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm"
              >
                <h2 className="text-xl font-bold text-white mb-6">Logistic Regression</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Accuracy</span>
                      <span className="text-cyan-400 font-bold">{(metrics.logistic_regression.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" style={{ width: `${metrics.logistic_regression.accuracy * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Precision</span>
                      <span className="text-cyan-400 font-bold">{(metrics.logistic_regression.precision * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" style={{ width: `${metrics.logistic_regression.precision * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Recall</span>
                      <span className="text-cyan-400 font-bold">{(metrics.logistic_regression.recall * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" style={{ width: `${metrics.logistic_regression.recall * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">F1-Score</span>
                      <span className="text-cyan-400 font-bold">{(metrics.logistic_regression.f1 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full" style={{ width: `${metrics.logistic_regression.f1 * 100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-slate-400 text-sm">
                    <strong>Training:</strong> {metrics.logistic_regression.training_samples} samples
                  </p>
                  <p className="text-slate-400 text-sm">
                    <strong>Testing:</strong> {metrics.logistic_regression.test_samples} samples
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Confusion Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm"
            >
              <h2 className="text-xl font-bold text-white mb-6">Confusion Matrix (Logistic Regression)</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  {confusionMatrixData.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="text-slate-300 font-semibold">{item.label}</p>
                        <p className="text-slate-400 text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-slate-700">
                        <td className="p-2 text-slate-400">True Negatives (TN)</td>
                        <td className="p-2 text-cyan-400 font-bold">{metrics.logistic_regression.confusion_matrix[0][0]}</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="p-2 text-slate-400">False Positives (FP)</td>
                        <td className="p-2 text-cyan-400 font-bold">{metrics.logistic_regression.confusion_matrix[0][1]}</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="p-2 text-slate-400">False Negatives (FN)</td>
                        <td className="p-2 text-cyan-400 font-bold">{metrics.logistic_regression.confusion_matrix[1][0]}</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-slate-400">True Positives (TP)</td>
                        <td className="p-2 text-cyan-400 font-bold">{metrics.logistic_regression.confusion_matrix[1][1]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
