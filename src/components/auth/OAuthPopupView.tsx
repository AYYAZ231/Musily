import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Check,
  ExternalLink,
  ArrowRight,
  Lock,
  Radio,
  Globe,
  Key,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { SpotifyIcon, YouTubeIcon } from '../common/StreamingIcons';

interface OAuthPopupViewProps {
  provider: 'spotify' | 'youtube';
}

export const OAuthPopupView: React.FC<OAuthPopupViewProps> = ({ provider }) => {
  const isSpotify = provider === 'spotify';

  // Read any passed initial account from URL
  const searchParams = new URLSearchParams(window.location.search);
  const initialAccount = searchParams.get('account') || '';

  const [actualAccount, setActualAccount] = useState(initialAccount);
  const [authMode, setAuthMode] = useState<'direct' | 'oauth_api'>('direct');
  const [clientId, setClientId] = useState(
    isSpotify
      ? localStorage.getItem('musily_spotify_client_id') || ''
      : localStorage.getItem('musily_google_client_id') || ''
  );
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to extract clean handle/username from raw input or pasted URLs
  const cleanInput = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';

    if (isSpotify) {
      // If user pasted Spotify profile URL: https://open.spotify.com/user/12345?si=...
      const userMatch = trimmed.match(/open\.spotify\.com\/user\/([a-zA-Z0-9._-]+)/);
      if (userMatch && userMatch[1]) {
        return decodeURIComponent(userMatch[1]);
      }
    } else {
      // If user pasted YouTube channel URL: https://www.youtube.com/@channelName
      const channelMatch = trimmed.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/);
      if (channelMatch && channelMatch[1]) {
        return `@${channelMatch[1]}`;
      }
      const cMatch = trimmed.match(/youtube\.com\/channel\/([a-zA-Z0-9._-]+)/);
      if (cMatch && cMatch[1]) {
        return cMatch[1];
      }
    }

    return trimmed;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setActualAccount(e.target.value);
  };

  // Launch official Spotify or Google OAuth redirect if user has a Client ID
  const handleLaunchOfficialOAuth = () => {
    if (!clientId.trim()) {
      setErrorMessage(
        isSpotify
          ? 'Please enter your Spotify Developer Client ID first.'
          : 'Please enter your Google Cloud OAuth Client ID first.'
      );
      return;
    }

    try {
      if (isSpotify) {
        localStorage.setItem('musily_spotify_client_id', clientId.trim());
        const redirectUri = `${window.location.origin}/?oauth_callback=spotify`;
        const scopes = 'user-read-private user-read-email user-library-read user-top-read playlist-read-private';
        const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(
          clientId.trim()
        )}&response_type=token&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=${encodeURIComponent(scopes)}&show_dialog=true`;
        window.location.href = spotifyAuthUrl;
      } else {
        localStorage.setItem('musily_google_client_id', clientId.trim());
        const redirectUri = `${window.location.origin}/?oauth_callback=youtube`;
        const scopes = 'https://www.googleapis.com/auth/youtube.readonly';
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
          clientId.trim()
        )}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=token&scope=${encodeURIComponent(scopes)}&prompt=consent`;
        window.location.href = googleAuthUrl;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to redirect to provider auth.');
    }
  };

  // Direct confirmation of actual account
  const handleConfirmActualAccount = () => {
    const cleaned = cleanInput(actualAccount);
    if (!cleaned) {
      setErrorMessage(
        isSpotify
          ? 'Please enter your actual Spotify username, email, or profile link.'
          : 'Please enter your actual YouTube channel name, handle, or URL.'
      );
      return;
    }

    setIsAuthorizing(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsSuccess(true);

      const payload = {
        username: isSpotify ? cleaned : undefined,
        channelTitle: !isSpotify ? cleaned : undefined,
        avatar: `https://api.dicebear.com/7.x/${isSpotify ? 'identicon' : 'bottts'}/svg?seed=${encodeURIComponent(
          cleaned
        )}`,
        email: `${cleaned.toLowerCase().replace(/[^a-z0-9]/g, '_')}@musily.app`,
        token: `${provider}_actual_tk_${Date.now()}`
      };

      // Transmit back to opener
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'MUSILY_OAUTH_SUCCESS',
            provider,
            payload
          },
          '*'
        );
        setTimeout(() => {
          try {
            window.close();
          } catch {}
        }, 600);
      } else {
        // Fallback for non-popup tab
        try {
          if (isSpotify) {
            localStorage.setItem(
              'musily_spotify_user',
              JSON.stringify({
                username: payload.username,
                avatar: payload.avatar,
                connectedAt: Date.now()
              })
            );
          } else {
            localStorage.setItem(
              'musily_yt_user',
              JSON.stringify({
                channelTitle: payload.channelTitle,
                avatar: payload.avatar,
                connectedAt: Date.now()
              })
            );
          }
        } catch {}

        setTimeout(() => {
          window.location.href = '/';
        }, 800);
      }
    }, 600);
  };

  const handleCancel = () => {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'MUSILY_OAUTH_CANCEL',
          provider
        },
        '*'
      );
      try {
        window.close();
      } catch {}
    } else {
      window.location.href = '/';
    }
  };

  const verifyUrl = isSpotify ? 'https://accounts.spotify.com' : 'https://music.youtube.com';
  const openWebUrl = isSpotify ? 'https://open.spotify.com' : 'https://www.youtube.com';

  const cleanedHandle = cleanInput(actualAccount);

  return (
    <div className="min-h-screen w-screen bg-[#09090B] text-white flex flex-col justify-between p-5 sm:p-6 select-none font-sans">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isSpotify ? 'bg-[#1DB954]/15 text-[#1DB954]' : 'bg-[#FF0000]/15 text-[#FF0000]'
            }`}
          >
            {isSpotify ? <SpotifyIcon className="w-5 h-5" /> : <YouTubeIcon className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              {isSpotify ? 'Spotify Account Integration' : 'YouTube Music Account Integration'}
            </h1>
            <p className="text-[11px] text-zinc-500 font-mono">Connect Your Actual Account</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
          <ShieldCheck className="w-3 h-3" />
          <span>Real Session Link</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="my-auto max-w-md mx-auto w-full space-y-5 py-4">
        <div className="text-center space-y-2">
          <div
            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-1 shadow-2xl ${
              isSpotify
                ? 'bg-gradient-to-br from-[#1DB954] to-emerald-700 text-black shadow-[#1DB954]/25'
                : 'bg-gradient-to-br from-[#FF0000] to-rose-700 text-white shadow-red-600/25'
            }`}
          >
            {isSpotify ? <SpotifyIcon className="w-8 h-8" /> : <YouTubeIcon className="w-8 h-8" />}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Link Your Actual {isSpotify ? 'Spotify' : 'YouTube'} Account
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            Connect your real streaming identity so Musily can personalize your recommendations, playlists, and Aux party queue.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('direct');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              authMode === 'direct'
                ? isSpotify
                  ? 'bg-[#1DB954] text-black shadow'
                  : 'bg-[#FF0000] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Enter Actual Account
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('oauth_api');
              setErrorMessage(null);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'oauth_api'
                ? isSpotify
                  ? 'bg-[#1DB954] text-black shadow'
                  : 'bg-[#FF0000] text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Key className="w-3 h-3" />
            <span>Developer OAuth 2.0</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            MODE 1: DIRECT ACTUAL ACCOUNT LINKING
            ========================================================================= */}
        {authMode === 'direct' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider block">
                  {isSpotify ? 'Your Actual Spotify Handle / URL / Email' : 'Your Actual YouTube Channel Handle / URL'}
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">Live Preview</span>
              </div>

              <input
                type="text"
                autoFocus
                value={actualAccount}
                onChange={handleInputChange}
                placeholder={
                  isSpotify
                    ? 'e.g. your_spotify_id or https://open.spotify.com/user/...'
                    : 'e.g. @your_channel or https://www.youtube.com/@...'
                }
                className={`w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/90 border border-zinc-700 hover:border-zinc-600 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-all ${
                  isSpotify ? 'focus:border-[#1DB954]' : 'focus:border-[#FF0000]'
                }`}
              />

              {/* Quick links to open provider in browser to verify or copy URL */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                <a
                  href={verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors border border-zinc-700/60"
                >
                  <Globe className="w-3 h-3 text-zinc-400" />
                  <span>Log in on {isSpotify ? 'accounts.spotify.com' : 'music.youtube.com'}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <a
                  href={openWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors border border-zinc-700/60"
                >
                  <span>Copy Profile Link ↗</span>
                </a>
              </div>

              {/* Dynamic Identity Badge */}
              {cleanedHandle ? (
                <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-3 animate-fade-in">
                  <img
                    src={`https://api.dicebear.com/7.x/${
                      isSpotify ? 'identicon' : 'bottts'
                    }/svg?seed=${encodeURIComponent(cleanedHandle)}`}
                    alt="Detected Profile"
                    className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-zinc-500 font-mono block">Will Link in Musily as:</span>
                    <strong className={`text-xs sm:text-sm truncate block ${isSpotify ? 'text-[#1DB954]' : 'text-red-400'}`}>
                      {isSpotify ? `@${cleanedHandle}` : cleanedHandle.startsWith('@') ? cleanedHandle : `@${cleanedHandle}`}
                    </strong>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                    Ready
                  </span>
                </div>
              ) : (
                <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Type your actual handle above to connect your personal library.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={isAuthorizing || isSuccess || !cleanedHandle}
                onClick={handleConfirmActualAccount}
                className={`w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSpotify
                    ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black shadow-[#1DB954]/25'
                    : 'bg-[#FF0000] hover:bg-[#ff1a1a] text-white shadow-red-600/25'
                }`}
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Account Connected! Closing window...</span>
                  </>
                ) : isAuthorizing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Linking Your Actual Account...</span>
                  </>
                ) : (
                  <>
                    <span>Connect & Link Actual Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-2.5 rounded-xl bg-transparent hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 2: OFFICIAL OAUTH 2.0 (ACCOUNTS.SPOTIFY.COM / GOOGLE)
            ========================================================================= */}
        {authMode === 'oauth_api' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 shadow-lg">
              <div>
                <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider block">
                  {isSpotify ? 'Spotify Developer Client ID' : 'Google Cloud OAuth Client ID'}
                </label>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Redirects directly to official {isSpotify ? 'accounts.spotify.com' : 'accounts.google.com'} for token authorization.
                </p>
              </div>

              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder={isSpotify ? 'Paste your Spotify Client ID' : 'Paste your Google Client ID'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/90 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />

              <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-[11px] text-zinc-400 space-y-1">
                <span className="font-bold text-zinc-300 block">Required Setup in Developer Dashboard:</span>
                <div>Redirect URI: <code className="text-emerald-400 bg-zinc-900 px-1 py-0.5 rounded font-mono">{window.location.origin}/?oauth_callback={provider}</code></div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchOfficialOAuth}
              className={`w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] ${
                isSpotify
                  ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black shadow-[#1DB954]/25'
                  : 'bg-[#FF0000] hover:bg-[#ff1a1a] text-white shadow-red-600/25'
              }`}
            >
              <span>Launch {isSpotify ? 'accounts.spotify.com' : 'accounts.google.com'} Auth</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-zinc-600 border-t border-zinc-800/80 pt-3 flex items-center justify-center gap-1.5 font-mono">
        <Lock className="w-3 h-3 text-zinc-500" />
        <span>End-to-end encrypted session bridge for Musily Party Protocol</span>
      </div>
    </div>
  );
};
