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
  Music2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { BrandLogo } from '../common/BrandLogo';

export const AuthModal: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [spotifyUsername, setSpotifyUsername] = useState('');
  const [spotifyPassword, setSpotifyPassword] = useState('');
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [youtubePassword, setYoutubePassword] = useState('');

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, do not show the modal
  if (state.isAuthenticated && state.currentUser) {
    return null;
  }

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
    }, 400);
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
        spotifyUsername,
        spotifyPassword,
        youtubeChannel,
        youtubePassword
      });
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
      }
    }, 500);
  };

  const handleFillDemo = () => {
    setLoginIdentifier('demo@musily.app');
    setLoginPassword('password123');
    setErrorMsg(null);
    setIsNotFound(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      {/* Background ambient decorative light */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/15 dark:bg-[#D4FF00]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0E0F14] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <BrandLogo size="lg" />
          <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-zinc-900 dark:text-white pt-2">
            {mode === 'login' ? 'Welcome Back to Musily' : 'Create Your Musily Account'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            {mode === 'login'
              ? 'Log in once to access your personalized drops, 10-band equalizer, and party aux.'
              : 'Connect your Spotify and YouTube accounts during registration to curate your personal feed.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 mb-6">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
              setIsNotFound(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setIsNotFound(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            Register Account & Connect Streaming
          </button>
        </div>

        {/* Feedback / Error Notice */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-400 text-xs mb-5 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {isNotFound && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setRegEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                    setRegName(!loginIdentifier.includes('@') ? loginIdentifier : '');
                    setErrorMsg(null);
                    setIsNotFound(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-800 dark:text-red-300 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Click here to Register Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            MODE 1: LOGIN FORM
            ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email or Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="demo@musily.app or Demo DJ"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-[#D4FF00] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-[#D4FF00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !loginIdentifier.trim() || !loginPassword}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 dark:from-[#D4FF00] dark:to-[#B6EB00] text-black font-extrabold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Log In to Musily</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* 1-Click Demo Shortcut */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Auto-Fill Demo Credentials (demo@musily.app)</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            MODE 2: REGISTER FORM WITH STREAMING INTEGRATION CREDENTIALS
            ========================================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Step 1: Account Essentials */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-[#D4FF00] uppercase tracking-wider block">
                Step 1 · User Profile
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Alex Walker"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-[#D4FF00]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-[#D4FF00]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-emerald-500 dark:focus:border-[#D4FF00]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Connect Streaming Accounts */}
            <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-[#D4FF00] uppercase tracking-wider">
                  Step 2 · Connect Spotify & YouTube Accounts
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Auto-Personalized</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Enter your login IDs for Spotify and YouTube. Musily immediately connects to your accounts to recommend and search songs tailored to your taste.
              </p>

              {/* Spotify Connection Fields */}
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    Spotify Login Integration
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={spotifyUsername}
                    onChange={(e) => setSpotifyUsername(e.target.value)}
                    placeholder="Spotify username / ID"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#1DB954]"
                  />
                  <input
                    type="password"
                    value={spotifyPassword}
                    onChange={(e) => setSpotifyPassword(e.target.value)}
                    placeholder="Spotify auth token / pass"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              {/* YouTube Music Connection Fields */}
              <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF0033]" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    YouTube Music Login Integration
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={youtubeChannel}
                    onChange={(e) => setYoutubeChannel(e.target.value)}
                    placeholder="YouTube channel / Google ID"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FF0033]"
                  />
                  <input
                    type="password"
                    value={youtubePassword}
                    onChange={(e) => setYoutubePassword(e.target.value)}
                    placeholder="YouTube auth token / pass"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-[#FF0033]"
                  />
                </div>
              </div>
            </div>

            {/* Register Submit */}
            <button
              type="submit"
              disabled={isLoading || !regName.trim() || !regEmail.trim() || !regPassword}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 dark:from-[#D4FF00] dark:to-[#B6EB00] text-black font-extrabold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Connecting Accounts & Registering...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Register & Connect Accounts</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
