import React from 'react';
import { useMusicStore } from '../../store/useMusicStore';

export const FloatingReactions: React.FC = () => {
  const { state } = useMusicStore();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {state.reactions.map((rx) => (
        <div
          key={rx.id}
          className="absolute bottom-24 flex flex-col items-center animate-float-reaction"
          style={{ left: `${rx.x}%` }}
        >
          <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(236,72,153,0.8)]">
            {rx.emoji}
          </span>
          <span className="text-[10px] font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded-full mt-1 backdrop-blur-sm">
            {rx.senderName}
          </span>
        </div>
      ))}
    </div>
  );
};
