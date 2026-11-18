import { Album, Artist, Track } from '../types';

export const OFFICIAL_ARTISTS: Artist[] = [
  {
    id: 'art_eminem',
    name: 'Eminem',
    genre: 'Hip-Hop/Rap',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/7fa738468c9a73ff98c1e1b78d622b81/1000x1000-000000-80-0-0.jpg',
    bio: 'One of the best-selling music artists of all time with 15 Grammy Awards.'
  },
  {
    id: 'art_the_weeknd',
    name: 'The Weeknd',
    genre: 'R&B / Synthpop',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/581693b4724a7fcfa754455101e13a44/1000x1000-000000-80-0-0.jpg',
    bio: 'Diamond-certified superstar known for Blinding Lights, Starboy, and cinematic concept albums.'
  },
  {
    id: 'art_karan_aujla',
    name: 'Karan Aujla',
    genre: 'Punjabi Pop / Desi Hip-Hop',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/a91a1d5ea91e85e4f0966569b50e8d6a/1000x1000-000000-80-0-0.jpg',
    bio: 'Global Punjabi music sensation behind Tauba Tauba, Softly, and Making Memories.'
  },
  {
    id: 'art_diljit_dosanjh',
    name: 'Diljit Dosanjh',
    genre: 'Punjabi / World',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/79b85e695e0ca6529e56bf3b628e92bd/1000x1000-000000-80-0-0.jpg',
    bio: 'Record-shattering Punjabi singer, international festival headliner, and cultural icon.'
  },
  {
    id: 'art_arijit_singh',
    name: 'Arijit Singh',
    genre: 'Bollywood / Soulful Pop',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/ac5350cff290edd5b69fa584b8b1bd4f/1000x1000-000000-80-0-0.jpg',
    bio: 'The voice of modern Indian cinema with over 100M+ monthly global streams.'
  },
  {
    id: 'art_taylor_swift',
    name: 'Taylor Swift',
    genre: 'Pop / Singer-Songwriter',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/cc2495870fe1a792ad0cdb05501ad5ec/1000x1000-000000-80-0-0.jpg',
    bio: '14-time Grammy winner and global musical phenomenon.'
  },
  {
    id: 'art_billie_eilish',
    name: 'Billie Eilish',
    genre: 'Alternative / Pop',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/8eab1a9a644889aabaca1e193e05f984/1000x1000-000000-80-0-0.jpg',
    bio: 'Multi-Academy and Grammy-winning pioneer behind Hit Me Hard and Soft.'
  },
  {
    id: 'art_drake',
    name: 'Drake',
    genre: 'Hip-Hop / R&B',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/eb0ed5b21d1ea5af021fc074ded0e91f/1000x1000-000000-80-0-0.jpg',
    bio: 'Billboard chart leader and global hip-hop powerhouse.'
  },
  {
    id: 'art_sabrina_carpenter',
    name: 'Sabrina Carpenter',
    genre: 'Pop',
    avatarUrl: 'https://cdn-images.dzcdn.net/images/artist/4a9cdc7737e2a0e59b4917b47884b859/1000x1000-000000-80-0-0.jpg',
    bio: 'Chart-topping pop princess with global anthems Espresso and Taste.'
  },
  {
    id: 'art_ap_dhillon',
    name: 'AP Dhillon',
    genre: 'Punjabi / R&B',
    avatarUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg',
    bio: 'Pioneer of the modern wave of Punjabi synthwave and hip-hop.'
  }
];

