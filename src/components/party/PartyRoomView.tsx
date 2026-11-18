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
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center select-none">
        <div className="w-16 h-16 rounded-2xl bg-ink-900 border border-ink-800 flex items-center justify-center mb-5">
          <span className="w-5 h-5 rounded-full bg-lime animate-pulse" />
        </div>
        <h2 className="text-2xl font-display font-extrabold text-white mb-2 tracking-tight">
          THE AUX, HANDLED.
        </h2>
        <p className="text-zinc-400 max-w-sm text-xs mb-6 leading-relaxed">
          Spin up a room to let Musily handle a continuous DJ-style set. Drop straight to the hooks, pass the Aux, and vote live with your friends online for free.
        </p>
        <button
          onClick={() => actions.createParty('PartyHost')}
          className="px-6 py-2.5 rounded-lg bg-lime hover:bg-lime-hover text-black font-bold text-xs shadow-subtle transition-all active:scale-[0.98] flex items-center gap-2"
        >
          <Radio className="w-4 h-4" />
          <span>Create Party Room</span>
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
  const emojis = ['🔥', '🔊', '🎉', '❤️', '💃', '⚡'];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 select-none">
      {/* Top Deck Room Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-ink-900 border border-ink-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-lime flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
                ROOM LIVE
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs font-mono text-zinc-400 uppercase">
                CODE: <strong className="text-white">{room.id}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs text-zinc-400">The Aux is with:</span>
              <span className="text-xs font-bold text-white bg-ink-800 px-2 py-0.5 rounded border border-ink-700">
                {currentAuxOwner ? currentAuxOwner.name : 'Host'}
                {state.hasAux && ' (You)'}
              </span>
              {state.isHost && (
                <button
                  onClick={onOpenPassAux}
                  className="text-xs text-lime hover:underline font-semibold ml-1"
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
              className="px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-white text-xs font-medium border border-ink-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-lime" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Link'}</span>
            </button>

            <button
              onClick={actions.toggleDropMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all flex items-center gap-1.5 ${
                state.dropMode
                  ? 'bg-lime text-black border-lime font-bold'
                  : 'bg-ink-800 border-ink-700 text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Drop Mode: {state.dropMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={actions.leaveParty}
              className="p-2 rounded-lg bg-ink-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-ink-700 transition-colors"
              title="Leave Room"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reaction Bar */}
        <div className="mt-4 pt-4 border-t border-ink-800 flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            Reactions:
          </span>
          <div className="flex items-center gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => actions.sendReaction(emoji)}
                className="text-lg p-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 transition-transform active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-ink-800 pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'queue'
              ? 'bg-ink-800 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Party Queue ({room.queue.length})
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'chat'
              ? 'bg-ink-800 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Chat ({state.chatMessages.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'members'
              ? 'bg-ink-800 text-white'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Listeners ({room.participants.length})
        </button>

        <button
          onClick={onOpenSearch}
          className="ml-auto px-3 py-1.5 rounded-lg bg-ink-800 hover:bg-ink-700 text-white text-xs font-semibold flex items-center gap-1 border border-ink-700 transition-all"
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
            <div className="p-4 rounded-xl bg-ink-900 border border-ink-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={state.currentTrack.coverUrl}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0 bg-ink-800"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase text-lime font-bold">
                    ON THE AUX RIGHT NOW
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">
                    {state.currentTrack.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate">{state.currentTrack.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-zinc-400">
                  {state.currentTrack.votes} votes
                </span>
              </div>
            </div>
          )}

          {/* Up Next / Democratic Queue */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-zinc-500 uppercase px-1">
              Up Next (Voted songs play first)
            </span>

            {room.queue.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-ink-900 border border-ink-800">
                <p className="text-xs text-zinc-400 mb-3">The queue is empty.</p>
                <button
                  onClick={onOpenSearch}
                  className="px-4 py-2 rounded-lg bg-lime hover:bg-lime-hover text-black text-xs font-bold transition-all"
                >
                  Suggest Songs from Spotify / YouTube
                </button>
              </div>
            ) : (
              room.queue.map((t, idx) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-ink-900 hover:bg-ink-850 border border-ink-800 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-zinc-500 w-4 text-center">
                      {idx + 1}
                    </span>
                    <img
                      src={t.coverUrl}
                      alt=""
                      className="w-9 h-9 rounded object-cover shrink-0 bg-ink-800"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{t.title}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{t.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => actions.voteTrack(t.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-ink-800 hover:bg-ink-700 text-white text-xs font-mono font-bold border border-ink-700 transition-all active:scale-95"
                      title="Vote up"
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-lime" />
                      <span>{t.votes}</span>
                    </button>

                    {state.hasAux && (
                      <button
                        onClick={() => actions.playTrack(t)}
                        className="px-2.5 py-1 rounded bg-white hover:bg-zinc-200 text-black text-xs font-semibold"
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
        <div className="rounded-xl bg-ink-900 border border-ink-800 p-4 flex flex-col h-80">
          <div className="flex-1 overflow-y-auto space-y-2.5 p-1">
            {state.chatMessages.length === 0 ? (
              <div className="text-center text-xs text-zinc-500 py-12">
                No messages yet. Drop a comment for the DJ.
              </div>
            ) : (
              state.chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs">
                  <span className="font-bold text-white mr-2">{msg.senderName}:</span>
                  <span className="text-zinc-300">{msg.text}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-3 border-t border-ink-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message or track request..."
              className="flex-1 px-3 py-2 rounded-lg bg-ink-850 border border-ink-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-lime"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-lime hover:bg-lime-hover text-black font-semibold text-xs transition-colors"
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
              className="p-3 rounded-lg bg-ink-900 border border-ink-800 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  {p.name}
                  {p.isHost && (
                    <span className="text-[9px] font-mono uppercase bg-ink-800 px-1 rounded text-zinc-400">
                      Host
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  {p.hasAux ? '🎧 Holding Aux' : 'Listener'}
                </p>
              </div>

              {state.isHost && !p.hasAux && (
                <button
                  onClick={() => actions.passAux(p.id)}
                  className="px-2 py-1 rounded bg-ink-800 hover:bg-ink-700 text-lime text-xs font-semibold border border-ink-700 transition-colors"
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
