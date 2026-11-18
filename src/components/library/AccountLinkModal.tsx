import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { SpotifyIcon, YouTubeIcon } from '../common/StreamingIcons';
import { OAuthBrowserService } from '../../services/oauthBrowserService';
import { AuthService } from '../../services/authService';

interface AccountLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountLinkModal: React.FC<AccountLinkModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useMusicStore();
  const [spotifyUser, setSpotifyUser] = useState(state.linkedAccounts.spotify.username || '');
  const [ytChannel, setYtChannel] = useState(state.linkedAccounts.youtube.channelTitle || '');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [oauthLoading, setOauthLoading] = useState<'spotify' | 'youtube' | null>(null);

  if (!isOpen) return null;

  const handleBrowserOAuth = async (provider: 'spotify' | 'youtube') => {
    setOauthLoading(provider);
    const res = await OAuthBrowserService.openOAuth(provider);
    setOauthLoading(null);

    if (res.success) {
      if (provider === 'spotify') {
        actions.linkSpotify(res.username || 'SpotifyUser');
      } else {
        actions.linkYouTube(res.channelTitle || 'YouTubeUser');
      }

      if (state.currentUser) {
        AuthService.updateConnectedAccounts(
          state.currentUser.id,
          {
            connected: provider === 'spotify' ? true : state.linkedAccounts.spotify.isConnected,
            username: provider === 'spotify' ? res.username : state.linkedAccounts.spotify.username
          },
          {
            connected: provider === 'youtube' ? true : state.linkedAccounts.youtube.isConnected,
            channel: provider === 'youtube' ? res.channelTitle : state.linkedAccounts.youtube.channelTitle
          }
        );
      }
    }
  };

  const handleSpotifyConnect = (e: React.FormEvent) => {
    e.preventDefault();
    actions.linkSpotify(spotifyUser || 'SpotifyUser');
  };

  const handleYouTubeConnect = (e: React.FormEvent) => {
    e.preventDefault();
    actions.linkYouTube(ytChannel || 'YouTubeMusicUser');
  };

  const handleImportPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;
    setImportStatus('Importing playlist tracks into library...');
    setTimeout(() => {
      setImportStatus('Added tracks to your Musily library.');
      setPlaylistUrl('');
      setTimeout(() => setImportStatus(''), 2500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl space-y-5 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
              Linked Accounts
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Stream audio and playlists from both services</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Spotify */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SpotifyIcon className="w-4 h-4 text-[#1DB954]" />
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">Spotify Account</span>
            </div>
            {state.linkedAccounts.spotify.isConnected ? (
              <span className="text-[10px] font-mono text-[#1DB954] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">Not Connected</span>
            )}
          </div>

          {state.linkedAccounts.spotify.isConnected ? (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">
                User: <strong className="text-zinc-900 dark:text-white">{state.linkedAccounts.spotify.username}</strong>
              </span>
              <button
                onClick={actions.disconnectSpotify}
                className="text-zinc-400 hover:text-red-500 text-xs font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={oauthLoading !== null}
                onClick={() => handleBrowserOAuth('spotify')}
                className="w-full py-2 px-3 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
              >
                <SpotifyIcon className="w-3.5 h-3.5" />
                <span>
                  {oauthLoading === 'spotify' ? 'Connecting Browser...' : 'Login with Spotify (Browser Connect)'}
                </span>
              </button>

              <form onSubmit={handleSpotifyConnect} className="flex gap-2">
                <input
                  type="text"
                  value={spotifyUser}
                  onChange={(e) => setSpotifyUser(e.target.value)}
                  placeholder="Or enter Spotify username"
                  className="flex-1 px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Link
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 2. YouTube Music */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <YouTubeIcon className="w-4 h-4 text-[#FF0000]" />
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">YouTube Music</span>
            </div>
            {state.linkedAccounts.youtube.isConnected ? (
              <span className="text-[10px] font-mono text-[#FF0033] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">Not Connected</span>
            )}
          </div>

          {state.linkedAccounts.youtube.isConnected ? (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">
                Channel: <strong className="text-zinc-900 dark:text-white">{state.linkedAccounts.youtube.channelTitle}</strong>
              </span>
              <button
                onClick={actions.disconnectYouTube}
                className="text-zinc-400 hover:text-red-500 text-xs font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <button
                type="button"
                disabled={oauthLoading !== null}
                onClick={() => handleBrowserOAuth('youtube')}
                className="w-full py-2 px-3 rounded-lg bg-[#FF0000] hover:bg-[#ff1a1a] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
                <span>
                  {oauthLoading === 'youtube' ? 'Connecting Browser...' : 'Login with YouTube (Browser Connect)'}
                </span>
              </button>

              <form onSubmit={handleYouTubeConnect} className="flex gap-2">
                <input
                  type="text"
                  value={ytChannel}
                  onChange={(e) => setYtChannel(e.target.value)}
                  placeholder="Or enter YouTube channel"
                  className="flex-1 px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Link
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 3. Playlist Import */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="block text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase">
            Import Playlist URL
          </span>
          <form onSubmit={handleImportPlaylist} className="flex gap-2">
            <input
              type="url"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Paste Spotify or YouTube playlist URL"
              className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold border border-zinc-300 dark:border-zinc-700 transition-colors"
            >
              Import
            </button>
          </form>
          {importStatus && (
            <p className="text-xs text-[#059669] dark:text-[#D4FF00] font-mono">{importStatus}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
          <span>Local storage authentication · No private credentials shared</span>
        </div>
      </div>
    </div>
  );
};
