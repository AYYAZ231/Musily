import React, { useState, useEffect } from 'react';
import { Search, Play, Plus, Flame, Sparkles, Filter, Music } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { SpotifyService, FEATURED_SPOTIFY_TRACKS } from '../../services/spotifyService';
import { YouTubeService, FEATURED_YOUTUBE_TRACKS } from '../../services/youtubeService';
import { Track } from '../../types';

export const UnifiedSearch: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'spotify' | 'youtube'>('all');

  const genres = [
    'Hindi & Bollywood Party',
    'Punjabi Hits',
    'EDM & Club Drops',
    'Global Top 50',
    'Hip Hop & Rap',
    'Lo-Fi Vibes'
  ];

  // Initial load
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

      // If query given, randomize or sort relevant
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
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Search Bar Header */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search songs, artists, Spotify playlists, YouTube Music..."
            className="w-full pl-14 pr-28 py-4 rounded-3xl bg-surface-elevated/90 border border-white/10 text-white placeholder-slate-400 text-sm md:text-base focus:outline-none focus:border-primary shadow-glow-primary transition-all"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                handleSearch('');
              }}
              className="absolute right-5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Source Pills & Quick Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Source Switcher */}
        <div className="flex p-1 rounded-2xl bg-surface border border-white/5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-party-pink to-primary text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Sources
          </button>
          <button
            onClick={() => setFilter('spotify')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'spotify'
                ? 'bg-spotify text-black shadow-glow-spotify'
                : 'text-slate-400 hover:text-spotify'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-spotify" />
            Spotify
          </button>
          <button
            onClick={() => setFilter('youtube')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              filter === 'youtube'
                ? 'bg-youtube text-white shadow'
                : 'text-slate-400 hover:text-youtube'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-youtube" />
            YouTube Music
          </button>
        </div>

        {/* Quick Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => {
                setQuery(g);
                handleSearch(g);
              }}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-medium text-slate-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4 text-primary" />
            {query ? `Results for "${query}"` : 'Trending on Spotify & YouTube'}
          </h3>
          <span className="text-xs text-slate-400">{results.length} tracks</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-20 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all group ${
                    isCurrent
                      ? 'bg-primary/20 border-primary/50 shadow-glow-primary'
                      : 'bg-surface/60 hover:bg-surface border-white/5 hover:border-white/15'
                  }`}
                >
                  <div
                    onClick={() => actions.playTrack(track)}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow shrink-0">
                      <img src={track.coverUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-primary transition-colors">
                          {track.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            track.source === 'spotify'
                              ? 'bg-spotify/20 text-spotify border border-spotify/30'
                              : 'bg-youtube/20 text-youtube border border-youtube/30'
                          }`}
                        >
                          {track.source === 'spotify' ? 'Spotify' : 'YouTube'}
                        </span>
                        {track.dropTime && (
                          <span className="text-[9px] text-party-yellow flex items-center gap-0.5 font-bold">
                            <Sparkles className="w-2.5 h-2.5" /> Drop @ {track.dropTime}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => actions.addToQueue(track)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-all active:scale-95"
                      title={state.isPartyActive ? 'Queue to Party' : 'Add to Queue'}
                    >
                      {state.isPartyActive ? (
                        <Flame className="w-4 h-4 text-party-pink" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
