import React, { useState } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  Zap,
  RotateCcw,
  Volume2,
  Disc3,
  Check,
  Wand2,
  Radio,
  Headphones
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { EQUALIZER_PRESETS } from '../../services/aiAudioService';
import { EqualizerBands } from '../../types';

export const EqualizerModal: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [activeTab, setActiveTab] = useState<'eq' | 'ai'>('eq');
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!state.isEqualizerOpen) return null;

  const eq = state.equalizer;
  const bandsList: { key: keyof EqualizerBands; label: string; freq: string; role: string }[] = [
    { key: 'b32', label: '32Hz', freq: '32 Hz', role: 'Sub-Bass' },
    { key: 'b64', label: '64Hz', freq: '64 Hz', role: 'Kick Punch' },
    { key: 'b125', label: '125Hz', freq: '125 Hz', role: 'Bassline' },
    { key: 'b250', label: '250Hz', freq: '250 Hz', role: 'Low-Mid' },
    { key: 'b500', label: '500Hz', freq: '500 Hz', role: 'Body' },
    { key: 'b1k', label: '1kHz', freq: '1 kHz', role: 'Lead Vocal' },
    { key: 'b2k', label: '2kHz', freq: '2 kHz', role: 'Clarity' },
    { key: 'b4k', label: '4kHz', freq: '4 kHz', role: 'Attack' },
    { key: 'b8k', label: '8kHz', freq: '8 kHz', role: 'Cymbals' },
    { key: 'b16k', label: '16kHz', freq: '16 kHz', role: 'Air & Brilliance' },
  ];

  const handleBandChange = (key: keyof EqualizerBands, value: number) => {
    actions.setEqualizerBands({ [key]: value });
  };

  const handleApplyAiPrompt = (promptText: string) => {
    if (!promptText.trim()) return;
    setIsAiGenerating(true);
    setFeedbackMsg(null);

    setTimeout(() => {
      const res = actions.applyAIAudioPrompt(promptText);
      setIsAiGenerating(false);
      setFeedbackMsg(res.insight);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }, 600);
  };

  const aiSuggestions = [
    '⚡ High Energy Club Drop with punchy kick & sizzle',
    '🎧 Audiophile Studio Master Clarity & vocal separation',
    '🚗 Deep Subwoofer Basshead car slam',
    '📼 Vintage Analog Lo-Fi Tape Saturation',
    '🎤 Intimate Acoustic & Crisp Vocals',
    '🏟️ Stadium Arena Live 3D Concert Reverb'
  ];

  // SVG Spline coordinates calculation for curve visualizer
  const svgWidth = 600;
  const svgHeight = 90;
  const points = bandsList.map((item, index) => {
    const x = (index / (bandsList.length - 1)) * (svgWidth - 40) + 20;
    // -12dB is at bottom (height - 10), +12dB is at top (10), 0dB is at middle (height/2)
    const gain = eq.bands[item.key] || 0;
    const y = (svgHeight / 2) - (gain / 12) * (svgHeight / 2 - 12);
    return { x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cX = (prev.x + p.x) / 2;
    return `${acc} C ${cX} ${prev.y}, ${cX} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0E0F14] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/95 dark:bg-[#0E0F14]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-900 dark:text-[#D4FF00] shadow-sm">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display tracking-tight text-zinc-900 dark:text-white">
                  Acoustic Studio & Master Equalizer
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#D4FF00]/15 dark:text-[#D4FF00] font-bold border border-emerald-300 dark:border-[#D4FF00]/30">
                  {eq.isEnabled ? 'ACTIVE' : 'BYPASSED'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                10-band precision frequency shaping & neural AI acoustic optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* EQ Master Toggle Switch */}
            <button
              onClick={actions.toggleEqualizerEnabled}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                eq.isEnabled
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent font-bold'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-zinc-700'
              }`}
            >
              {eq.isEnabled ? 'EQ On' : 'EQ Bypass'}
            </button>

            {/* Close Button */}
            <button
              onClick={() => actions.toggleEqualizerModal(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/30">
          <button
            onClick={() => setActiveTab('eq')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'eq'
                ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-500 dark:text-[#D4FF00]" />
            <span>10-Band Graphic EQ</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-lime-500 text-white dark:text-black shadow-md'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Acoustic Co-Pilot</span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-black/20 font-mono">
              Auto
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* TAB 1: 10-Band Graphic Equalizer */}
          {activeTab === 'eq' && (
            <div className="space-y-6">
              {/* Presets Bar */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Sound Signature Presets
                  </span>
                  <button
                    onClick={actions.resetEqualizer}
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Flat
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(EQUALIZER_PRESETS).map(([key, item]) => {
                    const isSelected = eq.preset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => actions.applyEqualizerPreset(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-emerald-500/15 text-emerald-700 dark:bg-[#D4FF00]/15 dark:text-[#D4FF00] border-emerald-500/40 dark:border-[#D4FF00]/40 font-bold shadow-sm'
                            : 'bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                        }`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Frequency Curve Visualizer */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1 px-1">
                  <span>Frequency Response Curve (20Hz - 20kHz)</span>
                  <span className="text-[#D4FF00]">
                    {eq.preset.toUpperCase()} • Preamp: {eq.preamp > 0 ? `+${eq.preamp}` : eq.preamp}dB
                  </span>
                </div>
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-20 overflow-visible"
                >
                  {/* Grid lines */}
                  <line
                    x1="0"
                    y1={svgHeight / 2}
                    x2={svgWidth}
                    y2={svgHeight / 2}
                    stroke="#27272A"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1={svgHeight * 0.15}
                    x2={svgWidth}
                    y2={svgHeight * 0.15}
                    stroke="#1E1E24"
                    strokeDasharray="2 4"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1={svgHeight * 0.85}
                    x2={svgWidth}
                    y2={svgHeight * 0.85}
                    stroke="#1E1E24"
                    strokeDasharray="2 4"
                    strokeWidth="1"
                  />

                  {/* Gradient Area under curve */}
                  <defs>
                    <linearGradient id="eqGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#D4FF00" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <path
                    d={`${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`}
                    fill="url(#eqGradient)"
                  />

                  {/* Curve Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />

                  {/* Nodes */}
                  {points.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="#D4FF00"
                      stroke="#09090B"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </div>

              {/* 10 Vertical Sliders Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                {bandsList.map((item) => {
                  const gain = eq.bands[item.key] || 0;
                  return (
                    <div
                      key={item.key}
                      className="flex flex-col items-center justify-between h-52 sm:h-56 py-1 select-none"
                    >
                      {/* Gain dB value badge */}
                      <span
                        onClick={() => handleBandChange(item.key, 0)}
                        title="Click to reset to 0dB"
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          gain > 0
                            ? 'text-emerald-600 dark:text-[#D4FF00] font-bold bg-emerald-500/10 dark:bg-[#D4FF00]/10'
                            : gain < 0
                            ? 'text-amber-500 font-bold bg-amber-500/10'
                            : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {gain > 0 ? `+${gain}` : gain}dB
                      </span>

                      {/* Slider Input */}
                      <div className="flex-1 flex items-center justify-center my-2 relative">
                        <input
                          type="range"
                          min={-12}
                          max={12}
                          step={1}
                          value={gain}
                          onChange={(e) => handleBandChange(item.key, parseInt(e.target.value, 10))}
                          className="h-32 sm:h-36 -rotate-90 origin-center cursor-pointer"
                          style={{ width: '130px' }}
                        />
                      </div>

                      {/* Frequency & Sub-Label */}
                      <div className="text-center mt-1">
                        <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                          {item.label}
                        </p>
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate max-w-[50px]">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Master Controls: Pre-Amp, Bass Punch, 3D Spatial Audio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Preamp Volume */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Pre-Amp Gain
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#D4FF00]">
                      {eq.preamp > 0 ? `+${eq.preamp}` : eq.preamp} dB
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-12}
                    max={12}
                    step={1}
                    value={eq.preamp}
                    onChange={(e) => actions.setEqualizerPreamp(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-400 mt-1">
                    <span>-12dB</span>
                    <span>0dB</span>
                    <span>+12dB</span>
                  </div>
                </div>

                {/* Sub Bass Punch */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Bass Slam / Punch
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-500">
                      Lv. {eq.bassBoost}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={1}
                    value={eq.bassBoost}
                    onChange={(e) => actions.setEqualizerBassBoost(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-zinc-400 mt-1">
                    <span>Clean</span>
                    <span>Punchy</span>
                    <span>Subwoofer</span>
                  </div>
                </div>

                {/* 3D Spatial Audio Surround */}
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-blue-500" />
                      Spatial Soundstage
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-blue-500">
                      {eq.spatialAudio}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['off', 'studio', 'concert', 'binaural'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => actions.setEqualizerSpatial(mode)}
                        className={`py-1 text-[11px] rounded capitalize font-medium border transition-all ${
                          eq.spatialAudio === mode
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/40 font-bold'
                            : 'bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Acoustic Co-Pilot */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              {/* AI Live Auto-Master Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Live AI Adaptive Auto-Master
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Continuously listens to current song genre & harmonically auto-shapes curves.
                    </p>
                  </div>
                </div>

                <button
                  onClick={actions.toggleAIAudioOptimization}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                    eq.aiAutoOptimize
                      ? 'bg-emerald-500 text-white dark:bg-[#D4FF00] dark:text-black font-extrabold'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {eq.aiAutoOptimize ? 'Enabled • Active' : 'Enable AI Master'}
                </button>
              </div>

              {/* Natural Language Prompt Tuning */}
              <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <label className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-emerald-500 dark:text-[#D4FF00]" />
                  Command AI Audio Engine
                </label>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Type what you want to hear in plain English. The AI analyzes psychoacoustic harmonic targets and recalculates the 10-band curve instantly.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyAiPrompt(aiPromptInput)}
                    placeholder="e.g. Heavy sub-bass with punchy kicks, cut the boxy mud, and elevate crystal vocals..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-[#D4FF00] transition-colors"
                  />
                  <button
                    disabled={isAiGenerating || !aiPromptInput.trim()}
                    onClick={() => handleApplyAiPrompt(aiPromptInput)}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-sm shrink-0"
                  >
                    {isAiGenerating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate EQ Curve</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Suggestion Chips */}
                <div className="pt-2">
                  <span className="text-[11px] text-zinc-400 font-medium block mb-2">
                    Quick AI Acoustic Styles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {aiSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setAiPromptInput(sug);
                          handleApplyAiPrompt(sug);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 hover:border-emerald-500 dark:hover:border-[#D4FF00] text-[11px] text-zinc-700 dark:text-zinc-300 transition-all text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Diagnostic Insight Box */}
              {(feedbackMsg || eq.aiLastInsight) && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3 animate-fade-in">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">
                      AI Acoustic Engine Diagnostics:
                    </p>
                    <p className="leading-relaxed opacity-90">
                      {feedbackMsg || eq.aiLastInsight}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Disc3 className={`w-4 h-4 ${state.isPlaying ? 'animate-spin' : ''}`} />
            <span>Target: {state.currentTrack?.title || 'System Output'}</span>
          </div>

          <button
            onClick={() => actions.toggleEqualizerModal(false)}
            className="px-4 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-lg transition-all"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
