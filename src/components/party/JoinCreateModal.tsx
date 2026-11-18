import React, { useState } from 'react';
import { X, Radio, ArrowRight, ShieldCheck } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

interface JoinCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinCreateModal: React.FC<JoinCreateModalProps> = ({ isOpen, onClose }) => {
  const { actions } = useMusicStore();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] dark:bg-[#D4FF00]" />
            <h3 className="text-base font-display font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
              Party Aux Room
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-5">
          <button
            type="button"
            onClick={() => setTab('create')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'create'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            Create Room
          </button>
          <button
            type="button"
            onClick={() => setTab('join')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'join'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
            }`}
          >
            Join with Code
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                Your DJ Nickname
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="e.g. Aryan, Sam, Host"
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-400"
                required
              />
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Creates a synchronized room code you can send to friends. Anyone can suggest tracks and vote to bump them up!
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] dark:bg-[#D4FF00] dark:hover:bg-[#C4ED00] text-white dark:text-black font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{loading ? 'Creating...' : 'Launch Room'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. AUX-9921"
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 text-center font-mono tracking-widest text-sm uppercase focus:outline-none focus:border-zinc-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-zinc-900 hover:bg-black text-white dark:bg-white dark:text-black font-bold text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{loading ? 'Joining...' : 'Join Party'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] dark:text-[#D4FF00]" />
          <span>Peer-to-Peer WebRTC · 100% Free Forever</span>
        </div>
      </div>
    </div>
  );
};
