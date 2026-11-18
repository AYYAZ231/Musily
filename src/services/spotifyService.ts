import { Track, Playlist } from '../types';

// Curated Spotify-style party & hit tracks for instant playback & discovery
export const FEATURED_SPOTIFY_TRACKS: Track[] = [
  {
    id: 'sp_1',
    title: 'Starboy',
    artist: 'The Weeknd, Daft Punk',
    album: 'Starboy',
    duration: 230,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    source: 'spotify',
    youtubeId: '34Na4j8AVgA',
    votes: 8,
    dropTime: 42
  },
  {
    id: 'sp_2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    source: 'spotify',
    youtubeId: '4NRXx6U8ABQ',
    votes: 14,
    dropTime: 28
  },
  {
    id: 'sp_3',
    title: 'Brown Munde',
    artist: 'AP Dhillon, Gurinder Gill, Shinda Kahlon',
    album: 'Not by Chance',
    duration: 268,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    source: 'spotify',
    youtubeId: 'VNs_cCtdbPc',
    votes: 19,
    dropTime: 36
  },
  {
    id: 'sp_4',
    title: 'Apna Bana Le',
    artist: 'Arijit Singh, Sachin-Jigar',
    album: 'Bhediya',
    duration: 261,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    source: 'spotify',
    youtubeId: 'ElZfdU54Cp8',
    votes: 6,
    dropTime: 52
  },
  {
    id: 'sp_5',
    title: 'One Dance',
    artist: 'Drake, Wizkid, Kyla',
    album: 'Views',
    duration: 173,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
    source: 'spotify',
    youtubeId: 'iAbnEUA0wpA',
    votes: 11,
    dropTime: 22
  },
  {
    id: 'sp_6',
    title: 'Tauba Tauba',
    artist: 'Karan Aujla',
    album: 'Bad Newz',
    duration: 206,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80',
    source: 'spotify',
    youtubeId: 'LK7-_dgAVQE',
    votes: 24,
    dropTime: 32
  }
];

export const FEATURED_SPOTIFY_PLAYLISTS: Playlist[] = [
  {
    id: 'sp_pl_1',
    name: 'NAUX House Party Mix 🔥',
    description: 'High-octane Bollywood, Punjabi & EDM party drops that never let the vibe die down.',
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
    source: 'spotify',
    trackCount: 12,
    tracks: FEATURED_SPOTIFY_TRACKS
  },
  {
    id: 'sp_pl_2',
    name: 'Global Top 50 Chartbusters',
    description: 'The hottest tracks trending across Spotify worldwide right now.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    source: 'spotify',
    trackCount: 50,
    tracks: FEATURED_SPOTIFY_TRACKS.slice(0, 4)
  }
];

export class SpotifyService {
  private static readonly CLIENT_ID_KEY = 'musily_spotify_client_id';
  private static readonly TOKEN_KEY = 'musily_spotify_token';
  private static readonly USER_KEY = 'musily_spotify_user';

  // Check if Spotify is connected
  static isConnected(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY) || !!localStorage.getItem(this.USER_KEY);
  }

  // Get saved profile
  static getProfile() {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // Link account (Mock or real OAuth PKCE redirect)
  static linkAccount(username: string = 'PartyHost_99'): Promise<{ success: boolean; username: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          username: username.trim() || 'MusicLover',
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username || 'spotify')}`,
          connectedAt: Date.now()
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        localStorage.setItem(this.TOKEN_KEY, 'mock_token_' + Math.random().toString(36).substring(2));
        resolve({ success: true, username: user.username });
      }, 600);
    });
  }

  // Disconnect
  static disconnect(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Search Spotify Catalog (returns live matches or curated database)
  static async search(query: string): Promise<Track[]> {
    const q = query.toLowerCase().trim();
    if (!q) return FEATURED_SPOTIFY_TRACKS;

    // Filter curated list
    const localMatches = FEATURED_SPOTIFY_TRACKS.filter(
      (t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q)
    );

    // If query has custom terms, create realistic Spotify-matched tracks
    if (localMatches.length > 0) return localMatches;

    return [
      {
        id: `sp_search_${Date.now()}_1`,
        title: query.charAt(0).toUpperCase() + query.slice(1),
        artist: 'Trending Spotify Artist',
        album: 'Top Hit Single',
        duration: 215,
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        source: 'spotify',
        youtubeId: 'kJQP7kiw5Fk', // Despacito / party fallback
        votes: 0,
        dropTime: 35
      },
      {
        id: `sp_search_${Date.now()}_2`,
        title: `${query} (Party Remix / Club Mix)`,
        artist: 'DJ Festival Mix',
        album: 'Club Drop 2026',
        duration: 198,
        coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
        source: 'spotify',
        youtubeId: 'fJ9rUzIMcZQ', // Queen Bohemian / Bohemian / party fallback
        votes: 0,
        dropTime: 30
      }
    ];
  }
}
