import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Play,
  Pause,
  Plus,
  Zap,
  CheckCircle2,
  Disc3,
  User,
  Music,
  Clock,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Heart,
  Check
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FastSearchService, SearchResponse } from '../../services/fastSearchService';
import { AlbumViewModal } from '../album/AlbumViewModal';
import { EqualizerBars } from '../common/EqualizerBars';
import { Track, Album, Artist } from '../../types';

type SearchCategory = 'all' | 'tracks' | 'albums' | 'artists';

export const UnifiedSearch: React.FC = () => {
  const { state, actions } = useMusicStore();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('all');
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchResponse>({
    tracks: [],
    albums: [],
    artists: []
  });
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const debounceTimerRef = useRef<number | null>(null);

  const trendingQueries = [
    'All Music',
    'Eminem',
    'The Weeknd',
    'Karan Aujla',
    'Diljit Dosanjh',
    'Arijit Singh',
    'Taylor Swift',
    'Sabrina Carpenter',
    'Billie Eilish',
    'Drake'
  ];

  useEffect(() => {
    executeSearch('');
  }, []);

  const executeSearch = async (searchTerm: string) => {
    const q = searchTerm === 'All Music' ? '' : searchTerm.trim();

    // 1. Instant local index response (<2ms)
    const localResult = FastSearchService.searchLocal(q);
    setSearchData(localResult);

    if (!q) {
      setLoading(false);
      return;
    }

    // 2. Fetch full remote catalog in parallel with 1.8s timeout guarantee
    setLoading(true);
    try {
      const fullResult = await FastSearchService.search(q);
      setSearchData(fullResult);
    } catch (err) {
      console.warn('Search query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    // Instant local filter on every keystroke
    const immediate = FastSearchService.searchLocal(val);
    setSearchData(immediate);

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    // Fast debounce for remote enrichment (220ms)
    debounceTimerRef.current = window.setTimeout(() => {
      executeSearch(val);
    }, 220);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const displayedTracks = searchData.tracks;
  const displayedAlbums = searchData.albums;
  const displayedArtists = searchData.artists;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24 select-none animate-fade-in">
      {/* Search Input Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search songs, official albums, EPs, or artists (e.g. Eminem, Starboy, Karan Aujla)..."
            className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm sm:text-base font-medium shadow-sm transition-all"
            autoFocus
          />
          {loading && (
            <div className="absolute right-4 w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Trending Suggestions Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {trendingQueries.map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term === 'All Music' ? '' : term);
                executeSearch(term);
              }}
              className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors shrink-0 border border-zinc-200/50 dark:border-zinc-700/50"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills (All, Songs, Albums & EPs, Artists) */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            category === 'all'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          All Results
        </button>

        <button
          onClick={() => setCategory('tracks')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            category === 'tracks'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Songs ({displayedTracks.length})</span>
        </button>

        <button
          onClick={() => setCategory('albums')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            category === 'albums'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <Disc3 className="w-3.5 h-3.5" />
          <span>Albums & EPs ({displayedAlbums.length})</span>
        </button>

        <button
          onClick={() => setCategory('artists')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            category === 'artists'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-sm'
              : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Artists ({displayedArtists.length})</span>
        </button>
      </div>

      {/* TOP HIT SHOWCASE (If available) */}
      {category === 'all' && searchData.topHit && (
        <section className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            Top Result
          </h3>

          {searchData.topHit.type === 'artist' && (
            <div
              onClick={() => {
                setQuery((searchData.topHit!.data as Artist).name);
                executeSearch((searchData.topHit!.data as Artist).name);
              }}
              className="p-5 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 text-white flex items-center justify-between gap-5 cursor-pointer group hover:border-emerald-500/50 transition-all shadow-xl max-w-xl"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/20 shadow-lg">
                  <img
                    src={(searchData.topHit.data as Artist).avatarUrl}
                    alt={(searchData.topHit.data as Artist).name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono uppercase font-bold text-emerald-400">
                    Verified Artist
                  </span>
                  <h4 className="text-xl font-display font-black text-white truncate mt-1">
                    {(searchData.topHit.data as Artist).name}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {(searchData.topHit.data as Artist).genre}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actions.toggleFollowArtist(searchData.topHit!.data as Artist);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-md active:scale-95 ${
                  actions.isArtistFollowed((searchData.topHit!.data as Artist).name)
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/40'
                    : 'bg-white hover:bg-zinc-200 text-black border border-white/40'
                }`}
              >
                {actions.isArtistFollowed((searchData.topHit!.data as Artist).name) ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          )}

          {searchData.topHit.type === 'album' && (
            <div
              onClick={() => setSelectedAlbum(searchData.topHit!.data as Album)}
              className="p-5 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-black border border-zinc-800 text-white flex items-center gap-5 cursor-pointer group hover:border-emerald-500/50 transition-all shadow-xl max-w-xl"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 shrink-0 border border-white/20 shadow-lg">
                <img
                  src={(searchData.topHit.data as Album).coverUrl}
                  alt={(searchData.topHit.data as Album).title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono uppercase font-bold text-amber-400">
                  Official {(searchData.topHit.data as Album).type.toUpperCase()}
                </span>
                <h4 className="text-xl font-display font-black text-white truncate mt-1">
                  {(searchData.topHit.data as Album).title}
                </h4>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {(searchData.topHit.data as Album).artist} · {(searchData.topHit.data as Album).year || 'Release'}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAlbum(searchData.topHit!.data as Album);
                }}
                className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform shrink-0"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* SECTION: OFFICIAL ALBUMS & EPS (Click opens Spotify-style full album modal) */}
      {(category === 'all' || category === 'albums') && displayedAlbums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
              <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
                Official Albums & EPs
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">Click to view all songs</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className="group relative p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-xs"
              >
                {/* 1000x1000 Original Album Cover */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-900 mb-2.5 shadow-sm">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Album Type Pill */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-md text-[9px] font-mono uppercase font-bold text-white border border-white/10">
                    {album.type}
                  </div>

                  {/* Floating Play Button */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-xl transform scale-80 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors">
                    {album.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {album.artist}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                    {album.year || '2024'} · {album.trackCount ? `${album.trackCount} tracks` : 'Full Album'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION: OFFICIAL ARTISTS (High-Res Deezer Portraits) */}
      {(category === 'all' || category === 'artists') && displayedArtists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
            <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
              Official Artists
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayedArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => {
                  setQuery(artist.name);
                  executeSearch(artist.name);
                }}
                className="group p-3 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center shadow-xs"
              >
                {/* 1000x1000 Original Artist Portrait */}
                <div className="relative aspect-square w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-900 mb-2.5 shadow-md border-2 border-zinc-200 dark:border-zinc-700 group-hover:border-emerald-500 transition-colors">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate w-full group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                  {artist.name}
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  {artist.genre}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.toggleFollowArtist(artist);
                  }}
                  className={`mt-2.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95 ${
                    actions.isArtistFollowed(artist.name)
                      ? 'bg-emerald-500/15 text-emerald-500 dark:text-[#D4FF00] border border-emerald-500/40 hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/40'
                      : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                  title={actions.isArtistFollowed(artist.name) ? 'Click to Unfollow' : 'Follow Artist'}
                >
                  {actions.isArtistFollowed(artist.name) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION: SONGS LIST */}
      {(category === 'all' || category === 'tracks') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
              <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
                Songs & Tracks
              </h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">{displayedTracks.length} Songs</span>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {displayedTracks.length === 0 ? (
              <div className="p-12 text-center text-xs text-zinc-400">
                No songs matching "{query}". Try searching by song name or artist.
              </div>
            ) : (
              displayedTracks.map((track, idx) => {
                const isCurrent = state.currentTrack?.id === track.id;
                const isPlayingThis = isCurrent && state.isPlaying;

                return (
                  <div
                    key={track.id || idx}
                    onClick={() => actions.playTrack(track)}
                    className={`flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group ${
                      isCurrent ? 'bg-emerald-500/10 dark:bg-emerald-500/15' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Album Cover */}
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-zinc-900 shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-700">
                        <img src={track.coverUrl} alt="" className="w-full h-full object-cover" />
                        {isPlayingThis ? (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <EqualizerBars isPlaying={true} size="sm" />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                      </div>

                      {/* Track & Artist Info (Clean: zero platform badges) */}
                      <div className="min-w-0 truncate pr-3 space-y-0.5">
                        <p
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isCurrent
                              ? 'text-emerald-600 dark:text-[#D4FF00] font-bold'
                              : 'text-zinc-900 dark:text-white'
                          }`}
                        >
                          {track.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {track.artist} {track.album && track.album !== track.title ? `· ${track.album}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Drop Cue, Duration & Quick Actions (Heart & Queue) */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs font-mono">
                      {track.dropTime && (
                        <span className="text-[10px] font-semibold text-amber-500 hidden sm:inline flex items-center gap-0.5">
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
                          actions.toggleLikeSong(track);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          actions.isSongLiked(track.id, track.title)
                            ? 'text-rose-500 hover:text-rose-600'
                            : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        title={actions.isSongLiked(track.id, track.title) ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            actions.isSongLiked(track.id, track.title) ? 'fill-rose-500' : ''
                          }`}
                        />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          actions.addToQueue(track);
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                        title="Add to Next Up Queue"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* Full Spotify-Style Album View Modal */}
      <AlbumViewModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
};