export const OFFICIAL_ALBUMS: Album[] = [
  {
    id: 'alb_starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg',
    year: '2016',
    releaseDate: 'November 25, 2016',
    trackCount: 18,
    type: 'album',
    genre: 'R&B / Synthpop',
    tracks: [
      { id: 'sb_1', title: 'Starboy (feat. Daft Punk)', artist: 'The Weeknd', album: 'Starboy', duration: 230, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: '34Na4j8AVgA', votes: 45, dropTime: 42, trackNumber: 1 },
      { id: 'sb_2', title: 'Party Monster', artist: 'The Weeknd', album: 'Starboy', duration: 249, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 20, dropTime: 30, trackNumber: 2 },
      { id: 'sb_3', title: 'False Alarm', artist: 'The Weeknd', album: 'Starboy', duration: 220, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 15, dropTime: 25, trackNumber: 3 },
      { id: 'sb_4', title: 'Reminder', artist: 'The Weeknd', album: 'Starboy', duration: 218, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 28, dropTime: 22, trackNumber: 4 },
      { id: 'sb_5', title: 'Rockin’', artist: 'The Weeknd', album: 'Starboy', duration: 232, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 12, dropTime: 28, trackNumber: 5 },
      { id: 'sb_6', title: 'Secrets', artist: 'The Weeknd', album: 'Starboy', duration: 265, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 18, dropTime: 35, trackNumber: 6 },
      { id: 'sb_7', title: 'True Colors', artist: 'The Weeknd', album: 'Starboy', duration: 206, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 14, dropTime: 40, trackNumber: 7 },
      { id: 'sb_8', title: 'Stargirl Interlude (feat. Lana Del Rey)', artist: 'The Weeknd', album: 'Starboy', duration: 111, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 22, dropTime: 15, trackNumber: 8 },
      { id: 'sb_9', title: 'Sidewalks (feat. Kendrick Lamar)', artist: 'The Weeknd', album: 'Starboy', duration: 231, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 31, dropTime: 32, trackNumber: 9 },
      { id: 'sb_10', title: 'Die for You', artist: 'The Weeknd', album: 'Starboy', duration: 260, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 55, dropTime: 38, trackNumber: 10 },
      { id: 'sb_11', title: 'I Feel It Coming (feat. Daft Punk)', artist: 'The Weeknd', album: 'Starboy', duration: 269, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 42, dropTime: 24, trackNumber: 11 }
    ]
  },
  {
    id: 'alb_after_hours',
    title: 'After Hours',
    artist: 'The Weeknd',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg',
    year: '2020',
    releaseDate: 'March 20, 2020',
    trackCount: 14,
    type: 'album',
    genre: 'Synthpop / New Wave',
    tracks: [
      { id: 'ah_1', title: 'Alone Again', artist: 'The Weeknd', album: 'After Hours', duration: 250, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 16, dropTime: 35, trackNumber: 1 },
      { id: 'ah_2', title: 'Too Late', artist: 'The Weeknd', album: 'After Hours', duration: 239, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 14, dropTime: 26, trackNumber: 2 },
      { id: 'ah_3', title: 'Heartless', artist: 'The Weeknd', album: 'After Hours', duration: 200, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 38, dropTime: 32, trackNumber: 3 },
      { id: 'ah_4', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: '4NRXx6U8ABQ', votes: 65, dropTime: 28, trackNumber: 4 },
      { id: 'ah_5', title: 'In Your Eyes', artist: 'The Weeknd', album: 'After Hours', duration: 237, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 29, dropTime: 30, trackNumber: 5 },
      { id: 'ah_6', title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours', duration: 215, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 52, dropTime: 25, trackNumber: 6 },
      { id: 'ah_7', title: 'After Hours', artist: 'The Weeknd', album: 'After Hours', duration: 361, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2b/b9/fe/2bb9fef5-d7f3-8345-25a9-db0e79fde4e4/20UMGIM11048.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 34, dropTime: 45, trackNumber: 7 }
    ]
  },
  {
    id: 'alb_death_of_slim_shady',
    title: 'The Death of Slim Shady (Coup De Grâce)',
    artist: 'Eminem',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg',
    year: '2024',
    releaseDate: 'July 12, 2024',
    trackCount: 19,
    type: 'album',
    genre: 'Hip-Hop/Rap',
    tracks: [
      { id: 'doss_1', title: 'Renaissance', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 98, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 21, dropTime: 12, trackNumber: 1 },
      { id: 'doss_2', title: 'Habits (feat. White Gold)', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 298, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 19, dropTime: 28, trackNumber: 2 },
      { id: 'doss_3', title: 'Brand New Dance', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 206, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 24, dropTime: 22, trackNumber: 3 },
      { id: 'doss_4', title: 'Lucifer', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 261, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 27, dropTime: 30, trackNumber: 4 },
      { id: 'doss_5', title: 'Fuel (feat. JID)', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 213, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 44, dropTime: 20, trackNumber: 5 },
      { id: 'doss_6', title: 'Houdini', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 227, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/0f/11/b5/0f11b57e-999e-b93b-41bc-539d71e7e86f/24UMGIM60029.rgb.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: '22tVWwmTie8', votes: 55, dropTime: 25, trackNumber: 6 },
      { id: 'doss_7', title: 'Guilty Conscience 2', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 326, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 38, dropTime: 36, trackNumber: 7 },
      { id: 'doss_8', title: 'Tobey (feat. Big Sean, BabyTron)', artist: 'Eminem', album: 'The Death of Slim Shady', duration: 284, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/d5/ae/23/d5ae23ed-c989-c297-c860-e07f51723001/24UMGIM99176.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 31, dropTime: 24, trackNumber: 8 }
    ]
  },
  {
    id: 'alb_bad_newz',
    title: 'Bad Newz',
    artist: 'Karan Aujla, Sachin-Jigar',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/61/14/fe/6114feef-5714-bd10-9e03-b8c2fc6b00ef/198588763070.jpg/1000x1000bb.jpg',
    year: '2024',
    releaseDate: 'July 19, 2024',
    trackCount: 8,
    type: 'album',
    genre: 'Bollywood / Punjabi',
    tracks: [
      { id: 'bn_1', title: 'Tauba Tauba', artist: 'Karan Aujla, Vicky Kaushal', album: 'Bad Newz', duration: 206, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/61/14/fe/6114feef-5714-bd10-9e03-b8c2fc6b00ef/198588763070.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: 'LK7-_dgAVQE', votes: 55, dropTime: 32, trackNumber: 1 },
      { id: 'bn_2', title: 'Jaanam', artist: 'Vishal Mishra', album: 'Bad Newz', duration: 198, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/61/14/fe/6114feef-5714-bd10-9e03-b8c2fc6b00ef/198588763070.jpg/1000x1000bb.jpg', source: 'spotify', votes: 25, dropTime: 30, trackNumber: 2 },
      { id: 'bn_3', title: 'Mere Mehboob Mere Sanam', artist: 'Alka Yagnik, Udit Narayan', album: 'Bad Newz', duration: 182, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/61/14/fe/6114feef-5714-bd10-9e03-b8c2fc6b00ef/198588763070.jpg/1000x1000bb.jpg', source: 'spotify', votes: 20, dropTime: 24, trackNumber: 3 },
      { id: 'bn_4', title: 'Haule Haule', artist: 'Ammy Virk', album: 'Bad Newz', duration: 175, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/61/14/fe/6114feef-5714-bd10-9e03-b8c2fc6b00ef/198588763070.jpg/1000x1000bb.jpg', source: 'youtube', votes: 18, dropTime: 28, trackNumber: 4 }
    ]
  },
  {
    id: 'alb_ghost',
    title: 'Ghost',
    artist: 'Diljit Dosanjh',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ec/9a/1f/ec9a1fb9-dc98-cd4f-d4c9-01eed5e67b19/859778016276_cover.jpg/1000x1000bb.jpg',
    year: '2023',
    releaseDate: 'September 29, 2023',
    trackCount: 22,
    type: 'album',
    genre: 'Punjabi Pop',
    tracks: [
      { id: 'gh_1', title: 'Kinni Kinni', artist: 'Diljit Dosanjh', album: 'Ghost', duration: 198, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/94/80/be/9480bec1-6ca2-5bae-a7da-d0e7c45633ce/859779847831_cover.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: '2b73u-X5Jg8', votes: 45, dropTime: 28, trackNumber: 1 },
      { id: 'gh_2', title: 'Ghost', artist: 'Diljit Dosanjh', album: 'Ghost', duration: 188, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ec/9a/1f/ec9a1fb9-dc98-cd4f-d4c9-01eed5e67b19/859778016276_cover.jpg/1000x1000bb.jpg', source: 'spotify', votes: 24, dropTime: 26, trackNumber: 2 },
      { id: 'gh_3', title: 'Case', artist: 'Diljit Dosanjh', album: 'Ghost', duration: 205, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ec/9a/1f/ec9a1fb9-dc98-cd4f-d4c9-01eed5e67b19/859778016276_cover.jpg/1000x1000bb.jpg', source: 'youtube', votes: 28, dropTime: 32, trackNumber: 3 },
      { id: 'gh_4', title: 'Jatt Vailly', artist: 'Diljit Dosanjh', album: 'Ghost', duration: 178, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/ec/9a/1f/ec9a1fb9-dc98-cd4f-d4c9-01eed5e67b19/859778016276_cover.jpg/1000x1000bb.jpg', source: 'spotify', votes: 19, dropTime: 20, trackNumber: 4 }
    ]
  },
  {
    id: 'alb_making_memories',
    title: 'Making Memories',
    artist: 'Karan Aujla & Ikky',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/1000x1000bb.jpg',
    year: '2023',
    releaseDate: 'August 18, 2023',
    trackCount: 9,
    type: 'album',
    genre: 'Indian Pop / Hip-Hop',
    tracks: [
      { id: 'mm_1', title: 'Softly', artist: 'Karan Aujla, Ikky', album: 'Making Memories', duration: 155, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: 'cWMxCE2HTag', votes: 48, dropTime: 22, trackNumber: 1 },
      { id: 'mm_2', title: 'What?', artist: 'Karan Aujla, Ikky', album: 'Making Memories', duration: 182, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/1000x1000bb.jpg', source: 'spotify', votes: 26, dropTime: 25, trackNumber: 2 },
      { id: 'mm_3', title: 'You', artist: 'Karan Aujla, Ikky', album: 'Making Memories', duration: 201, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/1000x1000bb.jpg', source: 'spotify', votes: 31, dropTime: 30, trackNumber: 3 },
      { id: 'mm_4', title: 'Jee Ni Lagda', artist: 'Karan Aujla, Ikky', album: 'Making Memories', duration: 172, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/1000x1000bb.jpg', source: 'youtube', votes: 33, dropTime: 27, trackNumber: 4 }
    ]
  },
  {
    id: 'alb_short_n_sweet',
    title: "Short n' Sweet",
    artist: 'Sabrina Carpenter',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/1000x1000bb.jpg',
    year: '2024',
    releaseDate: 'August 23, 2024',
    trackCount: 12,
    type: 'album',
    genre: 'Pop',
    tracks: [
      { id: 'sns_1', title: 'Taste', artist: 'Sabrina Carpenter', album: "Short n' Sweet", duration: 157, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 36, dropTime: 20, trackNumber: 1 },
      { id: 'sns_2', title: 'Please Please Please', artist: 'Sabrina Carpenter', album: "Short n' Sweet", duration: 186, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 42, dropTime: 28, trackNumber: 2 },
      { id: 'sns_3', title: 'Espresso', artist: 'Sabrina Carpenter', album: "Short n' Sweet", duration: 175, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/e8/7b/57e87ba0-5057-9bb9-c247-ce7dbe426e89/24UMGIM55213.rgb.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: 'eVli-tstM5E', votes: 50, dropTime: 24, trackNumber: 3 },
      { id: 'sns_4', title: 'Bed Chem', artist: 'Sabrina Carpenter', album: "Short n' Sweet", duration: 171, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a1/1c/ca/a11ccab6-7d4c-e041-d028-998bcebeb709/24UMGIM61704.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 29, dropTime: 26, trackNumber: 4 }
    ]
  },
  {
    id: 'alb_hit_me_hard_and_soft',
    title: 'HIT ME HARD AND SOFT',
    artist: 'Billie Eilish',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/1000x1000bb.jpg',
    year: '2024',
    releaseDate: 'May 17, 2024',
    trackCount: 10,
    type: 'album',
    genre: 'Alternative / Pop',
    tracks: [
      { id: 'hmh_1', title: 'SKINNY', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', duration: 219, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 22, dropTime: 35, trackNumber: 1 },
      { id: 'hmh_2', title: 'LUNCH', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', duration: 180, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 38, dropTime: 20, trackNumber: 2 },
      { id: 'hmh_3', title: 'CHIHIRO', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', duration: 303, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 34, dropTime: 40, trackNumber: 3 },
      { id: 'hmh_4', title: 'Birds of a Feather', artist: 'Billie Eilish', album: 'HIT ME HARD AND SOFT', duration: 196, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: 'd5gxZEYS5B8', votes: 55, dropTime: 30, trackNumber: 4 }
    ]
  },
  {
    id: 'alb_lover',
    title: 'Lover',
    artist: 'Taylor Swift',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/1000x1000bb.jpg',
    year: '2019',
    releaseDate: 'August 23, 2019',
    trackCount: 18,
    type: 'album',
    genre: 'Pop',
    tracks: [
      { id: 'lov_1', title: 'Cruel Summer', artist: 'Taylor Swift', album: 'Lover', duration: 178, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: 'ic8j13piAhQ', votes: 47, dropTime: 26, trackNumber: 1 },
      { id: 'lov_2', title: 'Lover', artist: 'Taylor Swift', album: 'Lover', duration: 221, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 35, dropTime: 32, trackNumber: 2 },
      { id: 'lov_3', title: 'The Man', artist: 'Taylor Swift', album: 'Lover', duration: 190, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 28, dropTime: 24, trackNumber: 3 },
      { id: 'lov_4', title: 'Paper Rings', artist: 'Taylor Swift', album: 'Lover', duration: 222, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 26, dropTime: 20, trackNumber: 4 }
    ]
  },
  {
    id: 'alb_not_by_chance',
    title: 'Not by Chance',
    artist: 'AP Dhillon, Gurinder Gill',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg',
    year: '2020',
    releaseDate: 'December 23, 2020',
    trackCount: 7,
    type: 'album',
    genre: 'Punjabi Pop',
    tracks: [
      { id: 'nbc_1', title: 'Fateh', artist: 'AP Dhillon, Gurinder Gill', album: 'Not by Chance', duration: 215, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg', source: 'spotify', votes: 20, dropTime: 28, trackNumber: 1 },
      { id: 'nbc_2', title: 'Saada Pyaar', artist: 'AP Dhillon', album: 'Not by Chance', duration: 204, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg', source: 'spotify', votes: 32, dropTime: 30, trackNumber: 2 },
      { id: 'nbc_3', title: 'Brown Munde', artist: 'AP Dhillon, Gurinder Gill, Shinda Kahlon', album: 'Not by Chance', duration: 268, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: 'VNs_cCtdbPc', votes: 52, dropTime: 36, trackNumber: 3 },
      { id: 'nbc_4', title: 'Takeover', artist: 'AP Dhillon, Gurinder Gill', album: 'Not by Chance', duration: 198, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/26/a3/ac/26a3ac64-69e4-95ec-80ab-1f5a477537d2/859742042973_cover.jpg/1000x1000bb.jpg', source: 'spotify', votes: 27, dropTime: 25, trackNumber: 4 }
    ]
  },
  {
    id: 'alb_views',
    title: 'Views',
    artist: 'Drake',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/1000x1000bb.jpg',
    year: '2016',
    releaseDate: 'April 29, 2016',
    trackCount: 20,
    type: 'album',
    genre: 'Hip-Hop/Rap',
    tracks: [
      { id: 'vi_1', title: 'Keep the Family Close', artist: 'Drake', album: 'Views', duration: 328, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 19, dropTime: 40, trackNumber: 1 },
      { id: 'vi_2', title: 'Feel No Ways', artist: 'Drake', album: 'Views', duration: 240, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 28, dropTime: 30, trackNumber: 2 },
      { id: 'vi_3', title: 'Controlla', artist: 'Drake', album: 'Views', duration: 245, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 35, dropTime: 22, trackNumber: 3 },
      { id: 'vi_4', title: 'One Dance', artist: 'Drake, Wizkid, Kyla', album: 'Views', duration: 173, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f2/0d/8b/f20d8bff-a927-ae98-6784-20a1f51cb23e/16UMGIM27642.rgb.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: 'iAbnEUA0wpA', votes: 48, dropTime: 22, trackNumber: 4 },
      { id: 'vi_5', title: 'Hotline Bling', artist: 'Drake', album: 'Views', duration: 267, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 41, dropTime: 32, trackNumber: 5 }
    ]
  },
  {
    id: 'alb_8_mile',
    title: '8 Mile (Music from the Motion Picture)',
    artist: 'Eminem',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/23/fc/0823fcd9-cb44-695b-32bf-b3bf51d9f800/00606949351229.rgb.jpg/1000x1000bb.jpg',
    year: '2002',
    releaseDate: 'October 29, 2002',
    trackCount: 16,
    type: 'album',
    genre: 'Soundtrack / Hip-Hop',
    tracks: [
      { id: '8m_1', title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile Soundtrack', duration: 326, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/23/fc/0823fcd9-cb44-695b-32bf-b3bf51d9f800/00606949351229.rgb.jpg/1000x1000bb.jpg', source: 'spotify', youtubeId: 'Wj7lL6eDOqc', votes: 60, dropTime: 33, trackNumber: 1 },
      { id: '8m_2', title: 'Love Me', artist: 'Eminem, Obie Trice, 50 Cent', album: '8 Mile Soundtrack', duration: 270, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/23/fc/0823fcd9-cb44-695b-32bf-b3bf51d9f800/00606949351229.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 25, dropTime: 28, trackNumber: 2 },
      { id: '8m_3', title: '8 Mile', artist: 'Eminem', album: '8 Mile Soundtrack', duration: 360, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/08/23/fc/0823fcd9-cb44-695b-32bf-b3bf51d9f800/00606949351229.rgb.jpg/1000x1000bb.jpg', source: 'spotify', votes: 34, dropTime: 35, trackNumber: 3 }
    ]
  }
];

export const OFFICIAL_SINGLES_AND_EPS: Album[] = [
  {
    id: 'single_obsessed',
    title: 'Obsessed',
    artist: 'Riar Saab, Abhijay Sharma',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/5c/d6/b5/5cd6b584-174b-d084-2a21-a26b87266716/197190316131.jpg/1000x1000bb.jpg',
    year: '2023',
    trackCount: 1,
    type: 'single',
    genre: 'Punjabi Pop',
    tracks: [
      { id: 'yt_2', title: 'Obsessed', artist: 'Riar Saab, Abhijay Sharma', album: 'Obsessed Single', duration: 185, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/5c/d6/b5/5cd6b584-174b-d084-2a21-a26b87266716/197190316131.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: '4bz8sN5W4Qc', votes: 18, dropTime: 25, trackNumber: 1 }
    ]
  },
  {
    id: 'single_kahani_suno',
    title: 'Kahani Suno 2.0',
    artist: 'Kaifi Khalil',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/ff/cc/7b/ffcc7bba-4005-f2c4-b1f1-3cc49a5e6283/artwork.jpg/1000x1000bb.jpg',
    year: '2022',
    trackCount: 1,
    type: 'single',
    genre: 'Desi Pop',
    tracks: [
      { id: 'yt_6', title: 'Kahani Suno 2.0', artist: 'Kaifi Khalil', album: 'Kahani Suno', duration: 173, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/ff/cc/7b/ffcc7bba-4005-f2c4-b1f1-3cc49a5e6283/artwork.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: '_XbvH7pP4iA', votes: 16, dropTime: 40, trackNumber: 1 }
    ]
  },
  {
    id: 'single_mi_gente',
    title: 'Mi Gente',
    artist: 'J Balvin, Willy William',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/43/23/44/43234493-859a-53f6-e31c-805370dc33d7/18UMGIM19841.rgb.jpg/1000x1000bb.jpg',
    year: '2017',
    trackCount: 1,
    type: 'single',
    genre: 'Reggaeton / Latin',
    tracks: [
      { id: 'yt_3', title: 'Mi Gente', artist: 'J Balvin, Willy William', album: 'Mi Gente', duration: 185, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/43/23/44/43234493-859a-53f6-e31c-805370dc33d7/18UMGIM19841.rgb.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: 'wnJ6LuUFpMo', votes: 15, dropTime: 20, trackNumber: 1 }
    ]
  },
  {
    id: 'single_despacito',
    title: 'Despacito',
    artist: 'Luis Fonsi, Daddy Yankee',
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e2/ef/f0/e2eff0bc-c51d-7de5-9280-6891ddcee71b/18UMGIM85289.rgb.jpg/1000x1000bb.jpg',
    year: '2017',
    trackCount: 1,
    type: 'single',
    genre: 'Latin Pop',
    tracks: [
      { id: 'yt_8', title: 'Despacito', artist: 'Luis Fonsi, Daddy Yankee', album: 'VIDA', duration: 228, coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e2/ef/f0/e2eff0bc-c51d-7de5-9280-6891ddcee71b/18UMGIM85289.rgb.jpg/1000x1000bb.jpg', source: 'youtube', youtubeId: 'kJQP7kiw5Fk', votes: 48, dropTime: 32, trackNumber: 1 }
    ]
  }
];

export class CatalogService {
  // Get all official full albums
  static getAlbums(): Album[] {
    return OFFICIAL_ALBUMS;
  }

  // Get all official singles and EPs
  static getSinglesAndEPs(): Album[] {
    return OFFICIAL_SINGLES_AND_EPS;
  }

  // Get all releases combined
  static getAllReleases(): Album[] {
    return [...OFFICIAL_ALBUMS, ...OFFICIAL_SINGLES_AND_EPS];
  }

  // Get official artists
  static getArtists(): Artist[] {
    return OFFICIAL_ARTISTS;
  }

  // Lookup album by ID or title
  static getAlbumById(idOrTitle: string): Album | null {
    const q = idOrTitle.toLowerCase().trim();
    const found = this.getAllReleases().find(
      (a) => a.id.toLowerCase() === q || a.title.toLowerCase() === q
    );
    return found || null;
  }

  // Live lookup: if user searches for any album, fetch its full tracklist directly from iTunes API
  static async fetchRemoteAlbumDetails(collectionId: string | number): Promise<Album | null> {
    try {
      const res = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}&entity=song`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.results || data.results.length === 0) return null;

      const albumInfo = data.results[0];
      const rawTracks = data.results.slice(1);

      const highResCover = (albumInfo.artworkUrl100 || '').replace('100x100bb.jpg', '1000x1000bb.jpg');

      const tracks: Track[] = rawTracks.map((item: any, idx: number) => ({
        id: `trk_${item.trackId}`,
        title: item.trackName,
        artist: item.artistName,
        album: albumInfo.collectionName,
        duration: Math.round((item.trackTimeMillis || 180000) / 1000),
        coverUrl: highResCover,
        source: 'spotify' as const,
        streamUrl: item.previewUrl,
        votes: Math.floor(Math.random() * 20),
        dropTime: 28,
        trackNumber: item.trackNumber || idx + 1,
        albumId: `alb_${albumInfo.collectionId}`
      }));

      return {
        id: `alb_${albumInfo.collectionId}`,
        title: albumInfo.collectionName,
        artist: albumInfo.artistName,
        coverUrl: highResCover,
        year: (albumInfo.releaseDate || '').substring(0, 4),
        releaseDate: albumInfo.releaseDate ? new Date(albumInfo.releaseDate).toLocaleDateString() : undefined,
        trackCount: tracks.length || albumInfo.trackCount,
        type: tracks.length > 5 ? 'album' : tracks.length > 1 ? 'ep' : 'single',
        genre: albumInfo.primaryGenreName,
        tracks
      };
    } catch (err) {
      console.warn('Remote album lookup failed:', err);
      return null;
    }
  }
}
