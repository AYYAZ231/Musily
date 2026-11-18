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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search songs, artists, Spotify playlists, YouTube Music..."
          className="w-full pl-11 pr-20 py-3 rounded-xl bg-ink-900 border border-ink-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              handleSearch('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filters & Tags */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Source Switcher */}
        <div className="flex p-0.5 rounded-lg bg-ink-900 border border-ink-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-ink-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All Sources
          </button>
          <button
            onClick={() => setFilter('spotify')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'spotify' ? 'bg-spotify/20 text-spotify' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-spotify" />
            Spotify
          </button>
          <button
            onClick={() => setFilter('youtube')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === 'youtube' ? 'bg-youtube/20 text-youtube' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-youtube" />
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
              className="px-2.5 py-1 rounded-md bg-ink-900 hover:bg-ink-850 border border-ink-800 text-[11px] text-zinc-400 hover:text-white whitespace-nowrap transition-colors"
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

        <div className="rounded-xl bg-ink-900 border border-ink-800 overflow-hidden divide-y divide-ink-800/60">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500">Searching catalogs...</div>
          ) : (
            results.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => actions.playTrack(track)}
                  className={`flex items-center justify-between p-3 hover:bg-ink-850 transition-colors cursor-pointer group ${
                    isCurrent ? 'bg-ink-850/80' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-11 h-11 rounded-md overflow-hidden bg-ink-800 shrink-0">
                      <img src={track.coverUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>

                    <div className="min-w-0 truncate pr-3">
                      <p
                        className={`text-xs sm:text-sm font-semibold truncate ${
                          isCurrent ? 'text-lime' : 'text-white'
                        }`}
                      >
                        {track.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border hidden sm:inline ${
                        track.source === 'spotify'
                          ? 'border-spotify/30 text-spotify bg-spotify/5'
                          : 'border-youtube/30 text-youtube bg-youtube/5'
                      }`}
                    >
                      {track.source === 'spotify' ? 'Spotify' : 'YouTube'}
                    </span>

                    {track.dropTime && (
                      <span className="text-[10px] font-mono text-lime hidden md:inline">
                        Drop @ {track.dropTime}s
                      </span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        actions.addToQueue(track);
                      }}
                      className="p-1.5 rounded bg-ink-800 hover:bg-ink-700 text-zinc-300 hover:text-white transition-colors"
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
