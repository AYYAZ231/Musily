import { Track, Artist } from '../types';
import { SpotifyService, FEATURED_SPOTIFY_TRACKS } from './spotifyService';
import { YouTubeService, FEATURED_YOUTUBE_TRACKS } from './youtubeService';
import { OFFICIAL_ALBUMS, OFFICIAL_ARTISTS } from './catalogService';

export interface RecentRecommendation {
  track: Track;
  inspiredBy: string;
  sourceType: 'recent' | 'followed' | 'liked' | 'inspired';
}

const ALL_AVAILABLE_TRACKS: Track[] = [
  ...FEATURED_SPOTIFY_TRACKS,
  ...FEATURED_YOUTUBE_TRACKS,
  ...OFFICIAL_ALBUMS.flatMap((a) => a.tracks)
];

export class RecommendationService {
  private static readonly ALL_RECENTS_KEY = 'musily_all_recents';
  private static readonly FOLLOWED_KEY = 'musily_followed_artists';
  private static readonly LIKED_KEY = 'musily_liked_songs';

  // Get followed artists from storage
  static getFollowedArtists(): Artist[] {
    try {
      const raw = localStorage.getItem(this.FOLLOWED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [OFFICIAL_ARTISTS[0], OFFICIAL_ARTISTS[1]];
  }

  // Get liked songs from storage
  static getLikedSongs(): Track[] {
    try {
      const raw = localStorage.getItem(this.LIKED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  // Get combined recent listening history from Spotify, YouTube & local player
  static getRecentListens(): Track[] {
    const spRecents = SpotifyService.getRecentTracks();
    const ytRecents = YouTubeService.getRecentTracks();

    let localRecents: Track[] = [];
    try {
      const raw = localStorage.getItem(this.ALL_RECENTS_KEY);
      if (raw) {
        localRecents = JSON.parse(raw);
      }
    } catch {}

    const map = new Map<string, Track>();

    // Priority 1: explicitly played local recents
    localRecents.forEach((t) => map.set(t.id, t));

    // Priority 2: Spotify recents
    spRecents.forEach((t) => {
      if (!map.has(t.id)) map.set(t.id, t);
    });

    // Priority 3: YouTube recents
    ytRecents.forEach((t) => {
      if (!map.has(t.id)) map.set(t.id, t);
    });

    return Array.from(map.values()).slice(0, 15);
  }

  // Record a track play across both service histories
  static recordListen(track: Track): void {
    if (!track) return;

    if (track.source === 'spotify') {
      SpotifyService.recordRecent(track);
    } else if (track.source === 'youtube') {
      YouTubeService.recordRecent(track);
    }

    try {
      const current = this.getRecentListens();
      const filtered = current.filter((t) => t.id !== track.id);
      const updated = [track, ...filtered].slice(0, 30);
      localStorage.setItem(this.ALL_RECENTS_KEY, JSON.stringify(updated));
    } catch {}
  }

  // Dynamically compute recommendations depending on Followed Artists, Liked Songs & Recents
  static getRecommendationsFromRecents(): RecentRecommendation[] {
    const recents = this.getRecentListens();
    const followed = this.getFollowedArtists();
    const liked = this.getLikedSongs();
    const recommendations: RecentRecommendation[] = [];
    const usedTrackIds = new Set<string>();

    // 1. TOP PRIORITY: Recommendations from Followed Artists
    if (followed.length > 0) {
      followed.forEach((artist) => {
        const aName = artist.name.toLowerCase();
        const artistTracks = ALL_AVAILABLE_TRACKS.filter(
          (t) => !usedTrackIds.has(t.id) && t.artist.toLowerCase().includes(aName)
        );

        artistTracks.slice(0, 2).forEach((track) => {
          recommendations.push({
            track,
            inspiredBy: `From Followed Artist: ${artist.name}`,
            sourceType: 'followed'
          });
          usedTrackIds.add(track.id);
        });
      });
    }

    // 2. SECOND PRIORITY: Top recently played tracks
    recents.slice(0, 3).forEach((track) => {
      if (!usedTrackIds.has(track.id)) {
        recommendations.push({
          track,
          inspiredBy: 'Recently Played',
          sourceType: 'recent'
        });
        usedTrackIds.add(track.id);
      }
    });

    // 3. THIRD PRIORITY: Inspired by Liked Songs
    if (liked.length > 0 && recommendations.length < 8) {
      const likedArtists = liked.map((t) => t.artist.toLowerCase());
      ALL_AVAILABLE_TRACKS.forEach((candidate) => {
        if (usedTrackIds.has(candidate.id) || recommendations.length >= 8) return;
        const candArtist = candidate.artist.toLowerCase();
        const matchesLiked = likedArtists.some((la) => candArtist.includes(la) || la.includes(candArtist));
        if (matchesLiked) {
          recommendations.push({
            track: candidate,
            inspiredBy: 'Based on Liked Songs',
            sourceType: 'liked'
          });
          usedTrackIds.add(candidate.id);
        }
      });
    }

    // 4. FOURTH PRIORITY: Tracks inspired by Recent Artists
    if (recommendations.length < 8) {
      ALL_AVAILABLE_TRACKS.forEach((candidate) => {
        if (usedTrackIds.has(candidate.id) || recommendations.length >= 8) return;

        const candArtist = candidate.artist.toLowerCase();
        const matchedRecent = recents.find((r) => {
          const rTokens = r.artist.toLowerCase().split(/[,&]/).map((s) => s.trim());
          return rTokens.some((token) => token.length > 2 && candArtist.includes(token));
        });

        if (matchedRecent) {
          recommendations.push({
            track: candidate,
            inspiredBy: `Inspired by ${matchedRecent.artist.split(',')[0]}`,
            sourceType: 'inspired'
          });
          usedTrackIds.add(candidate.id);
        }
      });
    }

    // 5. Fill remaining spots with top energy drops
    if (recommendations.length < 8) {
      ALL_AVAILABLE_TRACKS.forEach((fallback) => {
        if (!usedTrackIds.has(fallback.id) && recommendations.length < 8) {
          recommendations.push({
            track: fallback,
            inspiredBy: 'Trending For Your Vibe',
            sourceType: 'inspired'
          });
          usedTrackIds.add(fallback.id);
        }
      });
    }

    return recommendations.slice(0, 8);
  }
}
