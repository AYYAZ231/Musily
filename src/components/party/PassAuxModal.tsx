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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="w-full max-w-sm rounded-2xl bg-ink-950 border border-ink-800 p-5 shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-lime" />
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-tight">
              Pass the Aux Cord
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
          Select a listener in the room to hand over DJ control. They can pause, skip, and trigger drops.
        </p>

        <div className="space-y-1.5 max-h-56 overflow-y-auto">
          {state.partyRoom.participants.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePass(p.id)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-ink-900 hover:bg-ink-850 border border-ink-800 transition-colors text-left"
            >
              <div>
                <span className="text-xs font-semibold text-white block">{p.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {p.hasAux ? 'Currently Holding Aux' : 'Listener'}
                </span>
              </div>
              {p.hasAux ? (
                <span className="text-[11px] font-mono text-lime font-bold">Aux Active</span>
              ) : (
                <span className="text-xs text-zinc-300 font-medium">Pass ➔</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
