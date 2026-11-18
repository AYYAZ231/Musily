import { useState, useEffect } from 'react';
import { Track, PartyRoom, Participant, Reaction, ChatMessage, ActiveTab, LinkedAccounts, ThemeMode, EqualizerBands, EqualizerSettings, UserProfile } from '../types';
import { AudioPlayer } from '../services/audioPlayer';
import { PartyP2PService, PartyMessage } from '../services/partyP2PService';
import { SpotifyService, FEATURED_SPOTIFY_TRACKS } from '../services/spotifyService';
import { YouTubeService, FEATURED_YOUTUBE_TRACKS } from '../services/youtubeService';
import { DEFAULT_EQUALIZER_BANDS, EQUALIZER_PRESETS, AIAudioService } from '../services/aiAudioService';
import { AuthService } from '../services/authService';
import { RecommendationService } from '../services/recommendationService';
import confetti from 'canvas-confetti';

interface MusicStoreState {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Track[];
  history: Track[];
  activeTab: ActiveTab;
  isPartyActive: boolean;
  partyRoom: PartyRoom | null;
  isHost: boolean;
  hasAux: boolean;
  reactions: Reaction[];
  chatMessages: ChatMessage[];
  isFullPlayerOpen: boolean;
  dropMode: boolean;
  theme: ThemeMode;
  linkedAccounts: LinkedAccounts;
  equalizer: EqualizerSettings;
  isEqualizerOpen: boolean;
}

const INITIAL_QUEUE: Track[] = [
  FEATURED_SPOTIFY_TRACKS[0],
  FEATURED_YOUTUBE_TRACKS[0],
  FEATURED_SPOTIFY_TRACKS[2],
  FEATURED_YOUTUBE_TRACKS[3]
];

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('musily_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'glass') return saved;
  }
  return 'dark';
};

const getInitialEqualizer = (): EqualizerSettings => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('musily_equalizer');
      if (saved) return JSON.parse(saved);
    } catch {}
  }
  return {
    isEnabled: true,
    preamp: 0,
    bassBoost: 3,
    spatialAudio: 'studio',
    bands: { ...DEFAULT_EQUALIZER_BANDS },
    preset: 'flat',
    aiAutoOptimize: false,
    aiLastPrompt: '',
    aiLastInsight: 'AI Acoustic Engine ready. Type any sound vibe or select a preset.'
  };
};

const applyThemeToDOM = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('dark', 'glass');
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'glass') {
    root.classList.add('dark', 'glass');
  }
};

// Session initialization
const initialSessionUser = AuthService.getCurrentSession();

// Singleton in-memory state
let globalState: MusicStoreState = {
  currentUser: initialSessionUser,
  isAuthenticated: !!initialSessionUser,
  currentTrack: INITIAL_QUEUE[0],
  isPlaying: false,
  currentTime: 0,
  duration: INITIAL_QUEUE[0].duration,
  volume: 0.8,
  queue: INITIAL_QUEUE.slice(1),
  history: [],
  activeTab: 'home',
  isPartyActive: false,
  partyRoom: null,
  isHost: true,
  hasAux: true,
  reactions: [],
  chatMessages: [],
  isFullPlayerOpen: false,
  dropMode: false,
  theme: getInitialTheme(),
  equalizer: getInitialEqualizer(),
  isEqualizerOpen: false,
  linkedAccounts: {
    spotify: {
      isConnected: initialSessionUser ? initialSessionUser.spotifyConnected : SpotifyService.isConnected(),
      username: initialSessionUser?.spotifyUsername || initialSessionUser?.name || SpotifyService.getProfile()?.username || 'SpotifyUser',
      avatar: initialSessionUser?.avatar || SpotifyService.getProfile()?.avatar
    },
    youtube: {
      isConnected: initialSessionUser ? initialSessionUser.youtubeConnected : YouTubeService.isConnected(),
      channelTitle: initialSessionUser?.youtubeChannel || initialSessionUser?.name || YouTubeService.getProfile()?.channelTitle || 'YouTubeUser',
      avatar: initialSessionUser?.avatar || YouTubeService.getProfile()?.avatar
    }
  }
};

