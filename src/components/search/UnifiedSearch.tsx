import React, { useState, useEffect } from 'react';
import { Search, Play, Plus, Zap, Music2 } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { SpotifyService } from '../../services/spotifyService';
import { YouTubeService } from '../../services/youtubeService';
import { EqualizerBars } from '../common/EqualizerBars';
import { Track } from '../../types';

export const UnifiedSearch: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'spotify' | 'youtube'>('all');

  const genres = [
    'All Music',
    'Hindi & Bollywood Party',
    'Punjabi Club Mix',
    'EDM & House Drops',
    'Global Top 50',
    'Hip Hop & Rap',
    'Lo-Fi Beats'
  ];

  useEffect(() => {
    handleSearch('');
  }, []);

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const q = searchTerm === 'All Music' ? '' : searchTerm;
      const [spTracks, ytTracks] = await Promise.all([
        SpotifyService.search(q),
        YouTubeService.search(q)
      ]);
      setResults([...spTracks, ...ytTracks]);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((track) => {
    if (sourceFilter === 'spotify') return track.source === 'spotify';
    if (sourceFilter === 'youtube') return track.source === 'youtube';
    return true;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none animate-fade-in">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search any song, artist, playlist, or club drop..."
          className="w-full pl-11 pr-20 py-3.5 rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-zinc-400 shadow-sm transition-colors"
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

      {/* Genre & Vibe Tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => {
              setQuery(g === 'All Music' ? '' : g);
              handleSearch(g);
            }}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#121216] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white whitespace-nowrap transition-all shadow-sm active:scale-95"
          >
            {g}
          </button>
        ))}
      </div>

      {/* Connected Account Source Filters */}
      {(state.linkedAccounts.spotify.isConnected || state.linkedAccounts.youtube.isConnected) && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-mono text-zinc-400 font-semibold">Priority Source:</span>
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              sourceFilter === 'all'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs'
                : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
            }`}
          >
            All Connected (Unified)
          </button>
          {state.linkedAccounts.spotify.isConnected && (
            <button
              onClick={() => setSourceFilter('spotify')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                sourceFilter === 'spotify'
                  ? 'bg-[#1DB954] text-white border-transparent shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
              <span>Spotify Picks (@{state.linkedAccounts.spotify.username})</span>
            </button>
          )}
          {state.linkedAccounts.youtube.isConnected && (
            <button
              onClick={() => setSourceFilter('youtube')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                sourceFilter === 'youtube'
                  ? 'bg-[#FF0033] text-white border-transparent shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#FF0033]" />
              <span>YouTube Music (@{state.linkedAccounts.youtube.channelTitle})</span>
            </button>
          )}
        </div>
      )}

      {/* Results Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono text-zinc-500 uppercase">
            {query ? `Results for "${query}"` : 'Recommended Catalog'}
          </span>
          <span className="text-xs font-mono text-zinc-500">{filteredResults.length} tracks</span>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-400">Loading catalog...</div>
          ) : (
            filteredResults.map((track, idx) => {
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlayingThis = isCurrent && state.isPlaying;

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
                      {isPlayingThis ? (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <EqualizerBars isPlaying={true} size="sm" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      )}
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

                  {/* Drop Cue, Duration & Add */}
                  <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                    {track.dropTime && (
                      <span className="text-[10px] font-semibold text-[#059669] dark:text-[#D4FF00] hidden sm:inline flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        Drop @ {track.dropTime}s
                      </span>
                    )}

                    <span className="text-zinc-400 dark:text-zinc-500">
                      {formatDuration(track.duration)}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.addToQueue(track);
                      }}
                      className="p-1.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-all active:scale-90 shadow-sm"
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
