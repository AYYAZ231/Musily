import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Plus, Zap, CheckCircle2, Radio, Music } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { SpotifyService } from '../../services/spotifyService';
import { YouTubeService } from '../../services/youtubeService';
import { EqualizerBars } from '../common/EqualizerBars';
import { SpotifyIcon, YouTubeIcon } from '../common/StreamingIcons';
import { Track } from '../../types';

export const UnifiedSearch: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'spotify' | 'youtube'>('all');
  const [matchedArtist, setMatchedArtist] = useState<{ name: string; genre: string } | null>(null);

  const debounceTimerRef = useRef<number | null>(null);

  const trendingQueries = [
    'All Music',
    'Eminem',
    'Arijit Singh',
    'Taylor Swift',
    'Diljit Dosanjh',
    'The Weeknd',
    'Drake',
    'Coldplay',
    'Bollywood Party'
  ];

  useEffect(() => {
    executeSearch('');
  }, []);

  const executeSearch = async (searchTerm: string) => {
    setLoading(true);
    const q = searchTerm === 'All Music' ? '' : searchTerm.trim();

    try {
      if (!q) {
        setMatchedArtist(null);
        const [spTracks, ytTracks] = await Promise.all([
          SpotifyService.search(''),
          YouTubeService.search('')
        ]);
        setResults([...spTracks, ...ytTracks]);
      } else {
        const [spTracks, ytTracks, artistInfo] = await Promise.all([
          SpotifyService.search(q),
          YouTubeService.search(q),
          SpotifyService.searchArtist(q)
        ]);

        setMatchedArtist(artistInfo);

        // Interleave Spotify and YouTube results for balanced catalog experience
        const combined: Track[] = [];
        const maxLen = Math.max(spTracks.length, ytTracks.length);
        for (let i = 0; i < maxLen; i++) {
          if (spTracks[i]) combined.push(spTracks[i]);
          if (ytTracks[i]) combined.push(ytTracks[i]);
        }

        setResults(combined);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      executeSearch(val);
    }, 320);
  };

  const filteredResults = results.filter((track) => {
    if (sourceFilter === 'spotify') return track.source === 'spotify';
    if (sourceFilter === 'youtube') return track.source === 'youtube';
    return true;
  });

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
          placeholder="Search real songs and artists across Spotify & YouTube Music..."
          className="w-full pl-11 pr-20 py-3.5 rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:border-emerald-500 shadow-sm transition-colors"
          autoFocus
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              executeSearch('');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Popular Trending Artists & Genres */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {trendingQueries.map((g) => (
          <button
            key={g}
            onClick={() => {
              const term = g === 'All Music' ? '' : g;
              setQuery(term);
              executeSearch(term);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs whitespace-nowrap transition-all shadow-sm active:scale-95 font-medium ${
              (g === 'All Music' && !query) || query.toLowerCase() === g.toLowerCase()
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-transparent font-bold'
                : 'bg-white dark:bg-[#121216] hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Verified Artist Showcase Card (When Artist Query Matched) */}
      {matchedArtist && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(matchedArtist.name)}`}
                alt={matchedArtist.name}
                className="w-full h-full rounded-2xl object-cover bg-zinc-900"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {matchedArtist.name}
                </h2>
                <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Artist
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Primary Genre: <strong className="text-zinc-800 dark:text-zinc-200">{matchedArtist.genre}</strong> · Streaming discography from Spotify & YouTube
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/30 text-[#1DB954] text-xs font-bold flex items-center gap-1.5">
              <SpotifyIcon className="w-3.5 h-3.5" />
              <span>Spotify Hits</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] text-xs font-bold flex items-center gap-1.5">
              <YouTubeIcon className="w-3.5 h-3.5" />
              <span>YouTube Videos</span>
            </span>
          </div>
        </div>
      )}

      {/* Connected Account Source Filters */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[11px] font-mono text-zinc-400 font-semibold">Filter Service:</span>
        <button
          onClick={() => setSourceFilter('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
            sourceFilter === 'all'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent shadow-xs'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          All Results ({results.length})
        </button>
        <button
          onClick={() => setSourceFilter('spotify')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
            sourceFilter === 'spotify'
              ? 'bg-[#1DB954] text-black font-extrabold border-transparent shadow-xs'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <SpotifyIcon className="w-3.5 h-3.5" />
          <span>Spotify Catalog</span>
        </button>
        <button
          onClick={() => setSourceFilter('youtube')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${
            sourceFilter === 'youtube'
              ? 'bg-[#FF0000] text-white font-extrabold border-transparent shadow-xs'
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <YouTubeIcon className="w-3.5 h-3.5" />
          <span>YouTube Music</span>
        </button>
      </div>

      {/* Results Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider font-semibold">
            {query ? `Live Catalog Matches for "${query}"` : 'Trending Global Songs'}
          </span>
          <span className="text-xs font-mono text-zinc-500">{filteredResults.length} tracks found</span>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {loading ? (
            <div className="p-12 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span>Searching real Spotify and YouTube catalog...</span>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400">
              No tracks found matching "{query}". Try searching an artist or song title.
            </div>
          ) : (
            filteredResults.map((track) => {
              const isCurrent = state.currentTrack?.id === track.id;
              const isPlayingThis = isCurrent && state.isPlaying;
              const isSpotify = track.source === 'spotify';

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

                    <div className="min-w-0 truncate pr-3 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isCurrent
                              ? 'text-[#059669] dark:text-[#D4FF00]'
                              : 'text-zinc-900 dark:text-white'
                          }`}
                        >
                          {track.title}
                        </p>
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {track.artist} {track.album && track.album !== track.title ? `· ${track.album}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Drop Cue, Duration & Add to Queue */}
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
                      title={state.isPartyActive ? 'Queue to party Aux' : 'Add to queue'}
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
