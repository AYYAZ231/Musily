import React, { useState } from 'react';
import {
  Play,
  Heart,
  User,
  Sparkles,
  Disc3,
  Music,
  Plus,
  Check,
  ArrowRight,
  ListPlus,
  Radio,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { FEATURED_SPOTIFY_PLAYLISTS } from '../../services/spotifyService';
import { FEATURED_YOUTUBE_PLAYLISTS } from '../../services/youtubeService';
import { OFFICIAL_ARTISTS } from '../../services/catalogService';
import { AlbumViewModal } from '../album/AlbumViewModal';
import { Playlist, Album, Artist, Track } from '../../types';

interface PlaylistsViewProps {
  onOpenAccountModal: () => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({ onOpenAccountModal }) => {
  const { state, actions } = useMusicStore();
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const allPlaylists: Playlist[] = [
    ...FEATURED_SPOTIFY_PLAYLISTS,
    ...FEATURED_YOUTUBE_PLAYLISTS,
  ];

  const likedSongsCount = state.likedSongs.length;
  const followedArtists = state.followedArtists;

  // Build virtual Album object for Liked Songs to open inside Spotify-style AlbumViewModal
  const likedSongsAlbum: Album = {
    id: 'musily_liked_songs',
    title: 'Liked Songs',
    artist: state.currentUser ? `${state.currentUser.name}'s Collection` : 'Your Personal Collection',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1000&auto=format&fit=crop&q=80',
    year: `${new Date().getFullYear()}`,
    genre: 'Personal Favorites',
    type: 'album',
    trackCount: state.likedSongs.length,
    tracks: state.likedSongs
  };

  const handlePlayLikedSongs = () => {
    if (state.likedSongs.length === 0) return;
    actions.playTrack(state.likedSongs[0]);
    state.likedSongs.slice(1).forEach((t) => actions.addToQueue(t));
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      actions.playTrack(playlist.tracks[0]);
      playlist.tracks.slice(1).forEach((t) => actions.addToQueue(t));
    }
  };

  // Convert a playlist into an Album format for detailed tracklist viewing
  const handleOpenPlaylistModal = (playlist: Playlist) => {
    const playlistAsAlbum: Album = {
      id: `playlist_${playlist.id}`,
      title: playlist.name,
      artist: 'Musily Curated',
      coverUrl: playlist.coverUrl,
      year: '2024',
      genre: 'Curated Mix',
      type: 'album',
      trackCount: playlist.trackCount,
      tracks: playlist.tracks
    };
    setSelectedAlbum(playlistAsAlbum);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 select-none animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Music className="w-7 h-7 text-emerald-500 dark:text-[#D4FF00]" />
            <span>Your Library</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Liked songs, followed artists, and curated streaming party sets.
          </p>
        </div>

        {/* Quick Stats Pill & Import Trigger */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
            <span className="text-rose-500 font-bold">{likedSongsCount} Liked</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-emerald-500 dark:text-[#D4FF00] font-bold">{followedArtists.length} Artists</span>
          </div>

          <button
            onClick={onOpenAccountModal}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            + Link Accounts
          </button>
        </div>
      </div>

      {/* =========================================================================
          HERO SECTION: SPOTIFY-STYLE "LIKED SONGS" ALBUM CARD
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
              Liked Songs Album
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">Click to view full tracklist</span>
        </div>

        {/* Spotify-style Liked Songs Card */}
        <div
          onClick={() => setSelectedAlbum(likedSongsAlbum)}
          className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-rose-600 hover:from-indigo-600 hover:via-purple-600 hover:to-rose-500 text-white cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
        >
          {/* Subtle glowing ambient circles in background */}
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              {/* Big Glowing Heart Badge */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white animate-pulse" />
              </div>

              <div>
                <span className="px-2.5 py-1 rounded-full bg-black/25 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider font-bold text-white border border-white/20">
                  OFFICIAL PLAYLIST ALBUM
                </span>
                <h4 className="text-2xl sm:text-4xl font-display font-black text-white mt-2 tracking-tight">
                  Liked Songs
                </h4>
                <p className="text-xs sm:text-sm text-white/80 font-medium mt-1">
                  {likedSongsCount === 0
                    ? 'No liked songs yet. Tap the heart icon on any song to save it here.'
                    : `${likedSongsCount} favorite ${likedSongsCount === 1 ? 'song' : 'songs'} saved in your library.`}
                </p>
              </div>

              {/* Sample preview of liked tracks */}
              {likedSongsCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-white/90 font-medium">
                  {state.likedSongs.slice(0, 3).map((t, idx) => (
                    <span
                      key={t.id || idx}
                      className="px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 truncate max-w-[200px]"
                    >
                      {t.title} <span className="opacity-70">· {t.artist}</span>
                    </span>
                  ))}
                  {likedSongsCount > 3 && (
                    <span className="text-[11px] font-mono text-white/70">
                      +{likedSongsCount - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick 1-Click Play Liked Songs Button */}
            {likedSongsCount > 0 && (
              <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={handlePlayLikedSongs}
                  className="px-6 py-3.5 rounded-2xl bg-white text-zinc-900 hover:bg-zinc-100 font-extrabold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
                  title="Play all liked songs"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play All</span>
                </button>

                <button
                  onClick={() => setSelectedAlbum(likedSongsAlbum)}
                  className="px-4 py-3.5 rounded-2xl bg-black/30 hover:bg-black/40 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-1.5"
                  title="Open tracklist"
                >
                  <span>Tracklist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION: FOLLOWED ARTISTS
          Shows artists followed by the user with real 1000x1000 artwork
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
            <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white">
              Followed Artists
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#D4FF00] text-xs font-mono font-bold">
              {followedArtists.length}
            </span>
          </div>
          <span className="text-xs text-zinc-400">Affects your Discover recommendations</span>
        </div>

        {followedArtists.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 text-center space-y-4 shadow-sm">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              You haven't followed any artists yet. Follow artists to tune your Discover recommendations!
            </p>

            <div className="pt-2">
              <h5 className="text-xs font-mono uppercase font-bold text-zinc-400 mb-3">
                Suggested Artists To Follow:
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {OFFICIAL_ARTISTS.slice(0, 6).map((artist) => (
                  <div
                    key={artist.id}
                    className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-800 mb-2 border border-zinc-300 dark:border-zinc-700 shadow-sm">
                      <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-white truncate w-full">
                      {artist.name}
                    </p>
                    <button
                      onClick={() => actions.toggleFollowArtist(artist)}
                      className="mt-2 px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold transition-all shadow-xs"
                    >
                      + Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {followedArtists.map((artist) => (
              <div
                key={artist.id}
                onClick={() => {
                  actions.setActiveTab('search');
                }}
                className="group p-3.5 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200/90 dark:border-zinc-800/90 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center shadow-xs"
              >
                {/* 1000x1000 Original Deezer Artist Portrait */}
                <div className="relative aspect-square w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-zinc-900 mb-2.5 shadow-md border-2 border-zinc-200 dark:border-zinc-700 group-hover:border-emerald-500 transition-colors">
                  <img
                    src={artist.avatarUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <h4 className="text-xs font-bold text-zinc-900 dark:text-white truncate w-full group-hover:text-emerald-600 dark:group-hover:text-[#D4FF00] transition-colors">
                  {artist.name}
                </h4>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  {artist.genre}
                </p>

                {/* Following State Toggle Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.toggleFollowArtist(artist);
                  }}
                  className="mt-2.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all border bg-emerald-500/10 text-emerald-600 dark:text-[#D4FF00] border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30"
                  title="Click to Unfollow"
                >
                  ✓ Following
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION: CURATED STREAMING SETS & PLAYLISTS
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-display font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
              <span>Streaming Playlists & Party Sets</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Handcrafted mixes engineered for continuous party momentum.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400">{allPlaylists.length} Playlists</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allPlaylists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => handleOpenPlaylistModal(pl)}
              className="p-3.5 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={pl.coverUrl}
                    alt={pl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:scale-110 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPlaylist(pl);
                    }}
                    title="Play Set"
                  >
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                    {pl.trackCount} tracks · Drop Ready
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
      </section>

      {/* Full Spotify-Style Album/Tracklist Modal */}
      <AlbumViewModal
        album={selectedAlbum}
        isOpen={!!selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
};
