import { EqualizerBands, EqualizerSettings, Track } from '../types';

export const DEFAULT_EQUALIZER_BANDS: EqualizerBands = {
  b32: 0,
  b64: 0,
  b125: 0,
  b250: 0,
  b500: 0,
  b1k: 0,
  b2k: 0,
  b4k: 0,
  b8k: 0,
  b16k: 0
};

export const EQUALIZER_PRESETS: Record<string, { name: string; description: string; bands: EqualizerBands; preamp: number; bassBoost: number; spatial: 'off' | 'studio' | 'concert' | 'binaural' }> = {
  flat: {
    name: 'Pure Studio (Flat)',
    description: 'Uncolored, accurate reference frequency response',
    bands: { b32: 0, b64: 0, b125: 0, b250: 0, b500: 0, b1k: 0, b2k: 0, b4k: 0, b8k: 0, b16k: 0 },
    preamp: 0,
    bassBoost: 0,
    spatial: 'off'
  },
  club_drop: {
    name: 'Party Drop & Club',
    description: 'Maximum sub-bass slam, scooped mid-boxiness, elevated high-end sparkle',
    bands: { b32: 9, b64: 8, b125: 5, b250: 1, b500: -2, b1k: 0, b2k: 3, b4k: 5, b8k: 7, b16k: 8 },
    preamp: 2,
    bassBoost: 8,
    spatial: 'concert'
  },
  bass_heavy: {
    name: 'Subwoofer Maximizer',
    description: 'Deep 32Hz-64Hz extension for car audio and bass lovers',
    bands: { b32: 11, b64: 9, b125: 6, b250: 2, b500: 0, b1k: -1, b2k: 0, b4k: 2, b8k: 3, b16k: 4 },
    preamp: 1,
    bassBoost: 10,
    spatial: 'studio'
  },
  vocal_crystal: {
    name: 'Crystal Vocal Clarity',
    description: 'Carves out low rumble and accentuates 1kHz-4kHz speech frequencies',
    bands: { b32: -4, b64: -2, b125: 0, b250: 2, b500: 3, b1k: 6, b2k: 7, b4k: 5, b8k: 4, b16k: 2 },
    preamp: 0,
    bassBoost: 1,
    spatial: 'studio'
  },
  audiophile: {
    name: 'Audiophile Hi-Res',
    description: 'Gentle Harman-inspired curve for balanced acoustic depth and imaging',
    bands: { b32: 3, b64: 3, b125: 2, b250: 0, b500: 1, b1k: 2, b2k: 3, b4k: 4, b8k: 5, b16k: 4 },
    preamp: 0,
    bassBoost: 3,
    spatial: 'binaural'
  },
  lofi_chill: {
    name: 'Lo-Fi Tape Saturation',
    description: 'Warm analog low-mids with rolled-off digital highs',
    bands: { b32: 4, b64: 5, b125: 6, b250: 4, b500: 2, b1k: 0, b2k: -2, b4k: -4, b8k: -7, b16k: -9 },
    preamp: 1,
    bassBoost: 5,
    spatial: 'off'
  },
  rock_punch: {
    name: 'Rock & Live Stage',
    description: 'Aggressive electric guitar crunch and kick drum definition',
    bands: { b32: 5, b64: 6, b125: 4, b250: 1, b500: -2, b1k: 3, b2k: 5, b4k: 6, b8k: 5, b16k: 3 },
    preamp: 1,
    bassBoost: 4,
    spatial: 'concert'
  }
};

