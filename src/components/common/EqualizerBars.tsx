import React from 'react';

interface EqualizerBarsProps {
  isPlaying: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EqualizerBars: React.FC<EqualizerBarsProps> = ({
  isPlaying,
  className = '',
  size = 'md'
}) => {
  const heightClass = size === 'sm' ? 'h-3 w-0.5' : size === 'lg' ? 'h-6 w-1' : 'h-4 w-0.5';

  return (
    <div className={`flex items-end gap-0.5 ${className}`}>
      <span
        className={`${heightClass} rounded-full bg-[#10B981] dark:bg-[#D4FF00] ${
          isPlaying ? 'anim-eq-1' : 'h-[25%]'
        } transition-all duration-300`}
      />
      <span
        className={`${heightClass} rounded-full bg-[#10B981] dark:bg-[#D4FF00] ${
          isPlaying ? 'anim-eq-2' : 'h-[60%]'
        } transition-all duration-300`}
      />
      <span
        className={`${heightClass} rounded-full bg-[#10B981] dark:bg-[#D4FF00] ${
          isPlaying ? 'anim-eq-3' : 'h-[35%]'
        } transition-all duration-300`}
      />
      <span
        className={`${heightClass} rounded-full bg-[#10B981] dark:bg-[#D4FF00] ${
          isPlaying ? 'anim-eq-4' : 'h-[80%]'
        } transition-all duration-300`}
      />
    </div>
  );
};
