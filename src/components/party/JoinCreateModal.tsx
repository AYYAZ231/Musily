import React, { useState } from 'react';
import { X, Flame, Radio, ArrowRight, ShieldCheck, Copy, Check, Users } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

interface JoinCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCreateModal: React.FC<JoinCreateModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useMusicStore();
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [hostName, setHostName] = useState('DJ_Host');
  const [guestName, setGuestName] = useState('PartyGuest');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await actions.createParty(hostName.trim() || 'DJ_Host');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) {
      setError('Please enter a 6-digit room code.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await actions.joinParty(roomCode.trim(), guestName.trim() || 'Guest');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Could not connect to room. Check code & ensure Host is online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#111522] border border-party-pink/30 shadow-glow-party p-6 sm:p-8 overflow-hidden">
        {/* Glow decorative spheres */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-party-pink/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-party-pink to-primary flex items-center justify-center shadow-lg">
              <Flame className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white">Party on Musily</h3>
              <p className="text-xs text-party-cyan">Inspired by naux.party • 100% Free Live Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs: Host vs Join */}
        <div className="flex p-1 rounded-2xl bg-surface-elevated/80 border border-white/5 mb-6 relative z-10">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'create'
                ? 'bg-gradient-to-r from-party-pink to-primary text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Host a Party
          </button>
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === 'join'
                ? 'bg-gradient-to-r from-primary to-party-cyan text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Join with Code
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Tab 1: Host Party Form */}
        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your DJ Nickname
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. MasterDJ, Aryan, VibeKing"
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-party-pink transition-colors"
                required
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-party-pink font-semibold">
                <Radio className="w-4 h-4" />
                <span>NAUX Aux Features Included:</span>
              </div>
              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5">
                <li>Instant 6-character room code & shareable link</li>
                <li>Live synchronized playback across all devices</li>
                <li><strong>The Drop Mode:</strong> Skip slow intros, play straight from the drop</li>
                <li>Democratic voting queue & live emoji bursts</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-party-pink via-primary to-party-cyan hover:opacity-95 text-white font-bold text-sm shadow-glow-party transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Generating Room...</span>
              ) : (
                <>
                  <span>Create Party Room</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Tab 2: Join Party Form */
          <form onSubmit={handleJoin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Party Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. AUX-9912 or 6-digit code"
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-white/10 text-white placeholder-slate-500 text-lg font-mono tracking-widest uppercase focus:outline-none focus:border-primary transition-colors text-center"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Name / Alias
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Alex, Sam"
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-party-cyan hover:opacity-95 text-white font-bold text-sm shadow-glow-primary transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Connecting to Party...</span>
              ) : (
                <>
                  <span>Join Party</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Free P2P Notice */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-spotify" />
          <span>Peer-to-Peer WebRTC sync: 100% Free forever with no server costs</span>
        </div>
      </div>
    </div>
  );
};
