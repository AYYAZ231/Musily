import React from 'react';
import { Play } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-white">Your Playlists</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Curated party sets from Spotify and YouTube</p>
        </div>

        <button
          onClick={onOpenAccountModal}
          className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs font-semibold transition-colors shadow-sm"
        >
          + Import Playlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allPlaylists.map((pl) => (
          <div
            key={pl.id}
            onClick={() => handlePlayPlaylist(pl)}
            className="p-3.5 rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={pl.coverUrl}
                  alt={pl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPlaylist(pl);
                  }}
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-semibold ${
                    pl.source === 'spotify'
                      ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      : 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10'
                  }`}
                >
                  {pl.source === 'spotify' ? 'Spotify' : 'YouTube'}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                  {pl.trackCount} tracks
                </span>
              </div>

              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-[#059669] dark:group-hover:text-[#D4FF00] transition-colors truncate">
                {pl.name}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                {pl.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
