import { UserProfile, StoredUser } from '../types';

const USERS_DB_KEY = 'musily_users_db';
const SESSION_KEY = 'musily_session_user';

const INITIAL_USERS: StoredUser[] = [
  {
    id: 'user_demo_1',
    name: 'Demo DJ',
    email: 'demo@musily.app',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 86400000,
    spotifyConnected: true,
    spotifyUsername: 'demomusic_spot',
    spotifyPasswordOrToken: '••••••••••••',
    youtubeConnected: true,
    youtubeChannel: 'DemoBangersYT',
    youtubePasswordOrToken: '••••••••••••'
  }
];

export class AuthService {
  private static getDb(): StoredUser[] {
    if (typeof window === 'undefined') return INITIAL_USERS;
    try {
      const data = localStorage.getItem(USERS_DB_KEY);
      if (!data) {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  private static saveDb(users: StoredUser[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users database:', e);
    }
  }

  static getCurrentSession(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static login(identifier: string, password: string): {
    success: boolean;
    user?: UserProfile;
    error?: string;
    notFound?: boolean;
  } {
    const trimmed = identifier.trim().toLowerCase();
    const users = this.getDb();

    const existing = users.find(
      (u) => u.email.toLowerCase() === trimmed || u.name.toLowerCase() === trimmed
    );

    if (!existing) {
      return {
        success: false,
        error: `No account found for "${identifier}". Please register your account.`,
        notFound: true
      };
    }

    if (existing.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please verify and try again.'
      };
    }

    const { password: _, spotifyPasswordOrToken: __, youtubePasswordOrToken: ___, ...userProfile } = existing;

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    } catch {}

    return {
      success: true,
      user: userProfile
    };
  }

  static register(data: {
    name: string;
    email: string;
    password: string;
    spotifyUsername?: string;
    spotifyPassword?: string;
    youtubeChannel?: string;
    youtubePassword?: string;
  }): {
    success: boolean;
    user?: UserProfile;
    error?: string;
  } {
    if (!data.name.trim() || !data.email.trim() || !data.password) {
      return {
        success: false,
        error: 'Name, email, and password are required to create an account.'
      };
    }

    const users = this.getDb();
    const emailNorm = data.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === emailNorm)) {
      return {
        success: false,
        error: `An account with email "${data.email}" already exists. Please log in instead.`
      };
    }

    const hasSpotify = !!(data.spotifyUsername && data.spotifyUsername.trim());
    const hasYouTube = !!(data.youtubeChannel && data.youtubeChannel.trim());

    const newUser: StoredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.name.trim())}`,
      createdAt: Date.now(),
      spotifyConnected: hasSpotify,
      spotifyUsername: hasSpotify ? data.spotifyUsername?.trim() : undefined,
      spotifyPasswordOrToken: hasSpotify ? (data.spotifyPassword || 'linked') : undefined,
      youtubeConnected: hasYouTube,
      youtubeChannel: hasYouTube ? data.youtubeChannel?.trim() : undefined,
      youtubePasswordOrToken: hasYouTube ? (data.youtubePassword || 'linked') : undefined
    };

    users.push(newUser);
    this.saveDb(users);

    const { password: _, spotifyPasswordOrToken: __, youtubePasswordOrToken: ___, ...userProfile } = newUser;

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    } catch {}

    return {
      success: true,
      user: userProfile
    };
  }

  static logout() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {}
  }

  static updateConnectedAccounts(
    userId: string,
    spotify: { connected: boolean; username?: string; password?: string },
    youtube: { connected: boolean; channel?: string; password?: string }
  ): UserProfile | null {
    const users = this.getDb();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;

    users[index].spotifyConnected = spotify.connected;
    if (spotify.username) users[index].spotifyUsername = spotify.username;
    if (spotify.password) users[index].spotifyPasswordOrToken = spotify.password;

    users[index].youtubeConnected = youtube.connected;
    if (youtube.channel) users[index].youtubeChannel = youtube.channel;
    if (youtube.password) users[index].youtubePasswordOrToken = youtube.password;

    this.saveDb(users);

    const { password: _, spotifyPasswordOrToken: __, youtubePasswordOrToken: ___, ...updatedProfile } = users[index];
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedProfile));
    } catch {}

    return updatedProfile;
  }
}
