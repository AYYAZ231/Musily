export type MusicSource = 'spotify' | 'youtube' | 'local';
export type ThemeMode = 'dark' | 'light' | 'glass';

export interface EqualizerBands {
  b32: number;   // 32 Hz (Sub-Bass)
  b64: number;   // 64 Hz (Bass)
  b125: number;  // 125 Hz (Low-Mid / Kick punch)
  b250: number;  // 250 Hz (Warmth)
  b500: number;  // 500 Hz (Body)
  b1k: number;   // 1 kHz (Lead / Vocals)
  b2k: number;   // 2 kHz (Vocal presence)
  b4k: number;   // 4 kHz (Attack / Clarity)
  b8k: number;   // 8 kHz (Cymbals / Sparkle)
  b16k: number;  // 16 kHz (Air / Brilliance)
}

export interface EqualizerSettings {
  isEnabled: boolean;
  preamp: number; // dB (-12 to +12)
  bassBoost: number; // 0 to 10
  spatialAudio: 'off' | 'studio' | 'concert' | 'binaural';
  bands: EqualizerBands;
  preset: string;
  aiAutoOptimize: boolean;
  aiLastPrompt?: string;
  aiLastInsight?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  year: string;
  releaseDate?: string;
  trackCount: number;
  type: 'album' | 'single' | 'ep';
  tracks: Track[];
  source?: MusicSource;
  genre?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  genre: string;
  bio?: string;
  topTracks?: Track[];
  albums?: Album[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  source: MusicSource;
  streamUrl?: string;
  youtubeId?: string;
  spotifyUri?: string;
  albumId?: string;
  trackNumber?: number;
  addedBy?: {
    id: string;
    name: string;
    avatar: string;
  };
  votes: number;
  votedUserIds?: string[];
  dropTime?: number; // timestamp in seconds where the drop/chorus starts (Hook Drop mode)
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  hasAux: boolean;
  color: string;
  joinedAt: number;
}

export interface PartyRoom {
  id: string;
  name: string;
  hostId: string;
  auxOwnerId: string;
  isPlaying: boolean;
  currentTrack: Track | null;
  playbackPosition: number; // seconds
  lastSyncTimestamp: number;
  dropMode: boolean; // Hook drop format: drop straight into hook/chorus
  crossfade: boolean;
  crossfadeDuration: number; // seconds (default 5s)
  queue: Track[];
  history: Track[];
  participants: Participant[];
}

export interface Reaction {
  id: string;
  emoji: string;
  senderName: string;
  x: number; // percentage across screen 10-90%
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  source: MusicSource;
  trackCount: number;
  tracks: Track[];
}

export interface LinkedAccounts {
  spotify: {
    isConnected: boolean;
    username?: string;
    avatar?: string;
    playlists?: Playlist[];
  };
  youtube: {
    isConnected: boolean;
    channelTitle?: string;
    avatar?: string;
    playlists?: Playlist[];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: number;
  spotifyConnected: boolean;
  spotifyUsername?: string;
  youtubeConnected: boolean;
  youtubeChannel?: string;
}

export interface StoredUser extends UserProfile {
  password: string;
  spotifyPasswordOrToken?: string;
  youtubePasswordOrToken?: string;
}

export type ActiveTab = 'home' | 'search' | 'party' | 'library' | 'settings';
