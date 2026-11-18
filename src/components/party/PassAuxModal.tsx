import React from 'react';
import { X, Radio } from 'lucide-react';
import { useMusicStore } from '../../store/useMusicStore';

interface PassAuxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PassAuxModal: React.FC<PassAuxModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useMusicStore();

  if (!isOpen || !state.partyRoom) return null;

  const handlePass = (participantId: string) => {
    actions.passAux(participantId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#121216] border border-zinc-200 dark:border-zinc-800 p-5 shadow-xl transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#059669] dark:text-[#D4FF00]" />
            <h3 className="text-sm font-display font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
              Pass the Aux Cord
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
          Select a listener in the room to hand over DJ control. They can pause, skip, and trigger drops.
        </p>

        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {state.partyRoom.participants.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePass(p.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors text-left"
            >
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white block">{p.name}</span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {p.hasAux ? 'Currently Holding Aux' : 'Listener'}
                </span>
              </div>
              {p.hasAux ? (
                <span className="text-[11px] font-mono text-[#059669] dark:text-[#D4FF00] font-bold">Aux Active</span>
              ) : (
                <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">Pass ➔</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
