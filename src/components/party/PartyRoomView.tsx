import React, { useState } from 'react';
import {
  Radio,
  Flame,
  Copy,
  Check,
  Share2,
  Users,
  MessageSquare,
  Sparkles,
  ArrowUp,
  Disc,
  Send,
  LogOut,
  Award,
  Music2
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { Track } from '../../types';

interface PartyRoomViewProps {
  onOpenPassAux: () => void;
  onOpenSearch: () => void;
}

export const PartyRoomView: React.FC<PartyRoomViewProps> = ({ onOpenPassAux, onOpenSearch }) => {
  const { state, actions } = useMusicStore();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'chat' | 'members'>('queue');
  const [chatInput, setChatInput] = useState('');

  const room = state.partyRoom;

  if (!state.isPartyActive || !room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-party-pink to-primary flex items-center justify-center shadow-glow-party mb-6 animate-pulse">
          <Flame className="w-10 h-10 text-white fill-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
          Party Mode (NAUX Aux)
        </h2>
        <p className="text-slate-400 max-w-md text-sm mb-6 leading-relaxed">
          Create or join a synchronized party room. Just like <strong>naux.party</strong>, anyone can pass the Aux, drop straight to the chorus, upvote bangers, and vibe together in real-time online for free!
        </p>
        <button
          onClick={() => actions.createParty('PartyHost')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-party-pink via-primary to-party-cyan text-white font-bold text-sm shadow-glow-party hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Radio className="w-4 h-4" />
          Create a New Party Room
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/?party=${room.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    actions.sendChat(chatInput);
    setChatInput('');
  };

  const currentAuxOwner = room.participants.find((p) => p.id === room.auxOwnerId);

  const emojis = ['🔥', '🎉', '🔊', '❤️', '💃', '⚡'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      {/* Top Party Hero Banner (Glassmorphism & Neon) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A0E2A]/90 via-surface/90 to-[#0A1628]/90 border border-party-pink/30 p-6 md:p-8 shadow-glow-party">
        <div className="absolute top-0 right-0 w-96 h-96 bg-party-pink/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-party-pink/20 border border-party-pink text-party-pink text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-party-pink animate-ping" />
                Live Party Room
              </span>
              <span className="text-xs text-slate-400">
                Inspired by <strong>naux.party</strong>
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight">
              {room.name}
            </h1>

            {/* Aux Holder Badge */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-elevated/80 border border-white/10 text-xs">
                <Award className="w-4 h-4 text-party-yellow" />
                <span className="text-slate-400">Current Aux Holder:</span>
                <span className="font-bold text-white">
                  {currentAuxOwner ? currentAuxOwner.name : 'Party Host'}
                </span>
                {state.hasAux && (
                  <span className="ml-1 text-[10px] bg-party-pink text-white font-bold px-1.5 py-0.2 rounded-full">
                    YOU
                  </span>
                )}
              </div>

              {state.isHost && (
                <button
                  onClick={onOpenPassAux}
                  className="text-xs text-primary-light hover:text-white underline font-semibold transition-colors"
                >
                  Pass Aux ➔
                </button>
              )}
            </div>
          </div>

          {/* Room Code & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Room Code
                </span>
                <span className="font-mono text-xl font-bold tracking-widest text-party-cyan">
                  {room.id}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="p-2 ml-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                title="Copy Invite Link"
              >
                {copied ? <Check className="w-4 h-4 text-spotify" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-party-pink to-primary text-white text-xs font-bold shadow-lg flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Share Room'}</span>
            </button>

            <button
              onClick={actions.leaveParty}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-white/10 transition-colors"
              title="Leave Room"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Reaction Emojis Bar (Real-Time Burst like NAUX) */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-party-pink" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Send Live Burst:
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => actions.sendReaction(emoji)}
                className="text-2xl p-2 rounded-2xl bg-white/5 hover:bg-white/15 hover:scale-125 active:scale-90 transition-transform duration-200 shadow-sm"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* The Drop Mode Switcher */}
          <button
            onClick={actions.toggleDropMode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
              state.dropMode
                ? 'bg-party-yellow/20 border-party-yellow text-party-yellow shadow-glow-party'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>The Drop Mode: {state.dropMode ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Queue / Chat / Members) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'queue'
              ? 'bg-primary/20 text-white border border-primary/30 shadow-glow-primary'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Music2 className="w-4 h-4" />
          <span>Party Queue ({room.queue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'chat'
              ? 'bg-primary/20 text-white border border-primary/30 shadow-glow-primary'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Party Chat ({state.chatMessages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'members'
              ? 'bg-primary/20 text-white border border-primary/30 shadow-glow-primary'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Vibers ({room.participants.length})</span>
        </button>

        <div className="ml-auto">
          <button
            onClick={onOpenSearch}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>+ Suggest Track</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Democratic Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Now Playing in Party */}
          {state.currentTrack && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-party-pink/15 via-primary/10 to-transparent border border-party-pink/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden relative shadow-lg shrink-0">
                  <img
                    src={state.currentTrack.coverUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Disc className="w-6 h-6 text-white animate-spin-slow" />
                  </div>
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] text-party-pink uppercase font-extrabold tracking-wider">
                    NOW PLAYING ON THE AUX
                  </span>
                  <h4 className="text-base font-bold text-white truncate">
                    {state.currentTrack.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{state.currentTrack.artist}</p>
                </div>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-party-pink/20 text-party-pink font-bold border border-party-pink/30 shrink-0">
                {state.currentTrack.votes} Upvotes
              </span>
            </div>
          )}

          {/* Up Next List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              Democratic Queue (Top Voted Plays Next)
            </h3>

            {room.queue.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-surface/40 border border-white/5">
                <p className="text-sm text-slate-400 mb-3">No songs in queue yet!</p>
                <button
                  onClick={onOpenSearch}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors"
                >
                  Add Songs from Spotify & YouTube
                </button>
              </div>
            ) : (
              room.queue.map((t, idx) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-surface/60 hover:bg-surface border border-white/5 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-500 w-4 text-center">
                      #{idx + 1}
                    </span>
                    <img
                      src={t.coverUrl}
                      alt=""
                      className="w-11 h-11 rounded-lg object-cover shadow shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white truncate">
                          {t.title}
                        </span>
                        <span
                          className={`text-[9px] px-1 rounded font-bold uppercase ${
                            t.source === 'spotify'
                              ? 'text-spotify bg-spotify/10'
                              : 'text-youtube bg-youtube/10'
                          }`}
                        >
                          {t.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{t.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Upvote Button */}
                    <button
                      onClick={() => actions.voteTrack(t.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-party-pink/20 hover:text-party-pink text-slate-300 font-bold text-xs border border-white/5 transition-all active:scale-95"
                      title="Upvote to play sooner!"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                      <span>{t.votes}</span>
                    </button>

                    {/* Aux holder can play immediately */}
                    {state.hasAux && (
                      <button
                        onClick={() => actions.playTrack(t)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-primary text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Play Now
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Live Room Chat */}
      {activeTab === 'chat' && (
        <div className="rounded-3xl bg-surface/60 border border-white/5 p-4 flex flex-col h-96">
          <div className="flex-1 overflow-y-auto space-y-3 p-2">
            {state.chatMessages.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12">
                No chat messages yet. Start the conversation!
              </div>
            ) : (
              state.chatMessages.map((msg) => (
                <div key={msg.id} className="flex flex-col space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-party-pink">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 bg-white/5 px-3 py-1.5 rounded-xl max-w-lg self-start">
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-3 border-t border-white/5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Drop a comment or request a track..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated/70 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Party Members */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {room.participants.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-surface/60 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt="" className="w-10 h-10 rounded-full bg-surface" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {p.name}
                    {p.isHost && (
                      <span className="text-[9px] bg-party-pink/20 text-party-pink font-bold px-1.5 py-0.2 rounded">
                        HOST
                      </span>
                    )}
                  </h4>
                  <span className="text-xs text-slate-400">
                    {p.hasAux ? '🎧 Holding the Aux' : 'Listener'}
                  </span>
                </div>
              </div>

              {state.isHost && !p.hasAux && (
                <button
                  onClick={() => actions.passAux(p.id)}
                  className="px-2.5 py-1 rounded-lg bg-party-pink/20 hover:bg-party-pink text-party-pink hover:text-white text-xs font-bold transition-all"
                >
                  Pass Aux
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
