export type MusicSource = 'spotify' | 'youtube' | 'local';
export type ThemeMode = 'dark' | 'light';

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
  addedBy?: {
    id: string;
    name: string;
    avatar: string;
  };
  votes: number;
  votedUserIds?: string[];
  dropTime?: number; // timestamp in seconds where the drop/chorus starts (NAUX Drop mode)
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
  dropMode: boolean; // NAUX drop format: drop straight into hook/chorus
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

export type ActiveTab = 'home' | 'search' | 'party' | 'library' | 'settings';
