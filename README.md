# Musily 🎵🔥

> **The Ultimate Cross-Platform Music & Live Party App**  
> Stream tracks simultaneously from **Spotify & YouTube Music**, and host live synchronized parties with friends online for **100% FREE** with the features of [naux.party](https://www.naux.party).

Works seamlessly across:
- 💻 **Windows Desktop** (Native PWA / Launcher)
- 🌐 **Web Browser** (Chrome, Edge, Safari, Firefox, Opera)
- 📱 **Mobile Android APK** (Native Android via Capacitor)

---

## 🚀 Key Features

### 1. Dual Source Streaming (Spotify + YouTube Music)
- **Unified Search:** Search any track, album, or artist once to instantly retrieve matches from both Spotify and YouTube catalogs.
- **Account Linking:** Connect your Spotify account and YouTube Music playlists directly.
- **Smart Audio Resolver:** Stream full songs via the embedded YouTube audio player with Spotify's metadata, album art, and high-fidelity visuals.

### 2. Live Party Mode (Inspired by `naux.party`)
- **"The Drop" Mode:** Don't wait through slow song intros! Drop straight to the high-energy chorus and hook without awkward lulls.
- **Democratic Upvoting Queue:** Anyone in the room can suggest and upvote songs. The track with the most votes automatically plays next!
- **Pass the Aux:** The party host can pass the Aux cord to any guest, granting them real-time DJ controls.
- **Real-Time Synchronized Playback:** Play, pause, seek, and drop mode sync within milliseconds across all listeners.
- **Live Reaction Bursts:** Send animated floating emojis (🔥, 🎉, 🔊, ❤️, 💃, ⚡) with party confetti across everyone's screens.
- **Live Party Chat:** Integrated group room chat with participant rosters.

### 3. Glassmorphic Cyberpunk UI
- Deep obsidian dark mode (`#090B10`) with neon violet, party pink, and cyan accents.
- Rotating vinyl disc animation with active audio wave equalizer bars.
- Responsive mobile navigation bar for smartphones and collapsible sidebar for desktop.
- Full-screen immersive player view.

---

## 🛠️ The Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Theme** | Tailwind CSS, Lucide Icons, Glassmorphism, CSS Keyframe Animations |
| **Mobile Runtime (APK)** | Capacitor 7 (`@capacitor/core`, `@capacitor/android`, `@capacitor/app`) |
| **Desktop Runtime (Windows)** | Progressive Web App (PWA) with Windows MediaSession API & window chrome |
| **Real-Time Party Engine** | **WebRTC PeerJS (P2P)** — Zero server costs, 100% Free live sync! |
| **Backup WebSocket Server** | Node.js + Express + Socket.IO (ready for free deployment on Render) |
| **Audio Players** | Dual-Engine: HTML5 `<audio>` + YouTube IFrame API + Spotify Web API |

---

## 🌐 How to Use Live With Friends Online for FREE

You do **NOT** need to pay for any cloud hosting or servers. Here is the step-by-step free setup:

### Step 1: Deploy Web App for Free (Vercel / Netlify / GitHub Pages)
1. Fork or push this repository to GitHub: `https://github.com/AYYAZ231/Musily.git`
2. Go to [Vercel.com](https://vercel.com) (or [Netlify.com](https://netlify.com)) and sign in with GitHub.
3. Click **"New Project"**, select your `Musily` repository.
4. Framework Preset will be automatically detected as **Vite**.
5. Click **"Deploy"**.
6. Within 60 seconds, you get a free live URL (e.g., `https://musily-app.vercel.app`)!

### Step 2: Instant Zero-Cost Party Rooms (Peer-to-Peer WebRTC)
- Musily uses **PeerJS WebRTC Mesh** connecting over free public STUN/TURN brokers.
- You can click **"Create Party"**, get a 6-digit room code (e.g., `AUX-8492`), and send the link (`https://your-app.vercel.app/?party=AUX-8492`) to your friends.
- Your friends can join from their phones, laptops, or browsers anywhere in the world — **no login, no payment, and zero server maintenance required!**

---

## 📱 How to Get the Mobile Android APK

### Option A: Automatic Free GitHub Actions Build (Recommended)
This repository already includes `.github/workflows/build-apk.yml`:
1. Push your code to GitHub `main` branch:
   ```bash
   git add .
   git commit -m "Musily initial release"
   git push origin main
   ```
2. Go to your GitHub repository -> click the **Actions** tab.
3. The **"Build Android APK"** action will run automatically on GitHub's free cloud runners.
4. Once completed (approx. 3-4 mins), click on the build run to download **`Musily-Android-Debug.apk`**!
5. Install the APK on your Android phone.

### Option B: Local Android Studio Build
If you have Android Studio installed:
```bash
npm run build
npx cap sync android
npx cap open android
```
In Android Studio, click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## 💻 How to Run on Windows Desktop

### Method 1: 1-Click Batch Launcher
Double-click `Musily.bat` in the project root folder. It will install packages (if needed) and launch Musily in your browser!

### Method 2: Install as a Windows Desktop App (PWA)
1. Open Musily in Microsoft Edge or Google Chrome (`http://localhost:3000` or your Vercel URL).
2. Look at the right side of the address bar: click the **Install Musily** icon (or click the three dots `...` > **Apps > Install this site as an app**).
3. Musily will now run in its own standalone native Windows desktop window, appear in your Windows Start Menu, and support media keys on your keyboard!

---

## 💻 Development Commands

```bash
# Install dependencies
npm install

# Start local dev server (port 3000)
npm run dev

# Build production bundle & PWA
npm run build

# Sync Capacitor assets to Android project
npm run cap:sync

# Optional: Run standalone party WebSocket server
cd server
npm install
npm start
```

---

## 📜 License
MIT © Musily
