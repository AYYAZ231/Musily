import { Track } from '../types';

type PlaybackListener = (state: {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  track: Track | null;
}) => void;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export class AudioPlayer {
  private static instance: AudioPlayer;
  private audioEl: HTMLAudioElement | null = null;
  private ytPlayer: any = null;
  private isYtReady: boolean = false;
  private currentTrack: Track | null = null;
  private isPlaying: boolean = false;
  private currentTime: number = 0;
  private duration: number = 0;
  private volume: number = 0.8;
  private isMuted: boolean = false;
  private dropMode: boolean = false; // "The Drop" Mode: jumps straight to hook
  private crossfadeDuration: number = 4; // seconds
  private listeners: Set<PlaybackListener> = new Set();
  private timer: any = null;

  private constructor() {
    this.initAudio();
    this.initYouTube();
    this.initMediaSession();
  }

  static getInstance(): AudioPlayer {
    if (!AudioPlayer.instance) {
      AudioPlayer.instance = new AudioPlayer();
    }
    return AudioPlayer.instance;
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    this.audioEl = new Audio();
    this.audioEl.preload = 'auto';

    this.audioEl.addEventListener('timeupdate', () => {
      if (this.audioEl && !this.isUsingYouTube()) {
        this.currentTime = this.audioEl.currentTime;
        this.duration = this.audioEl.duration || this.currentTrack?.duration || 0;
        this.notify();
      }
    });

    this.audioEl.addEventListener('ended', () => {
      this.handleTrackEnded();
    });

    this.audioEl.addEventListener('play', () => {
      this.isPlaying = true;
      this.notify();
    });

    this.audioEl.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });
  }

  private initYouTube() {
    if (typeof window === 'undefined') return;

    // Load YouTube IFrame API script if not loaded
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Set callback
    window.onYouTubeIframeAPIReady = () => {
      // Create hidden container for YT player
      let container = document.getElementById('musily-yt-player');
      if (!container) {
        container = document.createElement('div');
        container.id = 'musily-yt-player';
        container.style.position = 'fixed';
        container.style.bottom = '-9999px';
        container.style.left = '-9999px';
        container.style.width = '1px';
        container.style.height = '1px';
        container.style.opacity = '0';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
      }

      this.ytPlayer = new window.YT.Player('musily-yt-player', {
        height: '100',
        width: '100',
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: () => {
            this.isYtReady = true;
            this.ytPlayer.setVolume(this.volume * 100);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1) {
              this.isPlaying = true;
              this.startTicker();
            } else if (event.data === 2) {
              this.isPlaying = false;
              this.stopTicker();
            } else if (event.data === 0) {
              this.handleTrackEnded();
            }
            this.notify();
          }
        }
      });
    };
  }

  private initMediaSession() {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          this.seek(details.seekTime);
        }
      });
    }
  }

  private updateMediaSession(track: Track) {
    if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: [
          { src: track.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    }
  }

  private isUsingYouTube(): boolean {
    return !!(this.currentTrack && (this.currentTrack.youtubeId || !this.currentTrack.streamUrl));
  }

  private startTicker() {
    this.stopTicker();
    this.timer = setInterval(() => {
      if (this.isUsingYouTube() && this.ytPlayer && this.ytPlayer.getCurrentTime) {
        try {
          this.currentTime = this.ytPlayer.getCurrentTime() || 0;
          this.duration = this.ytPlayer.getDuration() || this.currentTrack?.duration || 0;
          this.notify();
        } catch {}
      }
    }, 500);
  }

  private stopTicker() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async loadTrack(track: Track, autoPlay: boolean = true) {
    this.currentTrack = track;
    this.currentTime = 0;
    this.duration = track.duration || 180;
    this.updateMediaSession(track);

    // Stop current audio element
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }

    const startSeconds = this.dropMode ? (track.dropTime || Math.floor(track.duration * 0.28)) : 0;

    if (track.streamUrl) {
      // Direct stream
      if (this.ytPlayer && this.isYtReady) {
        try { this.ytPlayer.stopVideo(); } catch {}
      }
      if (this.audioEl) {
        this.audioEl.src = track.streamUrl;
        this.audioEl.currentTime = startSeconds;
        if (autoPlay) {
          await this.audioEl.play().catch(console.error);
        }
      }
    } else {
      // YouTube stream
      const ytid = track.youtubeId || '34Na4j8AVgA';
      if (this.ytPlayer && this.isYtReady) {
        if (autoPlay) {
          this.ytPlayer.loadVideoById({
            videoId: ytid,
            startSeconds: startSeconds
          });
          this.isPlaying = true;
          this.startTicker();
        } else {
          this.ytPlayer.cueVideoById({
            videoId: ytid,
            startSeconds: startSeconds
          });
          this.isPlaying = false;
        }
      } else {
        // YT not ready yet, set pending play
        setTimeout(() => this.loadTrack(track, autoPlay), 500);
      }
    }

    this.notify();
  }

  async play() {
    if (!this.currentTrack) return;
    if (this.isUsingYouTube()) {
      if (this.ytPlayer && this.isYtReady) {
        try {
          this.ytPlayer.playVideo();
          this.isPlaying = true;
          this.startTicker();
        } catch {}
      }
    } else if (this.audioEl) {
      await this.audioEl.play().catch(console.error);
      this.isPlaying = true;
    }
    this.notify();
  }

  pause() {
    if (this.isUsingYouTube()) {
      if (this.ytPlayer && this.isYtReady) {
        try {
          this.ytPlayer.pauseVideo();
        } catch {}
      }
    } else if (this.audioEl) {
      this.audioEl.pause();
    }
    this.isPlaying = false;
    this.stopTicker();
    this.notify();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(seconds: number) {
    this.currentTime = seconds;
    if (this.isUsingYouTube()) {
      if (this.ytPlayer && this.isYtReady) {
        try {
          this.ytPlayer.seekTo(seconds, true);
        } catch {}
      }
    } else if (this.audioEl) {
      this.audioEl.currentTime = seconds;
    }
    this.notify();
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    if (this.ytPlayer && this.isYtReady) {
      try {
        this.ytPlayer.setVolume(this.volume * 100);
      } catch {}
    }
    this.notify();
  }

  setDropMode(enabled: boolean) {
    this.dropMode = enabled;
    // If enabled and current track is near beginning, jump to drop!
    if (enabled && this.currentTrack && this.currentTime < 15) {
      const dropTime = this.currentTrack.dropTime || Math.floor(this.currentTrack.duration * 0.28);
      this.seek(dropTime);
    }
    this.notify();
  }

  getDropMode(): boolean {
    return this.dropMode;
  }

  subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    // Send initial state
    listener({
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      track: this.currentTrack
    });
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = {
      isPlaying: this.isPlaying,
      currentTime: this.currentTime,
      duration: this.duration,
      track: this.currentTrack
    };
    this.listeners.forEach((fn) => fn(state));
  }

  private onTrackEndedCallback: (() => void) | null = null;

  setOnTrackEnded(cb: () => void) {
    this.onTrackEndedCallback = cb;
  }

  private handleTrackEnded() {
    this.isPlaying = false;
    this.stopTicker();
    this.notify();
    if (this.onTrackEndedCallback) {
      this.onTrackEndedCallback();
    }
  }
}
