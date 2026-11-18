import { Track, Playlist } from '../types';

export const FEATURED_YOUTUBE_TRACKS: Track[] = [
  {
    id: 'yt_1',
    title: 'Tauba Tauba (Official Video)',
    artist: 'Karan Aujla, Vicky Kaushal',
    album: 'Bad Newz',
    duration: 206,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: 'LK7-_dgAVQE',
    votes: 32,
    dropTime: 32
  },
  {
    id: 'yt_2',
    title: 'Obsessed',
    artist: 'Riar Saab, Abhijay Sharma',
    album: 'Obsessed Single',
    duration: 185,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: '4bz8sN5W4Qc',
    votes: 18,
    dropTime: 25
  },
  {
    id: 'yt_3',
    title: 'Mi Gente',
    artist: 'J Balvin, Willy William',
    album: 'Mi Gente',
    duration: 185,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: 'wnJ6LuUFpMo',
    votes: 15,
    dropTime: 20
  },
  {
    id: 'yt_4',
    title: 'Proper Patola',
    artist: 'Diljit Dosanjh, Badshah',
    album: 'Namaste England',
    duration: 180,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: 'xnm8L_W3s_o',
    votes: 22,
    dropTime: 34
  },
  {
    id: 'yt_5',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: 'TUVcZfQe-Kw',
    votes: 9,
    dropTime: 27
  },
  {
    id: 'yt_6',
    title: 'Kahani Suno 2.0',
    artist: 'Kaifi Khalil',
    album: 'Kahani Suno',
    duration: 173,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: '_XbvH7pP4iA',
    votes: 16,
    dropTime: 40
  },
  {
    id: 'yt_7',
    title: 'Kinni Kinni',
    artist: 'Diljit Dosanjh',
    album: 'Ghost',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: '2b73u-X5Jg8',
    votes: 34,
    dropTime: 28
  },
  {
    id: 'yt_8',
    title: 'Despacito',
    artist: 'Luis Fonsi, Daddy Yankee',
    album: 'VIDA',
    duration: 228,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: 'kJQP7kiw5Fk',
    votes: 48,
    dropTime: 32
  },
  {
    id: 'yt_9',
    title: 'Houdini',
    artist: 'Eminem',
    album: 'The Death of Slim Shady',
    duration: 227,
    coverUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: '22tVWwmTie8',
    votes: 55,
    dropTime: 25
  },
  {
    id: 'yt_10',
    title: 'Calma (Remix)',
    artist: 'Pedro Capó, Farruko',
    album: 'Gangalee',
    duration: 238,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: '1_w7o9BGZao',
    votes: 21,
    dropTime: 30
  },
  {
    id: 'yt_11',
    title: 'Softly',
    artist: 'Karan Aujla, Ikky',
    album: 'Making Memories',
    duration: 155,
    coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: 'cWMxCE2HTag',
    votes: 39,
    dropTime: 22
  },
  {
    id: 'yt_12',
    title: 'Lover',
    artist: 'Diljit Dosanjh',
    album: 'MoonChild Era',
    duration: 191,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    source: 'youtube',
    youtubeId: 'm4nF6A0F1nE',
    votes: 41,
    dropTime: 26
  }
];

export const FEATURED_YOUTUBE_PLAYLISTS: Playlist[] = [
  {
    id: 'yt_pl_1',
    name: 'YouTube Music - Party Trending ⚡',
    description: 'The most streamed Hindi, Punjabi & International party music on YouTube Music.',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    trackCount: 12,
    tracks: FEATURED_YOUTUBE_TRACKS
  },
  {
    id: 'yt_pl_2',
    name: 'YouTube Music - Global Viral Video Drops 🎥',
    description: 'Chart-dominating official music video drops and worldwide viral sensations.',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    source: 'youtube',
    trackCount: 12,
    tracks: FEATURED_YOUTUBE_TRACKS
  }
];

export class YouTubeService {
  private static readonly USER_KEY = 'musily_yt_user';

  static isConnected(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }

  static getProfile() {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static linkAccount(input: string): Promise<{ success: boolean; channelName: string }> {
    return new Promise((resolve) => {
      let channelName = input.trim();
      const match = channelName.match(/youtube\.com\/@([a-zA-Z0-9._-]+)/);
      if (match && match[1]) {
        channelName = `@${match[1]}`;
      }

      setTimeout(() => {
        const user = {
          channelTitle: channelName || 'YouTubeChannel',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(channelName || 'youtube')}`,
          connectedAt: Date.now()
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        resolve({ success: true, channelName: user.channelTitle });
      }, 400);
    });
  }

  static disconnect(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Live search querying real YouTube Music catalog
  static async search(query: string): Promise<Track[]> {
    const q = query.trim();
    if (!q) return FEATURED_YOUTUBE_TRACKS;

    try {
      // 1. Fetch real YouTube video IDs via Vite server proxy if available
      let ytIds: string[] = [];
      try {
        const ytRes = await fetch(`/api/yt-search?q=${encodeURIComponent(q)}`);
        if (ytRes.ok) {
          const ytData = await ytRes.json();
          if (Array.isArray(ytData.ids)) {
            ytIds = ytData.ids;
          }
        }
      } catch {}

      // 2. Query real live music catalog API to get accurate titles, artists, albums and artwork
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=song&limit=25`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results.map((item: any, idx: number) => ({
            id: `yt_${item.trackId}`,
            title: item.trackName,
            artist: item.artistName,
            album: item.collectionName || item.trackName,
            duration: Math.round((item.trackTimeMillis || 195000) / 1000),
            coverUrl: (item.artworkUrl100 || '').replace('100x100bb.jpg', '600x600bb.jpg'),
            source: 'youtube' as const,
            youtubeId: ytIds[idx] || undefined,
            streamUrl: item.previewUrl,
            votes: Math.floor(Math.random() * 20),
            dropTime: 25
          }));
        }
      }
    } catch (err) {
      console.warn('Live YouTube Music search failed, checking local matches:', err);
    }

    // Fallback: Local search against featured catalog
    const qLower = q.toLowerCase();
    return FEATURED_YOUTUBE_TRACKS.filter(
      (t) => t.title.toLowerCase().includes(qLower) || t.artist.toLowerCase().includes(qLower)
    );
  }
}