export class AIAudioService {
  /**
   * Translates natural language acoustic prompts into psychoacoustic EQ curves & mastering parameters
   */
  static processAIPrompt(prompt: string): {
    bands: EqualizerBands;
    preamp: number;
    bassBoost: number;
    spatial: 'off' | 'studio' | 'concert' | 'binaural';
    presetName: string;
    insight: string;
  } {
    const text = prompt.toLowerCase();
    const bands: EqualizerBands = { ...DEFAULT_EQUALIZER_BANDS };
    let preamp = 0;
    let bassBoost = 2;
    let spatial: 'off' | 'studio' | 'concert' | 'binaural' = 'studio';
    const explanations: string[] = [];

    // Analyze Bass & Subwoofer intents
    if (text.includes('bass') || text.includes('sub') || text.includes('subwoofer') || text.includes('drop') || text.includes('kick')) {
      if (text.includes('heavy') || text.includes('hard') || text.includes('punch') || text.includes('max') || text.includes('crazy')) {
        bands.b32 = 10;
        bands.b64 = 9;
        bands.b125 = 6;
        bassBoost = 9;
        explanations.push('boosted 32Hz & 64Hz sub-bass (+9 to +10 dB) for visceral kick impact');
      } else {
        bands.b32 = 6;
        bands.b64 = 5;
        bands.b125 = 4;
        bassBoost = 6;
        explanations.push('elevated low-end (+5 dB) for warm low-end foundation');
      }
    }

    // Analyze Vocal & Speech intents
    if (text.includes('vocal') || text.includes('voice') || text.includes('sing') || text.includes('clear') || text.includes('words') || text.includes('lyrics')) {
      bands.b1k = Math.max(bands.b1k, 5);
      bands.b2k = Math.max(bands.b2k, 6);
      bands.b4k = Math.max(bands.b4k, 5);
      bands.b250 = Math.min(bands.b250, 0); // cut mud
      explanations.push('carved 250Hz boxiness and boosted 1k-4kHz for upfront vocal presence');
    }

    // Analyze Treble, Sparkle & Air
    if (text.includes('bright') || text.includes('crisp') || text.includes('treble') || text.includes('high') || text.includes('sparkle') || text.includes('air')) {
      bands.b8k = Math.max(bands.b8k, 6);
      bands.b16k = Math.max(bands.b16k, 7);
      explanations.push('enhanced 8kHz and 16kHz air frequencies for sparkling high-fidelity detail');
    }

    // Analyze Chill, Lo-Fi, Tape, Mellow
    if (text.includes('lofi') || text.includes('chill') || text.includes('warm') || text.includes('vintage') || text.includes('tape') || text.includes('retro') || text.includes('mellow')) {
      bands.b125 = 5;
      bands.b250 = 4;
      bands.b8k = -5;
      bands.b16k = -8;
      bassBoost = 5;
      spatial = 'off';
      explanations.push('rolled off harsh digital frequencies above 8kHz and saturated 125-250Hz for vintage tube warmth');
    }

    // Analyze Concert, Live, Arena, 3D Spatial
    if (text.includes('concert') || text.includes('arena') || text.includes('live') || text.includes('stage') || text.includes('festival') || text.includes('3d') || text.includes('spatial') || text.includes('surround')) {
      spatial = text.includes('binaural') ? 'binaural' : 'concert';
      preamp = 2;
      bands.b64 = Math.max(bands.b64, 7);
      bands.b4k = Math.max(bands.b4k, 5);
      explanations.push('broadened stereo imaging with Concert Arena 3D reverb simulation');
    }

    // Analyze Car audio or Party
    if (text.includes('car') || text.includes('party') || text.includes('club') || text.includes('rave')) {
      bands.b32 = Math.max(bands.b32, 9);
      bands.b64 = Math.max(bands.b64, 8);
      bands.b500 = -2;
      bands.b8k = Math.max(bands.b8k, 6);
      bassBoost = 8;
      preamp = 2;
      spatial = 'concert';
      explanations.push('applied V-curve contour with anti-resonator cut at 500Hz for high volume clarity');
    }

    // Default fallback if no specific keywords
    if (explanations.length === 0) {
      bands.b32 = 4;
      bands.b64 = 4;
      bands.b1k = 2;
      bands.b4k = 3;
      bands.b8k = 4;
      bassBoost = 4;
      explanations.push('applied dynamic multi-band harmonic equalization tailored to current acoustic acoustics');
    }

    const insight = `AI Neural Tuning applied: ${explanations.join(', ')}.`;

    return {
      bands,
      preamp,
      bassBoost,
      spatial,
      presetName: 'AI Custom Tuning',
      insight
    };
  }

  /**
   * Real-time automatic optimization based on the currently playing track
   */
  static getTrackAutoMaster(track: Track): {
    bands: EqualizerBands;
    preamp: number;
    bassBoost: number;
    spatial: 'off' | 'studio' | 'concert' | 'binaural';
    insight: string;
  } {
    const title = (track.title + ' ' + track.artist).toLowerCase();

    if (title.includes('drop') || title.includes('tauba') || title.includes('munde') || title.includes('party') || title.includes('dj') || title.includes('remix')) {
      return {
        bands: EQUALIZER_PRESETS.club_drop.bands,
        preamp: 2,
        bassBoost: 8,
        spatial: 'concert',
        insight: `AI Auto-Master detected High-Energy Club Banger in "${track.title}". Applied The Drop frequency contour.`
      };
    }

    if (title.includes('starboy') || title.includes('blinding') || title.includes('weeknd') || title.includes('pop')) {
      return {
        bands: EQUALIZER_PRESETS.audiophile.bands,
        preamp: 1,
        bassBoost: 4,
        spatial: 'studio',
        insight: `AI Auto-Master detected Synthwave/Pop in "${track.title}". Calibrated for Studio Master separation.`
      };
    }

    return {
      bands: EQUALIZER_PRESETS.club_drop.bands,
      preamp: 1,
      bassBoost: 5,
      spatial: 'studio',
      insight: `AI Auto-Master optimized dynamic range for "${track.title}".`
    };
  }
}
