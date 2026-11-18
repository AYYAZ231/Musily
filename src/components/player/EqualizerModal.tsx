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
  Headphones,
  Flame,
  Music,
  Mic,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { EQUALIZER_PRESETS } from '../../services/aiAudioService';
import { EqualizerBands } from '../../types';

export const EqualizerModal: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!state.isEqualizerOpen) return null;

  const eq = state.equalizer;
  const bandsList: { key: keyof EqualizerBands; label: string; freq: string; role: string }[] = [
    { key: 'b32', label: '32Hz', freq: '32 Hz', role: 'Sub-Bass' },
    { key: 'b64', label: '64Hz', freq: '64 Hz', role: 'Kick' },
    { key: 'b125', label: '125Hz', freq: '125 Hz', role: 'Bass' },
    { key: 'b250', label: '250Hz', freq: '250 Hz', role: 'Low-Mid' },
    { key: 'b500', label: '500Hz', freq: '500 Hz', role: 'Body' },
    { key: 'b1k', label: '1kHz', freq: '1 kHz', role: 'Vocal' },
    { key: 'b2k', label: '2kHz', freq: '2 kHz', role: 'Clarity' },
    { key: 'b4k', label: '4kHz', freq: '4 kHz', role: 'Presence' },
    { key: 'b8k', label: '8kHz', freq: '8 kHz', role: 'Shimmer' },
    { key: 'b16k', label: '16kHz', freq: '16 kHz', role: 'Air' },
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
    }, 450);
  };

  const quickAiStyles = [
    { label: 'Club & Party Drop', icon: Zap, color: 'text-amber-400', prompt: 'High energy club drop with punchy kick, boosted sub-bass, and crystal highs' },
    { label: 'Audiophile Hi-Res', icon: Headphones, color: 'text-sky-400', prompt: 'Audiophile master reference with balanced acoustic depth and vocal separation' },
    { label: 'Deep Sub Slam', icon: Volume2, color: 'text-emerald-400', prompt: 'Deep 32Hz-64Hz subwoofer bass extension with visceral kick punch' },
    { label: 'Vintage Lo-Fi', icon: Radio, color: 'text-purple-400', prompt: 'Warm analog tape saturation with rolled-off digital highs' },
    { label: 'Vocal Presence', icon: Mic, color: 'text-rose-400', prompt: 'Carve out low mud and elevate crystal upfront vocal presence' },
  ];

  // SVG Spline coordinates calculation for curve visualizer
  const svgWidth = 640;
  const svgHeight = 90;
  const points = bandsList.map((item, index) => {
    const x = (index / (bandsList.length - 1)) * (svgWidth - 40) + 20;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0C0D12] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl flex flex-col transition-all text-zinc-900 dark:text-zinc-100">
        
        {/* =========================================================================
            HEADER: Studio & Master Equalizer Bar
            ========================================================================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/80 sticky top-0 bg-white/95 dark:bg-[#0C0D12]/95 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-emerald-500 dark:text-[#D4FF00] shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-display font-black tracking-tight text-zinc-900 dark:text-white">
                  Acoustic Studio & Master Equalizer
                </h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border transition-colors ${
                    eq.isEnabled
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-[#D4FF00] border-emerald-500/30'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  {eq.isEnabled ? 'ACTIVE' : 'BYPASSED'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
                10-band precision frequency shaping & neural AI acoustic optimization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* EQ On/Off Toggle Button */}
            <button
              onClick={actions.toggleEqualizerEnabled}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-xs ${
                eq.isEnabled
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {eq.isEnabled ? 'EQ On' : 'EQ Bypass'}
            </button>

            {/* Reset to Flat Button */}
            <button
              onClick={actions.resetEqualizer}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 transition-colors"
              title="Reset all 10 bands to 0dB"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={() => actions.toggleEqualizerModal(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Close Equalizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            BODY CONTENT: Console Layout
            ========================================================================= */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* 1. SOUND SIGNATURE PRESETS BAR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sound Signature Presets:</span>
              </span>
              <button
                onClick={actions.resetEqualizer}
                className="sm:hidden text-[11px] text-zinc-400 hover:text-white font-mono flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {Object.entries(EQUALIZER_PRESETS).map(([key, item]) => {
                const isSelected = eq.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => actions.applyEqualizerPreset(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-md scale-[1.02]'
                        : 'bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. DYNAMIC FREQUENCY CURVE VISUALIZER */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-inner relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2 px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Frequency Curve (20Hz - 20kHz)</span>
              </span>
              <span className="text-emerald-400 dark:text-[#D4FF00] font-bold">
                {eq.preset.toUpperCase()} • Preamp: {eq.preamp > 0 ? `+${eq.preamp}` : eq.preamp}dB • Bass: Lv.{eq.bassBoost}
              </span>
            </div>

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-20 sm:h-24 overflow-visible"
            >
              {/* Grid Lines */}
              <line
                x1="0"
                y1={svgHeight / 2}
                x2={svgWidth}
                y2={svgHeight / 2}
                stroke="#3f3f46"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1={svgHeight * 0.15}
                x2={svgWidth}
                y2={svgHeight * 0.15}
                stroke="#27272a"
                strokeDasharray="2 4"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1={svgHeight * 0.85}
                x2={svgWidth}
                y2={svgHeight * 0.85}
                stroke="#27272a"
                strokeDasharray="2 4"
                strokeWidth="1"
              />

              {/* Gradient Area under curve */}
              <defs>
                <linearGradient id="eqGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path
                d={`${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`}
                fill="url(#eqGlowGradient)"
              />

              {/* Curve Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                className="transition-all duration-300"
              />

              {/* Active Frequency Nodes */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#10B981"
                  stroke="#09090B"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              ))}
            </svg>
          </div>

          {/* 3. 10-BAND PRECISION GRAPHIC EQUALIZER FADERS */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5 p-3 sm:p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
            {bandsList.map((item) => {
              const gain = eq.bands[item.key] || 0;
              return (
                <div
                  key={item.key}
                  className="flex flex-col items-center justify-between h-48 sm:h-52 py-1 select-none"
                >
                  {/* Gain dB value badge */}
                  <button
                    onClick={() => handleBandChange(item.key, 0)}
                    title="Click to reset band to 0dB"
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded cursor-pointer transition-all ${
                      gain > 0
                        ? 'text-emerald-500 font-bold bg-emerald-500/10'
                        : gain < 0
                        ? 'text-amber-500 font-bold bg-amber-500/10'
                        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {gain > 0 ? `+${gain}` : gain}dB
                  </button>

                  {/* Vertical Fader Track */}
                  <div className="flex-1 flex items-center justify-center my-1 relative w-full">
                    {/* 0dB Notch Line */}
                    <div className="absolute w-4 border-t border-zinc-300 dark:border-zinc-700 pointer-events-none" />

                    <input
                      type="range"
                      min={-12}
                      max={12}
                      step={1}
                      value={gain}
                      onChange={(e) => handleBandChange(item.key, parseInt(e.target.value, 10))}
                      className="h-28 sm:h-32 -rotate-90 origin-center cursor-pointer w-28 sm:w-32 accent-emerald-500"
                    />
                  </div>

                  {/* Frequency Label & Role */}
                  <div className="text-center mt-1">
                    <p className="text-xs font-mono font-bold text-zinc-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider truncate max-w-[54px]">
                      {item.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. MASTER ACOUSTIC DIALS (Preamp, Bass Punch, 3D Spatial Audio) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Preamp Volume */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white">
                  Pre-Amp Gain
                </span>
                <span className="text-xs font-mono font-bold text-emerald-500 dark:text-[#D4FF00]">
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
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1.5">
                <span>-12dB</span>
                <span onClick={() => actions.setEqualizerPreamp(0)} className="cursor-pointer hover:underline">0dB (Flat)</span>
                <span>+12dB</span>
              </div>
            </div>

            {/* Bass Slam / Punch */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
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
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1.5">
                <span>Clean</span>
                <span>Punchy</span>
                <span>Subwoofer</span>
              </div>
            </div>

            {/* 3D Spatial Audio */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-sky-400" />
                  Spatial Soundstage
                </span>
                <span className="text-[10px] font-mono uppercase font-bold text-sky-400">
                  {eq.spatialAudio}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['off', 'studio', 'concert', 'binaural'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => actions.setEqualizerSpatial(mode)}
                    className={`py-1 text-[11px] rounded-lg capitalize font-bold border transition-all ${
                      eq.spatialAudio === mode
                        ? 'bg-sky-500/15 text-sky-400 border-sky-500/40 shadow-xs'
                        : 'bg-white dark:bg-zinc-800/80 text-zinc-500 border-zinc-200 dark:border-zinc-700/80 hover:border-zinc-400'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. AI ACOUSTIC CO-PILOT PROMPT BAR */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/[0.07] via-zinc-900/[0.02] to-teal-500/[0.07] border border-emerald-500/25 dark:border-emerald-500/35 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500 dark:text-[#D4FF00]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  AI Acoustic Co-Pilot
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                  Neural Engine
                </span>
              </div>

              {/* Auto-Master Toggle */}
              <button
                onClick={actions.toggleAIAudioOptimization}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border shrink-0 flex items-center gap-1.5 ${
                  eq.aiAutoOptimize
                    ? 'bg-emerald-500 text-white dark:bg-[#D4FF00] dark:text-black border-transparent shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Master: {eq.aiAutoOptimize ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Natural Language Prompt Input */}
            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center">
                <Wand2 className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={aiPromptInput}
                  onChange={(e) => setAiPromptInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyAiPrompt(aiPromptInput)}
                  placeholder="Describe your sound (e.g. punchy club kicks with airy vocal lift)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 font-medium transition-colors"
                />
              </div>

              <button
                disabled={isAiGenerating || !aiPromptInput.trim()}
                onClick={() => handleApplyAiPrompt(aiPromptInput)}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95 shadow-sm shrink-0"
              >
                {isAiGenerating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                    <span>Tuning...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-emerald-500 dark:text-black" />
                    <span>Magic Tune</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestion Pills with Lucide SVG Icons (No Emojis) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold mr-1 shrink-0">
                Quick Vibes:
              </span>
              {quickAiStyles.map((style, idx) => {
                const IconComponent = style.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setAiPromptInput(style.prompt);
                      handleApplyAiPrompt(style.prompt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <IconComponent className={`w-3 h-3 ${style.color}`} />
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Diagnostic Feedback Pill */}
            {(feedbackMsg || eq.aiLastInsight) && (
              <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2 min-w-0">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {feedbackMsg || eq.aiLastInsight}
                  </span>
                </div>
                <button
                  onClick={actions.resetEqualizer}
                  className="text-[11px] font-mono text-zinc-400 hover:text-white underline shrink-0"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            FOOTER: Target Output & Apply Done Button
            ========================================================================= */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 rounded-b-3xl">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <Disc3 className={`w-4 h-4 text-emerald-500 ${state.isPlaying ? 'animate-spin' : ''}`} />
            <span>Target: {state.currentTrack?.title || 'System Output'}</span>
          </div>

          <button
            onClick={() => actions.toggleEqualizerModal(false)}
            className="px-5 py-2 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
          >
            Apply & Done
          </button>
        </div>
      </div>
    </div>
  );
};
