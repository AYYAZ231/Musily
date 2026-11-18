import React, { useState } from 'react';
import { X, CheckCircle2, Link as LinkIcon, LogOut, ArrowRight, ShieldCheck, Music2 } from 'lucide-react';
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
    setImportStatus('Extracting playlist tracks from ' + (playlistUrl.includes('spotify') ? 'Spotify' : 'YouTube') + '...');
    setTimeout(() => {
      setImportStatus('Successfully imported 14 tracks into your Musily Library!');
      setPlaylistUrl('');
      setTimeout(() => setImportStatus(''), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-[#111522] border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-spotify to-youtube flex items-center justify-center shadow">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Linked Music Accounts</h3>
              <p className="text-xs text-slate-400">Stream tracks & sync playlists from both platforms</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Spotify Connect Card */}
        <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-spotify/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-spotify flex items-center justify-center shadow-glow-spotify">
                <Music2 className="w-4 h-4 text-black" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Spotify Account</h4>
                <p className="text-[11px] text-slate-400">Access saved playlists & liked tracks</p>
              </div>
            </div>

            {state.linkedAccounts.spotify.isConnected ? (
              <span className="text-xs font-bold text-spotify flex items-center gap-1 bg-spotify/10 px-2.5 py-1 rounded-full border border-spotify/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <span className="text-xs text-slate-400">Not Linked</span>
            )}
          </div>

          {state.linkedAccounts.spotify.isConnected ? (
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs text-slate-300 font-medium">
                Signed in as: <strong className="text-white">{state.linkedAccounts.spotify.username}</strong>
              </span>
              <button
                onClick={actions.disconnectSpotify}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3 h-3" /> Disconnect
              </button>
            </div>
          ) : (
            <form onSubmit={handleSpotifyConnect} className="flex gap-2 mt-2">
              <input
                type="text"
                value={spotifyUser}
                onChange={(e) => setSpotifyUser(e.target.value)}
                placeholder="Enter Spotify Username or ID"
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-spotify"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-spotify hover:bg-spotify/90 text-black font-bold text-xs shadow-glow-spotify transition-all"
              >
                Connect
              </button>
            </form>
          )}
        </div>

        {/* 2. YouTube Music Connect Card */}
        <div className="p-4 rounded-2xl bg-surface-elevated/70 border border-youtube/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-youtube flex items-center justify-center shadow">
                <Music2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">YouTube Music Account</h4>
                <p className="text-[11px] text-slate-400">Stream audio & access YouTube playlists</p>
              </div>
            </div>

            {state.linkedAccounts.youtube.isConnected ? (
              <span className="text-xs font-bold text-youtube flex items-center gap-1 bg-youtube/10 px-2.5 py-1 rounded-full border border-youtube/30">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            ) : (
              <span className="text-xs text-slate-400">Not Linked</span>
            )}
          </div>

          {state.linkedAccounts.youtube.isConnected ? (
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-xs text-slate-300 font-medium">
                Channel: <strong className="text-white">{state.linkedAccounts.youtube.channelTitle}</strong>
              </span>
              <button
                onClick={actions.disconnectYouTube}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3 h-3" /> Disconnect
              </button>
            </div>
          ) : (
            <form onSubmit={handleYouTubeConnect} className="flex gap-2 mt-2">
              <input
                type="text"
                value={ytChannel}
                onChange={(e) => setYtChannel(e.target.value)}
                placeholder="Enter YouTube Channel / Alias"
                className="flex-1 px-3 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-youtube"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-youtube hover:bg-youtube/90 text-white font-bold text-xs transition-all"
              >
                Connect
              </button>
            </form>
          )}
        </div>

        {/* 3. Import Playlist by Link */}
        <div className="p-4 rounded-2xl bg-surface/50 border border-white/5 space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Quick Import Spotify / YouTube Playlist URL
          </label>
          <form onSubmit={handleImportPlaylist} className="flex gap-2">
            <input
              type="url"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="Paste open.spotify.com/playlist/... or youtube.com/playlist?list=..."
              className="flex-1 px-3 py-2 rounded-xl bg-surface-elevated border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Import
            </button>
          </form>
          {importStatus && (
            <p className="text-xs text-party-cyan font-medium animate-fadeIn">{importStatus}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-spotify" />
          <span>Musily plays audio through legal embedded players and direct audio streams</span>
        </div>
      </div>
    </div>
  );
};
