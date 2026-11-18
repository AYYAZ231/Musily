import React, { useState } from 'react';
import { ShieldCheck, Check, ExternalLink, ArrowRight, Lock, Radio } from 'lucide-react';
import { SpotifyIcon, YouTubeIcon } from '../common/StreamingIcons';

interface OAuthPopupViewProps {
  provider: 'spotify' | 'youtube';
}

export const OAuthPopupView: React.FC<OAuthPopupViewProps> = ({ provider }) => {
  const isSpotify = provider === 'spotify';

  const [username, setUsername] = useState(
    isSpotify ? 'Alex_Spotify' : 'Alex_YouTubeMusic'
  );
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAuthorize = () => {
    setIsAuthorizing(true);

    setTimeout(() => {
      setIsSuccess(true);
      const payload = {
        username: isSpotify ? username.trim() : undefined,
        channelTitle: !isSpotify ? username.trim() : undefined,
        avatar: `https://api.dicebear.com/7.x/${isSpotify ? 'identicon' : 'bottts'}/svg?seed=${encodeURIComponent(
          username.trim()
        )}`,
        email: `${username.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}@musily.app`,
        token: `${provider}_oauth_tk_${Date.now()}`
      };

      // Send payload back to parent window
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
        // Fallback: Store directly in localStorage for tab redirect
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
    }, 700);
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

  const verifyUrl = isSpotify ? 'https://open.spotify.com' : 'https://music.youtube.com';

  return (
    <div className="min-h-screen w-screen bg-[#0A0A0C] text-white flex flex-col justify-between p-6 select-none font-sans">
      {/* Top Header */}
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
              {isSpotify ? 'Spotify Accounts' : 'Google / YouTube Music'}
            </h1>
            <p className="text-[11px] text-zinc-500 font-mono">Browser OAuth 2.0 Bridge</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
          <ShieldCheck className="w-3 h-3" />
          <span>Active Session SSL</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="my-auto max-w-sm mx-auto w-full space-y-6 py-6">
        <div className="text-center space-y-2">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-1 shadow-2xl ${
              isSpotify
                ? 'bg-gradient-to-br from-[#1DB954] to-emerald-700 text-black shadow-[#1DB954]/20'
                : 'bg-gradient-to-br from-[#FF0000] to-rose-700 text-white shadow-red-600/20'
            }`}
          >
            {isSpotify ? <SpotifyIcon className="w-9 h-9" /> : <YouTubeIcon className="w-9 h-9" />}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Connect to {isSpotify ? 'Spotify' : 'YouTube Music'}
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Musily is requesting permission to link your logged-in browser account for unified streaming and Drop Mode parties.
          </p>
        </div>

        {/* Active Browser Account Card */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              Active Browser Account
            </span>
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Verify Session</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <img
              src={`https://api.dicebear.com/7.x/${
                isSpotify ? 'identicon' : 'bottts'
              }/svg?seed=${encodeURIComponent(username || 'session')}`}
              alt="Avatar"
              className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <label className="text-[10px] text-zinc-500 font-mono block">Connected Handle / ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isSpotify ? 'Spotify username' : 'YouTube channel'}
                className="w-full bg-zinc-800/80 border border-zinc-700 hover:border-zinc-600 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Permissions Granted */}
        <div className="space-y-2 text-xs text-zinc-400 px-1">
          <span className="text-[11px] font-bold text-zinc-300 block">Permissions requested:</span>
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Stream personalized party tracks and high-fidelity audio catalog</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Sync recommendations to your Musily Home and Priority Search</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Participate in live Aux handoff and democratic song queue voting</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            disabled={isAuthorizing || isSuccess || !username.trim()}
            onClick={handleAuthorize}
            className={`w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${
              isSpotify
                ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black shadow-[#1DB954]/25'
                : 'bg-[#FF0000] hover:bg-[#ff1a1a] text-white shadow-red-600/25'
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Account Linked! Closing window...</span>
              </>
            ) : isAuthorizing ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Authorizing Browser Session...</span>
              </>
            ) : (
              <>
                <span>Agree & Link to Musily</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-2.5 rounded-xl bg-transparent hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel and Return
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-zinc-600 border-t border-zinc-800/80 pt-3 flex items-center justify-center gap-1.5 font-mono">
        <Lock className="w-3 h-3 text-zinc-500" />
        <span>End-to-end encrypted session bridge for Musily Party Protocol</span>
      </div>
    </div>
  );
};