const listeners = new Set<(state: MusicStoreState) => void>();

function updateState(partial: Partial<MusicStoreState>) {
  globalState = { ...globalState, ...partial };
  listeners.forEach((l) => l(globalState));
}

export function useMusicStore() {
  const [state, setState] = useState<MusicStoreState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const player = AudioPlayer.getInstance();
  const party = PartyP2PService.getInstance();

  useEffect(() => {
    // Apply theme to DOM on mount
    applyThemeToDOM(globalState.theme);

    const unsubPlayer = player.subscribe(({ isPlaying, currentTime, duration, track }) => {
      updateState({
        isPlaying,
        currentTime,
        duration: duration || track?.duration || 0,
        currentTrack: track || globalState.currentTrack
      });
    });

    player.setOnTrackEnded(() => {
      actions.nextTrack();
    });

    const unsubParty = party.subscribe((msg: PartyMessage) => {
      handleIncomingPartyMessage(msg);
    });

    return () => {
      unsubPlayer();
      unsubParty();
    };
  }, []);

  const handleIncomingPartyMessage = (msg: PartyMessage) => {
    const currentUserId = party.getUserId();

    switch (msg.type) {
      case 'SYNC_STATE': {
        const room: PartyRoom = msg.payload.room;
        const hasAux = room.auxOwnerId === currentUserId;
        updateState({
          partyRoom: room,
          queue: room.queue,
          hasAux,
          dropMode: room.dropMode
        });

        if (room.currentTrack && (!globalState.currentTrack || globalState.currentTrack.id !== room.currentTrack.id)) {
          player.loadTrack(room.currentTrack, room.isPlaying);
          player.seek(room.playbackPosition);
        } else if (room.isPlaying !== globalState.isPlaying) {
          if (room.isPlaying) player.play();
          else player.pause();
        }
        break;
      }

      case 'PLAY': {
        player.play();
        break;
      }

      case 'PAUSE': {
        player.pause();
        break;
      }

      case 'SEEK': {
        player.seek(msg.payload.time);
        break;
      }

      case 'TOGGLE_DROP': {
        const drop = !!msg.payload.dropMode;
        player.setDropMode(drop);
        updateState({ dropMode: drop });
        break;
      }

      case 'PASS_AUX': {
        const newAuxId = msg.payload.auxOwnerId;
        const isUserNowAux = newAuxId === currentUserId;
        if (globalState.partyRoom) {
          const updated = {
            ...globalState.partyRoom,
            auxOwnerId: newAuxId,
            participants: globalState.partyRoom.participants.map((p) => ({
              ...p,
              hasAux: p.id === newAuxId
            }))
          };
          updateState({ partyRoom: updated, hasAux: isUserNowAux });
        }
        break;
      }

      case 'REACTION': {
        const newReaction: Reaction = {
          id: 'rx_' + Date.now() + Math.random(),
          emoji: msg.payload.emoji,
          senderName: msg.senderName,
          x: Math.floor(Math.random() * 60) + 20,
          timestamp: Date.now()
        };
        updateState({
          reactions: [...globalState.reactions.slice(-15), newReaction]
        });

        if (msg.payload.emoji === '🎉' || msg.payload.emoji === '🔥') {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.8 }
          });
        }
        break;
      }

      case 'CHAT': {
        const chatItem: ChatMessage = {
          id: 'chat_' + Date.now(),
          senderId: msg.senderId,
          senderName: msg.senderName,
          senderColor: '#10B981',
          text: msg.payload.text,
          timestamp: Date.now()
        };
        updateState({
          chatMessages: [...globalState.chatMessages, chatItem]
        });
        break;
      }

      case 'ADD_QUEUE': {
        const newTrack: Track = msg.payload.track;
        const exists = globalState.queue.some((t) => t.id === newTrack.id);
        if (!exists) {
          const newQueue = [...globalState.queue, newTrack];
          updateState({ queue: newQueue });
          if (globalState.isHost && globalState.partyRoom) {
            syncPartyRoomState({ ...globalState.partyRoom, queue: newQueue });
          }
        }
        break;
      }

      case 'VOTE_TRACK': {
        const trackId = msg.payload.trackId;
        const newQueue = globalState.queue.map((t) => {
          if (t.id === trackId) {
            return { ...t, votes: t.votes + 1 };
          }
          return t;
        });
        newQueue.sort((a, b) => b.votes - a.votes);
        updateState({ queue: newQueue });
        if (globalState.isHost && globalState.partyRoom) {
          syncPartyRoomState({ ...globalState.partyRoom, queue: newQueue });
        }
        break;
      }

      case 'USER_JOINED': {
        if (globalState.isHost && globalState.partyRoom) {
          const newPart: Participant = {
            id: msg.payload.id,
            name: msg.payload.name,
            avatar: msg.payload.avatar,
            isHost: false,
            hasAux: false,
            color: '#10B981',
            joinedAt: Date.now()
          };
          const updatedParts = [...globalState.partyRoom.participants, newPart];
          const updatedRoom = { ...globalState.partyRoom, participants: updatedParts };
          updateState({ partyRoom: updatedRoom });

          party.sendMessage({
            type: 'SYNC_STATE',
            payload: { room: updatedRoom },
            senderId: party.getUserId(),
            senderName: party.getUserName()
          });
        }
        break;
      }
    }
  };

  const syncPartyRoomState = (room: PartyRoom) => {
    updateState({ partyRoom: room });
    party.sendMessage({
      type: 'SYNC_STATE',
      payload: { room },
      senderId: party.getUserId(),
      senderName: party.getUserName()
    });
  };

  const saveEqualizerToStorage = (eq: EqualizerSettings) => {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('musily_equalizer', JSON.stringify(eq));
      } catch {}
    }
  };

  const actions = {
    setTheme: (theme: ThemeMode) => {
      applyThemeToDOM(theme);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('musily_theme', theme);
      }
      updateState({ theme });
    },

    toggleTheme: () => {
      const nextTheme: ThemeMode =
        globalState.theme === 'dark' ? 'light' :
        globalState.theme === 'light' ? 'glass' : 'dark';
      actions.setTheme(nextTheme);
    },

    toggleEqualizerModal: (open?: boolean) => {
      const nextOpen = open !== undefined ? open : !globalState.isEqualizerOpen;
      updateState({ isEqualizerOpen: nextOpen });
    },

    toggleEqualizerEnabled: () => {
      const nextState = {
        ...globalState.equalizer,
        isEnabled: !globalState.equalizer.isEnabled
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
    },

    setEqualizerBands: (bands: Partial<EqualizerBands>) => {
      const updatedBands = { ...globalState.equalizer.bands, ...bands };
      const nextState: EqualizerSettings = {
        ...globalState.equalizer,
        bands: updatedBands,
        preset: 'custom'
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
    },

    setEqualizerPreamp: (preamp: number) => {
      const nextState: EqualizerSettings = {
        ...globalState.equalizer,
        preamp
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
    },

    setEqualizerBassBoost: (boost: number) => {
      const nextState: EqualizerSettings = {
        ...globalState.equalizer,
        bassBoost: boost
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
    },

    setEqualizerSpatial: (spatial: 'off' | 'studio' | 'concert' | 'binaural') => {
      const nextState: EqualizerSettings = {
        ...globalState.equalizer,
        spatialAudio: spatial
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
    },

    applyEqualizerPreset: (presetKey: string) => {
      const preset = EQUALIZER_PRESETS[presetKey];
      if (!preset) return;
      const nextState: EqualizerSettings = {
        ...globalState.equalizer,
        bands: { ...preset.bands },
        preamp: preset.preamp,
        bassBoost: preset.bassBoost,
        spatialAudio: preset.spatial,
        preset: presetKey,
        aiLastInsight: `Applied ${preset.name}: ${preset.description}`
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
    },

    applyAIAudioPrompt: (prompt: string) => {
      const result = AIAudioService.processAIPrompt(prompt);
      const nextState: EqualizerSettings = {
        ...globalState.equalizer,
        bands: result.bands,
        preamp: result.preamp,
        bassBoost: result.bassBoost,
        spatialAudio: result.spatial,
        preset: 'ai_custom',
        aiLastPrompt: prompt,
        aiLastInsight: result.insight
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
      return { success: true, insight: result.insight };
    },

    toggleAIAudioOptimization: () => {
      const nextAuto = !globalState.equalizer.aiAutoOptimize;
      if (nextAuto && globalState.currentTrack) {
        const auto = AIAudioService.getTrackAutoMaster(globalState.currentTrack);
        const nextState: EqualizerSettings = {
          ...globalState.equalizer,
          aiAutoOptimize: true,
          bands: auto.bands,
          preamp: auto.preamp,
          bassBoost: auto.bassBoost,
          spatialAudio: auto.spatial,
          preset: 'ai_auto',
          aiLastInsight: auto.insight
        };
        saveEqualizerToStorage(nextState);
        updateState({ equalizer: nextState });
      } else {
        const nextState: EqualizerSettings = {
          ...globalState.equalizer,
          aiAutoOptimize: false
        };
        saveEqualizerToStorage(nextState);
        updateState({ equalizer: nextState });
      }
    },

    resetEqualizer: () => {
      const nextState: EqualizerSettings = {
        isEnabled: true,
        preamp: 0,
        bassBoost: 3,
        spatialAudio: 'studio',
        bands: { ...DEFAULT_EQUALIZER_BANDS },
        preset: 'flat',
        aiAutoOptimize: false,
        aiLastPrompt: '',
        aiLastInsight: 'Equalizer reset to Pure Studio flat response.'
      };
      saveEqualizerToStorage(nextState);
      updateState({ equalizer: nextState });
    },

    setActiveTab: (tab: ActiveTab) => updateState({ activeTab: tab }),

    setFullPlayerOpen: (open: boolean) => updateState({ isFullPlayerOpen: open }),

    playTrack: (track: Track) => {
      player.loadTrack(track, true);
      RecommendationService.recordListen(track);

      const existingHistory = globalState.history.filter((t) => t.id !== track.id);
      updateState({
        currentTrack: track,
        isPlaying: true,
        history: [track, ...existingHistory].slice(0, 30)
      });

      if (globalState.isPartyActive && (globalState.isHost || globalState.hasAux)) {
        if (globalState.partyRoom) {
          syncPartyRoomState({
            ...globalState.partyRoom,
            currentTrack: track,
            isPlaying: true,
            playbackPosition: 0
          });
        }
      }
    },

    togglePlay: () => {
      const nextPlay = !globalState.isPlaying;
      if (nextPlay) player.play();
      else player.pause();
      updateState({ isPlaying: nextPlay });

      if (globalState.isPartyActive && (globalState.isHost || globalState.hasAux)) {
        party.sendMessage({
          type: nextPlay ? 'PLAY' : 'PAUSE',
          payload: {},
          senderId: party.getUserId(),
          senderName: party.getUserName()
        });
      }
    },

    seek: (seconds: number) => {
      player.seek(seconds);
      updateState({ currentTime: seconds });

      if (globalState.isPartyActive && (globalState.isHost || globalState.hasAux)) {
        party.sendMessage({
          type: 'SEEK',
          payload: { time: seconds },
          senderId: party.getUserId(),
          senderName: party.getUserName()
        });
      }
    },

    setVolume: (vol: number) => {
      player.setVolume(vol);
      updateState({ volume: vol });
    },

    toggleDropMode: () => {
      const nextDrop = !globalState.dropMode;
      player.setDropMode(nextDrop);
      updateState({ dropMode: nextDrop });

      if (globalState.isPartyActive && (globalState.isHost || globalState.hasAux)) {
        party.sendMessage({
          type: 'TOGGLE_DROP',
          payload: { dropMode: nextDrop },
          senderId: party.getUserId(),
          senderName: party.getUserName()
        });
      }
    },

    nextTrack: () => {
      if (globalState.queue.length > 0) {
        const next = globalState.queue[0];
        const newQueue = globalState.queue.slice(1);
        const newHistory = globalState.currentTrack
          ? [globalState.currentTrack, ...globalState.history]
          : globalState.history;

        updateState({ queue: newQueue, history: newHistory });
        actions.playTrack(next);
      }
    },

    prevTrack: () => {
      if (globalState.history.length > 0) {
        const prev = globalState.history[0];
        const newHistory = globalState.history.slice(1);
        updateState({ history: newHistory });
        actions.playTrack(prev);
      } else {
        actions.seek(0);
      }
    },

    addToQueue: (track: Track) => {
      const exists = globalState.queue.some((t) => t.id === track.id);
      if (exists) return;

      const trackWithUser = {
        ...track,
        addedBy: {
          id: party.getUserId(),
          name: party.getUserName(),
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${party.getUserId()}`
        }
      };

      if (globalState.isPartyActive) {
        party.sendMessage({
          type: 'ADD_QUEUE',
          payload: { track: trackWithUser },
          senderId: party.getUserId(),
          senderName: party.getUserName()
        });
      } else {
        updateState({ queue: [...globalState.queue, trackWithUser] });
      }
    },

    voteTrack: (trackId: string) => {
      if (globalState.isPartyActive) {
        party.sendMessage({
          type: 'VOTE_TRACK',
          payload: { trackId },
          senderId: party.getUserId(),
          senderName: party.getUserName()
        });
      } else {
        const updated = globalState.queue.map((t) => {
          if (t.id === trackId) return { ...t, votes: t.votes + 1 };
          return t;
        });
        updated.sort((a, b) => b.votes - a.votes);
        updateState({ queue: updated });
      }
    },

    createParty: async (hostName: string = 'PartyHost') => {
      try {
        const code = await party.createRoom(hostName);
        const initialRoom: PartyRoom = {
          id: code,
          name: `${hostName}'s Party Room 🔥`,
          hostId: party.getUserId(),
          auxOwnerId: party.getUserId(),
          isPlaying: globalState.isPlaying,
          currentTrack: globalState.currentTrack,
          playbackPosition: globalState.currentTime,
          lastSyncTimestamp: Date.now(),
          dropMode: globalState.dropMode,
          crossfade: true,
          crossfadeDuration: 4,
          queue: globalState.queue,
          history: [],
          participants: [
            {
              id: party.getUserId(),
              name: hostName,
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${party.getUserId()}`,
              isHost: true,
              hasAux: true,
              color: '#10B981',
              joinedAt: Date.now()
            }
          ]
        };

        updateState({
          isPartyActive: true,
          partyRoom: initialRoom,
          isHost: true,
          hasAux: true,
          activeTab: 'party'
        });
        return code;
      } catch (err) {
        console.error('Failed to create party room:', err);
        throw err;
      }
    },

    joinParty: async (code: string, userName: string = 'PartyGuest') => {
      try {
        await party.joinRoom(code, userName);
        updateState({
          isPartyActive: true,
          isHost: false,
          hasAux: false,
          activeTab: 'party'
        });
        return true;
      } catch (err) {
        console.error('Failed to join room:', err);
        throw err;
      }
    },

    leaveParty: () => {
      party.leaveRoom();
      updateState({
        isPartyActive: false,
        partyRoom: null,
        isHost: true,
        hasAux: true,
        reactions: [],
        chatMessages: []
      });
    },

    passAux: (participantId: string) => {
      if (!globalState.isHost) return;
      party.sendMessage({
        type: 'PASS_AUX',
        payload: { auxOwnerId: participantId },
        senderId: party.getUserId(),
        senderName: party.getUserName()
      });
    },

    sendReaction: (emoji: string) => {
      party.sendMessage({
        type: 'REACTION',
        payload: { emoji },
        senderId: party.getUserId(),
        senderName: party.getUserName()
      });
    },

    sendChat: (text: string) => {
      if (!text.trim()) return;
      party.sendMessage({
        type: 'CHAT',
        payload: { text },
        senderId: party.getUserId(),
        senderName: party.getUserName()
      });
    },

    linkSpotify: async (username: string) => {
      const res = await SpotifyService.linkAccount(username);
      updateState({
        linkedAccounts: {
          ...globalState.linkedAccounts,
          spotify: {
            isConnected: true,
            username: res.username,
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${res.username}`
          }
        }
      });
    },

    disconnectSpotify: () => {
      SpotifyService.disconnect();
      updateState({
        linkedAccounts: {
          ...globalState.linkedAccounts,
          spotify: { isConnected: false }
        }
      });
    },

    linkYouTube: async (channelTitle: string) => {
      const res = await YouTubeService.linkAccount(channelTitle);
      updateState({
        linkedAccounts: {
          ...globalState.linkedAccounts,
          youtube: {
            isConnected: true,
            channelTitle: res.channelName,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${res.channelName}`
          }
        }
      });
    },

    disconnectYouTube: () => {
      YouTubeService.disconnect();
      updateState({
        linkedAccounts: {
          ...globalState.linkedAccounts,
          youtube: { isConnected: false }
        }
      });
    },

    login: (identifier: string, password: string) => {
      const result = AuthService.login(identifier, password);
      if (result.success && result.user) {
        updateState({
          currentUser: result.user,
          isAuthenticated: true,
          linkedAccounts: {
            spotify: {
              isConnected: result.user.spotifyConnected,
              username: result.user.spotifyUsername || result.user.name,
              avatar: result.user.avatar
            },
            youtube: {
              isConnected: result.user.youtubeConnected,
              channelTitle: result.user.youtubeChannel || result.user.name,
              avatar: result.user.avatar
            }
          }
        });
      }
      return result;
    },

    register: (data: {
      name: string;
      email: string;
      password: string;
      spotifyUsername?: string;
      spotifyPassword?: string;
      youtubeChannel?: string;
      youtubePassword?: string;
    }) => {
      const result = AuthService.register(data);
      if (result.success && result.user) {
        updateState({
          currentUser: result.user,
          isAuthenticated: true,
          linkedAccounts: {
            spotify: {
              isConnected: result.user.spotifyConnected,
              username: result.user.spotifyUsername || result.user.name,
              avatar: result.user.avatar
            },
            youtube: {
              isConnected: result.user.youtubeConnected,
              channelTitle: result.user.youtubeChannel || result.user.name,
              avatar: result.user.avatar
            }
          }
        });
      }
      return result;
    },

    loginWithOAuth: (
      provider: 'spotify' | 'youtube',
      details: {
        username?: string;
        channelTitle?: string;
        avatar?: string;
        email?: string;
        token?: string;
      }
    ) => {
      const result = AuthService.loginWithOAuth(provider, details);
      if (result.success && result.user) {
        updateState({
          currentUser: result.user,
          isAuthenticated: true,
          linkedAccounts: {
            spotify: {
              isConnected: result.user.spotifyConnected,
              username: result.user.spotifyUsername || result.user.name,
              avatar: result.user.avatar
            },
            youtube: {
              isConnected: result.user.youtubeConnected,
              channelTitle: result.user.youtubeChannel || result.user.name,
              avatar: result.user.avatar
            }
          }
        });
      }
      return result;
    },

    logout: () => {
      AuthService.logout();
      updateState({
        currentUser: null,
        isAuthenticated: false
      });
    }
  };

  return { state, actions };
}
