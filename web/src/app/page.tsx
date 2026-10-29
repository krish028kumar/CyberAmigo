'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Zap, BarChart3, Send } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CyberAmigo
          </div>
          <div className="flex gap-6">
            <Link href="/classifier" className="text-slate-300 hover:text-cyan-400 transition font-medium">
              Classifier
            </Link>
            <Link href="/results" className="text-slate-300 hover:text-cyan-400 transition font-medium">
              Results
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-6">
            Your <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Cyber Amigo</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Your trusted friend in cyber threat detection. Advanced ML-powered analysis with 95.43% accuracy to identify urgency, sensitive requests, and suspicious intent patterns.
          </p>
        </motion.div>

        {/* Performance Stats */}
        <div className="grid grid-cols-4 gap-6 mb-16">
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400">95.43%</div>
            <div className="text-slate-400 text-sm mt-2">Accuracy</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400">95.43%</div>
            <div className="text-slate-400 text-sm mt-2">Recall</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400">983</div>
            <div className="text-slate-400 text-sm mt-2">Training Samples</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-cyan-400">&lt;1ms</div>
            <div className="text-slate-400 text-sm mt-2">Inference Time</div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <Zap className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Fast & Accurate</h3>
            <p className="text-slate-400 text-sm">Gradient Boosting model with 1008 engineered features</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="font-semibold text-white mb-2">Threat Detection</h3>
            <p className="text-slate-400 text-sm">Identifies urgency, sensitivity, and suspicious patterns</p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <BarChart3 className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="font-semibold text-white mb-2">Real-time Analysis</h3>
            <p className="text-slate-400 text-sm">Instant classification with confidence scores</p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
            onClick={() => window.location.href = '/classifier'}
          >
            <Send className="w-5 h-5" />
            Start Classifying
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 border border-slate-600 text-slate-300 font-semibold rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition"
            onClick={() => window.location.href = '/results'}
          >
            <BarChart3 className="w-5 h-5" />
            View Results
          </motion.button>
        </div>
      </div>
    </div>
  );
}
