import { Track, Artist } from '../types';
import { SpotifyService, FEATURED_SPOTIFY_TRACKS } from './spotifyService';
import { YouTubeService, FEATURED_YOUTUBE_TRACKS } from './youtubeService';
import { OFFICIAL_ALBUMS, OFFICIAL_SINGLES_AND_EPS, OFFICIAL_ARTISTS } from './catalogService';

export interface RecentRecommendation {
  track: Track;
  inspiredBy: string;
  sourceType: 'recent' | 'followed' | 'liked' | 'inspired';
}

export type GenreCluster =
  | 'punjabi'
  | 'synthpop'
  | 'hiphop'
  | 'bollywood'
  | 'pop'
  | 'latin'
  | 'rock'
  | 'global';

export interface GenreMeta {
  genre: string;
  cluster: GenreCluster;
  confidence: number;
  sisterArtists: string[];
}

export const ALL_AVAILABLE_TRACKS: Track[] = (() => {
  const allRaw: Track[] = [
    ...FEATURED_SPOTIFY_TRACKS,
    ...FEATURED_YOUTUBE_TRACKS,
    ...OFFICIAL_ALBUMS.flatMap((a) => a.tracks),
    ...OFFICIAL_SINGLES_AND_EPS.flatMap((a) => a.tracks)
  ];
  const uniqueMap = new Map<string, Track>();
  allRaw.forEach((t) => {
    if (!uniqueMap.has(t.id)) {
      uniqueMap.set(t.id, t);
    }
  });
  return Array.from(uniqueMap.values());
})();

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

  // =========================================================================
  // AI GENRE SMART AUTOPLAY & SUGGESTIONS ENGINE
  // Accurately classifies track genre and auto-suggests tracks of the SAME genre
  // =========================================================================

  static detectTrackGenre(track: Track): GenreMeta {
    if (!track) {
      return {
        genre: 'Pop / Global',
        cluster: 'pop',
        confidence: 0.5,
        sisterArtists: ['Taylor Swift', 'Sabrina Carpenter']
      };
    }

    const titleLower = (track.title || '').toLowerCase();
    const artistLower = (track.artist || '').toLowerCase();
    const albumLower = (track.album || '').toLowerCase();
    const explicitGenre = (track.genre || track.aiGenreMatch || '').toLowerCase();
    const combined = `${titleLower} ${artistLower} ${albumLower} ${explicitGenre}`;

    // 1. Direct album match in official releases
    for (const alb of [...OFFICIAL_ALBUMS, ...OFFICIAL_SINGLES_AND_EPS]) {
      const matchTrack = alb.tracks.some(
        (t) => t.id === track.id || t.title.toLowerCase() === titleLower
      );
      const matchAlbum = alb.title.toLowerCase() === albumLower;
      if (matchTrack || matchAlbum) {
        const albGenre = alb.genre || '';
        const albGenreLower = albGenre.toLowerCase();
        if (albGenreLower.includes('punjabi') || albGenreLower.includes('desi')) {
          return {
            genre: albGenre || 'Punjabi Pop',
            cluster: 'punjabi',
            confidence: 0.98,
            sisterArtists: ['Karan Aujla', 'Diljit Dosanjh', 'AP Dhillon', 'Gurinder Gill', 'Riar Saab', 'Ikky']
          };
        }
        if (albGenreLower.includes('synthpop') || albGenreLower.includes('r&b') || albGenreLower.includes('new wave')) {
          return {
            genre: albGenre || 'R&B / Synthpop',
            cluster: 'synthpop',
            confidence: 0.98,
            sisterArtists: ['The Weeknd', 'Daft Punk', 'Lana Del Rey']
          };
        }
        if (albGenreLower.includes('hip-hop') || albGenreLower.includes('rap')) {
          return {
            genre: albGenre || 'Hip-Hop / Rap',
            cluster: 'hiphop',
            confidence: 0.98,
            sisterArtists: ['Eminem', 'Drake', 'Kendrick Lamar', 'JID', 'Big Sean']
          };
        }
        if (albGenreLower.includes('bollywood') || albGenreLower.includes('soulful pop')) {
          return {
            genre: albGenre || 'Bollywood / Soulful Pop',
            cluster: 'bollywood',
            confidence: 0.98,
            sisterArtists: ['Arijit Singh', 'Kaifi Khalil', 'Sachin-Jigar', 'Vishal Mishra']
          };
        }
        if (albGenreLower.includes('latin') || albGenreLower.includes('reggaeton')) {
          return {
            genre: albGenre || 'Reggaeton / Latin',
            cluster: 'latin',
            confidence: 0.98,
            sisterArtists: ['J Balvin', 'Willy William', 'Luis Fonsi', 'Daddy Yankee']
          };
        }
        if (albGenreLower.includes('pop') || albGenreLower.includes('alternative')) {
          return {
            genre: albGenre || 'Pop / Dance',
            cluster: 'pop',
            confidence: 0.98,
            sisterArtists: ['Taylor Swift', 'Sabrina Carpenter', 'Billie Eilish']
          };
        }
      }
    }

    // 2. Official artist match
    for (const art of OFFICIAL_ARTISTS) {
      if (artistLower.includes(art.name.toLowerCase()) || art.name.toLowerCase().includes(artistLower)) {
        const artGenreLower = art.genre.toLowerCase();
        if (artGenreLower.includes('punjabi')) {
          return {
            genre: art.genre,
            cluster: 'punjabi',
            confidence: 0.95,
            sisterArtists: ['Karan Aujla', 'Diljit Dosanjh', 'AP Dhillon', 'Gurinder Gill', 'Riar Saab', 'Ikky']
          };
        }
        if (artGenreLower.includes('synthpop') || artGenreLower.includes('r&b')) {
          return {
            genre: art.genre,
            cluster: 'synthpop',
            confidence: 0.95,
            sisterArtists: ['The Weeknd', 'Daft Punk', 'Lana Del Rey']
          };
        }
        if (artGenreLower.includes('hip-hop') || artGenreLower.includes('rap')) {
          return {
            genre: art.genre,
            cluster: 'hiphop',
            confidence: 0.95,
            sisterArtists: ['Eminem', 'Drake', 'Kendrick Lamar', 'JID', 'Big Sean']
          };
        }
        if (artGenreLower.includes('bollywood') || artGenreLower.includes('soulful')) {
          return {
            genre: art.genre,
            cluster: 'bollywood',
            confidence: 0.95,
            sisterArtists: ['Arijit Singh', 'Kaifi Khalil', 'Sachin-Jigar', 'Vishal Mishra']
          };
        }
        if (artGenreLower.includes('pop') || artGenreLower.includes('alternative')) {
          return {
            genre: art.genre,
            cluster: 'pop',
            confidence: 0.95,
            sisterArtists: ['Taylor Swift', 'Sabrina Carpenter', 'Billie Eilish']
          };
        }
      }
    }

    // 3. Keyword scoring across clusters for arbitrary tracks (e.g. from Deezer / iTunes / YouTube)
    const punjabiKeywords = ['punjabi', 'desi', 'bhangra', 'aujla', 'diljit', 'dosanjh', 'dhillon', 'karan', 'gurinder', 'gill', 'riar', 'saab', 'ikky', 'tauba', 'kinni', 'softly', 'brown munde', 'saada pyaar', 'ghost', 'ammy virk', 'bad newz', 'not by chance', 'making memories', 'obsessed', 'jatt', 'sidhu', 'moose', 'sharma', 'chani'];
    const synthpopKeywords = ['weeknd', 'synthpop', 'synthwave', 'starboy', 'blinding lights', 'after hours', 'daft punk', 'retro', '80s', 'die for you', 'save your tears', 'in your eyes', 'heartless', 'reminder', 'party monster', 'lana del rey'];
    const hiphopKeywords = ['eminem', 'drake', 'rap', 'hip-hop', 'hiphop', 'slim shady', 'shady', 'houdini', 'lose yourself', 'fuel', 'tobey', 'one dance', 'hotline bling', 'controlla', 'lucifer', '8 mile', 'views', 'guilty conscience', 'kendrick', 'jid', 'big sean', 'travis scott', 'future', 'lil'];
    const bollywoodKeywords = ['arijit', 'kaifi', 'khalil', 'bollywood', 'hindi', 'sufi', 'apna bana le', 'kahani suno', 'jaanam', 'kesariya', 'bhediya', 'sanam', 'mehboob', 'pritam', 'shreya', 'ghoshal', 'atif aslam', 'vishal mishra'];
    const latinKeywords = ['balvin', 'willy william', 'fonsi', 'daddy yankee', 'mi gente', 'despacito', 'latin', 'reggaeton', 'urbano', 'bad bunny', 'rosalia'];
    const popKeywords = ['taylor swift', 'sabrina carpenter', 'billie eilish', 'pop', 'cruel summer', 'taste', 'espresso', 'please please please', 'lover', 'birds of a feather', 'lunch', 'chihiro', 'short n sweet', 'bed chem', 'dua lipa', 'olivia rodrigo'];
    const rockKeywords = ['rock', 'alternative', 'indie', 'guitar', 'coldplay', 'arctic monkeys', 'imagine dragons'];

    const countHits = (keywords: string[]) =>
      keywords.reduce((acc, kw) => (combined.includes(kw) ? acc + 1 : acc), 0);

    const scores: { cluster: GenreCluster; score: number; genre: string; sisterArtists: string[] }[] = [
      { cluster: 'punjabi', score: countHits(punjabiKeywords), genre: 'Punjabi Pop / Desi Hip-Hop', sisterArtists: ['Karan Aujla', 'Diljit Dosanjh', 'AP Dhillon', 'Riar Saab', 'Gurinder Gill'] },
      { cluster: 'synthpop', score: countHits(synthpopKeywords), genre: 'R&B / Synthpop', sisterArtists: ['The Weeknd', 'Daft Punk', 'Lana Del Rey'] },
      { cluster: 'hiphop', score: countHits(hiphopKeywords), genre: 'Hip-Hop / Rap', sisterArtists: ['Eminem', 'Drake', 'Kendrick Lamar', 'JID', 'Big Sean'] },
      { cluster: 'bollywood', score: countHits(bollywoodKeywords), genre: 'Bollywood / Soulful Pop', sisterArtists: ['Arijit Singh', 'Kaifi Khalil', 'Sachin-Jigar', 'Vishal Mishra'] },
      { cluster: 'latin', score: countHits(latinKeywords), genre: 'Reggaeton / Latin Hits', sisterArtists: ['J Balvin', 'Willy William', 'Luis Fonsi', 'Daddy Yankee'] },
      { cluster: 'pop', score: countHits(popKeywords), genre: 'Pop / Chart Hits', sisterArtists: ['Taylor Swift', 'Sabrina Carpenter', 'Billie Eilish'] },
      { cluster: 'rock', score: countHits(rockKeywords), genre: 'Alternative / Rock', sisterArtists: ['Arctic Monkeys', 'Imagine Dragons', 'Coldplay'] },
    ];

    scores.sort((a, b) => b.score - a.score);

    if (scores[0].score > 0) {
      return {
        genre: scores[0].genre,
        cluster: scores[0].cluster,
        confidence: Math.min(0.95, 0.6 + scores[0].score * 0.1),
        sisterArtists: scores[0].sisterArtists
      };
    }

    return {
      genre: 'Pop / Chart Hits',
      cluster: 'pop',
      confidence: 0.6,
      sisterArtists: ['Taylor Swift', 'Sabrina Carpenter', 'The Weeknd']
    };
  }

  // Returns next songs strictly matching the SAME GENRE of the currently played song
  static getAIGenreSuggestions(
    currentTrack: Track,
    count: number = 8,
    excludeIds: string[] = []
  ): Track[] {
    if (!currentTrack) return [];

    const meta = this.detectTrackGenre(currentTrack);
    const excludeSet = new Set<string>([currentTrack.id, ...excludeIds]);
    const currentTitleLower = (currentTrack.title || '').toLowerCase().trim();
    const currentArtistLower = (currentTrack.artist || '').toLowerCase().trim();

    interface ScoredTrack {
      track: Track;
      score: number;
    }

    const scored: ScoredTrack[] = [];

    for (const candidate of ALL_AVAILABLE_TRACKS) {
      if (excludeSet.has(candidate.id)) continue;
      const candTitleLower = (candidate.title || '').toLowerCase().trim();
      if (candTitleLower === currentTitleLower) continue;

      const candMeta = this.detectTrackGenre(candidate);
      const candArtistLower = (candidate.artist || '').toLowerCase().trim();

      // STRICT GENRE MATCHING: Candidate must share the same genre cluster!
      if (candMeta.cluster !== meta.cluster) {
        continue;
      }

      let score = 100; // Base score for exact genre cluster match

      // Bonus if candidate is by a sister artist of this genre
      const isSister = meta.sisterArtists.some((sa) =>
        candArtistLower.includes(sa.toLowerCase()) || sa.toLowerCase().includes(candArtistLower)
      );
      if (isSister) {
        score += 40;
      }

      // Bonus if candidate is another song by the current artist
      if (candArtistLower.includes(currentArtistLower) || currentArtistLower.includes(candArtistLower)) {
        score += 35;
      }

      // Popularity / Hook drop bonus
      if (candidate.dropTime && candidate.dropTime > 0) {
        score += 10;
      }
      if (candidate.votes) {
        score += Math.min(candidate.votes, 25);
      }

      scored.push({ track: candidate, score });
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // If we have fewer than count in the exact cluster, relax slightly to sibling genres
    if (scored.length < count) {
      for (const candidate of ALL_AVAILABLE_TRACKS) {
        if (excludeSet.has(candidate.id)) continue;
        const candTitleLower = (candidate.title || '').toLowerCase().trim();
        if (candTitleLower === currentTitleLower) continue;
        if (scored.some((s) => s.track.id === candidate.id)) continue;

        const candMeta = this.detectTrackGenre(candidate);
        const isSibling =
          (meta.cluster === 'punjabi' && candMeta.cluster === 'bollywood') ||
          (meta.cluster === 'bollywood' && candMeta.cluster === 'punjabi') ||
          (meta.cluster === 'synthpop' && candMeta.cluster === 'pop') ||
          (meta.cluster === 'pop' && candMeta.cluster === 'synthpop');

        if (isSibling) {
          scored.push({ track: candidate, score: 50 });
          if (scored.length >= count) break;
        }
      }
    }

    // Return mapped tracks with AI metadata tag
    return scored.slice(0, count).map((item) => ({
      ...item.track,
      aiGenreMatch: meta.genre,
      isAiSuggested: true
    }));
  }
}
