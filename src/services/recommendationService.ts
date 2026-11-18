import { Track } from '../types';
import { SpotifyService, FEATURED_SPOTIFY_TRACKS } from './spotifyService';
import { YouTubeService, FEATURED_YOUTUBE_TRACKS } from './youtubeService';

export interface RecentRecommendation {
  track: Track;
  inspiredBy: string;
  sourceType: 'recent' | 'inspired';
}

const ALL_AVAILABLE_TRACKS: Track[] = [
  ...FEATURED_SPOTIFY_TRACKS,
  ...FEATURED_YOUTUBE_TRACKS
];

export class RecommendationService {
  private static readonly ALL_RECENTS_KEY = 'musily_all_recents';

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

    // Deduplicate tracks by id while preserving recency order
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

  // Dynamically compute recommendations depending on recent Spotify & YouTube listens
  static getRecommendationsFromRecents(): RecentRecommendation[] {
    const recents = this.getRecentListens();
    const recommendations: RecentRecommendation[] = [];
    const usedTrackIds = new Set<string>();

    // 1. Surface the top recently played tracks first
    recents.slice(0, 4).forEach((track) => {
      recommendations.push({
        track,
        inspiredBy: 'Recently Played',
        sourceType: 'recent'
      });
      usedTrackIds.add(track.id);
    });

    // 2. Extract recent artists and styles
    const recentArtists = recents.map((t) => t.artist.toLowerCase());

    // 3. Find matching tracks from catalog sharing similar artists or vibe
    ALL_AVAILABLE_TRACKS.forEach((candidate) => {
      if (usedTrackIds.has(candidate.id)) return;

      const candArtist = candidate.artist.toLowerCase();

      // Check if candidate artist matches any recent artist
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

    // 4. Fill remaining spots with top energy drops
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
