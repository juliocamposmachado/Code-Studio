import React, { useRef } from 'react';

interface ResizerProps {
  onResize: (delta: number) => void;
}

export const Resizer: React.FC<ResizerProps> = ({ onResize }) => {
  const lastPos = useRef(0);

  const handleMove = (currentPos: number) => {
    const delta = currentPos - lastPos.current;
    onResize(delta);
    lastPos.current = currentPos;
  };

  // Mouse Events
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    lastPos.current = e.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => handleMove(moveEvent.clientX);
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  // Touch Events
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    lastPos.current = e.touches[0].clientX;

    const handleTouchMove = (moveEvent: TouchEvent) => handleMove(moveEvent.touches[0].clientX);
    const handleTouchEnd = () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      className="w-1.5 h-full cursor-col-resize group flex-shrink-0"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      aria-hidden="true"
    >
      <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-900/50 group-hover:bg-blue-500 transition-colors mx-auto" />
    </div>
  );
};
