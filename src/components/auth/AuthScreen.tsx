import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Radio,
  Zap,
  Sliders,
  ShieldCheck,
  Headphones,
  Music2,
  ChevronRight,
  Disc3
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { BrandLogo } from '../common/BrandLogo';

export const AuthScreen: React.FC = () => {
  const { actions } = useMusicStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Streaming toggles & credentials
  const [enableSpotify, setEnableSpotify] = useState(true);
  const [spotifyUsername, setSpotifyUsername] = useState('');
  const [spotifyPassword, setSpotifyPassword] = useState('');

  const [enableYouTube, setEnableYouTube] = useState(true);
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [youtubePassword, setYoutubePassword] = useState('');

  // Status state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsNotFound(false);
    setIsLoading(true);

    setTimeout(() => {
      const res = actions.login(loginIdentifier, loginPassword);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to log in.');
        if (res.notFound) {
          setIsNotFound(true);
        }
      }
    }, 450);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = actions.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        spotifyUsername: enableSpotify ? spotifyUsername : undefined,
        spotifyPassword: enableSpotify ? spotifyPassword : undefined,
        youtubeChannel: enableYouTube ? youtubeChannel : undefined,
        youtubePassword: enableYouTube ? youtubePassword : undefined
      });
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    }, 550);
  };

  const handleFillDemo = () => {
    setLoginIdentifier('demo@musily.app');
    setLoginPassword('password123');
    setErrorMsg(null);
    setIsNotFound(false);
  };

  const switchToRegister = (prefillEmail?: string) => {
    setMode('register');
    if (prefillEmail && prefillEmail.includes('@')) {
      setRegEmail(prefillEmail);
    }
    setErrorMsg(null);
    setIsNotFound(false);
  };

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#08090D] text-white selection:bg-[#D4FF00] selection:text-black overflow-y-auto lg:overflow-hidden select-none font-sans">
      {/* =========================================================================
          LEFT PANEL: Visual Sonic Stage & Hero Storytelling (55% on Desktop)
          ========================================================================= */}
      <div className="relative w-full lg:w-[54%] p-6 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800/80 bg-gradient-to-br from-[#0A0C13] via-[#090A0F] to-[#050608]">
        {/* Layered Ambient Mesh Orbs */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#D4FF00]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <BrandLogo size="lg" />

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span>NAUX PROTOCOL LIVE</span>
          </div>
        </div>

        {/* Center Hero Experience */}
        <div className="relative z-10 my-8 lg:my-0 space-y-8 max-w-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono font-bold text-emerald-400 tracking-wide uppercase shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>THE ALL-IN-ONE MUSIC AUX CORD</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight leading-[1.04] text-white">
              UNIFY YOUR MUSIC. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-[#D4FF00] bg-clip-text text-transparent">
                ZERO DEAD AIR.
              </span>
            </h1>

            <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
              Log in once to aggregate your <strong>Spotify</strong> and <strong>YouTube Music</strong> libraries into a seamless, high-fidelity player. Start songs straight at the drop, shape your sound with 10-band neural AI EQ, and host live party rooms online for 100% free.
            </p>
          </div>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1 hover:border-white/20 transition-colors">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white">The Drop Mode</h4>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Skips slow intros. Drops right into the hook and chorus.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1 hover:border-white/20 transition-colors">
              <Radio className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white">Live Party Aux</h4>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Free WebRTC P2P sync. Pass the Aux to anyone in the room.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 space-y-1 hover:border-white/20 transition-colors">
              <Sliders className="w-4 h-4 text-[#D4FF00]" />
              <h4 className="text-xs font-bold text-white">AI Acoustic Studio</h4>
              <p className="text-[11px] text-zinc-400 leading-snug">
                10-band master faders and natural language audio tuning.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof Ticker */}
        <div className="relative z-10 flex items-center gap-3 pt-6 lg:pt-0 text-xs text-zinc-400 font-mono">
          <div className="flex -space-x-2">
            <img className="w-7 h-7 rounded-full border-2 border-zinc-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="DJ 1" />
            <img className="w-7 h-7 rounded-full border-2 border-zinc-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="DJ 2" />
            <img className="w-7 h-7 rounded-full border-2 border-zinc-900 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="DJ 3" />
          </div>
          <span>3,420+ listeners partying on the Aux right now</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: Authentication Console (46% on Desktop)
          ========================================================================= */}
      <div className="w-full lg:w-[46%] p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-[#090A0E] relative z-10">
        <div className="max-w-md w-full mx-auto space-y-6">
          {/* Form Header */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
                {mode === 'login' ? 'Sign in to Musily' : 'Create your account'}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold border border-zinc-700">
                100% Free
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              {mode === 'login'
                ? 'Sign in once to sync your music, presets, and connected accounts.'
                : 'Connect your Spotify and YouTube accounts to personalize your music feed.'}
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setIsNotFound(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setIsNotFound(false);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>

          {/* Error Banner with Direct Register Prompt */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-2.5 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {isNotFound && (
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => switchToRegister(loginIdentifier)}
                    className="w-full py-2 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Click here to Register this account in 30 seconds</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =======================================================================
              LOGIN FORM
              ======================================================================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. demo@musily.app or Demo DJ"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4FF00] focus:ring-2 focus:ring-[#D4FF00]/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4FF00] focus:ring-2 focus:ring-[#D4FF00]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginIdentifier.trim() || !loginPassword}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 dark:from-[#D4FF00] dark:to-[#B6EB00] text-black font-extrabold text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 pt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Database...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Musily</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Demo Shortcut */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="w-full py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>One-Click Demo Sign In (demo@musily.app)</span>
                </button>
              </div>
            </form>
          )}

          {/* =======================================================================
              REGISTER FORM WITH SPOTIFY & YOUTUBE STREAMING INTEGRATION
              ======================================================================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* User Identity Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Alex Walker"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4FF00]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex@musily.app"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4FF00]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create your secure password"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4FF00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Streaming Integration Section */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5" />
                    Link Streaming Accounts (Recommended)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Personalized Drops</span>
                </div>

                {/* Spotify Card */}
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  enableSpotify ? 'bg-emerald-500/[0.06] border-emerald-500/30' : 'bg-zinc-900/40 border-zinc-800/80'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
                      <span className="text-xs font-bold text-white">Connect Spotify</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableSpotify}
                      onChange={(e) => setEnableSpotify(e.target.checked)}
                      className="cursor-pointer accent-[#1DB954]"
                    />
                  </div>
                  {enableSpotify && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fade-in">
                      <input
                        type="text"
                        value={spotifyUsername}
                        onChange={(e) => setSpotifyUsername(e.target.value)}
                        placeholder="Spotify Username / ID"
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#1DB954]"
                      />
                      <input
                        type="password"
                        value={spotifyPassword}
                        onChange={(e) => setSpotifyPassword(e.target.value)}
                        placeholder="Spotify Password / Token"
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#1DB954]"
                      />
                    </div>
                  )}
                </div>

                {/* YouTube Music Card */}
                <div className={`p-3.5 rounded-2xl border transition-all ${
                  enableYouTube ? 'bg-red-500/[0.06] border-red-500/30' : 'bg-zinc-900/40 border-zinc-800/80'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF0033]" />
                      <span className="text-xs font-bold text-white">Connect YouTube Music</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableYouTube}
                      onChange={(e) => setEnableYouTube(e.target.checked)}
                      className="cursor-pointer accent-[#FF0033]"
                    />
                  </div>
                  {enableYouTube && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 animate-fade-in">
                      <input
                        type="text"
                        value={youtubeChannel}
                        onChange={(e) => setYoutubeChannel(e.target.value)}
                        placeholder="Channel / Google Email"
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF0033]"
                      />
                      <input
                        type="password"
                        value={youtubePassword}
                        onChange={(e) => setYoutubePassword(e.target.value)}
                        placeholder="YouTube Password / Token"
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF0033]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !regName.trim() || !regEmail.trim() || !regPassword}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 dark:from-[#D4FF00] dark:to-[#B6EB00] text-black font-extrabold text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 pt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Streaming & Registering...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Account & Launch Musily</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="pt-2 text-center text-xs text-zinc-500">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchToRegister()}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setIsNotFound(false);
                  }}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
