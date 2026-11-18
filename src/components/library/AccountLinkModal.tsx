import React, { useState } from 'react';
import { X, CheckCircle2, LogOut, ShieldCheck, Music2 } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-md rounded-2xl bg-ink-950 border border-ink-800 p-6 shadow-elevated space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-bold text-white uppercase tracking-tight">
              Linked Accounts
            </h3>
            <p className="text-xs text-zinc-400">Stream audio and playlists from both services</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Spotify */}
        <div className="p-3.5 rounded-xl bg-ink-900 border border-ink-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-spotify" />
              <span className="text-xs font-semibold text-white">Spotify Account</span>
            </div>
            {state.linkedAccounts.spotify.isConnected ? (
              <span className="text-[10px] font-mono text-spotify font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            ) : (
              <span className="text-[10px] text-zinc-500 font-mono">Not Connected</span>
            )}
          </div>

          {state.linkedAccounts.spotify.isConnected ? (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-zinc-400">
                User: <strong className="text-white">{state.linkedAccounts.spotify.username}</strong>
              </span>
              <button
                onClick={actions.disconnectSpotify}
                className="text-zinc-500 hover:text-red-400 text-xs font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <form onSubmit={handleSpotifyConnect} className="flex gap-2 pt-1">
              <input
                type="text"
                value={spotifyUser}
                onChange={(e) => setSpotifyUser(e.target.value)}
                placeholder="Spotify username"
                className="flex-1 px-3 py-1.5 rounded-lg bg-ink-850 border border-ink-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-spotify text-black text-xs font-bold transition-all"
              >
                Link
              </button>
            </form>
          )}
        </div>

        {/* 2. YouTube Music */}
        <div className="p-3.5 rounded-xl bg-ink-900 border border-ink-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-youtube" />
              <span className="text-xs font-semibold text-white">YouTube Music</span>
            </div>
            {state.linkedAccounts.youtube.isConnected ? (
              <span className="text-[10px] font-mono text-youtube font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            ) : (
              <span className="text-[10px] text-zinc-500 font-mono">Not Connected</span>
            )}
          </div>

          {state.linkedAccounts.youtube.isConnected ? (
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-zinc-400">
                Channel: <strong className="text-white">{state.linkedAccounts.youtube.channelTitle}</strong>
              </span>
              <button
                onClick={actions.disconnectYouTube}
                className="text-zinc-500 hover:text-red-400 text-xs font-medium"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <form onSubmit={handleYouTubeConnect} className="flex gap-2 pt-1">
              <input
                type="text"
                value={ytChannel}
                onChange={(e) => setYtChannel(e.target.value)}
                placeholder="YouTube channel or alias"
                className="flex-1 px-3 py-1.5 rounded-lg bg-ink-850 border border-ink-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-white text-black text-xs font-bold transition-all"
              >
                Link
              </button>
            </form>
          )}
        </div>

        {/* 3. Playlist Import */}
        <div className="p-3.5 rounded-xl bg-ink-900 border border-ink-800 space-y-2">
          <span className="block text-[11px] font-mono text-zinc-400 uppercase">
            Import Playlist URL
          </span>
          <form onSubmit={handleImportPlaylist} className="flex gap-2">
            <input
              type="url"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Paste Spotify or YouTube playlist URL"
              className="flex-1 px-3 py-1.5 rounded-lg bg-ink-850 border border-ink-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-white text-xs font-semibold border border-ink-700 transition-colors"
            >
              Import
            </button>
          </form>
          {importStatus && (
            <p className="text-xs text-lime font-mono">{importStatus}</p>
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
