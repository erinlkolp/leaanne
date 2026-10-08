'use client';

import React, { useState } from 'react';
import { X, Key, ExternalLink, Download, Upload, CheckCircle2, RotateCcw } from 'lucide-react';

interface BnetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetToDefaults: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BnetSettingsModal({
  isOpen,
  onClose,
  onResetToDefaults,
  onExportData,
  onImportData,
}: BnetSettingsModalProps) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [region, setRegion] = useState('us');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      setTestStatus('Please enter both Client ID and Client Secret.');
      return;
    }

    setIsTesting(true);
    setTestStatus('Contacting Blizzard OAuth Token endpoint...');

    try {
      const res = await fetch('/api/blizzard/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          region,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestStatus('✓ Success! Connected and verified Battle.net API credentials.');
      } else {
        setTestStatus(`✗ Error: ${data.error || 'Authentication failed'}`);
      }
    } catch (err: any) {
      setTestStatus(`✗ Network error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121829] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Key className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-white">Battle.net API &amp; Data Sync</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          This dashboard can connect directly to Blizzard&apos;s Official Battle.net REST API to automatically fetch live character gear, raid lockouts, and account-wide collections.
        </p>

        {/* 3-Step Setup Guide */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mb-5 space-y-2 text-xs">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5">
            <span>How to get free API keys in 2 minutes:</span>
            <a
              href="https://develop.battle.net"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-sky-400 hover:underline ml-auto"
            >
              <span>develop.battle.net</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside text-slate-400 space-y-1">
            <li>Log in to <strong className="text-slate-200">develop.battle.net</strong> with your Blizzard account.</li>
            <li>Click <strong className="text-slate-200">API Access</strong> &rarr; <strong className="text-slate-200">Create Client</strong>.</li>
            <li>Set client name to &quot;WoW Companion&quot; and redirect URI to <code className="text-amber-300">http://localhost:3000</code>.</li>
            <li>Copy your <strong className="text-slate-200">Client ID</strong> and <strong className="text-slate-200">Client Secret</strong> below.</li>
          </ol>
        </div>

        {/* API Inputs */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Battle.net Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g., 4f18d... (from develop.battle.net)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Battle.net Client Secret
            </label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="••••••••••••••••••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleTestConnection}
              className="flex-1 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition"
            >
              Test &amp; Save Credentials
            </button>
          </div>

          {testStatus && (
            <div className="text-xs p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/50 text-sky-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{testStatus}</span>
            </div>
          )}
        </div>

        {/* Data Management: Backup & Export */}
        <div className="pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Local Data &amp; Backup
          </h4>
          <p className="text-[11px] text-slate-400 mb-3">
            Your progress, checked boxes, and wishlist are saved in your local browser storage. You can export a backup or restore default demo data at any time.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onExportData}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export JSON Backup</span>
            </button>

            <label className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import JSON Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                if (confirm('Reset all checklist progress and characters back to original sample data?')) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-rose-950/30 hover:bg-rose-950/50 text-rose-300 rounded-lg border border-rose-900/40 transition ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
