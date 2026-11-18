import React from 'react';
import { X, Award, Radio } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl bg-[#111522] border border-party-pink/30 p-6 shadow-glow-party">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-party-yellow" />
            <h3 className="text-base font-bold text-white">Pass the Aux Cord</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Select who gets control of the music. The Aux holder can play, pause, skip, and trigger drops!
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {state.partyRoom.participants.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePass(p.id)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-surface hover:bg-surface-elevated border border-white/5 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <span className="text-sm font-semibold text-white block">{p.name}</span>
                  <span className="text-[10px] text-slate-400">
                    {p.hasAux ? 'Currently Holding Aux' : 'Listener'}
                  </span>
                </div>
              </div>
              {p.hasAux ? (
                <span className="text-xs text-party-yellow font-bold flex items-center gap-1">
                  <Radio className="w-3 h-3" /> Aux
                </span>
              ) : (
                <span className="text-xs text-party-pink font-semibold">Pass ➔</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
