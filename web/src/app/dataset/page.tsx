'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface Threat {
  id: string;
  threat_text: string;
  diagnosis: string;
  solution: string;
  threat_type: string;
  Label: string;
}

export default function DatasetPage() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/dataset.csv');
        const text = await response.text();
        const lines = text.split('\n').slice(1);
        const parsed: Threat[] = [];

        for (const line of lines) {
          if (!line.trim()) continue;
          const parts = line.split(',');
          if (parts.length >= 6) {
            parsed.push({
              id: parts[0] || Math.random().toString(),
              threat_text: parts[1] || '',
              diagnosis: parts[2] || '',
              solution: parts[3] || '',
              threat_type: parts[4] || '',
              Label: parts[5]?.trim() || '',
            });
          }
        }
        setThreats(parsed);
      } catch (error) {
        console.error('Failed to load dataset:', error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const threatTypes = useMemo(() => {
    const types = new Set(threats.map(t => t.threat_type).filter(Boolean));
    return Array.from(types).sort();
  }, [threats]);

  const filteredThreats = useMemo(() => {
    return threats.filter(threat => {
      const matchesSearch = threat.threat_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           threat.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !selectedType || threat.threat_type === selectedType;
      const matchesLabel = !selectedLabel || threat.Label === selectedLabel;
      return matchesSearch && matchesType && matchesLabel;
    });
  }, [threats, searchTerm, selectedType, selectedLabel]);

  const paginatedThreats = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredThreats.slice(start, start + itemsPerPage);
  }, [filteredThreats, currentPage]);

  const totalPages = Math.ceil(filteredThreats.length / itemsPerPage);

  const stats = useMemo(() => {
    return {
      total: threats.length,
      threats: threats.filter(t => t.Label === 'threat').length,
      safe: threats.filter(t => t.Label === 'safe').length,
    };
  }, [threats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading dataset...</div>
      </div>
    );
  }

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
              <Link href="/analytics" className="text-slate-300 hover:text-cyan-400 transition font-medium">
                Analytics
              </Link>
              <Link href="/dataset" className="text-cyan-400 font-medium border-b-2 border-cyan-400">
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
            <h1 className="text-4xl font-bold text-white mb-2">Dataset Explorer</h1>
            <p className="text-slate-400 mb-8">
              Browse and analyze {stats.total} cybersecurity threats and safe samples
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">Total Samples</div>
                <div className="text-3xl font-bold text-cyan-400">{stats.total}</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">Threats</div>
                <div className="text-3xl font-bold text-red-500">{stats.threats}</div>
              </motion.div>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm"
              >
                <div className="text-slate-400 text-sm font-semibold mb-2">Safe</div>
                <div className="text-3xl font-bold text-green-500">{stats.safe}</div>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm mb-8">
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-slate-400 text-sm font-semibold mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search threats..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-semibold mb-2">Threat Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    >
                      <option value="">All Types</option>
                      {threatTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-semibold mb-2">Classification</label>
                    <select
                      value={selectedLabel}
                      onChange={(e) => {
                        setSelectedLabel(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    >
                      <option value="">All</option>
                      <option value="threat">Threats Only</option>
                      <option value="safe">Safe Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-slate-400 text-sm mb-4">
              Showing {paginatedThreats.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredThreats.length)} of {filteredThreats.length} results
            </div>

            {/* Threat List */}
            <div className="space-y-4 mb-8">
              {paginatedThreats.map((threat, i) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-500/50 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        threat.Label === 'threat'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                          : 'bg-green-500/20 text-green-400 border border-green-500/50'
                      }`}>
                        {threat.Label === 'threat' ? '🚨 Threat' : '✓ Safe'}
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
                        {threat.threat_type || 'unknown'}
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs">ID: {threat.id}</span>
                  </div>

                  <p className="text-slate-200 mb-3 line-clamp-2">
                    {threat.threat_text}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 font-semibold">Diagnosis:</span>
                      <p className="text-slate-400 line-clamp-2">{threat.diagnosis}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Solution:</span>
                      <p className="text-slate-400 line-clamp-2">{threat.solution}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </motion.button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        currentPage === page
                          ? 'bg-cyan-500 text-white'
                          : 'border border-slate-600 text-slate-300 hover:border-cyan-500'
                      }`}
                    >
                      {page}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
