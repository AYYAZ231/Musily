import React, { useState } from 'react';
import {
  Radio,
  Copy,
  Check,
  Share2,
  Users,
  MessageSquare,
  Zap,
  ChevronUp,
  Disc,
  Send,
  LogOut,
  Sliders,
  Plus
} from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';
import { EqualizerBars } from '../common/EqualizerBars';

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
      <div className="max-w-3xl mx-auto py-12 px-4 text-center select-none space-y-8 animate-fade-in">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-[#D4FF00]/30 blur-2xl pointer-events-none" />
          <div className="relative w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shadow-2xl">
            <Radio className="w-10 h-10 text-emerald-400 dark:text-[#D4FF00]" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#D4FF00] border border-emerald-500/20 text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#D4FF00] animate-ping" />
            Musily Aux Protocol • Zero Cloud Fees
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-zinc-900 dark:text-white">
            THE LIVE PARTY AUX.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Turn your music into a shared party deck. Synchronize live audio with friends online for free, skip to the drops, pass the virtual Aux cord, and vote what plays next.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1.5">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">The Drop Mode</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Jumps straight to the energetic chorus of every track. Zero dead air or slow intros.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1.5">
            <Radio className="w-5 h-5 text-emerald-500 dark:text-[#D4FF00]" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Pass The Aux</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Host can hand full DJ controls to any guest in the room with one click.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#0E0F14] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-1.5">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Democratic Upvoting</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Guests vote on queue items. Top-voted tracks automatically play next.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => actions.createParty('PartyHost')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 dark:from-[#D4FF00] dark:to-[#B6EB00] text-black font-extrabold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2.5"
          >
            <Radio className="w-4 h-4" />
            <span>Launch Free Party Room</span>
          </button>
        </div>
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
  const emojis = ['🔥', '🔊', '🎉', '❤️', '💃', '⚡'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none">
      {/* Top Deck Room Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#059669] dark:text-[#D4FF00] flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] dark:bg-[#D4FF00] animate-ping" />
                ROOM LIVE
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase">
                CODE: <strong className="text-zinc-900 dark:text-white">{room.id}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">The Aux is with:</span>
              <span className="text-xs font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                {currentAuxOwner ? currentAuxOwner.name : 'Host'}
                {state.hasAux && ' (You)'}
              </span>
              {state.isHost && (
                <button
                  onClick={onOpenPassAux}
                  className="text-xs text-[#059669] dark:text-[#D4FF00] hover:underline font-semibold ml-1"
                >
                  Pass Aux ➔
                </button>
              )}
            </div>
          </div>

          {/* Quick Room Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-medium border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981] dark:text-[#D4FF00]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Link'}</span>
            </button>

            <button
              onClick={actions.toggleDropMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
                state.dropMode
                  ? 'bg-zinc-900 text-white dark:bg-[#D4FF00] dark:text-black border-transparent font-bold shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Drop Mode: {state.dropMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={actions.leaveParty}
              className="p-2 rounded-lg bg-zinc-100 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-red-400 border border-zinc-200 dark:border-zinc-700 transition-colors"
              title="Leave Room"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reaction Bar */}
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Reactions:
          </span>
          <div className="flex items-center gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => actions.sendReaction(emoji)}
                className="text-lg p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-transform active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'queue'
              ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          Party Queue ({room.queue.length})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'chat'
              ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          Chat ({state.chatMessages.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'members'
              ? 'bg-zinc-900 text-white dark:bg-zinc-800 dark:text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
          }`}
        >
          Listeners ({room.participants.length})
        </button>

        <button
          onClick={onOpenSearch}
          className="ml-auto px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold flex items-center gap-1 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Song</span>
        </button>
      </div>

      {/* Queue View */}
      {activeTab === 'queue' && (
        <div className="space-y-3">
          {/* Active Now Playing */}
          {state.currentTrack && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                  <img
                    src={state.currentTrack.coverUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  {state.isPlaying && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <EqualizerBars isPlaying={true} size="sm" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-[#059669] dark:text-[#D4FF00] font-bold">
                    ON THE AUX RIGHT NOW
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                    {state.currentTrack.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{state.currentTrack.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-zinc-500">
                  {state.currentTrack.votes} votes
                </span>
              </div>
            </div>
          )}

          {/* Up Next / Democratic Queue */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase px-1">
              Up Next (Voted songs play first)
            </span>

            {room.queue.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">The queue is empty.</p>
                <button
                  onClick={onOpenSearch}
                  className="px-4 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black text-xs font-bold transition-all shadow-sm"
                >
                  Suggest Tracks for the Aux
                </button>
              </div>
            ) : (
              room.queue.map((t, idx) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#121216] hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 w-4 text-center">
                      {idx + 1}
                    </span>
                    <img
                      src={t.coverUrl}
                      alt=""
                      className="w-9 h-9 rounded object-cover shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{t.title}</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{t.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => actions.voteTrack(t.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-mono font-bold border border-zinc-200 dark:border-zinc-700 transition-all active:scale-95"
                      title="Vote up"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-[#059669] dark:text-[#D4FF00]" />
                      <span>{t.votes}</span>
                    </button>

                    {state.hasAux && (
                      <button
                        onClick={() => actions.playTrack(t)}
                        className="px-2.5 py-1 rounded bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-semibold shadow-sm"
                      >
                        Play
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat View */}
      {activeTab === 'chat' && (
        <div className="rounded-xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col h-80 shadow-sm">
          <div className="flex-1 overflow-y-auto space-y-2.5 p-1">
            {state.chatMessages.length === 0 ? (
              <div className="text-center text-xs text-zinc-400 dark:text-zinc-500 py-12">
                No messages yet. Drop a comment for the DJ.
              </div>
            ) : (
              state.chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs">
                  <span className="font-bold text-zinc-900 dark:text-white mr-2">{msg.senderName}:</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{msg.text}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message or track request..."
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-400"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-[#10B981] hover:bg-[#059669] dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black font-semibold text-xs transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Members View */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {room.participants.map((p) => (
            <div
              key={p.id}
              className="p-3 rounded-lg bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  {p.name}
                  {p.isHost && (
                    <span className="text-[9px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-zinc-500">
                      Host
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {p.hasAux ? '🎧 Holding Aux' : 'Listener'}
                </p>
              </div>

              {state.isHost && !p.hasAux && (
                <button
                  onClick={() => actions.passAux(p.id)}
                  className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[#059669] dark:text-[#D4FF00] text-xs font-semibold border border-zinc-200 dark:border-zinc-700 transition-colors"
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
