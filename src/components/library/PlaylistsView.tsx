import React from 'react';
import { Play, Music, Flame, Heart, Disc3 } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FEATURED_SPOTIFY_PLAYLISTS } from '../../services/spotifyService';
import { FEATURED_YOUTUBE_PLAYLISTS } from '../../services/youtubeService';
import { Playlist } from '../../types';

interface PlaylistsViewProps {
  onOpenAccountModal: () => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({ onOpenAccountModal }) => {
  const { actions } = useMusicStore();

  const allPlaylists: Playlist[] = [
    ...FEATURED_SPOTIFY_PLAYLISTS,
    ...FEATURED_YOUTUBE_PLAYLISTS,
  ];

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      actions.playTrack(playlist.tracks[0]);
      playlist.tracks.slice(1).forEach((t) => actions.addToQueue(t));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-extrabold text-white">Your Music Library</h2>
          <p className="text-xs text-slate-400">Aggregated playlists from Spotify & YouTube Music</p>
        </div>

        <button
          onClick={onOpenAccountModal}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
        >
          + Link / Import Playlist
        </button>
      </div>

      {/* Grid of Playlists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allPlaylists.map((pl) => (
          <div
            key={pl.id}
            className="p-4 rounded-3xl bg-surface/60 hover:bg-surface border border-white/5 hover:border-white/15 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 shadow-md bg-surface-elevated">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => handlePlayPlaylist(pl)}
                  className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                    pl.source === 'spotify'
                      ? 'bg-spotify/20 text-spotify border border-spotify/30'
                      : 'bg-youtube/20 text-youtube border border-youtube/30'
                  }`}
                >
                  {pl.source === 'spotify' ? 'Spotify' : 'YouTube Music'}
                </span>
                <span className="text-[10px] text-slate-400">• {pl.trackCount} tracks</span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                {pl.name}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                {pl.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
