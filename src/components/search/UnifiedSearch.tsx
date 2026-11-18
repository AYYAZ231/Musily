import React, { useState, useEffect } from 'react';
import { Search, Play, Plus, Zap, Music2, ExternalLink } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { SpotifyService } from '../../services/spotifyService';
import { YouTubeService } from '../../services/youtubeService';
import { Track } from '../../types';

export const UnifiedSearch: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'spotify' | 'youtube'>('all');

  const genres = [
    'Hindi & Bollywood Party',
    'Punjabi Club Mix',
    'EDM & House Drops',
    'Global Top 50',
    'Hip Hop & Rap',
    'Lo-Fi Beats'
  ];

  useEffect(() => {
    handleSearch('');
  }, [filter]);

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      let combined: Track[] = [];

      if (filter === 'all' || filter === 'spotify') {
        const spTracks = await SpotifyService.search(searchTerm);
        combined = [...combined, ...spTracks];
      }

      if (filter === 'all' || filter === 'youtube') {
        const ytTracks = await YouTubeService.search(searchTerm);
        combined = [...combined, ...ytTracks];
      }

      setResults(combined);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search songs, artists, Spotify playlists, YouTube Music..."
          className="w-full pl-11 pr-20 py-3 rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-zinc-400 shadow-sm transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              handleSearch('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters & Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Source Switcher */}
        <div className="flex p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            All Sources
          </button>
          <button
            onClick={() => setFilter('spotify')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'spotify'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
            Spotify
          </button>
          <button
            onClick={() => setFilter('youtube')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'youtube'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-bold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF0033]" />
            YouTube Music
          </button>
        </div>

        {/* Quick Genre Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => {
                setQuery(g);
                handleSearch(g);
              }}
              className="px-2.5 py-1 rounded-md bg-white dark:bg-[#121216] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap transition-colors shadow-sm"
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono text-zinc-500 uppercase">
            {query ? `Results for "${query}"` : 'Trending Results'}
          </span>
          <span className="text-xs font-mono text-zinc-500">{results.length} tracks</span>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-400">Searching catalogs...</div>
          ) : (
            results.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => actions.playTrack(track)}
                  className={`flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group ${
                    isCurrent ? 'bg-emerald-500/5 dark:bg-zinc-800/80' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-11 h-11 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0 shadow-sm">
                      <img src={track.coverUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0 truncate pr-3">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent
                            ? 'text-[#059669] dark:text-[#D4FF00]'
                            : 'text-zinc-900 dark:text-white'
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold hidden sm:inline ${
                        track.source === 'spotify'
                          ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                          : 'border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10'
                      }`}
                    >
                      {track.source === 'spotify' ? 'Spotify' : 'YouTube'}
                    </span>

                    {track.dropTime && (
                      <span className="text-[10px] font-mono font-semibold text-[#059669] dark:text-[#D4FF00] hidden md:inline">
                        Drop @ {track.dropTime}s
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.addToQueue(track);
                      }}
                      className="p-1.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors shadow-sm"
                      title={state.isPartyActive ? 'Queue to party' : 'Add to queue'}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
